"use client";

import { useState, useRef, useEffect } from "react";
import TeamMemberCard from "./TeamMemberCard";
import { teamApi, TeamMember } from "@/lib/api";

export default function MeetTheTeam() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await teamApi.getAll();
        if (response.success && response.data) {
          setTeamMembers(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch team members:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360; // Card width + gap
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Check scroll position after animation
      setTimeout(checkScrollPosition, 350);
    }
  };

  // Don't render section if no team members and done loading
  if (!isLoading && teamMembers.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-16 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header with Navigation Arrows */}
        <div className="flex items-center justify-between mb-8 lg:mb-10">
          <h2 className="text-[#000E51] text-xl sm:text-2xl lg:text-[28px] font-bold">
            Meet the Team
          </h2>

          {/* Navigation Arrows */}
          {!isLoading && teamMembers.length > 3 && (
            <div className="flex items-center gap-2">
              {/* Left Arrow */}
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-10 h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  canScrollLeft
                    ? "bg-white border border-gray-200 hover:border-[#000E51] text-[#64748B] hover:text-[#000E51]"
                    : "bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed"
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`w-10 h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  canScrollRight
                    ? "bg-[#000E51] hover:bg-[#001070] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="flex gap-5 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[340px] rounded-xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="w-full h-[260px] sm:h-[280px] lg:h-[300px] bg-gray-200" />
                <div className="p-4 lg:p-5 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Team Cards Slider */
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-5 lg:gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                image={member.image}
                name={member.name}
                role={member.role}
                description={member.description || ""}
                email={member.email}
                facebook={member.facebook}
                linkedin={member.linkedin}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
