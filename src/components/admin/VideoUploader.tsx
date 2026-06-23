"use client";

import { useState, useRef, useCallback } from "react";
import * as tus from "tus-js-client";
import { lessonApi } from "@/lib/api";

interface VideoUploaderProps {
  lessonId: string;
  currentVideoStatus?: string;
  currentThumbnailUrl?: string;
  currentBunnyVideoId?: string;
  onUploadComplete: (data: {
    bunnyVideoId: string;
    videoStatus: string;
    thumbnailUrl: string;
  }) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  none: { label: "No Video", color: "text-gray-500", bg: "bg-gray-100" },
  uploading: { label: "Uploading", color: "text-blue-600", bg: "bg-blue-50" },
  uploaded: { label: "Uploaded", color: "text-blue-600", bg: "bg-blue-50" },
  queued: { label: "Queued", color: "text-yellow-600", bg: "bg-yellow-50" },
  processing: { label: "Processing", color: "text-orange-600", bg: "bg-orange-50" },
  encoding: { label: "Encoding", color: "text-orange-600", bg: "bg-orange-50" },
  finished: { label: "Ready", color: "text-green-600", bg: "bg-green-50" },
  failed: { label: "Failed", color: "text-red-600", bg: "bg-red-50" },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export default function VideoUploader({
  lessonId,
  currentVideoStatus,
  currentThumbnailUrl,
  currentBunnyVideoId,
  onUploadComplete,
}: VideoUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tusUploadRef = useRef<tus.Upload | null>(null);
  const lastProgressRef = useRef<{ time: number; bytes: number } | null>(null);

  const status = currentVideoStatus || "none";
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.none;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const cancelUpload = useCallback(() => {
    if (tusUploadRef.current) {
      tusUploadRef.current.abort();
      tusUploadRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(null);
    setUploadSpeed(null);
    setFileName(null);
    lastProgressRef.current = null;
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please select a valid video file (MP4, WebM, or MOV)");
      return;
    }

    // Validate file size (5GB max)
    if (file.size > MAX_FILE_SIZE) {
      setError(`Video file must be under ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);
      setUploadSpeed(null);
      setFileName(file.name);
      lastProgressRef.current = null;

      // Step 1: Get TUS upload credentials from backend
      const response = await lessonApi.createVideoUpload(lessonId);

      if (!response.success || !response.data) {
        throw new Error(response.message || "Failed to create video upload");
      }

      const { tusUpload: creds, bunnyVideoId, thumbnailUrl } = response.data;

      // Step 2: Upload directly to Bunny via TUS protocol
      await new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(file, {
          endpoint: creds.endpoint,
          retryDelays: [0, 1000, 3000, 5000, 10000, 20000],
          chunkSize: 10 * 1024 * 1024, // 10MB chunks
          metadata: {
            filetype: file.type,
            title: file.name,
          },
          headers: {
            AuthorizationSignature: creds.authSignature,
            AuthorizationExpire: String(creds.expirationTime),
            VideoId: creds.videoId,
            LibraryId: String(creds.libraryId),
          },
          onError: (err) => {
            tusUploadRef.current = null;
            reject(new Error(err.message || "Upload failed"));
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percent = Math.round((bytesUploaded / bytesTotal) * 100);
            setUploadProgress(percent);

            // Calculate upload speed
            const now = Date.now();
            if (lastProgressRef.current) {
              const elapsed = (now - lastProgressRef.current.time) / 1000;
              if (elapsed > 0.5) {
                const bytesDiff = bytesUploaded - lastProgressRef.current.bytes;
                const speed = bytesDiff / elapsed;
                if (speed > 0) {
                  setUploadSpeed(`${formatFileSize(speed)}/s`);
                }
                lastProgressRef.current = { time: now, bytes: bytesUploaded };
              }
            } else {
              lastProgressRef.current = { time: now, bytes: bytesUploaded };
            }
          },
          onSuccess: () => {
            tusUploadRef.current = null;
            resolve();
          },
        });

        tusUploadRef.current = upload;

        // Check for previous uploads to resume
        upload.findPreviousUploads().then((previousUploads) => {
          if (previousUploads.length > 0) {
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }
          upload.start();
        });
      });

      // Step 3: Confirm upload completed
      await lessonApi.confirmVideoUpload(lessonId);

      onUploadComplete({
        bunnyVideoId,
        videoStatus: "uploaded",
        thumbnailUrl,
      });
    } catch (err) {
      if (err instanceof Error && err.message === "Upload cancelled") {
        return; // Don't show error for user-initiated cancel
      }
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      setUploadSpeed(null);
      setFileName(null);
      lastProgressRef.current = null;
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        Lesson Video (Bunny Stream)
      </label>

      {/* Status Badge */}
      {currentBunnyVideoId && (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
            {status === "processing" || status === "encoding" || status === "uploading" ? (
              <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : status === "finished" ? (
              <svg className="-ml-0.5 mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : null}
            {statusInfo.label}
          </span>
        </div>
      )}

      {/* Thumbnail Preview */}
      {currentThumbnailUrl && status === "finished" && (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={currentThumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
            Bunny Stream
          </div>
        </div>
      )}

      {/* Upload Area */}
      {isUploading ? (
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 bg-blue-50">
          <div className="text-center">
            <p className="text-sm font-medium text-blue-700 mb-1">
              Uploading directly to Bunny Stream...
            </p>
            {fileName && (
              <p className="text-xs text-blue-500 mb-2 truncate px-4">{fileName}</p>
            )}
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress || 0}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <span className="text-xs text-blue-600">{uploadProgress || 0}%</span>
              {uploadSpeed && (
                <span className="text-xs text-blue-500">{uploadSpeed}</span>
              )}
            </div>
            <button
              onClick={cancelUpload}
              className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Cancel Upload
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-all duration-200"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-gray-600">
            {currentBunnyVideoId ? "Click to replace video" : "Click to upload video"}
          </p>
          <p className="text-xs text-gray-400 mt-1">MP4, WebM, or MOV (up to 5GB)</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">&times;</button>
        </div>
      )}
    </div>
  );
}
