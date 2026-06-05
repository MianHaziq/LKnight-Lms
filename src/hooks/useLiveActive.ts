"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const POLL_INTERVAL_MS = 5_000;

export function useLiveActive(): { isLiveActive: boolean } {
  const [isLiveActive, setIsLiveActive] = useState(false);

  const fetchActive = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/live-streams/active-status`);
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success && json.data) {  
        setIsLiveActive(!!json.data.active);
      }
    } catch {
      setIsLiveActive(false);
    }
  }, []);

  useEffect(() => {
    fetchActive();
    const interval = setInterval(fetchActive, POLL_INTERVAL_MS);
    const onVisibility = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchActive();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchActive]);

  return { isLiveActive };
}
