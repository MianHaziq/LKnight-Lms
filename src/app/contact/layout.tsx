import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact Us - Get in Touch",
  description:
    "Have questions about LKnight Learning Hub? Contact our support team for assistance with courses, subscriptions, or partnership inquiries.",
  keywords: ["contact", "support", "help", "customer service", "inquiries"],
  canonical: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
