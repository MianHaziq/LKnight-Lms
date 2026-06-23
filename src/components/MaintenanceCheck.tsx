"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { settingsApi } from "@/lib/api";

export default function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Admin routes bypass maintenance mode
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const res = await settingsApi.getPublicSettings();
        if (res.success && res.data) {
          setMaintenanceMode(res.data.maintenanceMode || false);
        }
      } catch {
        // If API fails, don't block users
      } finally {
        setLoading(false);
      }
    };
    checkMaintenance();
  }, []);

  // Don't block admin routes
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Show loading briefly while checking
  if (loading) {
    return <>{children}</>;
  }

  // Show maintenance page
  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000E51] to-[#001a7a] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          {/* Maintenance Icon */}
          <div className="mx-auto w-24 h-24 mb-8 rounded-full bg-white/10 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF6F00"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white font-outfit mb-4">
            LKnight Learning Hub is coming soon
          </h1>
          <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
            We&apos;re putting the final touches on an amazing learning experience.
            Please check back soon to start your journey with us.
          </p>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF6F00] animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 rounded-full bg-[#FF6F00] animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 rounded-full bg-[#FF6F00] animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
