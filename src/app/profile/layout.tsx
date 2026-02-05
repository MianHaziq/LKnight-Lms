import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Profile - Manage Your Account",
  description:
    "Manage your LKnight Learning Hub profile settings, update personal information, and secure your account.",
  keywords: ["profile", "account settings", "user profile"],
  canonical: "/profile",
  noIndex: true,
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
