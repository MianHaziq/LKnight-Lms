"use client";

import { useState, useEffect } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import Badge from "@/components/admin/Badge";
import { settingsApi, authApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface SettingsState {
  maintenanceMode: boolean;
  hiddenPages: string[];
}

const navPages = [
  { id: "vault", label: "The Vault", description: "Anonymous leadership discussion forum" },
  { id: "platform", label: "Platform", description: "Platform dropdown menu in navbar" },
  { id: "enterprise", label: "Enterprise", description: "Enterprise dropdown menu in navbar" },
  { id: "courses", label: "Courses", description: "Courses page link in navbar" },
  { id: "pricing", label: "Pricing", description: "Pricing page link in navbar" },
  { id: "about", label: "About", description: "About page link in navbar" },
  { id: "contact", label: "Contact", description: "Contact page link in navbar" },
];

export default function SettingsPage() {
  const { user } = useAuth();

  const [settings, setSettings] = useState<SettingsState>({
    maintenanceMode: false,
    hiddenPages: [],
  });

  // Admin profile
  const [adminProfile, setAdminProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsApi.getSettings();
        if (res.success && res.data) {
          setSettings({
            maintenanceMode: res.data.maintenanceMode,
            hiddenPages: res.data.hiddenPages || [],
          });
        }
      } catch {
        // Use defaults if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Load admin profile from auth context
  useEffect(() => {
    if (user) {
      setAdminProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handlePageToggle = (pageId: string) => {
    setSettings((prev) => {
      const isHidden = prev.hiddenPages.includes(pageId);
      return {
        ...prev,
        hiddenPages: isHidden
          ? prev.hiddenPages.filter((p) => p !== pageId)
          : [...prev.hiddenPages, pageId],
      };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await settingsApi.updateSettings({
        maintenanceMode: settings.maintenanceMode,
        hiddenPages: settings.hiddenPages,
      });
      if (res.success) {
        setSaved(true);
      }
    } catch {
      // fail silently
    } finally {
      setSaving(false);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({ ...prev, [name]: value }));
    setProfileSaved(false);
  };

  const handleProfileSave = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile(user.id, {
        firstName: adminProfile.firstName,
        lastName: adminProfile.lastName,
      });
      if (res.success) {
        setProfileSaved(true);
      }
    } catch {
      // fail silently
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handlePasswordSave = async () => {
    if (!user) return;
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError("Both current and new password are required");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await authApi.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        setPasswordSuccess(true);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-outfit">
            Settings
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Configure your LMS platform settings
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {saved && (
            <Badge variant="success" size="sm">
              Saved
            </Badge>
          )}
          <AdminButton
            variant="secondary"
            onClick={handleSave}
            disabled={saving}
            size="sm"
            icon={
              saving ? (
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
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
              ) : (
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
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              )
            }
          >
            {saving ? "Saving..." : "Save Changes"}
          </AdminButton>
        </div>
      </div>

      {/* Admin Details */}
      <AdminCard
        title="Admin Details"
        subtitle="Your admin account information"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AdminInput
              label="First Name"
              name="firstName"
              value={adminProfile.firstName}
              onChange={handleProfileChange}
              placeholder="First Name"
            />
            <AdminInput
              label="Last Name"
              name="lastName"
              value={adminProfile.lastName}
              onChange={handleProfileChange}
              placeholder="Last Name"
            />
          </div>
          <AdminInput
            label="Email"
            name="email"
            type="email"
            value={adminProfile.email}
            onChange={() => {}}
            placeholder="admin@example.com"
            disabled
          />
          <div className="flex items-center gap-3">
            <AdminButton
              variant="secondary"
              onClick={handleProfileSave}
              disabled={savingProfile}
              size="sm"
            >
              {savingProfile ? "Saving..." : "Update Profile"}
            </AdminButton>
            {profileSaved && (
              <Badge variant="success" size="sm">
                Profile Updated
              </Badge>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Change Password */}
      <AdminCard
        title="Change Password"
        subtitle="Update your admin password"
      >
        <div className="space-y-4">
          <AdminInput
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <AdminInput
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />
            <AdminInput
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
            />
          </div>
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-green-600">Password changed successfully</p>
          )}
          <AdminButton
            variant="secondary"
            onClick={handlePasswordSave}
            disabled={savingPassword}
            size="sm"
          >
            {savingPassword ? "Changing..." : "Change Password"}
          </AdminButton>
        </div>
      </AdminCard>

      {/* Page Visibility */}
      <AdminCard
        title="Page Visibility"
        subtitle="Show or hide pages from the navigation bar"
      >
        <div className="space-y-1">
          {navPages.map((page) => {
            const isVisible = !settings.hiddenPages.includes(page.id);
            return (
              <div
                key={page.id}
                className="flex items-center justify-between py-2.5 sm:py-3 border-b border-gray-100 last:border-0 gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {page.label}
                    </p>
                    {!isVisible && (
                      <Badge variant="warning" size="sm">
                        Hidden
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {page.description}
                  </p>
                </div>
                <button
                  onClick={() => handlePageToggle(page.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 ${
                    isVisible ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      isVisible ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </AdminCard>

      {/* Maintenance Mode */}
      <AdminCard
        title="Maintenance Mode"
        subtitle="Control site availability"
        className="border-yellow-200"
      >
        <div className="flex items-center justify-between p-3 sm:p-4 bg-yellow-50 rounded-lg sm:rounded-xl border border-yellow-200 gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Maintenance Mode</p>
              {settings.maintenanceMode && (
                <Badge variant="warning" size="sm">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Put the site in maintenance mode. Users will see a maintenance
              page.
            </p>
          </div>
          <button
            onClick={() => handleToggle("maintenanceMode")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0 ${
              settings.maintenanceMode ? "bg-yellow-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </AdminCard>
    </div>
  );
}
