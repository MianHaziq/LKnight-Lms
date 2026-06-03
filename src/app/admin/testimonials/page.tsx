"use client";

import { useState, useEffect, useRef } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import Badge from "@/components/admin/Badge";
import { testimonialApi, uploadApi, Testimonial } from "@/lib/api";

const pageOptions = [
  { key: "showOnHome" as const, label: "Home" },
  { key: "showOnAbout" as const, label: "About" },
  { key: "showOnCourses" as const, label: "Courses" },
  { key: "showOnDashboard" as const, label: "Dashboard" },
];

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={star <= value ? "#FF6F00" : "none"}
            stroke={star <= value ? "#FF6F00" : "#D1D5DB"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function TestimonialManagementPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    rating: 5,
    image: "",
    gender: "male",
    showOnHome: false,
    showOnAbout: false,
    showOnCourses: false,
    showOnDashboard: false,
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await testimonialApi.getAll(true);
      if (response.success && response.data) {
        setTestimonials(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      setError("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      content: "",
      rating: 5,
      image: "",
      gender: "male",
      showOnHome: false,
      showOnAbout: false,
      showOnCourses: false,
      showOnDashboard: false,
      isActive: true,
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }
    setError(null);
    setIsUploadingImage(true);
    try {
      const response = await uploadApi.uploadImage(file, "testimonials");
      if (response.success && response.data?.url) {
        setFormData((prev) => ({ ...prev, image: response.data!.url }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.content) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await testimonialApi.create({
        name: formData.name,
        content: formData.content,
        rating: formData.rating,
        image: formData.image || undefined,
        gender: formData.gender,
        showOnHome: formData.showOnHome,
        showOnAbout: formData.showOnAbout,
        showOnCourses: formData.showOnCourses,
        showOnDashboard: formData.showOnDashboard,
        isActive: formData.isActive,
      });
      if (response.success && response.data) {
        setTestimonials([...testimonials, response.data]);
        resetForm();
        setShowModal(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingItem || !formData.name || !formData.content) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await testimonialApi.update(editingItem.id, {
        name: formData.name,
        content: formData.content,
        rating: formData.rating,
        image: formData.image || undefined,
        gender: formData.gender,
        showOnHome: formData.showOnHome,
        showOnAbout: formData.showOnAbout,
        showOnCourses: formData.showOnCourses,
        showOnDashboard: formData.showOnDashboard,
        isActive: formData.isActive,
      });
      if (response.success && response.data) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editingItem.id ? response.data! : t))
        );
        setEditingItem(null);
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await testimonialApi.delete(id);
      if (response.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (item: Testimonial) => {
    setFormData({
      name: item.name,
      content: item.content,
      rating: item.rating,
      image: item.image || "",
      gender: item.gender || "male",
      showOnHome: item.showOnHome,
      showOnAbout: item.showOnAbout,
      showOnCourses: item.showOnCourses,
      showOnDashboard: item.showOnDashboard,
      isActive: item.isActive,
    });
    setEditingItem(item);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    resetForm();
  };

  const getPageLabels = (item: Testimonial) => {
    const pages: string[] = [];
    if (item.showOnHome) pages.push("Home");
    if (item.showOnAbout) pages.push("About");
    if (item.showOnCourses) pages.push("Courses");
    if (item.showOnDashboard) pages.push("Dashboard");
    return pages;
  };

  const activeCount = testimonials.filter((t) => t.isActive).length;

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-44" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-52" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-outfit">
            Testimonial Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage testimonials across your website pages
          </p>
        </div>
        <AdminButton
          variant="secondary"
          onClick={() => setShowModal(true)}
          size="sm"
          className="self-start sm:self-auto"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          Add Testimonial
        </AdminButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5 sm:mt-1">
            {testimonials.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">Active</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1">
            {activeCount}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hidden sm:block">
          <p className="text-xs sm:text-sm text-gray-500">Inactive</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-400 mt-0.5 sm:mt-1">
            {testimonials.length - activeCount}
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {testimonials.map((item) => (
          <AdminCard key={item.id} padding="md" className="group">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0 bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center font-bold text-white text-sm sm:text-base ${
                      item.gender === "female"
                        ? "bg-pink-500"
                        : "bg-primary"
                    }`}
                  >
                    {item.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                    {item.name}
                  </h3>
                  <Badge
                    variant={item.isActive ? "success" : "gray"}
                    size="sm"
                  >
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill={star <= item.rating ? "#FF6F00" : "none"}
                      stroke={star <= item.rating ? "#FF6F00" : "#D1D5DB"}
                      strokeWidth="2"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {item.content}
                </p>

                {/* Page badges */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {getPageLabels(item).map((p) => (
                    <span
                      key={p}
                      className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium"
                    >
                      {p}
                    </span>
                  ))}
                  {getPageLabels(item).length === 0 && (
                    <span className="text-[10px] text-gray-400">
                      No pages assigned
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <AdminButton
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => openEditModal(item)}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                }
              >
                Edit
              </AdminButton>
              <AdminButton
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50"
                onClick={() => setDeleteConfirm(item.id)}
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                }
              >
                Delete
              </AdminButton>
            </div>
          </AdminCard>
        ))}

        {/* Add Card */}
        <button
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 min-h-[140px] sm:min-h-[180px]"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-8 sm:h-8">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="font-medium text-sm sm:text-base">Add Testimonial</span>
        </button>
      </div>

      {/* Add/Edit Modal */}
      {(showModal || editingItem) && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl max-w-lg w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              {editingItem ? "Edit Testimonial" : "Add New Testimonial"}
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center text-white font-bold ${
                          formData.gender === "female"
                            ? "bg-pink-500"
                            : "bg-primary"
                        }`}
                      >
                        {formData.name
                          ? formData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="testimonial-image-upload"
                      disabled={isUploadingImage}
                    />
                    <label
                      htmlFor="testimonial-image-upload"
                      className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg transition-colors ${isUploadingImage ? "cursor-wait opacity-70" : "cursor-pointer hover:bg-gray-50"}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {isUploadingImage ? "Uploading..." : "Upload Photo"}
                    </label>
                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, image: "" }));
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        className="ml-2 text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                      If no photo, icon shows based on gender
                    </p>
                  </div>
                </div>
              </div>

              <AdminInput
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Jane Smith"
                required
              />

              {/* Content textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Testimonial Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="What the person said about your platform..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              {/* Rating */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Rating
                </label>
                <StarRatingInput
                  value={formData.rating}
                  onChange={(v) => setFormData({ ...formData, rating: v })}
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Gender (for default avatar)
                </label>
                <div className="flex gap-3">
                  {["male", "female"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        formData.gender === g
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Show on pages */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Show on Pages
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {pageOptions.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          [opt.key]: !prev[opt.key],
                        }))
                      }
                      className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                        formData[opt.key]
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {formData[opt.key] ? "✓ " : ""}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    Active Status
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Inactive testimonials won&apos;t appear on the website
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: !prev.isActive,
                    }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.isActive ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <AdminButton
                variant="outline"
                className="flex-1"
                size="sm"
                onClick={closeModal}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                className="flex-1"
                size="sm"
                onClick={editingItem ? handleEdit : handleAdd}
                disabled={isSaving || !formData.name || !formData.content}
              >
                {isSaving
                  ? "Saving..."
                  : editingItem
                  ? "Save Changes"
                  : "Add Testimonial"}
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl max-w-sm w-full p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 sm:w-6 sm:h-6">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-1.5 sm:mb-2">
              Delete Testimonial?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <AdminButton
                variant="outline"
                className="flex-1"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="danger"
                className="flex-1"
                size="sm"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isSaving}
              >
                {isSaving ? "Deleting..." : "Delete"}
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
