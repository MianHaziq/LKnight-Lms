"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiscussionCard from "@/components/vault/DiscussionCard";
import VaultSidebar from "@/components/vault/VaultSidebar";
import StartDiscussionModal from "@/components/vault/StartDiscussionModal";

const categories = [
  { id: "all", label: "All" },
  { id: "team-wellness", label: "Team Wellness" },
  { id: "career-growth", label: "Career Growth" },
  { id: "mental-health", label: "Mental Health" },
  { id: "remote-work", label: "Remote Work" },
  { id: "performance", label: "Performance" },
  { id: "other", label: "Other" },
];

const discussions = [
  {
    id: 1,
    category: "Team Wellness",
    categoryColor: "#FF6F00",
    timeAgo: "2 hours ago",
    title: "How do you handle team burnout during high-pressure periods?",
    description:
      "I've been noticing signs of burnout in my team after our recent product launch. Looking for practical strategies that worked for others.",
    author: "Anonymous Leader",
    upvotes: 24,
    comments: 12,
  },
  {
    id: 2,
    category: "Career Growth",
    categoryColor: "#3B82F6",
    timeAgo: "5 hours ago",
    title: "Transitioning from peer to manager - any advice?",
    description:
      "Just got promoted to lead my former team. Finding it challenging to establish authority while maintaining friendships.",
    author: "New Manager",
    upvotes: 31,
    comments: 18,
  },
  {
    id: 3,
    category: "Mental Health",
    categoryColor: "#8B5CF6",
    timeAgo: "1 day ago",
    title: "Dealing with imposter syndrome as a senior leader",
    description:
      "Even after 10 years in leadership roles, I still sometimes feel like I'm not qualified. How do you overcome these feelings?",
    author: "Seasoned Executive",
    upvotes: 67,
    comments: 25,
  },
  {
    id: 4,
    category: "Remote Work",
    categoryColor: "#10B981",
    timeAgo: "1 day ago",
    title: "Remote team engagement strategies that actually work",
    description:
      "Our remote team feels disconnected. Virtual happy hours aren't cutting it. What creative solutions have you found?",
    author: "Remote Leader",
    upvotes: 45,
    comments: 32,
  },
  {
    id: 5,
    category: "Performance",
    categoryColor: "#F59E0B",
    timeAgo: "2 days ago",
    title: "Having difficult conversations about performance",
    description:
      "I need to address underperformance with a team member I really like personally. How do you separate the personal from professional?",
    author: "Empathetic Manager",
    upvotes: 38,
    comments: 21,
  },
];

export default function VaultPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartDiscussion = (data: {
    category: string;
    title: string;
    description: string;
  }) => {
    console.log("New discussion:", data);
    // Here you would typically send this to your backend
  };

  const filteredDiscussions =
    selectedCategory === "all"
      ? discussions
      : discussions.filter(
          (d) =>
            d.category.toLowerCase().replace(" ", "-") === selectedCategory
        );

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
      <section className="w-full bg-[#0F172A] py-8 lg:py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Discussion Feed */}
            <div className="flex-1">
              {/* Start Discussion Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#1E293B] hover:bg-[#2D3B4F] border border-white/10 rounded-xl p-4 lg:p-5 flex items-center gap-3 transition-colors duration-200 mb-6"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF6F00]/20 flex items-center justify-center">
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
                <span className="text-white/50 text-sm lg:text-base">
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
                        ? "bg-[#000E51] text-white"
                        : "bg-[#1E293B] text-white/60 hover:bg-[#2D3B4F] hover:text-white/80"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Discussion Cards */}
              <div className="space-y-4">
                {filteredDiscussions.map((discussion) => (
                  <DiscussionCard
                    key={discussion.id}
                    category={discussion.category}
                    categoryColor={discussion.categoryColor}
                    timeAgo={discussion.timeAgo}
                    title={discussion.title}
                    description={discussion.description}
                    author={discussion.author}
                    upvotes={discussion.upvotes}
                    comments={discussion.comments}
                  />
                ))}
              </div>
            </div>

            {/* Right - Sidebar */}
            <div className="w-full lg:w-[320px] flex-shrink-0">
              <VaultSidebar />
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
