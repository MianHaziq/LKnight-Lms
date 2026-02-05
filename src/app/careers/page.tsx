import { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Careers - Join Our Team",
  description:
    "Join the LKnight Learning Hub team. We're looking for passionate individuals who want to transform education. View open positions coming soon.",
  keywords: ["careers", "jobs", "work with us", "open positions", "hiring"],
  canonical: "/careers",
});

export default function CareersPage() {
  return (
    <ComingSoon
      title="Careers at LKnight"
      description="We're growing our team of passionate educators and technologists. Our careers page is coming soon with exciting opportunities to shape the future of online learning."
      icon="briefcase"
    />
  );
}
