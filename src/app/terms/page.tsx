import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Read the terms and conditions governing your use of LKnight Learning Hub. Understand your rights and responsibilities as a user of our platform.",
  keywords: ["terms of service", "terms and conditions", "user agreement"],
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
            Last updated: February 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using LKnight Learning Hub, you agree to be bound
              by these Terms of Service and all applicable laws and regulations.
              If you do not agree with any of these terms, you are prohibited
              from using or accessing this site.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              2. Use License
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Permission is granted to temporarily access the materials on
              LKnight Learning Hub for personal, non-commercial educational use
              only. This is the grant of a license, not a transfer of title, and
              under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Modify or copy the materials</li>
              <li>
                Use the materials for any commercial purpose or public display
              </li>
              <li>
                Attempt to decompile or reverse engineer any software on the
                platform
              </li>
              <li>
                Remove any copyright or proprietary notations from the materials
              </li>
              <li>
                Transfer the materials to another person or mirror on any other
                server
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              3. Account Registration
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To access certain features of our platform, you must register for
              an account. You agree to provide accurate, current, and complete
              information during registration and to update such information to
              keep it accurate. You are responsible for safeguarding your
              password and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              4. Course Enrollment and Access
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you enroll in a course:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                You receive a limited, non-exclusive, non-transferable license
                to access course content
              </li>
              <li>Course access may be subject to time limitations</li>
              <li>
                You may not share your account credentials or course access with
                others
              </li>
              <li>
                You may not record, download, or redistribute course content
                unless explicitly permitted
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              5. Payment Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All purchases are final. We offer a 14-day money-back guarantee
              for course purchases if you are not satisfied with the course
              content. Refund requests must be submitted within 14 days of
              purchase and before completing more than 30% of the course
              content. Subscription plans may be canceled at any time, but no
              partial refunds will be issued for the current billing period.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              6. User Content
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You may have the opportunity to post comments, questions, or other
              content on our platform. You are solely responsible for your
              content and agree not to post anything that is illegal, offensive,
              defamatory, or infringes on intellectual property rights. We
              reserve the right to remove any content that violates these terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All course content, materials, trademarks, logos, and other
              intellectual property displayed on LKnight Learning Hub are the
              property of LKnight Productions or its content providers. You may
              not use, reproduce, or distribute any content without prior
              written permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              8. Disclaimer
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The materials on LKnight Learning Hub are provided on an &apos;as
              is&apos; basis. We make no warranties, expressed or implied, and
              hereby disclaim all other warranties including, without
              limitation, implied warranties of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              9. Limitations
            </h2>
            <p className="text-gray-600 leading-relaxed">
              In no event shall LKnight Learning Hub or its suppliers be liable
              for any damages (including, without limitation, damages for loss
              of data or profit) arising out of the use or inability to use the
              materials on our platform.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to revise these terms of service at any time
              without notice. By using this website, you agree to be bound by
              the current version of these terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              11. Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Questions about the Terms of Service should be sent to us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@lknightlearninghub.com
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
