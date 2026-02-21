"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { enrollmentApi, SessionEnrollment } from "@/lib/api";

const MAX_POLLS = 10;
const POLL_INTERVAL = 2000;

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [enrollment, setEnrollment] = useState<SessionEnrollment | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const checkEnrollment = useCallback(async () => {
    if (!sessionId) {
      setError("No session ID found. Please check your dashboard for enrollment status.");
      setIsPolling(false);
      return;
    }

    try {
      const response = await enrollmentApi.getSessionEnrollment(sessionId);
      if (response.success && response.data) {
        const enrollmentData = response.data;
        setEnrollment(enrollmentData);
        setIsPolling(false);
        // Auto-redirect to course after 3 seconds
        setTimeout(() => {
          router.push(`/dashboard/courses/${enrollmentData.course.id}`);
        }, 3000);
      }
    } catch {
      // Enrollment not yet created (webhook still processing) — keep polling
      setPollCount((prev) => prev + 1);
    }
  }, [sessionId, router]);

  useEffect(() => {
    if (!isPolling || pollCount >= MAX_POLLS) {
      if (pollCount >= MAX_POLLS && !enrollment) {
        setIsPolling(false);
        setError(
          "Payment was successful but enrollment is taking longer than expected. " +
          "Please check your dashboard in a few minutes. " +
          "If the course doesn't appear, contact support."
        );
      }
      return;
    }

    const timer = setTimeout(checkEnrollment, pollCount === 0 ? 500 : POLL_INTERVAL);
    return () => clearTimeout(timer);
  }, [isPolling, pollCount, checkEnrollment, enrollment]);

  // No session ID
  if (!sessionId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#000E51] mb-3">Invalid Session</h1>
          <p className="text-gray-500 mb-6">
            No payment session found. Please check your dashboard for enrollment status.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-[#FF6F00] hover:bg-[#E86400] text-white font-semibold rounded-xl transition-all duration-200"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Error state (polling timed out)
  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#000E51] mb-3">Payment Received</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-[#FF6F00] hover:bg-[#E86400] text-white font-semibold rounded-xl transition-all duration-200"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Enrollment confirmed
  if (enrollment) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#000E51] mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-2">
            You now have access to{" "}
            <span className="font-semibold text-[#000E51]">
              {enrollment.course.title}
            </span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Redirecting you to the course...
          </p>
          <div className="flex items-center justify-center gap-2 text-[#FF6F00] mb-6">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span className="text-sm font-medium">Please wait...</span>
          </div>
          <Link
            href={`/dashboard/courses/${enrollment.course.id}`}
            className="inline-block px-6 py-3 bg-[#FF6F00] hover:bg-[#E86400] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
          >
            Go to Course Now
          </Link>
        </div>
      </div>
    );
  }

  // Polling state (waiting for webhook)
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-2xl p-8 sm:p-12 border border-gray-100 shadow-lg">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="animate-spin w-8 h-8 text-[#FF6F00]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#000E51] mb-3">
          Confirming Your Payment
        </h1>
        <p className="text-gray-500 mb-4">
          Please wait while we process your enrollment. This usually takes a few seconds.
        </p>
        <div className="flex justify-center gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-[#FF6F00] rounded-full animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6F00]"></div>
            </div>
            <h1 className="text-2xl font-bold text-[#000E51] mb-3">Loading...</h1>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
