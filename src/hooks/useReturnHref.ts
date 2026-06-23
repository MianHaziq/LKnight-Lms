"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "auth:returnTo";
const AUTH_PATHS = ["/signin", "/signup", "/forgot-password", "/reset-password"];

const isAuthPath = (pathname: string) =>
  AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/**
 * Returns a safe internal href to send the user "back" from auth pages.
 * Prefers a previously captured path (stable across signin ↔ signup hops),
 * falls back to a sanitized `document.referrer`, finally to `fallback`.
 */
export function useReturnHref(fallback = "/") {
  const [href, setHref] = useState(fallback);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setHref(stored);
      return;
    }

    try {
      const ref = document.referrer;
      if (!ref) return;
      const url = new URL(ref);
      if (url.origin !== window.location.origin) return;
      if (isAuthPath(url.pathname)) return;
      const path = url.pathname + url.search;
      sessionStorage.setItem(STORAGE_KEY, path);
      setHref(path);
    } catch {
      // malformed referrer — keep fallback
    }
  }, []);

  return href;
}

/** Call after successful auth to drop the captured path. */
export function clearReturnHref() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
