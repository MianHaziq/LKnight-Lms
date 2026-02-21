"use client";

import { useState } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import StatsCard from "@/components/admin/StatsCard";
import RevenueChart from "@/components/admin/RevenueChart";
import LineChart from "@/components/admin/LineChart";
import PieChart from "@/components/admin/PieChart";
import EnrollmentChart from "@/components/admin/EnrollmentChart";
import Badge from "@/components/admin/Badge";

// Mock data
const monthlyRevenue = [
  { label: "Jan", value: 12500 },
  { label: "Feb", value: 15200 },
  { label: "Mar", value: 14800 },
  { label: "Apr", value: 18100 },
  { label: "May", value: 17800 },
  { label: "Jun", value: 21200 },
  { label: "Jul", value: 19900 },
  { label: "Aug", value: 23400 },
  { label: "Sep", value: 22100 },
  { label: "Oct", value: 25600 },
  { label: "Nov", value: 24300 },
  { label: "Dec", value: 28500 },
];

const userGrowth = [
  { label: "Jan", value: 320 },
  { label: "Feb", value: 480 },
  { label: "Mar", value: 650 },
  { label: "Apr", value: 820 },
  { label: "May", value: 1010 },
  { label: "Jun", value: 1320 },
  { label: "Jul", value: 1550 },
  { label: "Aug", value: 1840 },
  { label: "Sep", value: 2120 },
  { label: "Oct", value: 2450 },
  { label: "Nov", value: 2680 },
  { label: "Dec", value: 2847 },
];

const enrollmentsByMonth = [
  { label: "Jan", value: 245 },
  { label: "Feb", value: 312 },
  { label: "Mar", value: 289 },
  { label: "Apr", value: 378 },
  { label: "May", value: 356 },
  { label: "Jun", value: 423 },
  { label: "Jul", value: 401 },
  { label: "Aug", value: 467 },
  { label: "Sep", value: 445 },
  { label: "Oct", value: 512 },
  { label: "Nov", value: 489 },
  { label: "Dec", value: 534 },
];

const topCourses = [
  { name: "Web Development Masterclass", revenue: 45200, enrollments: 456, trend: 12, rating: 4.9 },
  { name: "React Advanced Patterns", revenue: 38900, enrollments: 312, trend: 8, rating: 4.8 },
  { name: "Python for Data Science", revenue: 32400, enrollments: 287, trend: 15, rating: 4.7 },
  { name: "Node.js Backend Development", revenue: 28700, enrollments: 234, trend: -3, rating: 4.6 },
  { name: "UI/UX Design Fundamentals", revenue: 24100, enrollments: 198, trend: 5, rating: 4.5 },
];

const revenueByCategory = [
  { name: "Web Development", value: 85400 },
  { name: "Mobile Dev", value: 48200 },
  { name: "Data Science", value: 41600 },
  { name: "Backend", value: 36400 },
  { name: "Design", value: 31400 },
];

const enrollmentsByCourse = [
  { name: "Web Development Masterclass", enrollments: 456 },
  { name: "React Advanced Patterns", enrollments: 312 },
  { name: "Python for Data Science", enrollments: 287 },
  { name: "Node.js Backend Development", enrollments: 234 },
  { name: "UI/UX Design Fundamentals", enrollments: 198 },
  { name: "JavaScript Essentials", enrollments: 176 },
  { name: "TypeScript Deep Dive", enrollments: 145 },
  { name: "Database Design", enrollments: 132 },
];

type Period = "7d" | "30d" | "90d" | "12m" | "all";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("12m");

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.value, 0);
  const totalEnrollments = enrollmentsByMonth.reduce((sum, m) => sum + m.value, 0);

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
          change={{ value: 18.2, type: "increase" }}
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
          value="2,847"
          change={{ value: 12.5, type: "increase" }}
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
          change={{ value: 8.7, type: "increase" }}
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
          title="Avg Order Value"
          value="$87.50"
          change={{ value: 3.2, type: "decrease" }}
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
        subtitle="Monthly revenue performance for the current year"
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
          <RevenueChart data={monthlyRevenue} />
        </div>
      </AdminCard>

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* User Growth */}
        <AdminCard
          title="User Growth"
          subtitle="Cumulative user registrations"
          action={
            <Badge variant="success" size="sm">
              +790%
            </Badge>
          }
        >
          <div className="h-56 sm:h-64 lg:h-72">
            <LineChart
              data={userGrowth}
              color="#3B82F6"
              valuePrefix=""
              valueSuffix=" users"
            />
          </div>
        </AdminCard>

        {/* Enrollments */}
        <AdminCard
          title="Monthly Enrollments"
          subtitle="Course enrollments per month"
          action={
            <Badge variant="success" size="sm">
              +118%
            </Badge>
          }
        >
          <div className="h-56 sm:h-64 lg:h-72">
            <LineChart
              data={enrollmentsByMonth}
              color="#A855F7"
              valuePrefix=""
              valueSuffix=" enrollments"
            />
          </div>
        </AdminCard>
      </div>

      {/* Enrollment by Course Chart */}
      <AdminCard
        title="Enrollments by Course"
        subtitle="Student enrollment distribution across courses"
        action={
          <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
            {enrollmentsByCourse.reduce((sum, c) => sum + c.enrollments, 0).toLocaleString()} total
          </Badge>
        }
      >
        <div className="h-72 sm:h-80 lg:h-96">
          <EnrollmentChart data={enrollmentsByCourse} layout="vertical" />
        </div>
      </AdminCard>

      {/* Top Courses & Revenue by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Courses */}
        <AdminCard
          title="Top Performing Courses"
          subtitle="Ranked by revenue"
          padding="none"
        >
          <div className="divide-y divide-gray-50">
            {topCourses.map((course, index) => (
              <div
                key={course.name}
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
                    {course.name}
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
                  <p className="text-xs sm:text-sm font-bold text-primary">
                    ${course.revenue.toLocaleString()}
                  </p>
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
        </AdminCard>

        {/* Revenue by Category - Pie Chart */}
        <AdminCard
          title="Revenue by Category"
          subtitle="Distribution across categories"
        >
          <div className="h-64 sm:h-72 lg:h-[340px]">
            <PieChart
              data={revenueByCategory}
              centerValue={`$${(totalRevenue / 1000).toFixed(0)}k`}
              centerLabel="Total Revenue"
            />
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
            <p className="text-2xl sm:text-3xl font-bold text-primary">87%</p>
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
            <p className="text-2xl sm:text-3xl font-bold text-secondary">4.8</p>
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
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">2.5h</p>
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
            <p className="text-2xl sm:text-3xl font-bold text-green-600">92%</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Satisfaction</p>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
