import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service - LKnight Learning Hub",
  description:
    "Read the terms and conditions governing your use of LKnight Learning Hub by LKnight Productions, LLC. Understand your rights, responsibilities, and more.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "LKnight terms",
    "LKnight Productions",
  ],
  canonical: "/terms",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <div className="bg-[#000E51] pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Terms of Service
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
          <span className="text-gray-900">Terms of Service</span>
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="prose prose-lg max-w-none">
          {/* Intro */}
          <section className="mb-10">
            <p className="text-gray-600 leading-relaxed">
              Welcome to the LKnight Learning Hub, operated by LKnight
              Productions, LLC (&quot;Company,&quot; &quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;). By accessing or using this
              platform, you agree to the following Terms of Service. If you do
              not agree, please do not use this site.
            </p>
          </section>

          {/* 1. Use of the Platform */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              1. Use of the Platform
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The LKnight Learning Hub provides leadership development content,
              training materials, and related resources for educational purposes
              only.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              You agree to use this platform for lawful purposes and in
              accordance with these terms. You may not:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Share login credentials</li>
              <li>Distribute, reproduce, or resell course materials</li>
              <li>
                Copy, modify, or create derivative works from content
              </li>
              <li>Attempt to interfere with platform functionality</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Access is granted for personal or authorized organizational use
              only.
            </p>
          </section>

          {/* 2. Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              2. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              All content on this platform, including videos, frameworks,
              workbooks, guides, logos, trademarks, and written materials, is the
              intellectual property of LKnight Productions, LLC.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              No content may be copied, redistributed, recorded, screenshot for
              distribution, or republished without prior written consent.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Violation of intellectual property rights may result in termination
              of access and potential legal action.
            </p>
          </section>

          {/* 3. No Professional or Clinical Advice */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              3. No Professional or Clinical Advice
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The content provided through the LKnight Learning Hub is for
              educational and informational purposes only.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              While LKnight integrates organizational strategy and clinical
              insight, the platform does not provide therapy, medical advice,
              legal advice, or personalized professional services.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Participation in this platform does not establish a therapeutic,
              medical, legal, or employment relationship.
            </p>
            <p className="text-gray-600 leading-relaxed">
              If you are experiencing a mental health crisis, please seek
              immediate assistance from a licensed professional or emergency
              services.
            </p>
          </section>

          {/* 4. Payment & Access */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              4. Payment &amp; Access
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Access to LMS content may require payment, subscription, or
              corporate licensing.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              All payments are final unless otherwise stated in a written
              agreement.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify pricing, subscription structures, or
              content availability at any time.
            </p>
          </section>

          {/* 5. Account Termination */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              5. Account Termination
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate access to the platform
              if a user violates these Terms of Service, including misuse,
              unauthorized sharing, or harmful conduct within community spaces.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              LKnight Productions, LLC shall not be liable for any indirect,
              incidental, consequential, or punitive damages arising from use of
              this platform.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Users assume full responsibility for how they apply the information
              provided.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Results may vary based on individual and organizational
              circumstances.
            </p>
          </section>

          {/* 7. Modifications */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              7. Modifications
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these Terms of Service from time to time. Continued
              use of the platform after updates constitutes acceptance of the
              revised terms.
            </p>
          </section>

          {/* 8. Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              8. Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by the laws of the State of Texas,
              without regard to conflict of law principles.
            </p>
          </section>

          {/* 9. Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              9. Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              For questions regarding these Terms of Service, please contact:
            </p>
            <div className="mt-4 p-6 bg-gray-50 rounded-lg space-y-2">
              <p className="text-gray-700">
                <strong>Lunka Crawford</strong>
              </p>
              <p className="text-gray-600">Founder &amp; CEO</p>
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
              <p className="text-gray-600">
                Co-Founder &amp; Clinical Director
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
                href="/privacy"
                className="text-[#FF6F00] hover:underline font-medium"
              >
                Privacy Policy
              </Link>{" "}
              which describes how we collect, use, and protect your personal
              information.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
