import { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Community - Connect & Learn Together",
  description:
    "Join our vibrant learning community. Connect with fellow learners, share experiences, and grow together. LKnight community platform coming soon.",
  keywords: ["community", "learning community", "connect", "networking", "peer learning"],
  canonical: "/community",
});

export default function CommunityPage() {
  return (
    <ComingSoon
      title="LKnight Community"
      description="We're creating a vibrant space for learners to connect, collaborate, and grow together. Join the waitlist to be part of our community from day one."
      icon="community"
    />
  );
}
