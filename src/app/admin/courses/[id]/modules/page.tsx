"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import Badge from "@/components/admin/Badge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { courseApi, moduleApi, lessonApi, documentApi, Module, Lesson, CourseDetails, Document as DocType } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { DocumentManager } from "@/components/admin";
import VideoUploader from "@/components/admin/VideoUploader";

interface ModuleWithExpanded extends Module {
  isExpanded: boolean;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Content type detection
const getContentTypeCategory = (contentType?: string): "image" | "video" | "unknown" => {
  if (!contentType) return "unknown";
  if (contentType.startsWith("image/")) return "image";
  if (contentType.startsWith("video/")) return "video";
  return "unknown";
};

export default function ModulesPage() {
  const params = useParams();
  const { showToast } = useToast();
  const courseId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [modules, setModules] = useState<ModuleWithExpanded[]>([]);

  // Module form states
  const [showAddModule, setShowAddModule] = useState(false);
  const [showEditModule, setShowEditModule] = useState<string | null>(null);
  const [savingModule, setSavingModule] = useState(false);
  const [deletingModule, setDeletingModule] = useState<string | null>(null);

  // Lesson form states
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [showEditLesson, setShowEditLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [savingLesson, setSavingLesson] = useState(false);
  const [deletingLesson, setDeletingLesson] = useState<string | null>(null);

  // Delete modal states
  const [deleteModuleModal, setDeleteModuleModal] = useState<{ isOpen: boolean; moduleId: string; title: string }>({
    isOpen: false,
    moduleId: "",
    title: "",
  });
  const [deleteLessonModal, setDeleteLessonModal] = useState<{
    isOpen: boolean;
    moduleId: string;
    lessonId: string;
    title: string;
  }>({ isOpen: false, moduleId: "", lessonId: "", title: "" });

  // Document states for edit modals
  const [editModuleDocuments, setEditModuleDocuments] = useState<DocType[]>([]);
  const [editLessonDocuments, setEditLessonDocuments] = useState<DocType[]>([]);

  // New module form
  const [newModule, setNewModule] = useState({
    title: "",
    summary: "",
    description: "",
    content: "",
    contentType: "",
  });
  const [moduleContentPreview, setModuleContentPreview] = useState<string | null>(null);

  // Edit module form
  const [editModuleData, setEditModuleData] = useState({
    title: "",
    summary: "",
    description: "",
    content: "",
    contentType: "",
  });
  const [editModuleContentPreview, setEditModuleContentPreview] = useState<string | null>(null);

  // New lesson form
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    videoUrl: "",
    content: "",
    contentType: "",
    duration: 0,
  });
  const [lessonContentPreview, setLessonContentPreview] = useState<string | null>(null);

