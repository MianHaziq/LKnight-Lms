"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CourseCard, { type CourseCardProps } from "./CourseCard";
import { courseApi, type Course } from "@/lib/api";

// Transform API course to CourseCard props
const transformCourse = (course: Course): CourseCardProps => ({
  id: course.id,
  slug: course.slug,
  thumbnail: course.thumbnail,
  level: course.level || "Beginner",
  category: course.category?.name || "General",
  title: course.title,
  summary: course.summary,
  moduleCount: course.moduleCount,
  enrollments: course.enrollments,
  instructor: course.instructorName
    || (course.instructor
      ? `${course.instructor.firstName} ${course.instructor.lastName}`
      : "Instructor"),
  price: course.price,
});

interface FeaturedCoursesSectionProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
  limit?: number;
}

export default function FeaturedCoursesSection({
  title = "Featured Courses",
  subtitle = "Our most popular courses loved by thousands of learners",
  showViewAll = true,
  viewAllHref = "/courses",
  limit = 3,
}: FeaturedCoursesSectionProps) {
  const [courses, setCourses] = useState<CourseCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseApi.getAll({
          limit,
          status: "PUBLISHED",
          sortBy: "createdAt",
          order: "desc",
        });
        if (res.success && res.data?.courses) {
          const transformed = res.data.courses.map(transformCourse);
          setCourses(transformed);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [limit]);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12 lg:mb-14">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 sm:mb-3">
                {title}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-500">
                {subtitle}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="aspect-[16/10] bg-gray-200" />
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-100 rounded mb-4" />
                  <div className="flex gap-4 mb-3">
                    <div className="h-4 w-16 bg-gray-100 rounded" />
                    <div className="h-4 w-20 bg-gray-100 rounded" />
                  </div>
                  <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
                  <div className="flex justify-between pt-4 border-t border-gray-100">
                    <div className="h-4 w-24 bg-gray-100 rounded" />
                    <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12 lg:mb-14">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 sm:mb-3">
              {title}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500">
              {subtitle}
            </p>
          </div>

          {showViewAll && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 text-secondary font-semibold text-sm sm:text-base hover:opacity-80 transition-opacity duration-200 group"
            >
              <span>View All Courses</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="transform group-hover:translate-x-1 transition-transform duration-200"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}
