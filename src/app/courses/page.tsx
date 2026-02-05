"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedCoursesSection from "@/components/FeaturedCoursesSection";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Header Section */}
      <div className="bg-[#000E51] pt-16 pb-20 px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-white mb-4 leading-tight">
            Executive Course{" "}
            <span className="text-[#FF6F00]">Catalog</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Designed for leaders seeking to strengthen strategic thinking, decision-making, and
            organizational impact through practical, executive-level learning.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Start courses..."
                className="w-full bg-white rounded-lg py-4 pl-12 pr-4 text-gray-700 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Orange Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6F00]" />
      </div>

      {/* Featured Courses Section */}
      <FeaturedCoursesSection
        title="Featured Courses"
        subtitle="Our most popular courses loved by thousands of learners"
        showViewAll={true}
        viewAllHref="/courses/all"
      />

      <Footer />
    </div>
  );
}
