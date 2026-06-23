"use client";

import { useState, useEffect, useRef } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import Badge from "@/components/admin/Badge";
import { teamApi, uploadApi, TeamMember } from "@/lib/api";

export default function TeamManagementPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    email: "",
    facebook: "",
    linkedin: "",
    image: "",
    isActive: true,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const response = await teamApi.getAll(true);
      if (response.success && response.data) {
        setMembers(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      setError("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      description: "",
      email: "",
      facebook: "",
      linkedin: "",
      image: "",
      isActive: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      const response = await uploadApi.uploadImage(file, "team");
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
    if (!formData.name || !formData.role) return;

    setIsSaving(true);
    setError(null);
    try {
      const response = await teamApi.create({
        name: formData.name,
        role: formData.role,
        description: formData.description || undefined,
        email: formData.email || undefined,
        facebook: formData.facebook || undefined,
        linkedin: formData.linkedin || undefined,
        image: formData.image || undefined,
        isActive: formData.isActive,
      });

      if (response.success && response.data) {
        setMembers([...members, response.data]);
        resetForm();
        setShowModal(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create team member"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingMember || !formData.name || !formData.role) return;

    setIsSaving(true);
    setError(null);
    try {
      const response = await teamApi.update(editingMember.id, {
        name: formData.name,
        role: formData.role,
        description: formData.description || undefined,
        email: formData.email || undefined,
        facebook: formData.facebook || undefined,
        linkedin: formData.linkedin || undefined,
        image: formData.image || undefined,
        isActive: formData.isActive,
      });

      if (response.success && response.data) {
        setMembers((prev) =>
          prev.map((m) => (m.id === editingMember.id ? response.data! : m))
        );
        setEditingMember(null);
        resetForm();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update team member"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await teamApi.delete(id);
      if (response.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        setDeleteConfirm(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete team member"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const openEditModal = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description || "",
      email: member.email || "",
      facebook: member.facebook || "",
      linkedin: member.linkedin || "",
      image: member.image || "",
      isActive: member.isActive,
    });
    setEditingMember(member);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    resetForm();
  };

  const activeCount = members.filter((m) => m.isActive).length;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 h-24"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-outfit">
            Team Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage your &quot;Meet the Team&quot; section on the About page
          </p>
        </div>
        <AdminButton
          variant="secondary"
          onClick={() => setShowModal(true)}
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
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          }
        >
          Add Team Member
        </AdminButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">Total Members</p>
          <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5 sm:mt-1">
            {members.length}
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
            {members.length - activeCount}
          </p>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {members.map((member) => (
          <AdminCard key={member.id} padding="md" className="group">
            <div className="flex items-start gap-3 sm:gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-sm sm:text-base">
                    {member.name
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
                    {member.name}
                  </h3>
                  <Badge
                    variant={member.isActive ? "success" : "gray"}
                    size="sm"
                  >
                    {member.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-secondary font-medium mt-0.5">
                  {member.role}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {member.description || "No description"}
                </p>
                {member.email && (
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 truncate">
                    {member.email}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <AdminButton
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => openEditModal(member)}
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
                  >
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
                onClick={() => setDeleteConfirm(member.id)}
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
                  >
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
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="sm:w-8 sm:h-8"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="font-medium text-sm sm:text-base">
            Add Team Member
          </span>
        </button>
      </div>

      {/* Add/Edit Modal */}
      {(showModal || editingMember) && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl max-w-lg w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
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
                      id="team-image-upload"
                      disabled={isUploadingImage}
                    />
                    <label
                      htmlFor="team-image-upload"
                      className={`inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg transition-colors ${isUploadingImage ? "cursor-wait opacity-70" : "cursor-pointer hover:bg-gray-50"}`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
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
                      JPG, PNG. Max 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <AdminInput
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., John Doe"
                required
              />

              <AdminInput
                label="Role / Position"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g., Chief Technology Officer"
                required
              />

              <AdminInput
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief bio or description"
              />

              <AdminInput
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@example.com"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <AdminInput
                  label="Facebook URL"
                  value={formData.facebook}
                  onChange={(e) =>
                    setFormData({ ...formData, facebook: e.target.value })
                  }
                  placeholder="https://facebook.com/..."
                />

                <AdminInput
                  label="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    Active Status
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400">
                    Inactive members won&apos;t appear on the website
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

              {/* Preview */}
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">
                  Preview
                </p>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold text-xs">
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
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {formData.name || "Full Name"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-secondary truncate">
                      {formData.role || "Role / Position"}
                    </p>
                  </div>
                </div>
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
                onClick={editingMember ? handleEdit : handleAdd}
                disabled={isSaving || !formData.name || !formData.role}
              >
                {isSaving
                  ? "Saving..."
                  : editingMember
                  ? "Save Changes"
                  : "Add Member"}
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500 sm:w-6 sm:h-6"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 text-center mb-1.5 sm:mb-2">
              Delete Team Member?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6">
              This action cannot be undone. The team member will be permanently
              removed.
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
