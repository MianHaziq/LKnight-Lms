"use client";

import { useState, useEffect, useRef } from "react";
import { lessonApi, type Lesson } from "@/lib/api";

interface BunnyVideoPlayerProps {
  lesson: Lesson;
  onHalfWatched?: () => void;
}

export default function BunnyVideoPlayer({ lesson, onHalfWatched }: BunnyVideoPlayerProps) {
  const onHalfWatchedRef = useRef(onHalfWatched);
  onHalfWatchedRef.current = onHalfWatched;

  // Timer-based progress: mark complete after user spends half the lesson duration on this page
  // Bunny Stream iframes don't expose playback events cross-origin
  useEffect(() => {
    const durationSec = lesson.duration || 0;
    if (durationSec <= 0) return;

    // Wait for half the video duration (minimum 10s, maximum 5min)
    const halfDurationMs = Math.min(Math.max(durationSec * 500, 10000), 300000);

    const timer = setTimeout(() => {
      onHalfWatchedRef.current?.();
    }, halfDurationMs);

    return () => clearTimeout(timer);
  }, [lesson.id, lesson.duration]);

  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState(lesson.videoStatus);

  const isProcessing = videoStatus === "processing" || videoStatus === "encoding" || videoStatus === "uploaded" || videoStatus === "queued";

  // Fetch embed URL
  useEffect(() => {
    if (!lesson.bunnyVideoId) {
      setLoading(false);
      return;
    }

    // Use pre-signed embedUrl from getLessonById response if available
    if (lesson.embedUrl) {
      setEmbedUrl(lesson.embedUrl);
      setLoading(false);
      return;
    }

    // If still processing, don't try to fetch embed URL yet
    if (isProcessing) {
      setLoading(false);
      return;
    }

    // Otherwise fetch it
    const fetchEmbedUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await lessonApi.getVideoUrl(lesson.id);
        if (response.success && response.data) {
          setEmbedUrl(response.data.embedUrl);
        } else {
          setError("Failed to load video");
        }
      } catch {
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchEmbedUrl();
  }, [lesson.id, lesson.bunnyVideoId, lesson.embedUrl, isProcessing]);

  // Poll for status updates when video is processing
  useEffect(() => {
    if (!isProcessing || !lesson.bunnyVideoId) return;

    const pollStatus = async () => {
      try {
        const response = await lessonApi.getVideoStatus(lesson.id);
        if (response.success && response.data) {
          const newStatus = response.data.videoStatus;
          if (newStatus && newStatus !== videoStatus) {
            setVideoStatus(newStatus);
            // If finished, fetch the embed URL
            if (newStatus === "finished") {
              try {
                const urlResponse = await lessonApi.getVideoUrl(lesson.id);
                if (urlResponse.success && urlResponse.data) {
                  setEmbedUrl(urlResponse.data.embedUrl);
                }
              } catch {
                // Will show error state
              }
            }
          }
        }
      } catch {
        // Silently retry on next interval
      }
    };

    const interval = setInterval(pollStatus, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [lesson.id, lesson.bunnyVideoId, isProcessing, videoStatus]);

  if (loading) {
    return (
      <div className="aspect-video bg-gradient-to-br from-[#000E51] to-[#001a7a] rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <svg className="animate-spin h-10 w-10 mx-auto mb-3 text-white/70" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm opacity-70">Loading video...</p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="aspect-video bg-gradient-to-br from-[#000E51] to-[#001a7a] rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-[#FF6F00]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-lg font-medium">Video is being processed</p>
          <p className="text-sm opacity-70 mt-2">This usually takes a few minutes. The page will update automatically.</p>
        </div>
      </div>
    );
  }

  if (error || !embedUrl) {
    return (
      <div className="aspect-video bg-gradient-to-br from-[#000E51] to-[#001a7a] rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-50">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <p className="text-sm opacity-70">{error || "Video unavailable"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-2xl overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        loading="lazy"
        className="w-full h-full border-0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
