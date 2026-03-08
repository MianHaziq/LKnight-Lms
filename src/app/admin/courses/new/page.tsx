"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import AdminSelect from "@/components/admin/AdminSelect";
import { categoryApi, courseApi, Category } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";

const levelOptions = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

export default function NewCoursePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    instructorName: "",
    categoryId: "",
    level: "BEGINNER",
    price: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Fetch categories on mount
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryApi.getAll();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Course title is required");
      showToast("Course title is required", "error");
      return;
    }
    if (!formData.summary.trim()) {
      setError("Course summary is required");
      showToast("Course summary is required", "error");
      return;
    }
    if (!formData.categoryId) {
      setError("Please select a category");
      showToast("Please select a category", "error");
      return;
    }

    try {
      setLoading(true);

      const courseData = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        description: formData.description.trim() || undefined,
        thumbnail: thumbnailPreview || undefined,
        instructorName: formData.instructorName.trim() || undefined,
        categoryId: formData.categoryId,
        instructorId: "", // Will be auto-assigned by backend
        level: formData.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        price: formData.price ? parseFloat(formData.price) : 0,
        status,
      };

      const response = await courseApi.create(courseData);

      if (response.success && response.data) {
        const message = status === "PUBLISHED"
          ? "Course published successfully!"
          : "Course saved as draft!";
        showToast(message, "success");
        // Redirect to edit page or modules page
        router.push(`/admin/courses/${response.data.id}/modules`);
      } else {
        const errorMsg = response.message || "Failed to create course";
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create course";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-outfit">
            Add New Course
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Create a new course for your LMS
          </p>
        </div>
        <AdminButton
          variant="ghost"
          href="/admin/courses"
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
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          }
        >
          Back to Courses
        </AdminButton>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit("DRAFT"); }}>
        <div className="space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <AdminCard title="Basic Information" subtitle="Course title and description">
            <div className="space-y-3 sm:space-y-4">
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
                helperText="URL-friendly version of the title (auto-generated)"
              />

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <p className="text-[10px] sm:text-xs text-gray-400 text-right">
                  {formData.summary.length}/200
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Full Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of the course content, what students will learn, prerequisites, etc."
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none sm:rows-6"
                />
              </div>
            </div>
          </AdminCard>

          {/* Course Details */}
          <AdminCard title="Course Details" subtitle="Category, level, and pricing">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {loadingCategories ? (
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500">
                    Loading categories...
                  </div>
                </div>
              ) : (
                <AdminSelect
                  label="Category"
                  name="categoryId"
                  options={categoryOptions}
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                />
              )}

              <AdminSelect
                label="Level"
                name="level"
                options={levelOptions}
                value={formData.level}
                onChange={handleChange}
                required
              />

              {/* Price field removed — pricing is now managed via subscription plans */}

              <AdminInput
                label="Teacher Name"
                name="instructorName"
                value={formData.instructorName}
                onChange={handleChange}
                placeholder="e.g., John Smith"
                helperText="Name displayed as the course instructor"
              />
            </div>
          </AdminCard>

          {/* Thumbnail */}
          <AdminCard title="Course Thumbnail" subtitle="Upload an image for the course">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {/* Preview */}
                <div className="w-full sm:w-48 h-24 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border-2 border-dashed border-gray-200">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sm:w-8 sm:h-8"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <div className="flex-1 w-full">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 sm:p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mx-auto text-gray-400 mb-2 sm:w-6 sm:h-6"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-600">
                        <span className="text-primary font-medium">
                          Click to upload
                        </span>{" "}
                        <span className="hidden sm:inline">or drag and drop</span>
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                  </label>
                  {thumbnail && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 truncate">
                      Selected: {thumbnail.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2 sm:pt-4">
            <AdminButton variant="outline" href="/admin/courses" className="order-3 sm:order-1">
              Cancel
            </AdminButton>
            <AdminButton
              variant="ghost"
              type="button"
              onClick={() => handleSubmit("DRAFT")}
              disabled={loading}
              className="order-2"
            >
              {loading ? "Saving..." : "Save as Draft"}
            </AdminButton>
            <AdminButton
              variant="secondary"
              type="button"
              onClick={() => handleSubmit("PUBLISHED")}
              disabled={loading}
              className="order-1 sm:order-3"
            >
              {loading ? "Publishing..." : "Publish Course"}
            </AdminButton>
          </div>
        </div>
      </form>
    </div>
  );
}
