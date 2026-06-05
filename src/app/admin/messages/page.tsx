"use client";

import { useState, useEffect, useCallback } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import AdminSelect from "@/components/admin/AdminSelect";
import Badge from "@/components/admin/Badge";
import DataTable from "@/components/admin/DataTable";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  contactAdminApi,
  ContactMessage,
  ContactMessageStats,
} from "@/lib/api";

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "ARCHIVED", label: "Archived" },
];

const subjectLabels: Record<string, string> = {
  general: "General Inquiry",
  support: "Technical Support",
  sales: "Course Enrollment",
  other: "Other",
};

const statusBadgeVariant: Record<
  string,
  "primary" | "gray" | "success" | "warning" | "danger"
> = {
  NEW: "primary",
  READ: "gray",
  REPLIED: "success",
  ARCHIVED: "warning",
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactMessageStats>({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Modal states
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await contactAdminApi.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch {
      // Stats are non-critical
    }
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
      } = {
        page: currentPage,
        limit,
      };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;

      const response = await contactAdminApi.getMessages(params);

      if (response.success) {
        setMessages(response.data || []);
        if (response.pagination) {
          setTotalMessages(response.pagination.total);
          setTotalPages(response.pagination.totalPages);
        }
      } else {
        setError(response.message || "Failed to load messages");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter]);

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Fetch messages when filters change
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Open message detail (auto-marks as READ via API)
  const openMessage = async (msg: ContactMessage) => {
    try {
      const response = await contactAdminApi.getById(msg.id);
      if (response.success && response.data) {
        setSelectedMessage(response.data);
        setAdminNote(response.data.adminNote || "");
        setIsEditingNote(false);
        // Refresh list + stats if status changed
        if (msg.status === "NEW") {
          fetchMessages();
          fetchStats();
        }
      }
    } catch {
      setSelectedMessage(msg);
      setAdminNote(msg.adminNote || "");
    }
  };

  // Update status
  const handleStatusChange = async (id: string, status: string) => {
    try {
      setIsSaving(true);
      const response = await contactAdminApi.updateStatus(id, status);
      if (response.success && response.data) {
        setSelectedMessage(response.data);
        fetchMessages();
        fetchStats();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update status"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Save admin note
  const handleSaveNote = async () => {
    if (!selectedMessage) return;
    try {
      setIsSaving(true);
      const response = await contactAdminApi.addNote(
        selectedMessage.id,
        adminNote
      );
      if (response.success && response.data) {
        setSelectedMessage(response.data);
        setIsEditingNote(false);
        fetchMessages();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete message
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsSaving(true);
      await contactAdminApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      if (selectedMessage?.id === deleteTarget.id) {
        setSelectedMessage(null);
      }
      fetchMessages();
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message");
    } finally {
      setIsSaving(false);
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Format full date
  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Table columns
  const columns = [
    {
      key: "sender",
      header: "Sender",
      render: (msg: ContactMessage) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#000E51]/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-[#000E51]">
              {msg.firstName[0]}
              {msg.lastName?.[0] || ""}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {msg.firstName} {msg.lastName || ""}
              {msg.status === "NEW" && (
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full ml-2" />
              )}
            </p>
            <p className="text-xs text-gray-500 truncate">{msg.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      render: (msg: ContactMessage) => (
        <span className="text-sm text-gray-700">
          {subjectLabels[msg.subject] || msg.subject}
        </span>
      ),
    },
    {
      key: "message",
      header: "Message",
      render: (msg: ContactMessage) => (
        <p className="text-sm text-gray-500 truncate max-w-[200px]">
          {msg.message}
        </p>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (msg: ContactMessage) => (
        <Badge variant={statusBadgeVariant[msg.status] || "gray"} size="sm">
          {msg.status}
        </Badge>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (msg: ContactMessage) => (
        <span className="text-sm text-gray-500">
          {formatDate(msg.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (msg: ContactMessage) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openMessage(msg);
            }}
            className="text-[#FF6F00] hover:text-[#E86400] text-sm font-medium"
          >
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(msg);
            }}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Loading skeleton
  if (isLoading && messages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse"
            >
              <div className="h-3 bg-gray-200 rounded w-16 mb-3" />
              <div className="h-7 bg-gray-200 rounded w-12" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-2xl font-bold text-[#000E51]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
          <p className="text-xs text-blue-600 mb-1">New</p>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Read</p>
          <p className="text-2xl font-bold text-gray-600">{stats.read}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-green-100 shadow-sm">
          <p className="text-xs text-green-600 mb-1">Replied</p>
          <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-yellow-100 shadow-sm">
          <p className="text-xs text-yellow-600 mb-1">Archived</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.archived}
          </p>
        </div>
      </div>

      {/* Filters */}
      <AdminCard>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <AdminInput
              placeholder="Search by name, email, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
            />
          </div>
          <div className="w-full sm:w-40">
            <AdminSelect
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </AdminCard>

      {/* Messages Table */}
      <AdminCard padding="none">
        <DataTable
          columns={columns}
          data={messages}
          emptyMessage="No messages found"
          onRowClick={(msg: ContactMessage) => openMessage(msg)}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * limit + 1} to{" "}
              {Math.min(currentPage * limit, totalMessages)} of {totalMessages}
            </p>
            <div className="flex items-center gap-2">
              <AdminButton
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </AdminButton>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? "bg-[#000E51] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <AdminButton
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Next
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#000E51]">
                  Message from {selectedMessage.firstName}{" "}
                  {selectedMessage.lastName || ""}
                </h2>
                <p className="text-xs text-gray-500">
                  {formatFullDate(selectedMessage.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Sender Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Email</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-[#FF6F00] hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-sm text-[#FF6F00] hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Subject</p>
                  <p className="text-sm text-gray-900">
                    {subjectLabels[selectedMessage.subject] ||
                      selectedMessage.subject}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Status</p>
                  <Badge
                    variant={
                      statusBadgeVariant[selectedMessage.status] || "gray"
                    }
                    size="sm"
                  >
                    {selectedMessage.status}
                  </Badge>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMessage.status !== "NEW" && (
                    <AdminButton
                      variant="outline"
                      size="sm"
                      disabled={isSaving}
                      onClick={() =>
                        handleStatusChange(selectedMessage.id, "NEW")
                      }
                    >
                      Mark as New
                    </AdminButton>
                  )}
                  {selectedMessage.status !== "READ" && (
                    <AdminButton
                      variant="outline"
                      size="sm"
                      disabled={isSaving}
                      onClick={() =>
                        handleStatusChange(selectedMessage.id, "READ")
                      }
                    >
                      Mark as Read
                    </AdminButton>
                  )}
                  {selectedMessage.status !== "REPLIED" && (
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      disabled={isSaving}
                      onClick={() =>
                        handleStatusChange(selectedMessage.id, "REPLIED")
                      }
                    >
                      Mark as Replied
                    </AdminButton>
                  )}
                  {selectedMessage.status !== "ARCHIVED" && (
                    <AdminButton
                      variant="ghost"
                      size="sm"
                      disabled={isSaving}
                      onClick={() =>
                        handleStatusChange(selectedMessage.id, "ARCHIVED")
                      }
                    >
                      Archive
                    </AdminButton>
                  )}
                </div>
              </div>

              {/* Admin Note */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Admin Note</p>
                  {!isEditingNote && (
                    <button
                      onClick={() => setIsEditingNote(true)}
                      className="text-xs text-[#FF6F00] hover:text-[#E86400] font-medium"
                    >
                      {selectedMessage.adminNote ? "Edit" : "Add Note"}
                    </button>
                  )}
                </div>
                {isEditingNote ? (
                  <div className="space-y-2">
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/20 focus:border-[#FF6F00]"
                      placeholder="Add an internal note about this message..."
                    />
                    <div className="flex gap-2">
                      <AdminButton
                        size="sm"
                        disabled={isSaving}
                        onClick={handleSaveNote}
                      >
                        {isSaving ? "Saving..." : "Save Note"}
                      </AdminButton>
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingNote(false);
                          setAdminNote(selectedMessage.adminNote || "");
                        }}
                      >
                        Cancel
                      </AdminButton>
                    </div>
                  </div>
                ) : selectedMessage.adminNote ? (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-sm text-gray-700">
                    {selectedMessage.adminNote}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No admin note yet
                  </p>
                )}
              </div>

              {/* Delete */}
              <div className="pt-3 border-t border-gray-100">
                <AdminButton
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setDeleteTarget(selectedMessage);
                  }}
                >
                  Delete Message
                </AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          title="Delete Message"
          message={`Are you sure you want to delete the message from ${deleteTarget.firstName} ${deleteTarget.lastName || ""}? This action cannot be undone.`}
          confirmText="Delete"
          variant="danger"
          isLoading={isSaving}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
