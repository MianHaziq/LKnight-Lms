"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { testimonialApi, Testimonial } from "@/lib/api";

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= rating ? "#FF6F00" : "none"}
          stroke={star <= rating ? "#FF6F00" : "#D1D5DB"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

// Default avatar based on gender
function DefaultAvatar({ gender, name }: { gender: string; name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (gender === "female") {
    return (
      <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
        <span className="text-white text-xl font-bold">{initials}</span>
      </div>
    );
  }
  return (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#000E51] to-[#1a3a8a] flex items-center justify-center">
      <span className="text-white text-xl font-bold">{initials}</span>
    </div>
  );
}

// Single testimonial card
function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const hasImage = testimonial.image && testimonial.image.trim() !== "";
  const isBase64 =
    testimonial.image && testimonial.image.startsWith("data:");

  return (
    <div className="flex-shrink-0 w-[300px] sm:w-[340px] lg:w-[380px] group">
      <div
        className="bg-white rounded-2xl border border-gray-100 px-6 pt-14 pb-6 relative transition-all duration-300 hover:shadow-lg hover:border-[#000E51]/20 hover:-translate-y-1 h-full flex flex-col"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      >
        {/* Circle Image - positioned at top center, overlapping card */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-md">
            {hasImage ? (
              isBase64 ? (
                <img
                  src={testimonial.image!}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={testimonial.image!}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <DefaultAvatar
                gender={testimonial.gender}
                name={testimonial.name}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center text-center">
          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={testimonial.rating} />
          </div>

          {/* Testimonial text */}
          <p className="text-[#64748B] text-sm leading-relaxed mb-4 flex-1 line-clamp-4">
            &ldquo;{testimonial.content}&rdquo;
          </p>

          {/* Name */}
          <p className="text-[#000E51] text-sm font-semibold">
            {testimonial.name}
          </p>
        </div>
      </div>
    </div>
  );
}

interface TestimonialSectionProps {
  page: "home" | "about" | "courses" | "dashboard";
}

export default function TestimonialSection({ page }: TestimonialSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isPaused = useRef(false);
  const isArrowScrolling = useRef(false);
  const scrollSpeed = useRef(0.5); // pixels per frame

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialApi.getByPage(page);
        if (response.success && response.data) {
          setTestimonials(response.data);
        }
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, [page]);

  // Auto-scroll animation
  const animate = useCallback(() => {
    if (scrollRef.current && !isPaused.current && !isArrowScrolling.current) {
      const el = scrollRef.current;
      el.scrollLeft += scrollSpeed.current;

      // Reset to start when we've scrolled through half the content
      // (content is duplicated so resetting at half creates seamless loop)
      const resetPoint = el.scrollWidth / 2;
      if (el.scrollLeft >= resetPoint) {
        el.scrollLeft = el.scrollLeft - resetPoint;
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [testimonials, animate]);

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current || isArrowScrolling.current) return;

    const el = scrollRef.current;
    // Scroll by one card width + gap (380px card + 24px gap on lg)
    const cardWidth = window.innerWidth >= 1024 ? 404 : window.innerWidth >= 640 ? 364 : 324;
    const distance = direction === "left" ? -cardWidth : cardWidth;

    // Pause auto-scroll, do manual smooth scroll, then resume
    isArrowScrolling.current = true;

    const start = el.scrollLeft;
    const target = start + distance;
    const duration = 400; // ms
    const startTime = performance.now();

    const animateScroll = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic for smooth deceleration
      const ease = 1 - Math.pow(1 - progress, 3);
      el.scrollLeft = start + distance * ease;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        // Wrap around if needed
        const resetPoint = el.scrollWidth / 2;
        if (el.scrollLeft >= resetPoint) {
          el.scrollLeft = el.scrollLeft - resetPoint;
        } else if (el.scrollLeft < 0) {
          el.scrollLeft = el.scrollLeft + resetPoint;
        }
        isArrowScrolling.current = false;
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Don't render if no testimonials
  if (!isLoading && testimonials.length === 0) {
    return null;
  }

  // Duplicate testimonials enough times for seamless infinite scroll
  // Even 1 testimonial should scroll, so we need enough copies to fill the viewport
  // Must be even number of copies so reset at half creates a seamless loop
  const displayItems: Testimonial[] = [];
  if (testimonials.length > 0) {
    let copies = Math.max(2, Math.ceil(12 / testimonials.length));
    if (copies % 2 !== 0) copies++;
    for (let i = 0; i < copies; i++) {
      displayItems.push(...testimonials);
    }
  }

  return (
    <section className="w-full bg-[#F8F9FC] py-16 lg:py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header with arrows */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {/* Heading removed per client request (What Our Students Say) */}
            {/* <h2 className="text-[#000E51] text-xl sm:text-2xl lg:text-[28px] font-bold">
              What Our Students Say
            </h2>
            <p className="text-[#64748B] text-sm mt-1">
              Hear from our community of learners
            </p> */}
          </div>

          {!isLoading && testimonials.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center bg-white border border-gray-200 hover:border-[#000E51] text-[#64748B] hover:text-[#000E51] transition-all duration-200"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
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
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg flex items-center justify-center bg-[#000E51] hover:bg-[#001070] text-white transition-all duration-200"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
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
      </div>

      {/* Scrolling container - full width for seamless effect */}
      {isLoading ? (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[300px] sm:w-[340px] lg:w-[380px] animate-pulse"
              >
                <div className="bg-white rounded-2xl border border-gray-100 px-6 pt-14 pb-6 relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full bg-gray-200" />
                  </div>
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div
                          key={s}
                          className="w-4 h-4 bg-gray-200 rounded"
                        />
                      ))}
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={scrollRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex gap-6 overflow-x-hidden px-4 sm:px-6 lg:px-12 pt-12"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {displayItems.map((testimonial, index) => (
            <TestimonialCard
              key={`${testimonial.id}-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>
      )}
    </section>
  );
}
