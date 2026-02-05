import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "The Vault - Private Leadership Community",
  description:
    "Join our exclusive leadership community. A psychologically safe space for leaders to share experiences, challenges, and wisdom anonymously.",
  keywords: [
    "leadership community",
    "executive network",
    "peer support",
    "leadership forum",
    "anonymous discussions",
  ],
  canonical: "/vault",
});

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
