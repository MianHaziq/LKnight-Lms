import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Courses - Executive Course Catalog",
  description:
    "Browse executive courses in leadership, communication, and team development. Designed for leaders seeking to strengthen strategic thinking and organizational impact.",
  keywords: [
    "executive courses",
    "leadership training",
    "business courses",
    "professional development",
    "online courses",
  ],
  canonical: "/courses",
});

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