  // Edit lesson form
  const [editLessonData, setEditLessonData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    content: "",
    contentType: "",
    duration: 0,
  });
  const [editLessonContentPreview, setEditLessonContentPreview] = useState<string | null>(null);

  // Fetch course and modules
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [courseRes, modulesRes] = await Promise.all([
        courseApi.getById(courseId),
        moduleApi.getByCourse(courseId),
      ]);

      if (courseRes.success && courseRes.data) {
        setCourse(courseRes.data);
      }

      if (modulesRes.success && modulesRes.data) {
        const modulesWithExpanded = (modulesRes.data as Module[]).map((mod, index) => ({
          ...mod,
          isExpanded: index === 0,
        }));
        setModules(modulesWithExpanded);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  }, [courseId, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, isExpanded: !m.isExpanded } : m
      )
    );
  };

  // Handle file upload for module
  const handleModuleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isEdit) {
          setEditModuleData((prev) => ({
            ...prev,
            content: base64,
            contentType: file.type,
          }));
          setEditModuleContentPreview(base64);
        } else {
          setNewModule((prev) => ({
            ...prev,
            content: base64,
            contentType: file.type,
          }));
          setModuleContentPreview(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload for lesson
  const handleLessonFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isEdit) {
          setEditLessonData((prev) => ({
            ...prev,
            content: base64,
            contentType: file.type,
          }));
          setEditLessonContentPreview(base64);
        } else {
          setNewLesson((prev) => ({
            ...prev,
            content: base64,
            contentType: file.type,
          }));
          setLessonContentPreview(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Module
  const handleAddModule = async () => {
    if (!newModule.title.trim()) {
      setError("Module title is required");
      showToast("Module title is required", "error");
      return;
    }

    try {
      setSavingModule(true);
      setError(null);

      const response = await moduleApi.create(courseId, {
        title: newModule.title.trim(),
        summary: newModule.summary.trim() || undefined,
        description: newModule.description.trim() || undefined,
        content: newModule.content || undefined,
        contentType: newModule.contentType || undefined,
      });

      if (response.success && response.data) {
        setModules([...modules, { ...response.data, isExpanded: true }]);
        setNewModule({ title: "", summary: "", description: "", content: "", contentType: "" });
        setModuleContentPreview(null);
        setShowAddModule(false);
        showToast("Module created successfully!", "success");
      } else {
        setError(response.message || "Failed to create module");
        showToast(response.message || "Failed to create module", "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create module";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setSavingModule(false);
    }
  };

  // Edit Module
  const openEditModule = async (module: ModuleWithExpanded) => {
    setEditModuleData({
      title: module.title,
      summary: module.summary || "",
      description: module.description || "",
      content: module.content || "",
      contentType: module.contentType || "",
    });
    setEditModuleContentPreview(module.content || null);
    setEditModuleDocuments([]);
    setShowEditModule(module.id);

    // Fetch module documents
    try {
      const res = await documentApi.getByModule(module.id);
      if (res.success && res.data) {
        setEditModuleDocuments(res.data as DocType[]);
      }
    } catch {
      // Documents will show as empty - non-blocking
    }
  };

  const handleEditModule = async () => {
    if (!showEditModule) return;
    if (!editModuleData.title.trim()) {
      setError("Module title is required");
      showToast("Module title is required", "error");
      return;
    }

    try {
      setSavingModule(true);
      setError(null);

      const response = await moduleApi.update(showEditModule, {
        title: editModuleData.title.trim(),
        summary: editModuleData.summary.trim() || undefined,
        description: editModuleData.description.trim() || undefined,
        content: editModuleData.content || undefined,
        contentType: editModuleData.contentType || undefined,
      });

      if (response.success && response.data) {
        setModules((prev) =>
          prev.map((m) =>
            m.id === showEditModule
              ? { ...response.data, isExpanded: m.isExpanded } as ModuleWithExpanded
              : m
          )
        );
        setShowEditModule(null);
        setEditModuleContentPreview(null);
        showToast("Module updated successfully!", "success");
      } else {
        setError(response.message || "Failed to update module");
        showToast(response.message || "Failed to update module", "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update module";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setSavingModule(false);
    }
  };

  // Open delete module modal
  const openDeleteModuleModal = (moduleId: string, title: string) => {
    setDeleteModuleModal({ isOpen: true, moduleId, title });
  };

  // Delete Module
  const handleDeleteModule = async () => {
    const { moduleId } = deleteModuleModal;

    try {
      setDeletingModule(moduleId);
      setError(null);

      const response = await moduleApi.delete(moduleId);

      if (response.success) {
        setModules((prev) => prev.filter((m) => m.id !== moduleId));
        setDeleteModuleModal({ isOpen: false, moduleId: "", title: "" });
        showToast("Module deleted successfully!", "success");
      } else {
        setError(response.message || "Failed to delete module");
        showToast(response.message || "Failed to delete module", "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete module";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setDeletingModule(null);
    }
  };

  // Add Lesson
  const handleAddLesson = async (moduleId: string) => {
    if (!newLesson.title.trim()) {
      setError("Lesson title is required");
      showToast("Lesson title is required", "error");
      return;
    }

    try {
      setSavingLesson(true);
      setError(null);

      const response = await lessonApi.create(moduleId, {
        title: newLesson.title.trim(),
        description: newLesson.description.trim() || undefined,
        videoUrl: newLesson.videoUrl.trim() || undefined,
        content: newLesson.content || undefined,
        contentType: newLesson.contentType || undefined,
        duration: newLesson.duration || 0,
      });

      if (response.success && response.data) {
        setModules((prev) =>
          prev.map((m) => {
            if (m.id === moduleId) {
              return { ...m, lessons: [...m.lessons, response.data as Lesson] };
            }
            return m;
          })
        );
        setNewLesson({ title: "", description: "", videoUrl: "", content: "", contentType: "", duration: 0 });
        setLessonContentPreview(null);
        setShowAddLesson(null);
        showToast("Lesson created successfully!", "success");
      } else {
        setError(response.message || "Failed to create lesson");
        showToast(response.message || "Failed to create lesson", "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create lesson";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setSavingLesson(false);
    }
  };

  // Edit Lesson
  const openEditLesson = async (moduleId: string, lesson: Lesson) => {
    setEditLessonData({
      title: lesson.title,
      description: lesson.description || "",
      videoUrl: lesson.videoUrl || "",
      content: lesson.content || "",
      contentType: lesson.contentType || "",
      duration: lesson.duration || 0,
    });
    setEditLessonContentPreview(lesson.content || null);
    setEditLessonDocuments([]);
    setShowEditLesson({ moduleId, lessonId: lesson.id });

    // Fetch lesson documents
    try {
      const res = await documentApi.getByLesson(lesson.id);
      if (res.success && res.data) {
        setEditLessonDocuments(res.data as DocType[]);
      }
    } catch {
      // Documents will show as empty - non-blocking
    }
  };

  const handleEditLesson = async () => {
    if (!showEditLesson) return;
    if (!editLessonData.title.trim()) {
      setError("Lesson title is required");
      showToast("Lesson title is required", "error");
      return;
    }

    try {
      setSavingLesson(true);
      setError(null);

      const response = await lessonApi.update(showEditLesson.lessonId, {
        title: editLessonData.title.trim(),
        description: editLessonData.description.trim() || undefined,
        videoUrl: editLessonData.videoUrl.trim() || undefined,
        content: editLessonData.content || undefined,
        contentType: editLessonData.contentType || undefined,
        duration: editLessonData.duration || 0,
      });

      if (response.success && response.data) {
        setModules((prev) =>
          prev.map((m) => {
            if (m.id === showEditLesson.moduleId) {
              return {
                ...m,
                lessons: m.lessons.map((l) =>
                  l.id === showEditLesson.lessonId ? (response.data as Lesson) : l
                ),
              };
            }
            return m;
          })
        );
        setShowEditLesson(null);
        setEditLessonContentPreview(null);
        showToast("Lesson updated successfully!", "success");
      } else {
        setError(response.message || "Failed to update lesson");
        showToast(response.message || "Failed to update lesson", "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update lesson";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setSavingLesson(false);
    }
  };

  // Open delete lesson modal
  const openDeleteLessonModal = (moduleId: string, lessonId: string, title: string) => {
    setDeleteLessonModal({ isOpen: true, moduleId, lessonId, title });
  };

  // Delete Lesson
  const handleDeleteLesson = async () => {
    const { moduleId, lessonId } = deleteLessonModal;

    try {
      setDeletingLesson(lessonId);
      setError(null);

      const response = await lessonApi.delete(lessonId);

      if (response.success) {
        setModules((prev) =>
          prev.map((m) => {
            if (m.id === moduleId) {
              return { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) };
            }
            return m;
          })
        );
        setDeleteLessonModal({ isOpen: false, moduleId: "", lessonId: "", title: "" });
        showToast("Lesson deleted successfully!", "success");
      } else {
        setError(response.message || "Failed to delete lesson");
        showToast(response.message || "Failed to delete lesson", "error");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete lesson";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setDeletingLesson(null);
    }
  };

  // Content Preview Component
  const ContentPreview = ({ content, contentType, className = "" }: { content?: string; contentType?: string; className?: string }) => {
    if (!content) return null;

    const category = getContentTypeCategory(contentType);

    if (category === "image") {
      return (
        <img
          src={content}
          alt="Content preview"
          className={`max-h-32 rounded-lg object-cover ${className}`}
        />
      );
    }

    if (category === "video") {
      return (
        <video
          src={content}
          controls
          className={`max-h-32 rounded-lg ${className}`}
        />
      );
    }

    return null;
  };

  // File Upload Component
  const FileUploadField = ({
    label,
    onChange,
    preview,
    onClear,
    accept = "image/*,video/*",
  }: {
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    preview: string | null;
    onClear: () => void;
    accept?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        {label}
      </label>
      {preview ? (
        <div className="relative inline-block">
          <ContentPreview content={preview} contentType={preview.split(";")[0].split(":")[1]} className="border border-gray-200" />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <input
            type="file"
            accept={accept}
            onChange={onChange}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
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
            <p className="text-xs text-gray-500">
              <span className="text-primary font-medium">Click to upload</span> image or video
            </p>
          </div>
        </label>
      )}
    </div>
  );

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalDuration = modules.reduce(
    (sum, m) => sum + m.lessons.reduce((lSum, l) => lSum + (l.duration || 0), 0),
    0
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <a href="/admin/courses" className="hover:text-primary">Courses</a>
            <span>/</span>
            <a href={`/admin/courses/${courseId}`} className="hover:text-primary">
              {course?.title || "Course"}
            </a>
          </div>
          <h1 className="text-2xl font-bold text-primary font-outfit">
            Module Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Organize your course content into modules and lessons
          </p>
        </div>
        <div className="flex gap-2">
          <AdminButton variant="outline" href={`/admin/courses/${courseId}`}>
            Edit Course
          </AdminButton>
          <AdminButton
            variant="secondary"
            onClick={() => setShowAddModule(true)}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
          >
            Add Module
          </AdminButton>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
          <button onClick={() => setError(null)} className="float-right text-red-500 hover:text-red-700">
            &times;
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Modules</p>
          <p className="text-2xl font-bold text-primary mt-1">{modules.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Lessons</p>
          <p className="text-2xl font-bold text-primary mt-1">{totalLessons}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Total Duration</p>
          <p className="text-2xl font-bold text-primary mt-1">
            {Math.floor(totalDuration / 3600)}h {Math.floor((totalDuration % 3600) / 60)}m
          </p>
        </div>
      </div>

      {/* Add Module Form */}
      {showAddModule && (
        <AdminCard title="Add New Module" padding="md">
          <div className="space-y-4">
            <AdminInput
              label="Module Title"
              value={newModule.title}
              onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
              placeholder="e.g., Getting Started"
              required
            />
            <AdminInput
              label="Module Summary"
              value={newModule.summary}
              onChange={(e) => setNewModule({ ...newModule, summary: e.target.value })}
              placeholder="Brief description of this module"
            />
            <div className="space-y-1.5">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={newModule.description}
                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                placeholder="Detailed description of the module content"
                rows={3}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              />
            </div>
            <FileUploadField
              label="Module Content (Image/Video)"
              onChange={(e) => handleModuleFileChange(e, false)}
              preview={moduleContentPreview}
              onClear={() => {
                setNewModule({ ...newModule, content: "", contentType: "" });
                setModuleContentPreview(null);
              }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <AdminButton
                variant="ghost"
                onClick={() => {
                  setShowAddModule(false);
                  setNewModule({ title: "", summary: "", description: "", content: "", contentType: "" });
                  setModuleContentPreview(null);
                }}
                disabled={savingModule}
              >
                Cancel
              </AdminButton>
              <AdminButton variant="primary" onClick={handleAddModule} disabled={savingModule}>
                {savingModule ? "Adding..." : "Add Module"}
              </AdminButton>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Edit Module Modal */}
      {showEditModule && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Module</h3>
              <div className="space-y-4">
                <AdminInput
                  label="Module Title"
                  value={editModuleData.title}
                  onChange={(e) => setEditModuleData({ ...editModuleData, title: e.target.value })}
                  placeholder="e.g., Getting Started"
                  required
                />
                <AdminInput
                  label="Module Summary"
                  value={editModuleData.summary}
                  onChange={(e) => setEditModuleData({ ...editModuleData, summary: e.target.value })}
                  placeholder="Brief description of this module"
                />
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={editModuleData.description}
                    onChange={(e) => setEditModuleData({ ...editModuleData, description: e.target.value })}
                    placeholder="Detailed description of the module content"
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
                <FileUploadField
                  label="Module Content (Image/Video)"
                  onChange={(e) => handleModuleFileChange(e, true)}
                  preview={editModuleContentPreview}
                  onClear={() => {
                    setEditModuleData({ ...editModuleData, content: "", contentType: "" });
                    setEditModuleContentPreview(null);
                  }}
                />

                {/* Module Documents */}
                {showEditModule && (
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Module Documents
                    </label>
                    <DocumentManager
                      entityType="module"
                      entityId={showEditModule}
                      documents={editModuleDocuments}
                      onDocumentsChange={setEditModuleDocuments}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <AdminButton
                  variant="ghost"
                  onClick={() => {
                    setShowEditModule(null);
                    setEditModuleContentPreview(null);
                  }}
                  disabled={savingModule}
                >
                  Cancel
                </AdminButton>
                <AdminButton variant="primary" onClick={handleEditModule} disabled={savingModule}>
                  {savingModule ? "Saving..." : "Save Changes"}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lesson Modal */}
      {showEditLesson && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Lesson</h3>
              <div className="space-y-4">
                <AdminInput
                  label="Lesson Title"
                  value={editLessonData.title}
                  onChange={(e) => setEditLessonData({ ...editLessonData, title: e.target.value })}
                  placeholder="e.g., Introduction to Variables"
                  required
                />
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={editLessonData.description}
                    onChange={(e) => setEditLessonData({ ...editLessonData, description: e.target.value })}
                    placeholder="Detailed description of the lesson"
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <AdminInput
                    label="Video URL"
                    value={editLessonData.videoUrl}
                    onChange={(e) => setEditLessonData({ ...editLessonData, videoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                  <AdminInput
                    label="Duration (seconds)"
                    type="number"
                    value={editLessonData.duration}
                    onChange={(e) => setEditLessonData({ ...editLessonData, duration: parseInt(e.target.value) || 0 })}
                    placeholder="600"
                  />
                </div>
                {/* Video Upload via Bunny Stream */}
                {showEditLesson && (
                  <VideoUploader
                    lessonId={showEditLesson.lessonId}
                    currentVideoStatus={
                      modules
                        .find((m) => m.id === showEditLesson.moduleId)
                        ?.lessons.find((l) => l.id === showEditLesson.lessonId)
                        ?.videoStatus
                    }
                    currentThumbnailUrl={
                      modules
                        .find((m) => m.id === showEditLesson.moduleId)
                        ?.lessons.find((l) => l.id === showEditLesson.lessonId)
                        ?.thumbnailUrl
                    }
                    currentBunnyVideoId={
                      modules
                        .find((m) => m.id === showEditLesson.moduleId)
                        ?.lessons.find((l) => l.id === showEditLesson.lessonId)
                        ?.bunnyVideoId
                    }
                    onUploadComplete={(data) => {
                      // Update the lesson in local state with Bunny video info
                      setModules((prev) =>
                        prev.map((m) => {
                          if (m.id === showEditLesson.moduleId) {
                            return {
                              ...m,
                              lessons: m.lessons.map((l) =>
                                l.id === showEditLesson.lessonId
                                  ? {
                                      ...l,
                                      bunnyVideoId: data.bunnyVideoId,
                                      videoStatus: data.videoStatus,
                                      thumbnailUrl: data.thumbnailUrl,
                                      content: undefined,
                                      contentType: undefined,
                                    }
                                  : l
                              ),
                            };
                          }
                          return m;
                        })
                      );
                      showToast("Video uploaded! Encoding will begin shortly.", "success");
                    }}
                  />
                )}

                {/* Lesson Documents */}
                {showEditLesson && (
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Lesson Documents
                    </label>
                    <DocumentManager
                      entityType="lesson"
                      entityId={showEditLesson.lessonId}
                      documents={editLessonDocuments}
                      onDocumentsChange={setEditLessonDocuments}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <AdminButton
                  variant="ghost"
                  onClick={() => {
                    setShowEditLesson(null);
                    setEditLessonContentPreview(null);
                  }}
                  disabled={savingLesson}
                >
                  Cancel
                </AdminButton>
                <AdminButton variant="primary" onClick={handleEditLesson} disabled={savingLesson}>
                  {savingLesson ? "Saving..." : "Save Changes"}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module, index) => (
          <AdminCard key={module.id} padding="none" className="overflow-hidden">
            {/* Module Header */}
            <div
              className="flex items-center gap-4 px-6 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => toggleModule(module.id)}
            >
              {/* Drag Handle */}
              <div className="text-gray-400 cursor-grab">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="5" r="1" />
                  <circle cx="9" cy="12" r="1" />
                  <circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="5" r="1" />
                  <circle cx="15" cy="12" r="1" />
                  <circle cx="15" cy="19" r="1" />
                </svg>
              </div>

              {/* Module Content Preview (Thumbnail) */}
              {module.content && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                  <ContentPreview content={module.content} contentType={module.contentType} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Module Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">Module {index + 1}</Badge>
                  <h3 className="font-semibold text-gray-900">{module.title}</h3>
                </div>
                {module.summary && (
                  <p className="text-sm text-gray-500 mt-0.5">{module.summary}</p>
                )}
              </div>

              {/* Lesson Count */}
              <div className="text-sm text-gray-500">{module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"}</div>

              {/* Actions */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <AdminButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddLesson(module.id)}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  }
                >
                  Add Lesson
                </AdminButton>
                <button
                  onClick={() => openEditModule(module)}
                  className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  title="Edit Module"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => openDeleteModuleModal(module.id, module.title)}
                  disabled={deletingModule === module.id}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete Module"
                >
                  {deletingModule === module.id ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Expand/Collapse */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-gray-400 transition-transform duration-200 ${module.isExpanded ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Lessons */}
            {module.isExpanded && (
              <div className="border-t border-gray-100">
                {/* Add Lesson Form */}
                {showAddLesson === module.id && (
                  <div className="p-4 bg-blue-50 border-b border-blue-100">
                    <div className="space-y-3">
                      <AdminInput
                        label="Lesson Title"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                        placeholder="e.g., Introduction to Variables"
                        required
                      />
                      <div className="space-y-1.5">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          value={newLesson.description}
                          onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                          placeholder="Detailed description of the lesson"
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <AdminInput
                          label="Video URL"
                          value={newLesson.videoUrl}
                          onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                          placeholder="https://..."
                        />
                        <AdminInput
                          label="Duration (seconds)"
                          type="number"
                          value={newLesson.duration}
                          onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) || 0 })}
                          placeholder="600"
                        />
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <p className="text-xs text-blue-700">
                          <span className="font-medium">Video upload:</span> Save the lesson first, then edit it to upload a video via Bunny Stream.
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <AdminButton
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowAddLesson(null);
                            setNewLesson({ title: "", description: "", videoUrl: "", content: "", contentType: "", duration: 0 });
                            setLessonContentPreview(null);
                          }}
                          disabled={savingLesson}
                        >
                          Cancel
                        </AdminButton>
                        <AdminButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleAddLesson(module.id)}
                          disabled={savingLesson}
                        >
                          {savingLesson ? "Adding..." : "Add Lesson"}
                        </AdminButton>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lessons List */}
                {module.lessons.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="mx-auto text-gray-300 mb-2"
                    >
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    <p>No lessons yet. Add your first lesson to this module.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        {/* Order */}
                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500">
                          {lessonIndex + 1}
                        </span>

                        {/* Content Thumbnail */}
                        {lesson.thumbnailUrl && lesson.bunnyVideoId ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0 relative">
                            <img src={lesson.thumbnailUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            {lesson.videoStatus === "finished" && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white" />
                            )}
                            {(lesson.videoStatus === "processing" || lesson.videoStatus === "encoding") && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        ) : lesson.content ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                            <ContentPreview content={lesson.content} contentType={lesson.contentType} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                        )}

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                          {lesson.description && (
                            <p className="text-xs text-gray-400 truncate">{lesson.description}</p>
                          )}
                          {lesson.videoUrl && !lesson.description && (
                            <p className="text-xs text-gray-400 truncate max-w-xs">{lesson.videoUrl}</p>
                          )}
                        </div>

                        {/* Duration */}
                        <span className="text-sm text-gray-500">{formatDuration(lesson.duration || 0)}</span>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditLesson(module.id, lesson)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Lesson"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openDeleteLessonModal(module.id, lesson.id, lesson.title)}
                            disabled={deletingLesson === lesson.id}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete Lesson"
                          >
                            {deletingLesson === lesson.id ? (
                              <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </AdminCard>
        ))}
      </div>

      {modules.length === 0 && !showAddModule && (
        <AdminCard padding="lg">
          <div className="text-center py-8">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto text-gray-300 mb-4"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No modules yet</h3>
            <p className="text-gray-500 mb-4">Start organizing your course by adding the first module.</p>
            <AdminButton
              variant="secondary"
              onClick={() => setShowAddModule(true)}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              }
            >
              Add First Module
            </AdminButton>
          </div>
        </AdminCard>
      )}

      {/* Delete Module Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModuleModal.isOpen}
        onClose={() => setDeleteModuleModal({ isOpen: false, moduleId: "", title: "" })}
        onConfirm={handleDeleteModule}
        title="Delete Module"
        message={`Are you sure you want to delete "${deleteModuleModal.title}"? All lessons in this module will also be deleted.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingModule === deleteModuleModal.moduleId}
      />

      {/* Delete Lesson Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteLessonModal.isOpen}
        onClose={() => setDeleteLessonModal({ isOpen: false, moduleId: "", lessonId: "", title: "" })}
        onConfirm={handleDeleteLesson}
        title="Delete Lesson"
        message={`Are you sure you want to delete "${deleteLessonModal.title}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletingLesson === deleteLessonModal.lessonId}
      />

    </div>
  );
}
