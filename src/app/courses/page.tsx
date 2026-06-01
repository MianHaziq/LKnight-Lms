"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard, { type CourseCardProps } from "@/components/CourseCard";
import TestimonialSection from "@/components/TestimonialSection";
import { courseApi, categoryApi, type Course, type Category } from "@/lib/api";

const transformCourse = (course: Course): CourseCardProps => ({
  id: course.id,
  slug: course.slug,
  thumbnail: course.thumbnail,
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

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-10 h-10 border-3 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}

function CoursesContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "";
  const searchFromUrl = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<CourseCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 9;

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch {
        // silently fail
      }
    };
    fetchCategories();
  }, []);

  // Sync category from URL
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
    setPage(1);
  }, [categoryFromUrl]);

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await courseApi.getAll({
        page,
        limit: LIMIT,
        status: "PUBLISHED",
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        sortBy: "createdAt",
        order: "desc",
      });
      if (res.success && res.data) {
        setCourses(res.data.courses.map(transformCourse));
        setTotalPages(res.data.pagination.totalPages);
        setTotal(res.data.pagination.total);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    // fetchCourses is triggered by the page/searchQuery dep change
  };

  // Handle category change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId === selectedCategory ? "" : catId);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Header Section */}
      <div className="bg-[#000E51] pt-16 pb-20 px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-white mb-4 leading-tight">
            Two Lenses. One Goal.{" "}
            <span className="text-[#FF6F00]">Better Leadership.</span>
          </h1>

          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            This is where organizational strategy and human behavior meet. Every course is designed
            through both lenses, giving you clarity to lead your business and the awareness to lead
            your people. The result is leadership that is steady, intentional, and built to last.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search courses..."
                className="w-full bg-white rounded-lg py-4 pl-12 pr-4 text-gray-700 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] transition-all"
              />
            </div>
          </form>
        </div>

        {/* Orange Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6F00]" />
      </div>

      {/* Category Filters + Courses */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => handleCategoryChange("")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  !selectedCategory
                    ? "bg-[#000E51] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Courses
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === cat.id
                      ? "bg-[#000E51] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-70">({cat.courseCount})</span>
                </button>
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loading && (
            <p className="text-sm text-gray-500 mb-6">
              {total} {total === 1 ? "course" : "courses"} found
              {searchQuery && <> for &ldquo;{searchQuery}&rdquo;</>}
              {selectedCategory && categories.length > 0 && (
                <> in <span className="font-medium text-primary">{categories.find(c => c.id === selectedCategory)?.name}</span></>
              )}
            </p>
          )}

          {/* Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  <div className="aspect-video bg-gray-200" />
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
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">No courses found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms or removing filters."
                  : "No courses available in this category yet."}
              </p>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setPage(1);
                  }}
                  className="text-secondary font-medium text-sm hover:opacity-80"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | string)[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  typeof item === "string" ? (
                    <span key={`dots-${idx}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        page === item
                          ? "bg-[#000E51] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <TestimonialSection page="courses" />
      <Footer />
    </div>
  );
}
