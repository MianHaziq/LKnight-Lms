"use client";

import TransitionLink from "./TransitionLink";

export default function CTASection() {
  return (
    <section
      className="w-full py-14 lg:py-16"
      style={{
        background:
          "linear-gradient(135deg, #FFF8F0 0%, #FFF4E8 50%, #FFEEDD 100%)",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col items-center text-center">
          {/* Heading */}
          <h2 className="text-[#000E51] text-xl sm:text-2xl lg:text-[28px] font-bold mb-6">
            Start Today, Lead Tomorrow with LKnight.
          </h2>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* View Pricing Plans Button */}
            <TransitionLink
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF6F00] hover:bg-[#E56300] text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-[0_4px_14px_rgba(255,111,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,111,0,0.4)]"
            >
              View Pricing Plans
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </TransitionLink>

            {/* Explore Courses Button */}
            <TransitionLink
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-[#000E51] text-[#000E51] text-sm font-semibold rounded-lg hover:bg-[#000E51] hover:text-white transition-all duration-200"
            >
              Explore Courses
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
