import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Learn how LKnight Learning Hub collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  keywords: ["privacy policy", "data protection", "personal information"],
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
            Last updated: February 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              LKnight Learning Hub (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;) is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our website and services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              Personal Information
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide
              when you:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Register for an account</li>
              <li>Enroll in courses</li>
              <li>Subscribe to our newsletter</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              This information may include your name, email address, phone
              number, billing information, and any other information you choose
              to provide.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>
                Personalize your learning experience and provide course
                recommendations
              </li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              4. Information Sharing
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy. We may share information with trusted
              service providers who assist us in operating our website and
              conducting our business, provided they agree to keep this
              information confidential.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method
              of transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding
              your personal information, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your data</li>
              <li>Data portability</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              7. Cookies and Tracking
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your
              experience on our website. You can control cookie preferences
              through your browser settings. Note that disabling cookies may
              affect certain features of our service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              8. Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy or our practices,
              please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@lknightlearninghub.com
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Address:</strong> 132 Dartmouth Street Boston,
                Massachusetts 02156 United States
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
