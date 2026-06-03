"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLiveActive } from "@/hooks/useLiveActive";

const HIDDEN_ROUTES = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/terms",
  "/privacy",
  "/admin",
];

export default function StickyGoLiveButton() {
  const pathname = usePathname();
  const { isLiveActive } = useLiveActive();

  const shouldHide = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (shouldHide) return null;

  return (
    <Link
      href="/live"
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
      aria-label="Go to live stream"
    >
      {isLiveActive && (
        <span
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"
          aria-hidden
        />
      )}
      <span className="text-primary font-medium text-sm">Go live</span>
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <circle cx="12" cy="12" r="3" fill="white" />
          <path
            d="M8.5 8.5C7.5 9.5 7 10.7 7 12C7 13.3 7.5 14.5 8.5 15.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M15.5 8.5C16.5 9.5 17 10.7 17 12C17 13.3 16.5 14.5 15.5 15.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M5.5 5.5C3.8 7.2 3 9.5 3 12C3 14.5 3.8 16.8 5.5 18.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M18.5 5.5C20.2 7.2 21 9.5 21 12C21 14.5 20.2 16.8 18.5 18.5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </Link>
  );
}
