import { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Blog - Insights & Resources",
  description:
    "Stay updated with the latest insights on leadership, learning, and professional development. LKnight Learning Hub blog coming soon.",
  keywords: ["blog", "articles", "insights", "learning resources", "education news"],
  canonical: "/blog",
});

export default function BlogPage() {
  return (
    <ComingSoon
      title="LKnight Blog"
      description="Our blog is launching soon with expert insights, learning tips, industry trends, and success stories from our community. Subscribe to be notified when we publish our first article."
      icon="edit"
    />
  );
}
