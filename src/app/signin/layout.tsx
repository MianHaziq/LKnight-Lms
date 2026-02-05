import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Sign In - Access Your Account",
  description:
    "Sign in to your LKnight Learning Hub account to access your courses, track progress, and continue your learning journey.",
  keywords: ["sign in", "login", "account access", "member login"],
  canonical: "/signin",
  noIndex: true,
});

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
