import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Pricing - Simple, Transparent Plans",
  description:
    "Choose the perfect plan for your learning journey. From Basic to Enterprise, all plans include 14-day free trial. Start learning with LKnight today.",
  keywords: [
    "pricing plans",
    "subscription",
    "learning plans",
    "course pricing",
    "enterprise learning",
  ],
  canonical: "/pricing",
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
