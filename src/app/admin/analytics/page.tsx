"use client";

import { useState, useEffect } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import StatsCard from "@/components/admin/StatsCard";
import RevenueChart from "@/components/admin/RevenueChart";
import LineChart from "@/components/admin/LineChart";
import PieChart from "@/components/admin/PieChart";
import EnrollmentChart from "@/components/admin/EnrollmentChart";
import Badge from "@/components/admin/Badge";
import {
  analyticsApi,
  AnalyticsOverview,
  ChartData,
  TopCourse,
} from "@/lib/api";

type Period = "7d" | "30d" | "90d" | "12m" | "all";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("12m");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<ChartData[]>([]);
  const [userGrowthTrend, setUserGrowthTrend] = useState(0);
  const [enrollmentChartData, setEnrollmentChartData] = useState<ChartData[]>([]);
  const [subscriptionsByPlan, setSubscriptionsByPlan] = useState<ChartData[]>([]);
  const [revenueByPlan, setRevenueByPlan] = useState<{ name: string; value: number }[]>([]);
  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          overviewRes,
          revenueRes,
          userGrowthRes,
          enrollmentChartRes,
          subscriptionsByPlanRes,
          revenueByPlanRes,
          topCoursesRes,
        ] = await Promise.all([
          analyticsApi.getOverview(period),
          analyticsApi.getRevenueChart(12),
          analyticsApi.getUserGrowth(12),
          analyticsApi.getEnrollmentChart(12),
          analyticsApi.getSubscriptionsByPlan(period, 12),
          analyticsApi.getRevenueByPlan(period),
          analyticsApi.getTopCourses(5),
        ]);

        if (overviewRes.success && overviewRes.data) {
          setOverview(overviewRes.data);
        }
        if (revenueRes.success && revenueRes.data) {
          setRevenueData(revenueRes.data);
        }
        if (userGrowthRes.success && userGrowthRes.data) {
          setUserGrowthData(userGrowthRes.data.data || []);
          setUserGrowthTrend(userGrowthRes.data.trend || 0);
        }
        if (enrollmentChartRes.success && enrollmentChartRes.data) {
          setEnrollmentChartData(enrollmentChartRes.data);
        }
        if (subscriptionsByPlanRes.success && subscriptionsByPlanRes.data) {
          setSubscriptionsByPlan(subscriptionsByPlanRes.data);
        }
        if (revenueByPlanRes.success && revenueByPlanRes.data) {
          setRevenueByPlan(
            revenueByPlanRes.data.map((item) => ({
              name: item.label,
              value: item.value,
            }))
          );
        }
        if (topCoursesRes.success && topCoursesRes.data) {
          setTopCourses(topCoursesRes.data);
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  const totalRevenue = overview?.totalRevenue?.value ?? 0;
  const totalUsers = overview?.totalUsers?.value ?? 0;
  const totalEnrollments = overview?.totalEnrollments?.value ?? 0;
  const avgOrderValue = overview?.avgOrderValue?.value ?? 0;
  const completionRate = overview?.completionRate ?? 0;
  const averageRating = overview?.averageRating ?? 0;
  const avgSessionDuration = overview?.avgSessionDuration ?? 0;
  const satisfactionRate = overview?.satisfactionRate ?? 0;

  const enrollmentChartTrend =
    enrollmentChartData.length >= 2
      ? (() => {
          const last = enrollmentChartData[enrollmentChartData.length - 1]?.value ?? 0;
          const prev = enrollmentChartData[enrollmentChartData.length - 2]?.value ?? 0;
          return prev > 0 ? Math.round(((last - prev) / prev) * 100) : 0;
        })()
      : 0;

  const totalSubscriptionsByPlan = subscriptionsByPlan.reduce(
    (sum, c) => sum + c.value,
    0
  );

  const exportRevenueCsv = () => {
    if (revenueData.length === 0) return;
    const headers = "Month,Revenue (USD)\n";
    const rows = revenueData.map((d) => `"${d.label}",${d.value}`).join("\n");
    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 lg:space-y-8 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-32"></div>
          ))}
        </div>
        <div className="bg-white rounded-xl h-80"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl h-72"></div>
          <div className="bg-white rounded-xl h-72"></div>
        </div>
        <div className="bg-white rounded-xl h-80"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl h-80"></div>
          <div className="bg-white rounded-xl h-80"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Failed to Load Analytics</h2>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => setPeriod((p) => p)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-outfit">
            Analytics & Reports
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Track your LMS performance and insights
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl overflow-x-auto">
            {(
              [
                { value: "7d", label: "7D" },
                { value: "30d", label: "30D" },
                { value: "90d", label: "90D" },
                { value: "12m", label: "12M" },
                { value: "all", label: "All" },
              ] as { value: Period; label: string }[]
            ).map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                  period === p.value
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <AdminButton
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={exportRevenueCsv}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            }
          >
            Export
          </AdminButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          }
          iconBgColor="bg-green-50"
        />
        <StatsCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          iconBgColor="bg-blue-50"
        />
        <StatsCard
          title="Enrollments"
          value={totalEnrollments.toLocaleString()}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-600"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          }
          iconBgColor="bg-purple-50"
        />
        <StatsCard
          title="Avg Plan Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-600"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          }
          iconBgColor="bg-orange-50"
        />
      </div>

      {/* Revenue Chart - Full Width */}
      <AdminCard
        title="Revenue Overview"
        subtitle="Monthly revenue performance"
        action={
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary"></span>
              <span className="text-xs sm:text-sm text-gray-500">Revenue</span>
            </div>
          </div>
        }
      >
        <div className="h-64 sm:h-72 lg:h-80">
          {revenueData.length > 0 ? (
            <RevenueChart data={revenueData} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No revenue data available
            </div>
          )}
        </div>
      </AdminCard>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* User Growth */}
        <AdminCard
          title="User Growth"
          subtitle="New user registrations per month"
          action={
            userGrowthTrend !== 0 ? (
              <Badge variant={userGrowthTrend >= 0 ? "success" : "danger"} size="sm">
                {userGrowthTrend >= 0 ? "+" : ""}
                {userGrowthTrend}%
              </Badge>
            ) : null
          }
        >
          <div className="h-56 sm:h-64 lg:h-72">
            {userGrowthData.length > 0 ? (
              <LineChart
                data={userGrowthData}
                color="#3B82F6"
                valuePrefix=""
                valueSuffix=" users"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No user data available
              </div>
            )}
          </div>
        </AdminCard>

        {/* Monthly Enrollments */}
        <AdminCard
          title="Monthly Enrollments"
          subtitle="Course enrollments per month"
          action={
            enrollmentChartTrend !== 0 ? (
              <Badge variant={enrollmentChartTrend >= 0 ? "success" : "danger"} size="sm">
                {enrollmentChartTrend >= 0 ? "+" : ""}
                {enrollmentChartTrend}%
              </Badge>
            ) : null
          }
        >
          <div className="h-56 sm:h-64 lg:h-72">
            {enrollmentChartData.length > 0 ? (
              <LineChart
                data={enrollmentChartData}
                color="#A855F7"
                valuePrefix=""
                valueSuffix=" enrollments"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No enrollment data available
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      {/* Enrollments by Plans Chart */}
      <AdminCard
        title="Enrollments by Plans"
        subtitle="Subscription count by plan (Monthly / Yearly)"
        action={
          totalSubscriptionsByPlan > 0 ? (
            <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
              {totalSubscriptionsByPlan.toLocaleString()} total
            </Badge>
          ) : null
        }
      >
        <div className="h-72 sm:h-80 lg:h-96">
          {subscriptionsByPlan.length > 0 ? (
            <EnrollmentChart
              data={subscriptionsByPlan.map((item) => ({
                name: item.label,
                enrollments: item.value,
              }))}
              layout="vertical"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No subscription data available
            </div>
          )}
        </div>
      </AdminCard>

      {/* Top Courses & Revenue by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Courses */}
        {/* <AdminCard
          title="Top Performing Courses"
          subtitle="By engagement"
          padding="none"
        >
          {topCourses.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {topCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm shadow-sm ${
                      index === 0
                        ? "bg-linear-to-br from-yellow-400 to-yellow-500 text-white"
                        : index === 1
                        ? "bg-linear-to-br from-gray-300 to-gray-400 text-white"
                        : index === 2
                        ? "bg-linear-to-br from-orange-400 to-orange-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {course.title}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                      <span className="text-[10px] sm:text-xs text-gray-500">
                        {course.enrollments} students
                      </span>
                      <span className="text-gray-300 hidden sm:inline">|</span>
                      <span className="text-[10px] sm:text-xs text-yellow-500 hidden sm:flex items-center gap-0.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge
                      variant={course.trend >= 0 ? "success" : "danger"}
                      size="sm"
                    >
                      {course.trend >= 0 ? "+" : ""}
                      {course.trend}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No course data available
            </div>
          )}
        </AdminCard> */}

        {/* Revenue by Plan - Pie Chart */}
        <AdminCard
          title="Revenue by Plan"
          subtitle="Subscription revenue by plan (Monthly / Yearly)"
        >
          <div className="h-64 sm:h-72 lg:h-[340px]">
            {revenueByPlan.length > 0 ? (
              <PieChart
                data={revenueByPlan}
                centerValue={
                  totalRevenue >= 1000
                    ? `$${(totalRevenue / 1000).toFixed(0)}k`
                    : `$${totalRevenue}`
                }
                centerLabel="Total Revenue"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No plan revenue data available
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        <AdminCard padding="md" className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary sm:w-6 sm:h-6"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-primary">{completionRate}%</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Completion Rate</p>
          </div>
        </AdminCard>
        <AdminCard padding="md" className="bg-linear-to-br from-secondary/5 to-secondary/10 border-secondary/20">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-secondary sm:w-6 sm:h-6"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-secondary">{averageRating}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Average Rating</p>
          </div>
        </AdminCard>
        <AdminCard padding="md" className="bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200/50">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-600 sm:w-6 sm:h-6"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{avgSessionDuration}h</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Avg Session</p>
          </div>
        </AdminCard>
        <AdminCard padding="md" className="bg-linear-to-br from-green-50 to-green-100/50 border-green-200/50">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-green-600 sm:w-6 sm:h-6"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{satisfactionRate}%</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Satisfaction</p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
