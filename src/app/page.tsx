import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedCoursesSection from "@/components/FeaturedCoursesSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import CEOSection from "@/components/CEOSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "LKnight Learning Hub - Master New Skills with Expert-Led Courses",
  description:
    "Transform your career with 500+ expert-led courses in leadership, technology, and business. Join 50,000+ learners worldwide. Start your journey today with LKnight Learning Hub.",
  keywords: [
    "online learning platform",
    "professional courses",
    "career development",
    "executive training",
  ],
  canonical: "/",
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedCoursesSection />
      <WhyChooseSection />
      <CEOSection />
      <CTASection />
      <Footer />
    </div>
  );
}
