import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MeetTheTeam from "@/components/MeetTheTeam";
import TestimonialSection from "@/components/TestimonialSection";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About Us - Our Mission & Story",
  description:
    "Learn about LKnight Learning Hub's mission to democratize education. Founded in 2020, we serve 50,000+ learners across 150+ countries with 500+ expert-led courses.",
  keywords: ["about lknight", "our story", "education mission", "learning community"],
  canonical: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Background Image */}
      <section
        className="w-full relative bg-[#000E51]"
        style={{
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/icon/aboutbg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Content */}
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight mb-4">
              Empowering Learners Worldwide
            </h1>
            <p className="text-white/80 text-sm sm:text-base lg:text-[16px] leading-relaxed max-w-[600px] mx-auto">
              LKnight LMS was founded with a simple mission: make quality
              education accessible to everyone, everywhere. We&apos;re building
              the future of learning.
            </p>
          </div>
        </div>
      </section>


      {/* Our Story Section */}
      <section className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 lg:max-w-[500px]">
              <h2 className="text-[#000E51] text-xl sm:text-2xl lg:text-[28px] font-bold mb-5">
                Our Story
              </h2>

              <div className="space-y-4 text-[#64748B] text-sm lg:text-[15px] leading-[1.8]">
                <p>
                  Founded in 2020 by Lunka Crawford, LKnight started with a
                  vision to democratize education. What began as a small
                  platform with just 10 courses has grown into a global learning
                  community.
                </p>
                <p>
                  Today, we serve over 50,000 learners across 150+ countries,
                  offering 500+ courses taught by industry experts. Our platform
                  combines cutting-edge technology with proven pedagogical
                  methods.
                </p>
                <p>
                  We believe that everyone deserves access to quality education,
                  regardless of their background or location. That&apos;s why we
                  work tirelessly to create courses that are engaging,
                  practical, and affordable.
                </p>
              </div>
            </div>

            {/* Right Image with Stats Badge */}
            <div className="flex-1 w-full lg:max-w-[650px] relative">
              {/* Main Image */}
              <div className="relative w-full h-[280px] sm:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src="/our-story-banner.jpg"
                  alt="LKnight Productions - Our Story"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 650px"
                  priority
                />
              </div>

              {/* Stats Badge */}
              <div
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#000E51]/90 backdrop-blur-sm text-white px-5 py-4 sm:px-6 sm:py-5"
                style={{
                  borderRadius: "12px",
                }}
              >
                <div className="text-2xl sm:text-3xl lg:text-[36px] font-bold leading-none">
                  50K+
                </div>
                <div className="text-white/70 text-xs sm:text-sm mt-1">
                  Active Learners
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="w-full bg-[#F8F9FC] py-14 lg:py-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="text-[#000E51] text-xl sm:text-2xl lg:text-[26px] font-bold mb-3">
              Our Values
            </h2>
            <p className="text-[#64748B] text-sm lg:text-[15px]">
              The principles that guide everything we do at LKnight
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Excellence */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#E8EAF6] flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[#000E51] text-sm lg:text-[15px] font-semibold mb-2">
                Excellence
              </h3>
              <p className="text-[#64748B] text-xs lg:text-[13px] leading-relaxed max-w-[200px]">
                We strive for excellence in everything we do, from course quality to customer support.
              </p>
            </div>

            {/* Community */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#E8EAF6] flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[#000E51] text-sm lg:text-[15px] font-semibold mb-2">
                Community
              </h3>
              <p className="text-[#64748B] text-xs lg:text-[13px] leading-relaxed max-w-[200px]">
                We believe learning is better together. Our community supports and inspires each other.
              </p>
            </div>

            {/* Innovation */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#E8EAF6] flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18H15"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 22H14"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2C9.34784 2 6.8043 3.05357 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.22 2.78 16.26 4.08 17.86C4.5 18.39 5 19.09 5 19.76V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V19.76C19 19.09 19.5 18.39 19.92 17.86C21.22 16.26 22 14.22 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C17.1957 3.05357 14.6522 2 12 2Z"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[#000E51] text-sm lg:text-[15px] font-semibold mb-2">
                Innovation
              </h3>
              <p className="text-[#64748B] text-xs lg:text-[13px] leading-relaxed max-w-[200px]">
                We continuously innovate to provide the best learning experience possible.
              </p>
            </div>

            {/* Accessibility */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#E8EAF6] flex items-center justify-center mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12H22"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                    stroke="#000E51"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[#000E51] text-sm lg:text-[15px] font-semibold mb-2">
                Accessibility
              </h3>
              <p className="text-[#64748B] text-xs lg:text-[13px] leading-relaxed max-w-[200px]">
                Quality education should be accessible to everyone, everywhere in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <MeetTheTeam />
      <TestimonialSection page="about" />

      <Footer />
    </div>
  );
}
