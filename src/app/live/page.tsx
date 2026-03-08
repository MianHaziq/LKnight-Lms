"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { type LiveStreamPlayback } from "@/lib/api";
import Hls from "hls.js";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function fetchPlayback(
  endpoint: string,
  token: string | null
): Promise<{ status: number; data: LiveStreamPlayback | null; success: boolean; message?: string }> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = await res.json().catch(() => ({}));
  if (res.status === 403) {
    return { status: 403, data: null, success: false, message: json.message };
  }
  if (res.ok && json.success) {
    return { status: res.status, data: json.data ?? null, success: true };
  }
  return { status: res.status, data: null, success: false, message: json.message };
}

function LivePageContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const streamIdParam = searchParams.get("stream");

  const [playback, setPlayback] = useState<LiveStreamPlayback | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [streamEnded, setStreamEnded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [hlsReloadKey, setHlsReloadKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin?redirect=/live");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    (async () => {
      setLoading(true);
      setAccessDenied(false);
      setServerError(null);
      try {
        const endpoint = streamIdParam
          ? `/live-streams/playback/${streamIdParam}`
          : "/live-streams/playback/active";
        const result = await fetchPlayback(endpoint, token);
        if (cancelled) return;
        if (result.status === 403) {
          setAccessDenied(true);
          setPlayback(undefined);
        } else if (result.success) {
          setPlayback(result.data ?? null);
          setStreamEnded(false);
          setVideoPlaying(false);
        } else {
          setServerError(result.message || "Something went wrong. Please try again.");
          setPlayback(undefined);
        }
      } catch {
        if (!cancelled) setServerError("Unable to load live stream. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, streamIdParam]);

  // When status is idle, poll playback so we get status update (e.g. active) without refresh
  useEffect(() => {
    if (!user || !playback || playback.status !== "idle" || accessDenied || serverError) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const endpoint = streamIdParam
      ? `/live-streams/playback/${streamIdParam}`
      : "/live-streams/playback/active";
    const interval = setInterval(async () => {
      const result = await fetchPlayback(endpoint, token);
      if (result.success && result.data) {
        setPlayback((prev) => (prev ? { ...prev, ...result.data } : prev));
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [user, playback?.id, playback?.status, streamIdParam, accessDenied, serverError]);

  // When idle and not playing yet, periodically reload HLS so we pick up the stream when host starts (no refresh needed)
  useEffect(() => {
    if (!playback || playback.status !== "idle" || videoPlaying) return;
    const interval = setInterval(() => setHlsReloadKey((k) => k + 1), 12_000);
    return () => clearInterval(interval);
  }, [playback?.status, videoPlaying]);

  // Fallback: detect video actually playing via timeupdate (in case 'playing' / 'canplay' don't fire)
  useEffect(() => {
    if (!playback || (playback.status !== "idle" && playback.status !== "active")) return;
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      if (video.readyState >= 2 && video.currentTime > 0) setVideoPlaying((p) => p || true);
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [playback?.status]);

  // Attach HLS when we have a stream (idle or active); hlsReloadKey forces re-attach to re-fetch manifest when stream goes live
  useEffect(() => {
    if (!playback?.playbackUrl || streamEnded) return;
    if (playback.status !== "idle" && playback.status !== "active") return;
    const video = videoRef.current;
    if (!video) return;
    const url = playback.playbackUrl;

    const onEnded = () => setStreamEnded(true);
    const onPlaying = () => setVideoPlaying(true);
    const tryAutoPlay = () => {
      if (video.paused) video.play().catch(() => {});
    };
    const onCanPlay = () => {
      onPlaying();
      tryAutoPlay();
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ENDED, onEnded);
      video.addEventListener("ended", onEnded);
      video.addEventListener("playing", onPlaying);
      video.addEventListener("canplay", onCanPlay);
      video.addEventListener("loadeddata", tryAutoPlay);
      return () => {
        hls.off(Hls.Events.MEDIA_ENDED, onEnded);
        video.removeEventListener("ended", onEnded);
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("loadeddata", tryAutoPlay);
        hls.destroy();
        hlsRef.current = null;
      };
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.addEventListener("ended", onEnded);
      video.addEventListener("playing", onPlaying);
      video.addEventListener("canplay", onCanPlay);
      video.addEventListener("loadeddata", tryAutoPlay);
      return () => {
        video.removeEventListener("ended", onEnded);
        video.removeEventListener("playing", onPlaying);
        video.removeEventListener("canplay", onCanPlay);
        video.removeEventListener("loadeddata", tryAutoPlay);
        video.src = "";
      };
    }
  }, [playback?.playbackUrl, playback?.status, streamEnded, hlsReloadKey]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">Live stream</h1>

          {loading && playback === undefined && (
            <div className="flex items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {!loading && accessDenied && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
              <p className="text-gray-300 mb-4">
                Live streaming is available only for paid or trial plan members.
              </p>
              <Link
                href="/pricing"
                className="inline-block px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:opacity-90"
              >
                Upgrade to watch
              </Link>
            </div>
          )}

          {!loading && !accessDenied && serverError && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
              <p className="text-gray-300 mb-4">{serverError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:opacity-90"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !accessDenied && !serverError && playback === null && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
              <p className="text-gray-300">No live stream is currently available. Check back later.</p>
            </div>
          )}

          {!loading && !accessDenied && !serverError && playback && (playback.status === "idle" || playback.status === "active") && streamEnded && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-10 text-center">
              <h2 className="text-lg font-semibold text-white mb-2">The stream has ended</h2>
              <p className="text-gray-400 text-sm mb-6">Thanks for watching.</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:opacity-90"
              >
                Back to home
              </Link>
            </div>
          )}

          {!loading && !accessDenied && !serverError && playback && (playback.status === "idle" || playback.status === "active") && !streamEnded && (
            <div className="space-y-4">
              {playback.title && (
                <p className="text-gray-300 text-lg">{playback.title}</p>
              )}
              {playback.status === "idle" && !videoPlaying && (
                <p className="text-gray-400 text-sm">
                  Waiting for the host to go live. The stream will appear below when they start broadcasting. You can keep this page open.
                </p>
              )}
              <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  controls
                  playsInline
                  autoPlay
                  muted={false}
                />
                {playback.status === "idle" && !videoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none">
                    <span className="text-gray-300 text-sm">Connecting to stream...</span>
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-sm">
                {playback.status === "active" || videoPlaying
                  ? "Live. If playback is buffering, it will catch up shortly."
                  : "Stream will start when the host goes live (typically 15–30 seconds after they start in OBS)."}
              </p>
            </div>
          )}

          {!loading && !accessDenied && !serverError && playback && playback.status !== "idle" && playback.status !== "active" && (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center">
              <p className="text-gray-300">This stream is not currently available.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function LivePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LivePageContent />
    </Suspense>
  );
}
