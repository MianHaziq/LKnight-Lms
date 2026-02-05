import { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "For Instructors - Teach With Us",
  description:
    "Join our team of expert instructors. Share your knowledge, reach thousands of learners, and earn while teaching what you love. Coming soon to LKnight Learning Hub.",
  keywords: ["become instructor", "teach online", "create courses", "instructor program"],
  canonical: "/instructors",
});

export default function InstructorsPage() {
  return (
    <ComingSoon
      title="For Instructors"
      description="We're building an amazing platform for instructors to share their expertise. Join our waitlist to be among the first to create and publish courses on LKnight Learning Hub."
      icon="users"
    />
  );
}
