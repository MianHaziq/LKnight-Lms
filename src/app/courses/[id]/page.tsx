"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { courseApi, enrollmentApi, CourseDetails, Module } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const levelColors: Record<string, string> = {
  BEGINNER: "bg-[#FF6F00]",
  INTERMEDIATE: "bg-blue-500",
  ADVANCED: "bg-green-500",
};

const formatLevel = (level: string) =>
  level.charAt(0) + level.slice(1).toLowerCase();

const formatDuration = (seconds: number) => {
  if (!seconds) return "0 min";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins} min`;
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { isAuthenticated, token } = useAuth();

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    (async () => {
      try {
        setIsLoading(true);

        // If user is logged in, check if they already have access
        if (isAuthenticated && token) {
          try {
            const accessCheck = await enrollmentApi.getCheckoutDetails(courseId);
            if (accessCheck.data?.hasAccess) {
              router.replace(`/dashboard/courses/${courseId}`);
              return;
            }
          } catch {
            // Access check failed (e.g. not enrolled) — continue to show preview
          }
        }

        const res = await courseApi.getById(courseId);
        if (res.data) {
          setCourse(res.data);
          // Expand first module by default
          if (res.data.modules && res.data.modules.length > 0) {
            setExpandedModules(new Set([res.data.modules[0].id]));
          }
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load course"
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [courseId, isAuthenticated, token, router]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const modules: Module[] = course?.modules || [];
  const totalLessons = modules.reduce(
    (sum, m) => sum + (m.lessons?.length || 0),
    0
  );
  const totalDuration = modules.reduce(
    (sum, m) =>
      sum + (m.lessons?.reduce((s, l) => s + (l.duration || 0), 0) || 0),
    0
  );
  const enrollments = (course as CourseDetails & { _count?: { enrollments: number } })?._count?.enrollments ?? course?.enrollments ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="aspect-video bg-gray-200 rounded-2xl"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Course not found
            </h2>
            <p className="text-gray-500 mb-4">
              {error || "The course you're looking for doesn't exist."}
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E86400] transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const instructorName =
    course.instructorName ||
    (course.instructor && typeof course.instructor === "object"
      ? `${course.instructor.firstName} ${course.instructor.lastName}`
      : "");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-[#000E51] pt-12 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/courses"
              className="hover:text-white/80 transition-colors"
            >
              Courses
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{course.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-md text-white text-xs font-semibold ${
                    levelColors[course.level] || "bg-gray-500"
                  }`}
                >
                  {formatLevel(course.level)}
                </span>
                {course.category && (
                  <span className="text-[#FF6F00] text-sm font-medium">
                    {course.category.name}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 font-outfit">
                {course.title}
              </h1>

              {course.summary && (
                <p className="text-white/70 text-base md:text-lg mb-6 leading-relaxed">
                  {course.summary}
                </p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
                {instructorName && (
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>{instructorName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1"
                    />
                  </svg>
                  <span>{modules.length} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>{totalLessons} lessons</span>
                </div>
                {totalDuration > 0 && (
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6V12L16 14" />
                    </svg>
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                )}
                {enrollments > 0 && (
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{enrollments.toLocaleString()} students</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Thumbnail + CTA */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={course.thumbnail || "/icon/webCourse.png"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  {/* Lock overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-500 mb-3">
                    Get full access to this course and all others with a
                    subscription plan.
                  </p>
                  <Link
                    href="/pricing"
                    className="block w-full text-center px-6 py-3 bg-[#FF6F00] text-white font-semibold rounded-xl hover:bg-[#E86400] transition-colors"
                  >
                    View Plans &amp; Pricing
                  </Link>
                  {isAuthenticated && (
                    <Link
                      href={`/dashboard/courses/${courseId}`}
                      className="block w-full text-center px-6 py-2.5 mt-2 border border-[#000E51] text-[#000E51] font-medium rounded-xl hover:bg-[#000E51]/5 transition-colors text-sm"
                    >
                      Go to Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Description + Modules */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            {course.description && (
              <div>
                <h2 className="text-xl font-bold text-[#000E51] mb-4 font-outfit">
                  About This Course
                </h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {course.description}
                </div>
              </div>
            )}

            {/* Course Curriculum */}
            <div>
              <h2 className="text-xl font-bold text-[#000E51] mb-4 font-outfit">
                Course Curriculum
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {modules.length} modules &middot; {totalLessons} lessons
                {totalDuration > 0 && ` \u00b7 ${formatDuration(totalDuration)}`}
              </p>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {modules.map((module, idx) => (
                  <div
                    key={module.id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    {/* Module Header */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-[#000E51] text-white text-sm font-semibold rounded-lg flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-[#000E51] text-sm sm:text-base">
                            {module.title}
                          </h3>
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
                        className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                          expandedModules.has(module.id) ? "rotate-180" : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {/* Lesson List (titles only, locked) */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedModules.has(module.id)
                          ? "max-h-[1000px]"
                          : "max-h-0"
                      }`}
                    >
                      <div className="pb-2 bg-gray-50/50">
                        {module.lessons?.map((lesson, lessonIdx) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 px-4 py-3 text-left"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center flex-shrink-0">
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <rect
                                  x="3"
                                  y="11"
                                  width="18"
                                  height="11"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {lessonIdx + 1}. {lesson.title}
                              </p>
                            </div>
                            {lesson.duration > 0 && (
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                {formatDuration(lesson.duration)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {modules.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    Course content coming soon.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Sticky CTA sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* What you'll get */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="font-semibold text-[#000E51] mb-3">
                  What&apos;s Included
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6F00"
                      strokeWidth="2"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    {totalLessons} video lessons
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6F00"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />
                      <rect
                        x="14"
                        y="14"
                        width="7"
                        height="7"
                        rx="1"
                      />
                    </svg>
                    {modules.length} course modules
                  </li>
                  {totalDuration > 0 && (
                    <li className="flex items-center gap-3">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FF6F00"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6V12L16 14" />
                      </svg>
                      {formatDuration(totalDuration)} of content
                    </li>
                  )}
                  <li className="flex items-center gap-3">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6F00"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Full access with any plan
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <Link
                href="/pricing"
                className="block w-full text-center px-6 py-3.5 bg-[#FF6F00] text-white font-semibold rounded-xl hover:bg-[#E86400] transition-colors text-base"
              >
                Get Started — View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
