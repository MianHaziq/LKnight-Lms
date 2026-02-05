import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Sign Up - Create Your Free Account",
  description:
    "Create a free LKnight Learning Hub account. Access 500+ expert-led courses, earn certificates, and join our global learning community.",
  keywords: [
    "sign up",
    "register",
    "create account",
    "free account",
    "join",
  ],
  canonical: "/signup",
  noIndex: true,
});

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
