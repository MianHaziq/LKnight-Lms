"use client";

import { useState, useEffect, useCallback } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import AdminSelect from "@/components/admin/AdminSelect";
import Badge from "@/components/admin/Badge";
import DataTable from "@/components/admin/DataTable";
import { userApi, UserDetails } from "@/lib/api";

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "ADMIN", label: "Admin" },
  { value: "INSTRUCTOR", label: "Instructor" },
  { value: "STUDENT", label: "Student" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

interface UserStats {
  total: number;
  students: number;
  instructors: number;
  admins: number;
  active: number;
  inactive: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, students: 0, instructors: 0, admins: 0, active: 0, inactive: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserDetails | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get initials from user name
  const getInitials = (user: UserDetails) => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  // Get full name
  const getFullName = (user: UserDetails) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
      } = {
        page: currentPage,
        limit,
      };

      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const response = await userApi.getAll(params);

      if (response.data) {
        setUsers(Array.isArray(response.data) ? response.data : []);
        // Handle pagination from response
        if (response.pagination) {
          setTotalUsers(response.pagination.total || 0);
          setTotalPages(response.pagination.totalPages || 1);
        } else if (response.count) {
          setTotalUsers(response.count);
          setTotalPages(Math.ceil(response.count / limit));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, roleFilter, statusFilter]);

  // Fetch user stats
  const fetchStats = async () => {
    try {
      const response = await userApi.getStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Toggle user status
  const handleToggleStatus = async (user: UserDetails) => {
    try {
      setIsSaving(true);
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await userApi.toggleStatus(user.id, newStatus as 'ACTIVE' | 'INACTIVE');
      setSelectedUser(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete user via custom confirmation dialog
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      setError(null);
      await userApi.delete(userToDelete.id);
      setSelectedUser((current) =>
        current && current.id === userToDelete.id ? null : current
      );
      setUserToDelete(null);
      // Refresh list and stats
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch users when filters or page changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  const columns = [
    {
      key: "name",
      header: "User",
      render: (user: UserDetails) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              user.role === "ADMIN"
                ? "bg-purple-100 text-purple-700"
                : user.role === "INSTRUCTOR"
                ? "bg-blue-100 text-blue-700"
                : "bg-primary/10 text-primary"
            }`}
          >
            <span className="text-sm font-semibold">{getInitials(user)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 text-sm">{getFullName(user)}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (user: UserDetails) => (
        <Badge
          variant={
            user.role === "ADMIN"
              ? "secondary"
              : user.role === "INSTRUCTOR"
              ? "primary"
              : "gray"
          }
          size="sm"
        >
          {formatRole(user.role || 'STUDENT')}
        </Badge>
      ),
    },
    {
      key: "enrolledCourses",
      header: "Courses",
      sortable: true,
      className: "hidden md:table-cell",
      render: (user: UserDetails) => (
        <span className="text-gray-600 text-sm">
          {(user.enrolledCourses ?? 0) > 0 ? user.enrolledCourses : "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (user: UserDetails) => (
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              user.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span
            className={`text-sm ${
              user.status === "ACTIVE" ? "text-green-600" : "text-gray-500"
            }`}
          >
            {formatStatus(user.status || 'ACTIVE')}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      className: "hidden lg:table-cell",
      render: (user: UserDetails) => (
        <span className="text-gray-500 text-sm">
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "-"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (user: UserDetails) => (
        <div className="flex items-center justify-end gap-1.5">
          <AdminButton
            variant="ghost"
            size="sm"
            onClick={() => setSelectedUser(user)}
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
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          >
            View
          </AdminButton>
          <AdminButton
            variant="danger"
            size="sm"
            onClick={() => setUserToDelete(user)}
            disabled={isDeleting}
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
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            }
          >
            Delete
          </AdminButton>
        </div>
      ),
    },
  ];

  // Loading skeleton
  if (isLoading && users.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
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
            User Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            View and manage all registered users
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-primary mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Students</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.students}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Instructors</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{stats.instructors}</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AdminCard padding="md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <AdminInput
              placeholder="Search by name or email..."
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
            options={roleOptions}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            placeholder="Role"
          />
          <AdminSelect
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="Status"
          />
        </div>
      </AdminCard>

      {/* Users Table */}
      <AdminCard padding="none">
        <DataTable
          columns={columns}
          data={users}
          emptyMessage="No users found matching your criteria"
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {users.length} of {totalUsers} users
            {(searchQuery || roleFilter || statusFilter) && " (filtered)"}
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

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
                    selectedUser.role === "ADMIN"
                      ? "bg-purple-100 text-purple-700"
                      : selectedUser.role === "INSTRUCTOR"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <span className="text-base sm:text-xl font-bold">{getInitials(selectedUser)}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                    {getFullName(selectedUser)}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sm:w-5 sm:h-5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Role</span>
                <Badge
                  variant={
                    selectedUser.role === "ADMIN"
                      ? "secondary"
                      : selectedUser.role === "INSTRUCTOR"
                      ? "primary"
                      : "gray"
                  }
                  size="sm"
                >
                  {formatRole(selectedUser.role || 'STUDENT')}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Status</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      selectedUser.status === "ACTIVE"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                  <span className="text-xs sm:text-sm font-medium">
                    {formatStatus(selectedUser.status || 'ACTIVE')}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Enrolled Courses</span>
                <span className="text-xs sm:text-sm font-medium">
                  {selectedUser.enrolledCourses ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100">
                <span className="text-xs sm:text-sm text-gray-500">Joined</span>
                <span className="text-xs sm:text-sm font-medium">
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
              <AdminButton
                variant="outline"
                className="flex-1"
                size="sm"
                onClick={() => setSelectedUser(null)}
                disabled={isSaving}
              >
                Close
              </AdminButton>
              {selectedUser.status === "ACTIVE" ? (
                <AdminButton
                  variant="secondary"
                  className="flex-1"
                  size="sm"
                  onClick={() => handleToggleStatus(selectedUser)}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Deactivate"}
                </AdminButton>
              ) : (
                <AdminButton
                  variant="primary"
                  className="flex-1"
                  size="sm"
                  onClick={() => handleToggleStatus(selectedUser)}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Activate"}
                </AdminButton>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {userToDelete && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => !isDeleting && setUserToDelete(null)}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl max-w-sm w-full p-4 sm:p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  Delete user account?
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-gray-500">
                  This will permanently remove{" "}
                  <span className="font-medium text-gray-800">
                    {getFullName(userToDelete)}
                  </span>{" "}
                  and all related data, including subscriptions, enrollments, and Vault activity. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row-reverse gap-2 sm:gap-3 mt-3 sm:mt-4">
              <AdminButton
                variant="danger"
                className="flex-1"
                size="sm"
                onClick={handleDeleteUser}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete user"}
              </AdminButton>
              <AdminButton
                variant="outline"
                className="flex-1"
                size="sm"
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
