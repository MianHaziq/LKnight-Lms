import { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Categories - Browse by Topic",
  description:
    "Explore courses by category. Find the perfect learning path in leadership, technology, business, and more. Coming soon to LKnight Learning Hub.",
  keywords: ["course categories", "topics", "learning paths", "browse courses"],
  canonical: "/categories",
});

export default function CategoriesPage() {
  return (
    <ComingSoon
      title="Course Categories"
      description="We're organizing our extensive course library into easy-to-navigate categories. Soon you'll be able to explore courses by topic, skill level, and learning path."
      icon="grid"
    />
  );
}
