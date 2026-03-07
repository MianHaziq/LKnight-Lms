"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "./Button";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/courses?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/courses");
    }
  };

  return (
    <section className="relative">
      {/* Hero Background Section */}
      <div className="relative">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/hero.jpg')" }}
          />
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, #1D3A63E5 0%, #1D3A63CC 50%, #1D3A63F2 100%)",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-12 pt-28 sm:pt-32 lg:pt-36 pb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#FF6F001A] backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-4 sm:mb-6">
            <span className="text-base sm:text-lg">🎓</span>
            <span className="text-white text-xs sm:text-sm font-medium">
              Learn from the Best, Achieve Your Best
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-4 sm:mb-6 px-2">
            <span className="text-white">Unlock Your Potential with</span>
            <br />
            <span className="text-secondary">LKnight LMS</span>
          </h1>

          {/* Description */}
          <p className="text-white/80 text-center text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-lg lg:max-w-2xl mb-6 sm:mb-8 px-2">
            Join thousands of learners and gain access to world-class courses,
            expertly designed to help you master new skills and advance your
            career.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto px-4 sm:px-0">
            <Button href="/courses">Browse Courses</Button>
            <Button
              href="/courses"
              bgColor="bg-transparent"
              textColor="text-white"
              showArrow={false}
              className="border-2 border-white/30 hover:border-white/50 hover:bg-white/10"
            >
              Subscribe Now
            </Button>
          </div>

          {/* Search Bar Section */}
          <div className="w-full mt-16 px-0 sm:px-2">
            <div className="max-w-5xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 lg:p-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="sm:w-5 sm:h-5"
                    >
                      <path
                        d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
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
                    placeholder="Search courses, instructors, or skills..."
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full sm:w-40 px-6 sm:px-8 py-3 sm:py-3.5 bg-secondary text-white text-sm sm:text-base font-semibold rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Transition Section */}
      <div className="relative h-32 sm:h-40 lg:h-48">
        {/* Background extends into wave area */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/hero.jpg')" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "#1D3A63F2",
            }}
          />
        </div>

        {/* Go Live Button - Navigate to Vault */}
        <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 right-4 sm:right-8 lg:right-12 z-20">
          <Link href="/vault" className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
            <span className="text-primary font-medium text-sm">Go live</span>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="3" fill="white" />
                <path
                  d="M8.5 8.5C7.5 9.5 7 10.7 7 12C7 13.3 7.5 14.5 8.5 15.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M15.5 8.5C16.5 9.5 17 10.7 17 12C17 13.3 16.5 14.5 15.5 15.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M5.5 5.5C3.8 7.2 3 9.5 3 12C3 14.5 3.8 16.8 5.5 18.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M18.5 5.5C20.2 7.2 21 9.5 21 12C21 14.5 20.2 16.8 18.5 18.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
