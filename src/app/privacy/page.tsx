import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy - LKnight Learning Hub",
  description:
    "Learn how LKnight Learning Hub by LKnight Productions, LLC collects, uses, and protects your personal information. Read our full privacy policy.",
  keywords: [
    "privacy policy",
    "data protection",
    "personal information",
    "LKnight privacy",
    "data security",
  ],
  canonical: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="bg-[#000E51] pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            Effective Date: March 1, 2026
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <Link href="/" className="hover:text-[#FF6F00] transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Privacy Policy</span>
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="prose prose-lg max-w-none">
          {/* Intro */}
          <section className="mb-10">
            <p className="text-gray-600 leading-relaxed">
              LKnight Productions, LLC (&quot;Company,&quot; &quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;) respects your privacy and is
              committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, store, and protect
              information when you access the LKnight Learning Hub and related
              services.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              By using this platform, you agree to the practices described
              below.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may collect the following types of information:
            </p>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              Personal Information
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Company name</li>
              <li>Job title</li>
              <li>Billing address</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              Account Information
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Login credentials</li>
              <li>Course enrollment and progress</li>
              <li>Community participation activity</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              Payment Information
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Payments are processed through secure third-party payment
              providers. LKnight Productions does not store full credit card
              information on its servers.
            </p>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              Technical Information
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Usage data</li>
              <li>Cookies and analytics information</li>
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Provide access to LMS content</li>
              <li>Process payments and manage subscriptions</li>
              <li>Communicate account and service updates</li>
              <li>Improve platform functionality and user experience</li>
              <li>Respond to inquiries and support requests</li>
              <li>Monitor security and prevent misuse</li>
            </ul>
            <p className="text-gray-600 leading-relaxed font-medium">
              We do not sell or rent your personal information.
            </p>
          </section>

          {/* 3. Community & Anonymous Profiles */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              3. Community &amp; Anonymous Profiles
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The LKnight Learning Hub may offer community features that allow
              users to participate using an anonymous display name.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              While your chosen display name may not reveal your identity to
              other members, LKnight Productions retains account registration
              information, including your name and email address, for
              administrative, security, and compliance purposes.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Anonymous participation applies only to how users appear within
              the community. It does not create full legal anonymity from the
              platform operator.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Users are responsible for maintaining the confidentiality of their
              login credentials and chosen display name.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Please exercise discretion when sharing personal or sensitive
              information in community discussions. Information voluntarily
              shared may be visible to other participants.
            </p>
          </section>

          {/* 4. User Conduct */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              4. User Conduct
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Users agree not to post content that is unlawful, defamatory,
              threatening, discriminatory, harmful, or otherwise inappropriate.
            </p>
            <p className="text-gray-600 leading-relaxed">
              LKnight Productions reserves the right to remove content or
              suspend accounts that violate community standards or compromise
              the safety of other members.
            </p>
          </section>

          {/* 5. Email Communications */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              5. Email Communications
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By creating an account or purchasing access, you may receive:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Account notifications</li>
              <li>Service-related announcements</li>
              <li>LMS updates</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              You may opt out of marketing emails at any time using the
              unsubscribe link provided. Transactional and account-related
              communications may still be sent as necessary.
            </p>
          </section>

          {/* 6. Data Sharing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              6. Data Sharing
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may share information with trusted third-party service
              providers who assist in operating the platform, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Hosting providers</li>
              <li>Payment processors</li>
              <li>Email service providers</li>
              <li>Analytics services</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              These providers are contractually obligated to protect your
              information.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We may also disclose information if required by law.
            </p>
          </section>

          {/* 7. Data Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              7. Data Security
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement reasonable administrative, technical, and physical
              safeguards to protect your personal information. However, no
              online platform can guarantee absolute security.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Users assume responsibility for safeguarding their login
              credentials.
            </p>
          </section>

          {/* 8. No Clinical or Professional Relationship */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              8. No Clinical or Professional Relationship
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Participation in the LKnight Learning Hub does not establish a
              therapeutic, psychological, medical, legal, or employment
              relationship with Ken Crawford, Lunka Crawford, or LKnight
              Productions.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              All content is educational in nature and is not a substitute for
              individualized professional services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If you are experiencing a mental health emergency, please contact a
              licensed professional or emergency services in your area.
            </p>
          </section>

          {/* 9. Corporate Accounts */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              9. Corporate Accounts
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For users accessing the platform through a corporate license,
              certain usage information may be shared with the sponsoring
              organization for reporting and administrative purposes, in
              accordance with applicable agreements.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Corporate administrators do not have access to private community
              discussion content unless explicitly disclosed.
            </p>
          </section>

          {/* 10. Your Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              10. Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your jurisdiction, you may have rights to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Request access to your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your information</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              To make a request, contact us using the information below.
            </p>
          </section>

          {/* 11. Changes to This Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. Updates will
              be reflected by a revised Effective Date. Continued use of the
              platform constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 12. Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              12. Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              For questions regarding this Privacy Policy, please contact:
            </p>
            <div className="mt-4 p-6 bg-gray-50 rounded-lg space-y-2">
              <p className="text-gray-700">
                <strong>Lunka Crawford</strong>
              </p>
              <p className="text-gray-700">
                <a
                  href="mailto:Lunka_Crawford@lknightproductions.com"
                  className="text-[#FF6F00] hover:underline"
                >
                  Lunka_Crawford@lknightproductions.com
                </a>
              </p>
              <div className="border-t border-gray-200 my-3"></div>
              <p className="text-gray-700">
                <strong>Ken Crawford</strong>
              </p>
              <p className="text-gray-700">
                <a
                  href="mailto:Ken_Crawford@lknightproductions.com"
                  className="text-[#FF6F00] hover:underline"
                >
                  Ken_Crawford@lknightproductions.com
                </a>
              </p>
            </div>
          </section>

          {/* Cross-link */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-gray-500 text-sm">
              Please also review our{" "}
              <Link
                href="/terms"
                className="text-[#FF6F00] hover:underline font-medium"
              >
                Terms of Service
              </Link>{" "}
              which governs your use of the LKnight Learning Hub platform.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
