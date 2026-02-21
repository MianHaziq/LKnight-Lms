"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface StartDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: string;
    title: string;
    description: string;
  }) => Promise<void>;
}

const categories = [
  { value: "team-wellness", label: "Team Wellness" },
  { value: "career-growth", label: "Career Growth" },
  { value: "mental-health", label: "Mental Health" },
  { value: "remote-work", label: "Remote Work" },
  { value: "performance", label: "Performance" },
  { value: "other", label: "Other" },
];

export default function StartDiscussionModal({
  isOpen,
  onClose,
  onSubmit,
}: StartDiscussionModalProps) {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !title || !description) return;

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ category, title, description });
      setCategory("");
      setTitle("");
      setDescription("");
      onClose();
    } catch {
      setError("Failed to post discussion. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[500px] bg-[#0A1628] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF6F00]/20 flex items-center justify-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="#FF6F00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-white text-base sm:text-lg font-semibold">
                Start a Discussion
              </h2>
              <p className="text-white/50 text-xs sm:text-sm">
                {isAdmin ? "Post as Admin" : "Share anonymously with the community"}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          {/* Category */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#000E51] border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm focus:outline-none focus:border-[#FF6F00] transition-colors cursor-pointer"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Discussion Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What would you like to discuss?"
              className="w-full bg-[#000E51] border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FF6F00] transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share more details about your question or experience..."
              rows={4}
              className="w-full bg-[#000E51] border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#FF6F00] transition-colors resize-none"
              required
            />
          </div>

          {/* Privacy Notice - Only show for non-admin users */}
          {!isAdmin && (
            <div className="flex items-start gap-2 sm:gap-3 bg-[#FF6F00]/10 rounded-lg p-3 sm:p-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5"
              >
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="11"
                  rx="2"
                  stroke="#FF6F00"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                  stroke="#FF6F00"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-white/60 text-xs leading-relaxed">
                Your identity is protected. Your post will be shared anonymously
                with other members. We never share your real identity.
              </p>
            </div>
          )}

          {/* Admin Notice */}
          {isAdmin && (
            <div className="flex items-start gap-2 sm:gap-3 bg-[#FF6F00]/10 rounded-lg p-3 sm:p-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#FF6F00"
                  strokeWidth="1.5"
                />
                <path d="M12 8V12" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="#FF6F00" />
              </svg>
              <p className="text-white/60 text-xs leading-relaxed">
                You are posting as <span className="text-[#FF6F00] font-medium">Admin</span>. Your post will be visible with the Admin badge.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#FF6F00] hover:bg-[#E56300] disabled:opacity-60 text-white font-semibold py-3 sm:py-3.5 rounded-lg transition-colors duration-200 text-sm sm:text-base cursor-pointer"
          >
            {submitting ? "Posting..." : isAdmin ? "Post Discussion" : "Post Discussion Anonymously"}
          </button>
        </form>
      </div>
    </div>
  );
}
