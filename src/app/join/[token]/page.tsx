"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  subscriptionApi,
  InviteLinkPreview,
  InviteLinkStatus,
} from "@/lib/api";

type Phase =
  | "loading"
  | "needs_auth"
  | "joining"
  | "joined"
  | "error";

interface StatePayload {
  phase: Phase;
  status?: InviteLinkStatus;
  preview?: InviteLinkPreview;
  message?: string;
}

function statusTitle(status?: InviteLinkStatus): string {
  switch (status) {
    case "invalid":
      return "Invalid invite link";
    case "revoked":
      return "Link revoked";
    case "expired":
      return "Link expired";
    case "exhausted":
      return "Link no longer available";
    case "subscription_inactive":
      return "Team is no longer active";
    case "full":
      return "Team is full";
    case "is_owner":
      return "You're the owner";
    default:
      return "Something went wrong";
  }
}

function StatusIcon({ tone }: { tone: "info" | "success" | "warn" | "error" }) {
  const palette = {
    info: { bg: "bg-blue-100", color: "#1d4ed8" },
    success: { bg: "bg-green-100", color: "#15803d" },
    warn: { bg: "bg-amber-100", color: "#b45309" },
    error: { bg: "bg-red-100", color: "#b91c1c" },
  }[tone];

  const path =
    tone === "success"
      ? "M5 13l4 4L19 7"
      : tone === "error"
      ? "M6 18L18 6M6 6l12 12"
      : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";

  return (
    <div className={`w-16 h-16 ${palette.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
      <svg className="w-8 h-8" fill="none" stroke={palette.color} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
      </svg>
    </div>
  );
}

export default function JoinPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [state, setState] = useState<StatePayload>({ phase: "loading" });
  const previewLoadedRef = useRef(false);
  const redeemStartedRef = useRef(false);

  // Step 1: load preview (public).
  useEffect(() => {
    if (previewLoadedRef.current) return;
    previewLoadedRef.current = true;

    Promise.resolve().then(async () => {
      if (!token) {
        setState({ phase: "error", status: "invalid", message: "No invite token in the URL." });
        return;
      }
      try {
        const res = await subscriptionApi.previewInviteLink(token);
        if (res.success && res.status === "valid" && res.data) {
          setState({ phase: "loading", preview: res.data, status: "valid" });
        } else {
          setState({
            phase: "error",
            status: res.status,
            message: res.message,
          });
        }
      } catch (err) {
        setState({
          phase: "error",
          status: "invalid",
          message: err instanceof Error ? err.message : "Could not load invitation.",
        });
      }
    });
  }, [token]);

  // Step 2: branch on auth state once preview is valid.
  useEffect(() => {
    if (authLoading) return;
    if (state.phase !== "loading" || state.status !== "valid") return;
    if (redeemStartedRef.current) return;

    Promise.resolve().then(async () => {
      if (!user) {
        setState((s) => ({ ...s, phase: "needs_auth" }));
        return;
      }

      redeemStartedRef.current = true;
      setState((s) => ({ ...s, phase: "joining" }));

      try {
        const res = await subscriptionApi.redeemInviteLink(token);
        if (res.status === "joined" || res.status === "already_member") {
          setState({
            phase: "joined",
            status: res.status,
            message:
              res.status === "joined"
                ? "You have joined the team. Redirecting to your dashboard..."
                : "You already have access. Redirecting to your dashboard...",
          });
          setTimeout(() => router.replace("/dashboard"), 1500);
        } else {
          setState({
            phase: "error",
            status: res.status,
            message: res.message,
          });
        }
      } catch (err) {
        setState({
          phase: "error",
          status: "invalid",
          message: err instanceof Error ? err.message : "Could not accept invitation.",
        });
      }
    });
  }, [authLoading, user, state.phase, state.status, token, router]);

  // Render

  if (state.phase === "loading" || state.phase === "joining") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6F00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {state.phase === "joining" ? "Joining the team..." : "Loading invitation..."}
          </p>
        </div>
      </div>
    );
  }

  if (state.phase === "joined") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <StatusIcon tone="success" />
          <h1 className="text-xl font-bold text-[#000E51] mb-2">Welcome aboard</h1>
          <p className="text-gray-500">{state.message}</p>
        </div>
      </div>
    );
  }

  if (state.phase === "needs_auth" && state.preview) {
    const inviter = state.preview.inviterFirstName;
    const org = state.preview.organizationName;
    const plan = state.preview.planName;
    const headline = org
      ? `Join ${org} on LKnight LMS`
      : "You're invited to join a team on LKnight LMS";
    const subtitle = inviter
      ? `${inviter} invited you${org ? ` to ${org}` : ""}${plan ? ` (${plan} plan)` : ""}.`
      : "Sign in or create an account to accept this invitation.";

    const redirectPath = `/join/${encodeURIComponent(token)}`;
    const signinHref = `/signin?redirect=${encodeURIComponent(redirectPath)}`;
    const signupHref = `/signup?redirect=${encodeURIComponent(redirectPath)}`;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#FF6F00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M22 11h-6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#000E51] mb-2">{headline}</h1>
          <p className="text-gray-500 mb-2">{subtitle}</p>
          {state.preview.seatsRemaining > 0 && (
            <p className="text-xs text-gray-400 mb-6">
              {state.preview.seatsRemaining} seat{state.preview.seatsRemaining === 1 ? "" : "s"} remaining
            </p>
          )}
          <div className="flex flex-col gap-3">
            <Link
              href={signupHref}
              className="block w-full px-6 py-3 bg-[#FF6F00] hover:bg-[#E86400] text-white font-semibold rounded-xl transition-colors"
            >
              Create an account
            </Link>
            <Link
              href={signinHref}
              className="block w-full px-6 py-3 border border-gray-200 text-[#000E51] hover:bg-gray-50 font-semibold rounded-xl transition-colors"
            >
              I already have an account
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            After signing in, you&apos;ll automatically join the team.
          </p>
        </div>
      </div>
    );
  }

  // Error state — any non-valid status from preview or redeem.
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        <StatusIcon tone={state.status === "full" ? "warn" : "error"} />
        <h1 className="text-xl font-bold text-[#000E51] mb-2">{statusTitle(state.status)}</h1>
        <p className="text-gray-500 mb-6">{state.message || "This invitation can no longer be used."}</p>
        <div className="flex flex-col gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-block w-full px-6 py-3 bg-[#000E51] text-white font-semibold rounded-xl hover:bg-[#001570] transition-colors"
            >
              Go to dashboard
            </Link>
          ) : (
            <Link
              href="/"
              className="inline-block w-full px-6 py-3 bg-[#000E51] text-white font-semibold rounded-xl hover:bg-[#001570] transition-colors"
            >
              Back to home
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
