import { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Help Center - Support & FAQs",
  description:
    "Get help with your LKnight Learning Hub account, courses, and subscriptions. Our comprehensive help center is coming soon.",
  keywords: ["help center", "support", "FAQ", "customer service", "documentation"],
  canonical: "/help",
});

export default function HelpPage() {
  return (
    <ComingSoon
      title="Help Center"
      description="We're building a comprehensive help center with guides, tutorials, and FAQs. In the meantime, reach out to us through our contact page for any assistance."
      icon="help"
    />
  );
}
