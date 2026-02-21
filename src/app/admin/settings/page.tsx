"use client";

import { useState } from "react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";
import AdminSelect from "@/components/admin/AdminSelect";
import Badge from "@/components/admin/Badge";

interface Settings {
  siteName: string;
  contactEmail: string;
  supportEmail: string;
  currency: string;
  defaultCourseStatus: string;
  enrollmentNotifications: boolean;
  marketingEmails: boolean;
  maintenanceMode: boolean;
}

const currencyOptions = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "PKR", label: "PKR - Pakistani Rupee" },
  { value: "INR", label: "INR - Indian Rupee" },
];

const courseStatusOptions = [
  { value: "draft", label: "Draft (Hidden until published)" },
  { value: "published", label: "Published (Visible immediately)" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "LKnight LMS",
    contactEmail: "contact@lknight.com",
    supportEmail: "support@lknight.com",
    currency: "USD",
    defaultCourseStatus: "draft",
    enrollmentNotifications: true,
    marketingEmails: false,
    maintenanceMode: false,
  });

  const [logo, setLogo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSaved(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
  };

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

      {/* General Settings */}
      <AdminCard
        title="General Settings"
        subtitle="Basic information about your LMS"
      >
        <div className="space-y-3 sm:space-y-4">
          <AdminInput
            label="Site Name"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            placeholder="Your LMS Name"
          />

          {/* Logo Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-medium text-gray-700">
              Site Logo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                {logo ? (
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-lg">LK</span>
                  </div>
                )}
              </div>
              <div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors">
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Upload Logo
                  </span>
                </label>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                  PNG or JPG, max 1MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Contact Settings */}
      <AdminCard
        title="Contact Information"
        subtitle="Email addresses for communication"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <AdminInput
            label="Contact Email"
            name="contactEmail"
            type="email"
            value={settings.contactEmail}
            onChange={handleChange}
            placeholder="contact@example.com"
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
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />
          <AdminInput
            label="Support Email"
            name="supportEmail"
            type="email"
            value={settings.supportEmail}
            onChange={handleChange}
            placeholder="support@example.com"
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
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            }
          />
        </div>
      </AdminCard>

      {/* Course Settings */}
      <AdminCard
        title="Course Settings"
        subtitle="Default settings for courses"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <AdminSelect
            label="Default Currency"
            name="currency"
            options={currencyOptions}
            value={settings.currency}
            onChange={handleChange}
          />
          <AdminSelect
            label="Default Course Status"
            name="defaultCourseStatus"
            options={courseStatusOptions}
            value={settings.defaultCourseStatus}
            onChange={handleChange}
          />
        </div>
      </AdminCard>

      {/* Notification Settings */}
      <AdminCard
        title="Notifications"
        subtitle="Configure email notifications"
      >
        <div className="space-y-3 sm:space-y-4">
          {/* Toggle Items */}
          <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 gap-3">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                Enrollment Notifications
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Receive email when a user enrolls in a course
              </p>
            </div>
            <button
              onClick={() => handleToggle("enrollmentNotifications")}
              className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors duration-200 shrink-0 ${
                settings.enrollmentNotifications
                  ? "bg-primary"
                  : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  settings.enrollmentNotifications
                    ? "translate-x-5 sm:translate-x-7"
                    : "translate-x-0.5 sm:translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 gap-3">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Marketing Emails</p>
              <p className="text-xs sm:text-sm text-gray-500">
                Send promotional emails to users
              </p>
            </div>
            <button
              onClick={() => handleToggle("marketingEmails")}
              className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors duration-200 shrink-0 ${
                settings.marketingEmails ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  settings.marketingEmails
                    ? "translate-x-5 sm:translate-x-7"
                    : "translate-x-0.5 sm:translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </AdminCard>

      {/* Danger Zone */}
      <AdminCard
        title="Danger Zone"
        subtitle="Irreversible and destructive actions"
        className="border-red-200"
      >
        <div className="space-y-3 sm:space-y-4">
          {/* Maintenance Mode */}
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
              className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors duration-200 shrink-0 ${
                settings.maintenanceMode ? "bg-yellow-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  settings.maintenanceMode
                    ? "translate-x-5 sm:translate-x-7"
                    : "translate-x-0.5 sm:translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Clear Cache */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 gap-3">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm sm:text-base">Clear Cache</p>
              <p className="text-xs sm:text-sm text-gray-500">
                Clear all cached data. This may temporarily slow down the site.
              </p>
            </div>
            <AdminButton variant="outline" size="sm" className="self-start sm:self-auto shrink-0">
              Clear Cache
            </AdminButton>
          </div>

          {/* Delete All Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-red-50 rounded-lg sm:rounded-xl border border-red-200 gap-3">
            <div className="min-w-0">
              <p className="font-medium text-red-700 text-sm sm:text-base">Delete All Data</p>
              <p className="text-xs sm:text-sm text-red-500">
                Permanently delete all courses, users, and data. This cannot be
                undone.
              </p>
            </div>
            <AdminButton variant="danger" size="sm" className="self-start sm:self-auto shrink-0">
              Delete All
            </AdminButton>
          </div>
        </div>
      </AdminCard>

      {/* System Info */}
      <AdminCard title="System Information" subtitle="Technical details">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
            <p className="text-[10px] sm:text-xs text-gray-500">Version</p>
            <p className="text-xs sm:text-sm font-medium text-gray-900">1.0.0</p>
          </div>
          <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
            <p className="text-[10px] sm:text-xs text-gray-500">Framework</p>
            <p className="text-xs sm:text-sm font-medium text-gray-900">Next.js 16</p>
          </div>
          <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
            <p className="text-[10px] sm:text-xs text-gray-500">Database</p>
            <p className="text-xs sm:text-sm font-medium text-gray-900">PostgreSQL</p>
          </div>
          <div className="p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
            <p className="text-[10px] sm:text-xs text-gray-500">Environment</p>
            <p className="text-xs sm:text-sm font-medium text-gray-900">Development</p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
