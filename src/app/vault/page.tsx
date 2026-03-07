"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiscussionCard from "@/components/vault/DiscussionCard";
import VaultSidebar from "@/components/vault/VaultSidebar";
import StartDiscussionModal from "@/components/vault/StartDiscussionModal";
import { useAuth } from "@/context/AuthContext";
import { vaultApi, type VaultDiscussion } from "@/lib/api";

const categories = [
  { id: "all", label: "All" },
  { id: "team-wellness", label: "Team Wellness" },
  { id: "career-growth", label: "Career Growth" },
  { id: "mental-health", label: "Mental Health" },
  { id: "remote-work", label: "Remote Work" },
  { id: "performance", label: "Performance" },
  { id: "other", label: "Other" },
];

export default function VaultPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discussions, setDiscussions] = useState<VaultDiscussion[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [statsKey, setStatsKey] = useState(0);
  const lastPollTimeRef = useRef<string>(new Date().toISOString());

  // Auth gate — redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin?redirect=/vault");
    }
  }, [user, authLoading, router]);

  // Fetch discussions
  const fetchDiscussions = useCallback(
    async (cursor?: string) => {
      try {
        if (cursor) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const res = await vaultApi.getDiscussions({
          category: selectedCategory,
          cursor,
          limit: 10,
        });

        if (res.success && res.data) {
          if (cursor) {
            setDiscussions((prev) => [...prev, ...res.data!.discussions]);
          } else {
            setDiscussions(res.data.discussions);
            // Reset poll time to now when fresh data is loaded
            lastPollTimeRef.current = new Date().toISOString();
          }
          setNextCursor(res.data.nextCursor);
        }
      } catch {
        // silently fail — user sees empty state
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory]
  );

  // Reset and re-fetch when category changes
  useEffect(() => {
    if (user) {
      setDiscussions([]);
      setNextCursor(null);
      fetchDiscussions();
    }
  }, [selectedCategory, user, fetchDiscussions]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !nextCursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loadingMore) {
          fetchDiscussions(nextCursor);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [nextCursor, loadingMore, fetchDiscussions]);

  // Poll for new discussions every 5 seconds (only updates message section)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const res = await vaultApi.pollDiscussions({
          since: lastPollTimeRef.current,
          category: selectedCategory,
        });
        if (res.success && res.data && res.data.discussions.length > 0) {
          setDiscussions((prev) => {
            const existingIds = new Set(prev.map((d) => d.id));
            const newOnes = res.data!.discussions.filter((d) => !existingIds.has(d.id));
            return newOnes.length > 0 ? [...newOnes, ...prev] : prev;
          });
          lastPollTimeRef.current = new Date().toISOString();
        }
      } catch {
        // silently fail — polling is non-critical
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user, selectedCategory]);

  // Handle new discussion created — errors propagate to modal for display
  const handleStartDiscussion = async (data: {
    category: string;
    title: string;
    description: string;
  }) => {
    const res = await vaultApi.createDiscussion(data);
    if (res.success && res.data) {
      setDiscussions((prev) => [res.data!, ...prev]);
      setStatsKey((k) => k + 1);
      lastPollTimeRef.current = new Date().toISOString();
    }
  };

  // Handle like toggle from a discussion card
  const handleLikeToggle = (discussionId: string, isLiked: boolean, likesCount: number) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId ? { ...d, isLiked, likesCount } : d
      )
    );
  };

  // Handle discussion deleted
  const handleDelete = (discussionId: string) => {
    setDiscussions((prev) => prev.filter((d) => d.id !== discussionId));
    setStatsKey((k) => k + 1);
  };

  // Show nothing until auth check completes
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full bg-[#000E51] py-12 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-[700px] mx-auto">
            {/* The Vault Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
              <span className="text-white/80 text-sm font-medium">
                The Vault
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-white text-2xl sm:text-3xl lg:text-[42px] font-bold leading-tight mb-4">
              Private <span className="text-[#FF6F00]">Leadership</span>{" "}
              Community
            </h1>

            {/* Subtext */}
            <p className="text-white/70 text-sm sm:text-base lg:text-[16px] leading-relaxed mb-6 max-w-[580px] mx-auto">
              A psychologically safe space for leaders to share experiences,
              challenges, and wisdom anonymously. Your identity is protected,
              your growth is supported.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-white text-xs font-medium">
                  Anonymous Posting
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[#FF6F00] rounded-full px-4 py-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12L11 14L15 10"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-white text-xs font-medium">
                  Members Only
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V12L15 15"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-white text-xs font-medium">
                  Moderated
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full bg-[#f8f9fc] py-8 lg:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Discussion Feed */}
            <div className="flex-1">
              {/* Start Discussion Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 lg:p-5 flex items-center gap-3 transition-colors duration-200 mb-6 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF6F00]/10 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
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
                <span className="text-gray-400 text-sm lg:text-base">
                  Start a new discussion...
                </span>
              </button>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === cat.id
                        ? "bg-[#000E51] text-white shadow-sm"
                        : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 border border-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Discussion Cards */}
              <div className="space-y-4">
                {loading ? (
                  // Skeleton loaders
                  Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-5 lg:p-6 animate-pulse border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-6 w-24 bg-gray-100 rounded-md" />
                        <div className="h-4 w-16 bg-gray-50 rounded" />
                      </div>
                      <div className="h-5 w-3/4 bg-gray-100 rounded mb-2" />
                      <div className="h-4 w-full bg-gray-50 rounded mb-4" />
                      <div className="flex justify-between">
                        <div className="h-4 w-20 bg-gray-50 rounded" />
                        <div className="h-4 w-24 bg-gray-50 rounded" />
                      </div>
                    </div>
                  ))
                ) : discussions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#FF6F00]/10 flex items-center justify-center mx-auto mb-4">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                          stroke="#FF6F00"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">
                      No discussions yet
                    </p>
                    <p className="text-gray-400 text-xs">
                      Be the first to start a conversation!
                    </p>
                  </div>
                ) : (
                  discussions.map((discussion) => (
                    <DiscussionCard
                      key={discussion.id}
                      discussion={discussion}
                      onLikeToggle={handleLikeToggle}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>

              {/* Infinite scroll trigger & loading indicator */}
              {nextCursor && (
                <div
                  ref={observerRef}
                  className="flex items-center justify-center py-6"
                >
                  {loadingMore && (
                    <div className="w-6 h-6 border-2 border-[#FF6F00] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              )}
            </div>

            {/* Right - Sidebar */}
            <div className="w-full lg:w-[320px] flex-shrink-0">
              <VaultSidebar key={statsKey} />
            </div>
          </div>
        </div>
      </section>

      {/* Start Discussion Modal */}
      <StartDiscussionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleStartDiscussion}
      />

      <Footer />
    </div>
  );
}
