"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import AdminSelect from "@/components/admin/AdminSelect";
import Badge from "@/components/admin/Badge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { categoryApi, courseApi, Category, CourseDetails } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const levelOptions = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    categoryId: "",
    level: "BEGINNER",
    price: "",
    status: "DRAFT",
  });
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Fetch categories and course data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesRes, courseRes] = await Promise.all([
        categoryApi.getAll(),
        courseApi.getById(courseId),
      ]);

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }

      if (courseRes.success && courseRes.data) {
        const courseData = courseRes.data;
        setCourse(courseData);
        setFormData({
          title: courseData.title || "",
          slug: courseData.slug || "",
          summary: courseData.summary || "",
          description: courseData.description || "",
          categoryId: courseData.category?.id || courseData.categoryId || "",
          level: (courseData.level?.toUpperCase() as "BEGINNER" | "INTERMEDIATE" | "ADVANCED") || "BEGINNER",
          price: courseData.price?.toString() || "0",
          status: (courseData.status?.toUpperCase() as "DRAFT" | "PUBLISHED") || "DRAFT",
        });
        setThumbnailPreview(courseData.thumbnail || null);
      } else {
        setError("Course not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch course");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Convert categories to select options
  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && {
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }),
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setSaving(true);

      const updateData = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        description: formData.description.trim() || undefined,
        thumbnail: thumbnailPreview || undefined,
        categoryId: formData.categoryId,
        level: formData.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        price: formData.price ? parseFloat(formData.price) : 0,
        status: formData.status as "DRAFT" | "PUBLISHED",
      };

      const response = await courseApi.update(courseId, updateData);

      if (response.success) {
        showToast("Course updated successfully!", "success");
        // Refresh the data
        await fetchData();
      } else {
        const errorMsg = response.message || "Failed to update course";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update course";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await courseApi.delete(courseId);

      if (response.success) {
        showToast("Course deleted successfully!", "success");
        setShowDeleteModal(false);
        router.push("/admin/courses");
      } else {
        const errorMsg = response.message || "Failed to delete course";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete course";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
        <AdminButton variant="outline" href="/admin/courses">
          Back to Courses
        </AdminButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <a href="/admin/courses" className="hover:text-primary">
              Courses
            </a>
            <span>/</span>
            <span>Edit Course</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-primary font-outfit">
              Edit Course
            </h1>
            <Badge
              variant={formData.status === "PUBLISHED" ? "success" : "warning"}
            >
              {formData.status === "PUBLISHED" ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AdminButton variant="ghost" href="/admin/courses">
            Cancel
          </AdminButton>
          <AdminButton
            variant="outline"
            href={`/admin/courses/${courseId}/modules`}
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
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            }
          >
            Manage Modules
          </AdminButton>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Enrollments</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {(course?.enrollments ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            ${(course?.revenue ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Created</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {course?.createdAt
              ? new Date(course.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <AdminCard title="Basic Information" subtitle="Course title and description">
            <div className="space-y-4">
              <AdminInput
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Web Development Masterclass"
                required
              />

              <AdminInput
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="web-development-masterclass"
                helperText="URL-friendly version of the title"
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Course Summary <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Brief description of the course (max 200 characters)"
                  maxLength={200}
                  rows={2}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <p className="text-xs text-gray-400 text-right">
                  {formData.summary.length}/200
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Full Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description..."
                  rows={6}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>
            </div>
          </AdminCard>

          {/* Course Details */}
          <AdminCard title="Course Details" subtitle="Category, level, and pricing">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminSelect
                label="Category"
                name="categoryId"
                options={categoryOptions}
                value={formData.categoryId}
                onChange={handleChange}
                required
              />

              <AdminSelect
                label="Level"
                name="level"
                options={levelOptions}
                value={formData.level}
                onChange={handleChange}
                required
              />

              <AdminInput
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="99"
                helperText="Set to 0 for free courses"
                icon={<span className="text-gray-400 font-medium">$</span>}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: "DRAFT" }))
                    }
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      formData.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                        : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                    }`}
                  >
                    Draft
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, status: "PUBLISHED" }))
                    }
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      formData.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                        : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                    }`}
                  >
                    Published
                  </button>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Thumbnail */}
          <AdminCard title="Course Thumbnail" subtitle="Upload an image for the course">
            <div className="flex items-start gap-6">
              {/* Preview */}
              <div className="w-48 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Upload */}
              <div className="flex-1">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mx-auto text-gray-400 mb-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="text-primary font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 2MB (Recommended: 1280x720)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </AdminCard>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <AdminButton
              variant="ghost"
              type="button"
              className="text-red-500 hover:bg-red-50"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
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
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              }
            >
              {deleting ? "Deleting..." : "Delete Course"}
            </AdminButton>

            <div className="flex items-center gap-3">
              <AdminButton variant="outline" href="/admin/courses">
                Cancel
              </AdminButton>
              <AdminButton
                variant="secondary"
                type="submit"
                disabled={saving}
                icon={
                  saving ? (
                    <svg
                      className="animate-spin"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="2" x2="12" y2="6" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                      <line x1="2" y1="12" x2="6" y2="12" />
                      <line x1="18" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                    </svg>
                  ) : null
                }
              >
                {saving ? "Saving..." : "Save Changes"}
              </AdminButton>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
