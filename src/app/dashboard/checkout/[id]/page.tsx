"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { enrollmentApi, CheckoutCourse } from "@/lib/api";

// Level badge colors
const levelColors: Record<string, string> = {
  BEGINNER: "bg-[#FF6F00]",
  INTERMEDIATE: "bg-blue-500",
  ADVANCED: "bg-green-500",
};

const formatLevel = (level: string) => {
  return level.charAt(0) + level.slice(1).toLowerCase();
};

function CheckoutContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = params.id as string;
  const wasCanceled = searchParams.get("canceled") === "true";

  const [course, setCourse] = useState<CheckoutCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const response = await enrollmentApi.getCheckoutDetails(courseId);
        if (response.data) {
          setCourse(response.data);
          // If user already has access, redirect to course
          if (response.data.hasAccess) {
            router.push(`/dashboard/courses/${courseId}`);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, router]);

  // Show cancellation message if redirected back from Stripe
  useEffect(() => {
    if (wasCanceled) {
      setError("Payment was canceled. You can try again when you're ready.");
    }
  }, [wasCanceled]);

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      setError(null);

      const response = await enrollmentApi.createCheckoutSession(courseId);

      if (response.success && response.data) {
        // FREE COURSE: enrolled directly, no Stripe needed
        if ("free" in response.data && response.data.free) {
          setSuccess(true);
          setTimeout(() => {
            router.push(`/dashboard/courses/${courseId}`);
          }, 2000);
          return;
        }

        // PAID COURSE: redirect to Stripe Checkout
        if ("sessionUrl" in response.data && response.data.sessionUrl) {
          const sessionUrl = response.data.sessionUrl;

          // Validate the URL is a legitimate Stripe checkout URL
          if (!sessionUrl.startsWith("https://checkout.stripe.com")) {
            setError("Invalid checkout URL received. Please try again or contact support.");
            setIsPurchasing(false);
            return;
          }

          window.location.href = sessionUrl;
          // Re-enable button after 10s if redirect stalls (slow connection)
          setTimeout(() => setIsPurchasing(false), 10000);
          return;
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to start checkout. Please try again."
      );
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#000E51] hover:bg-[#001a7a] text-white font-semibold rounded-xl transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!course) return null;

  // Success state (for free courses)
  if (success) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100 shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#000E51] mb-3">
            Enrollment Successful!
          </h2>
          <p className="text-gray-600 mb-2">
            You now have access to <span className="font-semibold text-[#000E51]">{course.title}</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting you to the course...
          </p>
          <div className="flex items-center justify-center gap-2 text-[#FF6F00]">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span className="text-sm font-medium">Please wait...</span>
          </div>
        </div>
      </div>
    );
  }

  const isFree = course.price === 0;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#000E51] font-medium mb-6 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Dashboard
      </Link>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Course Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Header Card */}
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Course Image */}
            <div className="relative aspect-[21/9] overflow-hidden">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#000E51] to-[#001a7a] flex items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-50">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              )}
              {/* Level Badge */}
              <span className={`absolute top-4 left-4 px-4 py-2 rounded-lg text-white text-sm font-semibold ${levelColors[course.level] || "bg-gray-500"}`}>
                {formatLevel(course.level)}
              </span>
            </div>

            {/* Course Info */}
            <div className="p-6">
              {/* Category */}
              {course.category && (
                <span className="text-sm font-medium text-[#FF6F00] mb-2 block">
                  {course.category.name}
                </span>
              )}

              <h1 className="text-2xl sm:text-3xl font-bold text-[#000E51] mb-3">
                {course.title}
              </h1>

              {course.summary && (
                <p className="text-gray-600 mb-4">{course.summary}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className="text-sm">{course.moduleCount} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                    <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm">{course.lessonCount} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className="text-sm">{course.enrollments} students</span>
                </div>
                {course.instructor && (
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span className="text-sm">By {course.instructor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-[#000E51] mb-4">Course Content</h2>
            <div className="space-y-3">
              {course.modules.map((module, index) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#000E51]/10 rounded-lg flex items-center justify-center text-sm font-bold text-[#000E51]">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{module.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {module.lessonCount} lesson{module.lessonCount !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {course.description && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-[#000E51] mb-4">About This Course</h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                {course.description}
              </div>
            </div>
          )}
        </div>

        {/* Purchase Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg sticky top-24">
            {/* Price */}
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-1">
                {isFree ? (
                  <span className="text-4xl font-bold text-green-600">Free</span>
                ) : (
                  <span className="text-4xl font-bold text-[#000E51]">
                    ${course.price.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {isFree ? "No payment required" : "One-time payment"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="w-full py-4 bg-[#FF6F00] hover:bg-[#E86400] text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPurchasing ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {isFree ? "Enrolling..." : "Redirecting to payment..."}
                </>
              ) : isFree ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Enroll for Free
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Enroll Now
                </>
              )}
            </button>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span className="text-sm">Lifetime access</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span className="text-sm">{course.moduleCount} modules, {course.lessonCount} lessons</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span className="text-sm">Certificate of completion</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span className="text-sm">Mobile & desktop access</span>
              </div>
            </div>

            {/* Secure Payment Note */}
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span className="text-xs">
                  {isFree ? "Secure enrollment" : "Secure payment powered by Stripe"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
