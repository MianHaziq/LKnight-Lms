"use client";

import { useEffect } from "react";
import { prefetchCache } from "@/lib/prefetchCache";

/**
 * Runs on app load to prefetch team and plans in the background.
 * When the user navigates to About or Pricing, data is already in cache and shows instantly.
 */
export default function PrefetchData() {
  useEffect(() => {
    prefetchCache.prefetchAll();
  }, []);
  return null;
}
