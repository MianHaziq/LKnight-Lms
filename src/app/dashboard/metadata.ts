import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const dashboardMetadata: Metadata = createMetadata({
  title: "Dashboard - My Learning Journey",
  description:
    "Track your learning progress, access enrolled courses, and continue your professional development journey with LKnight Learning Hub.",
  keywords: ["dashboard", "my courses", "learning progress", "enrolled courses"],
  canonical: "/dashboard",
  noIndex: true,
});
