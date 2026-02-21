"use client";

import { useState, useRef, useEffect } from "react";
import Button from "./Button";

const categories = [
  { value: "", label: "Search By Category" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "development", label: "Development" },
  { value: "finance", label: "Finance" },
];

export default function HeroSection() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategorySelect = (category: typeof categories[0]) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  return (
    <section className="relative">
      {/* Hero Background Section */}
      <div className="relative">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/icon/bg.jpg')" }}
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
              bgColor="bg-transparent"
              textColor="text-white"
              showArrow={false}
              className="border-2 border-white/30 hover:border-white/50 hover:bg-white/10"
            >
              Subscribe Now
            </Button>
          </div>

          {/* Search Bar Section - 62px below CTA buttons */}
          <div className="w-full mt-16 px-0 sm:px-2">
            <div className="max-w-5xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Desktop: Row layout */}
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
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
                      placeholder="Search courses, instructors, or skills..."
                      className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 border border-gray-200 rounded-lg text-sm sm:text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary"
                    />
                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="sm:w-4 sm:h-4"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Category Dropdown - Custom Styled */}
                  <div className="w-full lg:w-56 relative" ref={categoryRef}>
                    {/* Dropdown Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 sm:py-3.5 border rounded-lg text-sm sm:text-base font-medium bg-white cursor-pointer transition-all duration-200 ${
                        isCategoryOpen
                          ? "border-secondary ring-2 ring-secondary/50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${selectedCategory.value ? "text-primary" : "text-secondary"}`}
                    >
                      <span>{selectedCategory.label}</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`sm:w-4 sm:h-4 text-gray-400 transition-transform duration-300 ${
                          isCategoryOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 transition-all duration-300 origin-top ${
                        isCategoryOpen
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="py-2">
                        {categories.map((category, index) => (
                          <button
                            key={category.value || "default"}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className={`w-full px-4 py-3 text-left text-sm sm:text-base transition-all duration-200 flex items-center gap-3 ${
                              selectedCategory.value === category.value
                                ? "bg-secondary/10 text-secondary font-semibold"
                                : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                            } ${index === 0 ? "border-b border-gray-100" : ""}`}
                          >
                            {/* Category Icon */}
                            {category.value && (
                              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                {category.value === "business" && (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {category.value === "technology" && (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                                    <path d="M12 18H12.01M7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {category.value === "design" && (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                                    <path d="M12 19L19 12L22 15L15 22L12 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18 13L16.5 5.5L2 2L5.5 16.5L13 18L18 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 2L9.586 9.586" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="11" cy="11" r="2" stroke="currentColor" strokeWidth="2"/>
                                  </svg>
                                )}
                                {category.value === "marketing" && (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {category.value === "development" && (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                                    <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                {category.value === "finance" && (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                                    <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </span>
                            )}
                            <span>{category.label}</span>
                            {/* Checkmark for selected */}
                            {selectedCategory.value === category.value && category.value && (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="ml-auto text-secondary"
                              >
                                <path
                                  d="M20 6L9 17L4 12"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <button className="w-full lg:w-40 px-6 sm:px-8 py-3 sm:py-3.5 bg-secondary text-white text-sm sm:text-base font-semibold rounded-lg hover:opacity-90 transition-all duration-200">
                    Search
                  </button>
                </div>
              </div>
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
            style={{ backgroundImage: "url('/icon/bg.jpg')" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "#1D3A63F2",
            }}
          />
        </div>



        {/* Go Live Button - positioned in wave area */}
        <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 right-4 sm:right-8 lg:right-12 z-20">
          <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
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
          </button>
        </div>
      </div>
    </section>
  );
}
