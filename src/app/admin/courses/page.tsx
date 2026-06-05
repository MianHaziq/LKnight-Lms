"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import AdminSelect from "@/components/admin/AdminSelect";
import Badge from "@/components/admin/Badge";
import DataTable from "@/components/admin/DataTable";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { courseApi, categoryApi, Course, Category } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "PUBLISHED", label: "Published" },
  { value: "DRAFT", label: "Draft" },
];

interface CourseStats {
  total: number;
  published: number;
  draft: number;
  totalEnrollments: number;
}

export default function CoursesPage() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<CourseStats>({ total: 0, published: 0, draft: 0, totalEnrollments: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    courseId: string;
    courseTitle: string;
  }>({ isOpen: false, courseId: "", courseTitle: "" });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const limit = 10;

  // Build category options from API data
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
  ];

  // Fetch courses from API
  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        status?: string;
      } = {
        page: currentPage,
        limit,
      };

      if (searchQuery) params.search = searchQuery;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await courseApi.getAll(params);

      if (response.data) {
        setCourses(response.data.courses || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
          setTotalCourses(response.data.pagination.total);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, categoryFilter, statusFilter]);

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Fetch course stats
  const fetchStats = async () => {
    try {
      const response = await courseApi.getStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Open delete modal
  const openDeleteModal = (courseId: string, courseTitle: string) => {
    setDeleteModal({ isOpen: true, courseId, courseTitle });
  };

  // Handle delete course
  const handleDelete = async () => {
    const { courseId } = deleteModal;

    try {
      setDeletingId(courseId);
      const response = await courseApi.delete(courseId);

      if (response.success) {
        showToast("Course deleted successfully!", "success");
        setDeleteModal({ isOpen: false, courseId: "", courseTitle: "" });
        // Refresh data
        fetchCourses();
        fetchStats();
      } else {
        const errorMsg = response.message || "Failed to delete course";
        showToast(errorMsg, "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete course";
      showToast(errorMsg, "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  // Fetch courses when filters or page changes
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const columns = [
    {
      key: "title",
      header: "Course",
      render: (course: Course) => (
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-12 h-8 sm:w-16 sm:h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                width={64}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-xs text-gray-400">No img</span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-xs sm:text-sm line-clamp-1">
              {course.title}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">
              {course.category?.name || 'Uncategorized'}
            </p>
          </div>
        </div>
      ),
    },
    /* Price column removed — pricing is now managed via subscription plans */
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (course: Course) => (
        <Badge variant={course.status === "PUBLISHED" ? "primary" : "gray"} size="sm">
          {formatStatus(course.status)}
        </Badge>
      ),
    },
    {
      key: "enrollments",
      header: "Enrollments",
      sortable: true,
      render: (course: Course) => (
        <span className="text-gray-700 text-xs sm:text-sm">
          {(course.enrollments || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (course: Course) => (
        <div className="flex items-center gap-1 sm:gap-2">
          <AdminButton
            variant="ghost"
            size="sm"
            href={`/admin/courses/${course.id}`}
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-4 sm:h-4"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            }
            className="px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Edit</span>
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="sm"
            href={`/admin/courses/${course.id}/modules`}
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-4 sm:h-4"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            }
            className="hidden sm:inline-flex"
          >
            Modules
          </AdminButton>
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => openDeleteModal(course.id, course.title)}
            disabled={deletingId === course.id}
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:w-4 sm:h-4"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            }
            className="px-2 sm:px-3 text-red-500 hover:bg-red-50"
          >
            <span className="hidden sm:inline">{deletingId === course.id ? "..." : "Delete"}</span>
          </AdminButton>
        </div>
      ),
    },
  ];

  // Loading skeleton
  if (isLoading && courses.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
          <div className="h-9 w-36 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-outfit">
            Course Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage all courses, modules, and lessons
          </p>
        </div>
        <AdminButton
          variant="secondary"
          href="/admin/courses/new"
          size="sm"
          className="self-start sm:self-auto"
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
              className="sm:w-4.5 sm:h-4.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          Add New Course
        </AdminButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">Total Courses</p>
          <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5 sm:mt-1">
            {stats.total}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">Published</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">
            {stats.published}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">Drafts</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-0.5 sm:mt-1">
            {stats.draft}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">Total Enrollments</p>
          <p className="text-xl sm:text-2xl font-bold text-secondary mt-0.5 sm:mt-1">
            {stats.totalEnrollments.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <AdminCard padding="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <AdminInput
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  className="sm:w-4.5 sm:h-4.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
            />
          </div>
          <AdminSelect
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="Category"
          />
          <AdminSelect
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Status"
          />
        </div>
      </AdminCard>

      {/* Courses Table */}
      <AdminCard padding="none">
        <DataTable
          columns={columns}
          data={courses}
          emptyMessage="No courses found matching your criteria"
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {courses.length} of {totalCourses} courses
            {(searchQuery || categoryFilter || statusFilter) && " (filtered)"}
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <AdminButton
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Previous
            </AdminButton>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 3) {
                pageNum = i + 1;
              } else if (currentPage === 1) {
                pageNum = i + 1;
              } else if (currentPage === totalPages) {
                pageNum = totalPages - 2 + i;
              } else {
                pageNum = currentPage - 1 + i;
              }
              return (
                <AdminButton
                  key={pageNum}
                  variant={currentPage === pageNum ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={isLoading}
                  className={i > 0 ? "hidden sm:inline-flex" : ""}
                >
                  {pageNum}
                </AdminButton>
              );
            })}
            <AdminButton
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || isLoading}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, courseId: "", courseTitle: "" })}
        onConfirm={handleDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteModal.courseTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingId === deleteModal.courseId}
      />
    </div>
  );
}
