"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { subscriptionApi } from "@/lib/api";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, isLoading: authLoading } = useAuth();
  const [status, setStatus] = useState<"idle" | "accepting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const acceptStarted = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setStatus("error");
      setMessage("Invalid invitation link. No token provided.");
      return;
    }
    if (!user) {
      const redirectUrl = `/accept-invite?token=${encodeURIComponent(token)}`;
      router.replace(`/signin?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }
    if (acceptStarted.current) return;
    acceptStarted.current = true;
    setStatus("accepting");
    subscriptionApi
      .acceptInvite(token)
      .then((res) => {
        if (res.success) {
          setStatus("success");
          setMessage("You now have access. Redirecting to dashboard...");
          setTimeout(() => router.replace("/dashboard"), 1500);
        } else {
          setStatus("error");
          setMessage((res as { message?: string }).message || "Could not accept invitation.");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Could not accept invitation.");
      });
  }, [authLoading, user, token, router]);

  if (authLoading || (user && token && status === "accepting")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6F00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Accepting invitation...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#000E51] mb-2">Invalid link</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link href="/signin" className="inline-block px-6 py-3 bg-[#000E51] text-white font-semibold rounded-xl hover:bg-[#001570] transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#000E51] mb-2">Invitation issue</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-[#000E51] text-white font-semibold rounded-xl hover:bg-[#001570] transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#000E51] mb-2">Access granted</h1>
          <p className="text-gray-500">{message}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}
