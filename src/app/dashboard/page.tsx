"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { enrollmentApi, subscriptionApi, SubscriptionInfo, CourseWithStatus, UserDashboardStats } from "@/lib/api";

// Level badge colors
const levelColors: Record<string, string> = {
  BEGINNER: "bg-[#FF6F00]",
  INTERMEDIATE: "bg-blue-500",
  ADVANCED: "bg-green-500",
};

const formatLevel = (level: string) => {
  return level.charAt(0) + level.slice(1).toLowerCase();
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithStatus[]>([]);
  const [stats, setStats] = useState<UserDashboardStats>({
    totalEnrolled: 0,
    inProgress: 0,
    completed: 0,
    avgProgress: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [accessAll, setAccessAll] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [coursesRes, statsRes, subRes] = await Promise.all([
        enrollmentApi.getAllCoursesWithStatus(),
        enrollmentApi.getMyStats(),
        subscriptionApi.getMySubscription().catch(() => ({ success: false, data: null })),
      ]);

      if (coursesRes.data) {
        setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      }
      // Check if accessAll flag is in the response
      if ((coursesRes as { accessAll?: boolean }).accessAll !== undefined) {
        setAccessAll((coursesRes as { accessAll?: boolean }).accessAll || false);
      }
      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (subRes.success && subRes.data) {
        setSubscription(subRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Count unlocked and locked courses
  const unlockedCourses = courses.filter(c => c.hasAccess);
  const lockedCourses = courses.filter(c => !c.hasAccess);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        {/* Loading skeleton */}
        <div className="animate-pulse space-y-8">
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#000E51] to-[#001a7a] rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          <p className="text-[#FF6F00] font-medium text-sm sm:text-base mb-1">
            {getGreeting()},
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-outfit">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">
            {accessAll
              ? "You have unlimited access to all courses."
              : "Continue your learning journey and achieve your goals."}
          </p>
        </div>
      </div>

      {/* Subscription Status */}
      {subscription && (
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#000E51]">
                {subscription.plan.name}
                {subscription.cancelAtPeriodEnd && (
                  <span className="text-xs font-normal text-yellow-600 ml-2">(Cancels {new Date(subscription.currentPeriodEnd || "").toLocaleDateString()})</span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                Active subscription · Renews {new Date(subscription.currentPeriodEnd || "").toLocaleDateString()}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/subscription"
            className="text-sm font-medium text-[#FF6F00] hover:text-[#E86400] transition-colors whitespace-nowrap"
          >
            Manage Subscription
          </Link>
        </div>
      )}

      {/* No Subscription CTA */}
      {!subscription && !accessAll && !isLoading && (
        <div className="bg-gradient-to-r from-[#FF6F00]/10 to-[#FF6F00]/5 rounded-xl p-4 sm:p-5 border border-[#FF6F00]/20 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#000E51]">Unlock All Courses</p>
            <p className="text-xs text-gray-500">Get a subscription plan for full access to all learning materials.</p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6F00] hover:bg-[#E86400] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            View Plans
          </Link>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Enrolled Courses</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#000E51] mt-1">{stats.totalEnrolled}</p>
            </div>
            <div className="w-12 h-12 bg-[#000E51]/10 rounded-xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000E51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">In Progress</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#FF6F00] mt-1">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-[#FF6F00]/10 rounded-xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Completed</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Avg. Progress</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{stats.avgProgress}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses Section (Unlocked) */}
      {unlockedCourses.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#000E51] font-outfit">
              My Courses
            </h2>
            <span className="text-sm text-gray-500">
              {unlockedCourses.length} course{unlockedCourses.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {unlockedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Available Courses Section (Locked) */}
      {lockedCourses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-[#000E51] font-outfit">
                Available Courses
              </h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {lockedCourses.length} to unlock
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {lockedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <line x1="9" y1="7" x2="15" y2="7"/>
              <line x1="9" y1="11" x2="13" y2="11"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses available</h3>
          <p className="text-gray-500 mb-6">Check back later for new courses.</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6F00] hover:bg-[#E86400] text-white font-semibold rounded-xl transition-all duration-200"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
}

// Course Card Component for Dashboard
function CourseCard({ course }: { course: CourseWithStatus }) {
  const isLocked = !course.hasAccess;

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 ${isLocked ? "relative" : ""}`}>
      {/* Image Container */}
      <Link
        href={isLocked ? `/pricing` : `/dashboard/courses/${course.id}`}
        className="block relative aspect-[16/10] overflow-hidden"
      >
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className={`object-cover transition-transform duration-500 ${isLocked ? "group-hover:scale-100" : "group-hover:scale-105"}`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#000E51] to-[#001a7a] flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        )}

        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Level Badge */}
        <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-white text-xs sm:text-sm font-semibold ${levelColors[course.level] || "bg-gray-500"}`}>
          {formatLevel(course.level)}
        </span>

        {/* Progress Badge (only for unlocked) */}
        {!isLocked && course.progress > 0 && (
          <span className="absolute top-4 right-4 px-3 py-1.5 rounded-md bg-white/90 backdrop-blur-sm text-[#000E51] text-xs font-semibold">
            {course.progress}% Complete
          </span>
        )}

        {/* Subscription Badge (for locked) */}
        {isLocked && (
          <span className="absolute top-4 right-4 px-3 py-1.5 rounded-md bg-[#FF6F00] text-white text-xs font-bold">
            Get a Plan
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Category */}
        {course.category && (
          <span className="text-xs sm:text-sm font-medium text-[#FF6F00]">
            {course.category.name}
          </span>
        )}

        {/* Title */}
        <Link href={isLocked ? `/pricing` : `/dashboard/courses/${course.id}`}>
          <h3 className="text-base sm:text-lg font-bold text-[#000E51] mt-1 mb-2 line-clamp-2 group-hover:text-[#FF6F00] transition-colors duration-200">
            {course.title}
          </h3>
        </Link>

        {/* Summary */}
        {course.summary && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.summary}</p>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-4 sm:gap-6 mb-4 text-gray-500">
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-xs sm:text-sm">{course.moduleCount} modules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs sm:text-sm">{course.lessonCount} lessons</span>
          </div>
        </div>

        {/* Progress Bar (only for unlocked with progress) */}
        {!isLocked && course.isEnrolled && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-500">Progress</span>
              <span className="font-semibold text-[#000E51]">{course.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF6F00] to-[#ff8c33] rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {course.instructor && (
            <span className="text-sm text-gray-600">
              By <span className="font-medium text-[#000E51]">{course.instructor}</span>
            </span>
          )}
          <Link
            href={isLocked ? `/pricing` : `/dashboard/courses/${course.id}`}
            className={`inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
              isLocked
                ? "bg-[#000E51] text-white hover:bg-[#001a7a]"
                : "bg-[#FF6F00] text-white hover:bg-[#E86400]"
            }`}
          >
            {isLocked ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Get Access
              </>
            ) : (
              <>
                {course.progress > 0 ? "Continue" : "Start"}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3.33337 8H12.6667M12.6667 8L8.00004 3.33333M12.6667 8L8.00004 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
