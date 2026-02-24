import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service - LKnight Learning Hub",
  description:
    "Read the terms and conditions governing your use of LKnight Learning Hub by LKnight Productions. Understand your rights, responsibilities, course enrollment policies, payment terms, and more.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "LKnight terms",
    "course enrollment terms",
    "refund policy",
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
            Last updated: February 2026
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
          {/* Agreement to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using LKnight Learning Hub
              (&quot;Platform&quot;), operated by LKnight Productions
              (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to
              be bound by these Terms of Service (&quot;Terms&quot;) and all
              applicable laws and regulations. If you do not agree with any of
              these Terms, you must not use or access this Platform. These Terms
              constitute a legally binding agreement between you and LKnight
              Productions, located at 7312 Louetta Rd. Ste. B118-160, Spring,
              Texas 77379.
            </p>
          </section>

          {/* Eligibility */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              2. Eligibility
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You must be at least 18 years of age or the age of majority in
              your jurisdiction to use our Platform. If you are between 13 and
              18, you may use the Platform only with the consent and supervision
              of a parent or legal guardian who agrees to be bound by these
              Terms. Children under 13 are not permitted to use the Platform.
            </p>
          </section>

          {/* Account Registration */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              3. Account Registration
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To access certain features of our Platform, you must register for
              an account. When registering, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Provide accurate, current, and complete information during
                registration
              </li>
              <li>
                Maintain and update your information to keep it accurate and
                complete
              </li>
              <li>
                Safeguard your password and restrict access to your account
              </li>
              <li>
                Accept responsibility for all activities that occur under your
                account
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              You may also register using third-party services such as Google
              OAuth. By doing so, you authorize us to access certain information
              from your third-party account as permitted by that service. We
              reserve the right to suspend or terminate accounts that violate
              these Terms.
            </p>
          </section>

          {/* Use License */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              4. Use License
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Subject to these Terms, we grant you a limited, non-exclusive,
              non-transferable, revocable license to access and use the Platform
              for personal, non-commercial educational purposes. Under this
              license, you may not:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Modify, copy, distribute, or create derivative works of any
                Platform content
              </li>
              <li>
                Use the Platform or its content for any commercial purpose or
                public display
              </li>
              <li>
                Attempt to decompile, reverse engineer, or disassemble any
                software on the Platform
              </li>
              <li>
                Remove any copyright, trademark, or proprietary notices from the
                materials
              </li>
              <li>
                Transfer your account or course access to another person
              </li>
              <li>
                Use automated tools (bots, scrapers, crawlers) to access or
                extract content
              </li>
              <li>
                Circumvent any access control, security, or DRM measures
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              This license terminates automatically if you violate any of these
              restrictions and may be terminated by us at any time.
            </p>
          </section>

          {/* Course Enrollment */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              5. Course Enrollment and Access
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you enroll in a course on our Platform:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                You receive a limited, non-exclusive, non-transferable license
                to access the course content for your personal educational use
              </li>
              <li>
                Course access may be subject to time limitations or subscription
                terms as specified at the time of enrollment
              </li>
              <li>
                You may not share your account credentials or course access with
                others
              </li>
              <li>
                You may not record, download, screenshot, or redistribute course
                content unless explicitly permitted
              </li>
              <li>
                Course content may be updated, modified, or retired at our
                discretion
              </li>
              <li>
                Completion certificates, where offered, are subject to meeting
                all course requirements
              </li>
            </ul>
          </section>

          {/* Payment Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              6. Payment Terms and Refund Policy
            </h2>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              6.1 Payments
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              All prices are displayed in US Dollars (USD) unless otherwise
              stated. You agree to pay all fees associated with your course
              enrollments or subscription plan. Payment is due at the time of
              purchase. We use third-party payment processors to handle
              transactions securely.
            </p>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              6.2 Refund Policy
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We offer a <strong>14-day money-back guarantee</strong> for
              individual course purchases, subject to the following conditions:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>
                Refund requests must be submitted within 14 days of purchase
              </li>
              <li>
                You must not have completed more than 30% of the course content
              </li>
              <li>
                Refund requests can be submitted by contacting us at{" "}
                <a
                  href="mailto:inquiries@lknightproductions.com"
                  className="text-[#FF6F00] hover:underline"
                >
                  inquiries@lknightproductions.com
                </a>
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              6.3 Subscriptions
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Subscription plans renew automatically at the end of each billing
              cycle unless canceled before the renewal date. You may cancel your
              subscription at any time through your account settings. No partial
              refunds will be issued for the current billing period upon
              cancellation. We reserve the right to change subscription pricing
              with 30 days&apos; advance notice.
            </p>
          </section>

          {/* User Content */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              7. User Content
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may have the opportunity to post comments, questions, reviews,
              or other content on our Platform (&quot;User Content&quot;). By
              submitting User Content, you:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Grant us a non-exclusive, worldwide, royalty-free license to
                use, display, and distribute your User Content in connection
                with operating the Platform
              </li>
              <li>
                Represent that you own or have the right to submit the content
              </li>
              <li>
                Agree not to post content that is illegal, offensive,
                defamatory, threatening, harassing, or infringes on intellectual
                property rights
              </li>
              <li>
                Acknowledge that we may remove any User Content that violates
                these Terms at our sole discretion
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              8. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All course content, materials, trademarks, logos, software, and
              other intellectual property displayed on LKnight Learning Hub are
              the property of LKnight Productions or its content providers and
              are protected by United States and international copyright,
              trademark, and other intellectual property laws. You may not use,
              reproduce, distribute, modify, or publicly display any content
              from our Platform without prior written permission from LKnight
              Productions. The &quot;LKnight,&quot; &quot;LKnight Learning
              Hub,&quot; and &quot;LKnight Productions&quot; names and logos are
              trademarks of LKnight Productions.
            </p>
          </section>

          {/* Prohibited Conduct */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              9. Prohibited Conduct
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When using our Platform, you agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Violate any applicable local, state, national, or international
                law or regulation
              </li>
              <li>
                Impersonate any person or entity, or falsely represent your
                affiliation with any person or entity
              </li>
              <li>
                Interfere with or disrupt the Platform or servers and networks
                connected to it
              </li>
              <li>
                Upload or transmit viruses, malware, or any other malicious code
              </li>
              <li>
                Attempt to gain unauthorized access to other user accounts or
                Platform systems
              </li>
              <li>
                Harvest or collect personal information of other users without
                consent
              </li>
              <li>
                Use the Platform to send spam, unsolicited messages, or
                promotional materials
              </li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              10. Disclaimer of Warranties
            </h2>
            <p className="text-gray-600 leading-relaxed">
              THE PLATFORM AND ALL CONTENT ARE PROVIDED ON AN &quot;AS IS&quot;
              AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW,
              LKNIGHT PRODUCTIONS DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED
              WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE PLATFORM
              WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT ANY DEFECTS
              WILL BE CORRECTED. COURSE CONTENT IS PROVIDED FOR EDUCATIONAL
              PURPOSES ONLY AND DOES NOT CONSTITUTE PROFESSIONAL ADVICE.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL LKNIGHT PRODUCTIONS, ITS DIRECTORS, EMPLOYEES, PARTNERS,
              AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
              WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR
              OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR
              USE OF OR INABILITY TO USE THE PLATFORM. OUR TOTAL LIABILITY FOR
              ANY CLAIM ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT
              YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              12. Indemnification
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless LKnight
              Productions and its officers, directors, employees, agents, and
              affiliates from and against any and all claims, liabilities,
              damages, losses, costs, and expenses (including reasonable
              attorneys&apos; fees) arising out of or related to your use of the
              Platform, your violation of these Terms, or your violation of any
              rights of another party.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              13. Governing Law and Dispute Resolution
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of the State of Texas, United States, without regard to
              its conflict of law provisions. Any disputes arising out of or
              relating to these Terms or your use of the Platform shall be
              resolved as follows:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Informal resolution:</strong> You agree to first attempt
                to resolve any dispute informally by contacting us at{" "}
                <a
                  href="mailto:inquiries@lknightproductions.com"
                  className="text-[#FF6F00] hover:underline"
                >
                  inquiries@lknightproductions.com
                </a>
              </li>
              <li>
                <strong>Jurisdiction:</strong> If a dispute cannot be resolved
                informally, you agree to submit to the exclusive jurisdiction of
                the state and federal courts located in Harris County, Texas
              </li>
            </ul>
          </section>

          {/* Termination */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              14. Termination
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate your account and
              access to the Platform at our sole discretion, without prior
              notice, for conduct that we determine violates these Terms, is
              harmful to other users or the Platform, or is otherwise
              objectionable. Upon termination, your right to use the Platform
              will immediately cease. Sections of these Terms that by their
              nature should survive termination (including intellectual property,
              disclaimers, limitations of liability, and indemnification) will
              remain in effect.
            </p>
          </section>

          {/* Severability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              15. Severability and Entire Agreement
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or
              invalid, that provision shall be limited or eliminated to the
              minimum extent necessary so that these Terms shall otherwise remain
              in full force and effect. These Terms, together with our{" "}
              <Link
                href="/privacy"
                className="text-[#FF6F00] hover:underline"
              >
                Privacy Policy
              </Link>
              , constitute the entire agreement between you and LKnight
              Productions regarding the use of the Platform, superseding any
              prior agreements. Our failure to enforce any right or provision of
              these Terms shall not be considered a waiver of that right or
              provision.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              16. Changes to These Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify these Terms at any time. When we
              make material changes, we will update the &quot;Last updated&quot;
              date at the top of this page and may notify you via email or a
              prominent notice on our Platform. Your continued use of the
              Platform after any changes constitutes acceptance of the revised
              Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              17. Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="mt-4 p-6 bg-gray-50 rounded-lg space-y-2">
              <p className="text-gray-700 font-semibold">
                LKnight Productions
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> 7312 Louetta Rd. Ste. B118-160,
                Spring, Texas 77379
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:inquiries@lknightproductions.com"
                  className="text-[#FF6F00] hover:underline"
                >
                  inquiries@lknightproductions.com
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+18329535517"
                  className="text-[#FF6F00] hover:underline"
                >
                  (832) 953-5517
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
