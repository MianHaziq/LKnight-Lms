"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { courseApi, lessonApi, documentApi, CourseDetails, Module, Lesson, enrollmentApi, CheckoutCourse, Document as DocType } from "@/lib/api";
import BunnyVideoPlayer from "@/components/BunnyVideoPlayer";

// Format duration from seconds to mm:ss
const formatDuration = (seconds: number) => {
  if (!seconds || seconds === 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function CourseLearningPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.id as string;

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseDocuments, setCourseDocuments] = useState<DocType[]>([]);
  const [lessonDocuments, setLessonDocuments] = useState<DocType[]>([]);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const fetchCourse = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First check if user has access to this course
      const accessCheck = await enrollmentApi.getCheckoutDetails(courseId);
      if (accessCheck.data && !accessCheck.data.hasAccess) {
        // User doesn't have access, redirect to public course preview page
        router.push(`/courses/${courseId}`);
        return;
      }

      // Store enrollment ID and load completed lessons from localStorage
      const eid = accessCheck.data?.enrollmentId || null;
      if (eid) {
        setEnrollmentId(eid);
        try {
          const saved = localStorage.getItem(`progress_${eid}`);
          if (saved) {
            setCompletedLessons(new Set(JSON.parse(saved)));
          }
        } catch {
          // ignore localStorage errors
        }
      }

      const [response, docsRes] = await Promise.all([
        courseApi.getById(courseId),
        documentApi.getByCourse(courseId),
      ]);

      if (docsRes.success && docsRes.data) {
        setCourseDocuments(docsRes.data as DocType[]);
      }

      if (response.data) {
        setCourse(response.data);
        if (response.data.modules && response.data.modules.length > 0) {
          setModules(response.data.modules);
          // Expand first module by default
          setExpandedModules(new Set([response.data.modules[0].id]));
          // Select first lesson by default and fetch full details
          if (response.data.modules[0].lessons?.length > 0) {
            const firstLesson = response.data.modules[0].lessons[0];
            setSelectedLesson(firstLesson);
            // Fetch full lesson data and documents
            try {
              const [lessonRes, lessonDocsRes] = await Promise.all([
                lessonApi.getById(firstLesson.id),
                documentApi.getByLesson(firstLesson.id),
              ]);
              if (lessonRes.data) {
                setSelectedLesson(lessonRes.data);
              }
              if (lessonDocsRes.success && lessonDocsRes.data) {
                setLessonDocuments(lessonDocsRes.data as DocType[]);
              }
            } catch (err) {
              console.error("Failed to fetch first lesson:", err);
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch course:", err);
      setError(err instanceof Error ? err.message : "Failed to load course");
    } finally {
      setIsLoading(false);
    }
  }, [courseId, router]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  // Calculate total lessons, duration, and progress
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const totalDuration = modules.reduce(
    (sum, m) => sum + (m.lessons?.reduce((lSum, l) => lSum + (l.duration || 0), 0) || 0),
    0
  );
  const progressPercent = totalLessons > 0
    ? Math.round((completedLessons.size / totalLessons) * 100)
    : 0;

  const markLessonCompleted = (lessonId: string) => {
    if (!enrollmentId || completedLessons.has(lessonId)) return;

    const updated = new Set(completedLessons);
    updated.add(lessonId);
    setCompletedLessons(updated);

    // Persist to localStorage
    try {
      localStorage.setItem(`progress_${enrollmentId}`, JSON.stringify([...updated]));
    } catch {
      // ignore
    }

    // Calculate and send progress to backend
    const newProgress = totalLessons > 0
      ? Math.round((updated.size / totalLessons) * 100)
      : 0;
    enrollmentApi.updateProgress(enrollmentId, newProgress).catch(() => {
      // silently fail
    });
  };

  const handleLessonClick = async (lesson: Lesson) => {
    // Set basic lesson info first for immediate UI feedback
    setSelectedLesson(lesson);
    setLessonDocuments([]);
    // Scroll to video player on mobile
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Fetch full lesson data and documents in parallel
    try {
      const [response, docsRes] = await Promise.all([
        lessonApi.getById(lesson.id),
        documentApi.getByLesson(lesson.id),
      ]);
      if (response.data) {
        setSelectedLesson(response.data);
      }
      if (docsRes.success && docsRes.data) {
        setLessonDocuments(docsRes.data as DocType[]);
      }
    } catch (err) {
      console.error("Failed to fetch lesson details:", err);
    }
  };

  // Download document
  const handleDownload = async (docId: string, fileName: string) => {
    try {
      setDownloadingDoc(docId);
      const res = await documentApi.getById(docId);
      if (res.success && res.data && res.data.content) {
        const link = document.createElement("a");
        link.href = res.data.content;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Failed to download document:", err);
    } finally {
      setDownloadingDoc(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-video bg-gray-200 rounded-2xl"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h2>
          <p className="text-gray-500 mb-4">{error || "The course you're looking for doesn't exist."}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E86400] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-[#FF6F00] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span className="hidden sm:inline text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
              <h1 className="text-sm sm:text-base font-semibold text-[#000E51] line-clamp-1 max-w-[200px] sm:max-w-md">
                {course.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hidden sm:inline">{totalLessons} lessons</span>
              <span className="hidden sm:inline">•</span>
              <span>{Math.round(totalDuration / 60)} min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer
              lesson={selectedLesson}
              onHalfWatched={() => {
                if (selectedLesson) {
                  markLessonCompleted(selectedLesson.id);
                }
              }}
            />

            {/* Lesson Info */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#000E51] font-outfit">
                    {selectedLesson?.title || "Select a lesson"}
                  </h2>
                  {selectedLesson?.description && (
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">{selectedLesson.description}</p>
                  )}
                </div>
                {selectedLesson && (
                  <span className="flex-shrink-0 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                    {formatDuration(selectedLesson.duration)}
                  </span>
                )}
              </div>

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                {course.category && (
                  <span className="text-sm text-gray-600">
                    Category: <span className="font-medium text-[#000E51]">{course.category.name}</span>
                  </span>
                )}
                {(course.instructorName || course.instructor) && (
                  <span className="text-sm text-gray-600">
                    Instructor: <span className="font-medium text-[#000E51]">
                      {course.instructorName
                        || (typeof course.instructor === 'object'
                          ? `${course.instructor.firstName} ${course.instructor.lastName}`
                          : course.instructor)}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* Lesson Documents */}
            {lessonDocuments.length > 0 && (
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
                <h3 className="font-semibold text-[#000E51] mb-3 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#FF6F00]">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                  Lesson Materials
                </h3>
                <div className="space-y-2">
                  {lessonDocuments.map((doc) => (
                    <DocumentDownloadItem key={doc.id} doc={doc} onDownload={handleDownload} isDownloading={downloadingDoc === doc.id} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modules Sidebar */}
          <div className="space-y-4">
            {/* Course Progress Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#000E51]">Course Content</h3>
                <span className="text-sm font-semibold text-[#FF6F00]">{progressPercent}%</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>{modules.length} modules</span>
                <span>•</span>
                <span>{completedLessons.size}/{totalLessons} lessons</span>
                <span>•</span>
                <span>{Math.round(totalDuration / 60)} min</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6F00] to-[#ff8c33] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Course Materials */}
            {courseDocuments.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <h3 className="font-semibold text-[#000E51] mb-3 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#FF6F00]">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  Course Materials
                </h3>
                <div className="space-y-1.5">
                  {courseDocuments.map((doc) => (
                    <DocumentDownloadItem key={doc.id} doc={doc} onDownload={handleDownload} isDownloading={downloadingDoc === doc.id} />
                  ))}
                </div>
              </div>
            )}

            {/* Module List */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {modules.map((module, moduleIndex) => (
                <div key={module.id} className="border-b border-gray-100 last:border-b-0">
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-[#000E51] text-white text-xs font-semibold rounded-lg flex items-center justify-center">
                        {moduleIndex + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-[#000E51] text-sm sm:text-base line-clamp-1">
                          {module.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {module.lessons?.length || 0} lessons
                        </p>
                      </div>
                    </div>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`text-gray-400 transition-transform duration-200 ${
                        expandedModules.has(module.id) ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>

                  {/* Lessons List */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedModules.has(module.id) ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    <div className="pb-2">
                      {module.lessons?.map((lesson, lessonIndex) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selectedLesson?.id === lesson.id
                              ? "bg-[#FF6F00]/10 border-l-2 border-[#FF6F00]"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            completedLessons.has(lesson.id)
                              ? "bg-green-500 text-white"
                              : selectedLesson?.id === lesson.id
                                ? "bg-[#FF6F00] text-white"
                                : "bg-gray-100 text-gray-500"
                          }`}>
                            {completedLessons.has(lesson.id) ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium line-clamp-1 ${
                              selectedLesson?.id === lesson.id ? "text-[#FF6F00]" : "text-gray-700"
                            }`}>
                              {lessonIndex + 1}. {lesson.title}
                            </p>
                            <p className="text-xs text-gray-400">{formatDuration(lesson.duration)}</p>
                          </div>
                        </button>
                      ))}

                      {/* Module Documents */}
                      {module.documents && module.documents.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-50">
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Module Materials</p>
                          {module.documents.map((doc) => (
                            <DocumentDownloadItem key={doc.id} doc={doc} onDownload={handleDownload} isDownloading={downloadingDoc === doc.id} compact />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {modules.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No modules available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// File type icon helper
const fileTypeConfig: Record<string, { color: string; label: string }> = {
  "application/pdf": { color: "text-red-500 bg-red-50", label: "PDF" },
  "application/msword": { color: "text-blue-500 bg-blue-50", label: "DOC" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { color: "text-blue-500 bg-blue-50", label: "DOCX" },
  "application/vnd.ms-excel": { color: "text-green-600 bg-green-50", label: "XLS" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { color: "text-green-600 bg-green-50", label: "XLSX" },
  "application/vnd.ms-powerpoint": { color: "text-orange-500 bg-orange-50", label: "PPT" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { color: "text-orange-500 bg-orange-50", label: "PPTX" },
  "text/plain": { color: "text-gray-500 bg-gray-50", label: "TXT" },
  "text/csv": { color: "text-green-600 bg-green-50", label: "CSV" },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Document Download Item Component
function DocumentDownloadItem({
  doc,
  onDownload,
  isDownloading,
  compact = false,
}: {
  doc: DocType;
  onDownload: (id: string, fileName: string) => void;
  isDownloading: boolean;
  compact?: boolean;
}) {
  const config = fileTypeConfig[doc.fileType] || { color: "text-gray-500 bg-gray-50", label: "FILE" };

  return (
    <button
      onClick={() => onDownload(doc.id, doc.fileName)}
      disabled={isDownloading}
      className={`w-full flex items-center gap-3 rounded-lg hover:bg-gray-50 transition-colors text-left disabled:opacity-60 ${
        compact ? "px-2 py-1.5" : "px-3 py-2.5"
      }`}
    >
      <div className={`flex-shrink-0 rounded-lg flex items-center justify-center ${config.color} ${compact ? "w-7 h-7" : "w-9 h-9"}`}>
        <span className={`font-bold ${compact ? "text-[8px]" : "text-[10px]"}`}>{config.label}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-gray-700 truncate ${compact ? "text-xs" : "text-sm"}`}>{doc.title}</p>
        {!compact && <p className="text-xs text-gray-400">{formatFileSize(doc.fileSize)}</p>}
      </div>
      {isDownloading ? (
        <svg className={`animate-spin text-[#FF6F00] ${compact ? "w-3.5 h-3.5" : "w-4 h-4"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      ) : (
        <svg className={`text-gray-400 flex-shrink-0 ${compact ? "w-3.5 h-3.5" : "w-4 h-4"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
    </button>
  );
}

// Video Player Component
function VideoPlayer({ lesson, onHalfWatched }: { lesson: Lesson | null; onHalfWatched?: () => void }) {
  // Priority 1: Bunny Stream video (professional streaming)
  if (lesson?.bunnyVideoId) {
    return <BunnyVideoPlayer lesson={lesson} onHalfWatched={onHalfWatched} />;
  }

  // Priority 2 & 3: External URL or Base64 content (legacy player below)
  return <LegacyVideoPlayer lesson={lesson} onHalfWatched={onHalfWatched} />;
}

// Legacy HTML5 video player for external URLs and Base64 content
function LegacyVideoPlayer({ lesson, onHalfWatched }: { lesson: Lesson | null; onHalfWatched?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const halfWatchedRef = useRef(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Reset player when lesson changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
    halfWatchedRef.current = false;
  }, [lesson?.id]);

  // Auto-hide controls
  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      // Mark as completed when user watches past 50%
      if (
        !halfWatchedRef.current &&
        videoRef.current.duration > 0 &&
        videoRef.current.currentTime > videoRef.current.duration / 2
      ) {
        halfWatchedRef.current = true;
        onHalfWatched?.();
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleSkip(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          handleSkip(10);
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, duration]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get video URL
  // Check if content is already a data URL (starts with "data:") or needs to be constructed
  const getVideoUrl = () => {
    if (lesson?.videoUrl) return lesson.videoUrl;
    if (!lesson?.content) return null;

    // If content already starts with "data:", it's a complete data URL
    if (lesson.content.startsWith('data:')) {
      return lesson.content;
    }

    // Otherwise, construct the data URL from base64 content
    return `data:${lesson.contentType || 'video/mp4'};base64,${lesson.content}`;
  };

  const videoUrl = getVideoUrl();

  if (!lesson) {
    return (
      <div className="aspect-video bg-gradient-to-br from-[#000E51] to-[#001a7a] rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-50">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <p className="text-lg font-medium">Select a lesson to start learning</p>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-gradient-to-br from-[#000E51] to-[#001a7a] rounded-2xl flex items-center justify-center">
        <div className="text-center text-white">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-50">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
            <line x1="7" y1="2" x2="7" y2="22"/>
            <line x1="17" y1="2" x2="17" y2="22"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="2" y1="7" x2="7" y2="7"/>
            <line x1="2" y1="17" x2="7" y2="17"/>
            <line x1="17" y1="17" x2="22" y2="17"/>
            <line x1="17" y1="7" x2="22" y2="7"/>
          </svg>
          <p className="text-lg font-medium">{lesson.title}</p>
          <p className="text-sm opacity-70 mt-2">Video content coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative aspect-video bg-black rounded-2xl overflow-hidden group ${isFullscreen ? "rounded-none" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        controlsList="nodownload"
        disablePictureInPicture
        playsInline
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
        >
          <div className="w-20 h-20 bg-[#FF6F00] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </button>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16 pb-4 px-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#FF6F00] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, #FF6F00 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%)`,
            }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-[#FF6F00] transition-colors p-1">
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
            </button>

            {/* Skip Backward */}
            <button onClick={() => handleSkip(-10)} className="text-white hover:text-[#FF6F00] transition-colors p-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                <text x="12" y="15" fontSize="8" fill="currentColor" textAnchor="middle">10</text>
              </svg>
            </button>

            {/* Skip Forward */}
            <button onClick={() => handleSkip(10)} className="text-white hover:text-[#FF6F00] transition-colors p-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                <text x="12" y="15" fontSize="8" fill="currentColor" textAnchor="middle">10</text>
              </svg>
            </button>

            {/* Volume */}
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-[#FF6F00] transition-colors p-1">
                {isMuted || volume === 0 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                ) : volume < 0.5 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>

            {/* Time Display */}
            <span className="text-white text-xs sm:text-sm font-medium ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Speed */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-white hover:text-[#FF6F00] transition-colors p-1 text-xs sm:text-sm font-medium"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-[#1a1a1a] rounded-lg py-2 min-w-[80px] shadow-xl">
                  {speeds.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`w-full px-4 py-1.5 text-left text-sm transition-colors ${
                        playbackSpeed === speed ? "text-[#FF6F00] bg-white/10" : "text-white hover:bg-white/10"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-[#FF6F00] transition-colors p-1">
              {isFullscreen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
