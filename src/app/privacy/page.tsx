import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy - LKnight Learning Hub",
  description:
    "Learn how LKnight Learning Hub by LKnight Productions collects, uses, and protects your personal information. Read our full privacy policy covering data collection, cookies, CCPA rights, and more.",
  keywords: [
    "privacy policy",
    "data protection",
    "personal information",
    "LKnight privacy",
    "CCPA",
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
          <span className="text-gray-900">Privacy Policy</span>
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              LKnight Learning Hub, operated by LKnight Productions
              (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), is committed
              to protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              visit our website at{" "}
              <strong>www.lknightlearninghub.com</strong> and use our online
              learning platform services. By using our services, you consent to
              the practices described in this policy.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              Our principal place of business is located at 7312 Louetta Rd.
              Ste. B118-160, Spring, Texas 77379. If you have any questions
              about this policy, please contact us at{" "}
              <a
                href="mailto:inquiries@lknightproductions.com"
                className="text-[#FF6F00] hover:underline"
              >
                inquiries@lknightproductions.com
              </a>{" "}
              or call{" "}
              <a
                href="tel:+18329535517"
                className="text-[#FF6F00] hover:underline"
              >
                (832) 953-5517
              </a>
              .
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              2.1 Personal Information You Provide
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect information you voluntarily provide when you:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Create an account (name, email address, password)</li>
              <li>
                Sign in using third-party authentication (e.g., Google OAuth)
              </li>
              <li>Enroll in or purchase courses</li>
              <li>
                Complete your profile (phone number, profile picture,
                preferences)
              </li>
              <li>Submit a contact form or support request</li>
              <li>Subscribe to our newsletter or promotional communications</li>
              <li>Participate in surveys, contests, or community discussions</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              2.2 Payment Information
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              When you make a purchase, payment details (credit card number,
              billing address) are processed securely by our third-party payment
              processor. We do not store your full payment card information on
              our servers.
            </p>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              2.3 Automatically Collected Information
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you access our platform, we may automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Device and browser information (type, operating system, language)
              </li>
              <li>IP address and approximate geographic location</li>
              <li>
                Usage data (pages viewed, courses accessed, time spent, click
                patterns)
              </li>
              <li>
                Learning progress data (lesson completions, quiz scores,
                enrollment history)
              </li>
              <li>Referring website or source</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Service delivery:</strong> To provide, operate, and
                maintain our learning platform
              </li>
              <li>
                <strong>Account management:</strong> To create, manage, and
                authenticate your account
              </li>
              <li>
                <strong>Course access:</strong> To process enrollments, track
                progress, and issue certificates
              </li>
              <li>
                <strong>Transactions:</strong> To process payments and send
                purchase confirmations
              </li>
              <li>
                <strong>Personalization:</strong> To recommend courses and
                customize your learning experience
              </li>
              <li>
                <strong>Communication:</strong> To send technical notices,
                security alerts, and support messages
              </li>
              <li>
                <strong>Marketing:</strong> To send promotional content (with
                your consent; you may opt out at any time)
              </li>
              <li>
                <strong>Analytics:</strong> To monitor usage patterns and improve
                our services
              </li>
              <li>
                <strong>Security:</strong> To detect, prevent, and address fraud
                or unauthorized access
              </li>
              <li>
                <strong>Legal compliance:</strong> To comply with applicable laws
                and regulations
              </li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Service providers:</strong> With trusted third-party
                vendors who assist us in operating our platform (e.g., payment
                processors, email service providers, hosting providers,
                analytics tools). These providers are contractually obligated to
                protect your data.
              </li>
              <li>
                <strong>Authentication partners:</strong> When you sign in using
                Google OAuth, limited profile information is exchanged with
                Google per their privacy policies.
              </li>
              <li>
                <strong>Legal requirements:</strong> When required by law,
                subpoena, court order, or to protect the rights, property, or
                safety of LKnight Productions, our users, or the public.
              </li>
              <li>
                <strong>Business transfers:</strong> In connection with a merger,
                acquisition, or sale of assets, your information may be
                transferred as part of that transaction.
              </li>
              <li>
                <strong>With your consent:</strong> For any purpose you
                explicitly authorize.
              </li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience.
              These include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>
                <strong>Essential cookies:</strong> Required for site
                functionality, authentication, and security
              </li>
              <li>
                <strong>Analytics cookies:</strong> Help us understand how
                visitors use our platform (e.g., pages visited, session
                duration)
              </li>
              <li>
                <strong>Preference cookies:</strong> Remember your settings and
                preferences across visits
              </li>
              <li>
                <strong>Marketing cookies:</strong> Used to deliver relevant
                advertisements (only with your consent)
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              You can manage or disable cookies through your browser settings.
              Please note that disabling essential cookies may affect the
              functionality of our platform, including the ability to log in or
              access courses.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your
              personal information, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>SSL/TLS encryption for all data transmitted to and from our servers</li>
              <li>Hashed and salted password storage</li>
              <li>JWT-based authentication with secure token management</li>
              <li>Role-based access controls for administrative functions</li>
              <li>Regular security audits and vulnerability assessments</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              While we strive to protect your data, no method of electronic
              transmission or storage is 100% secure. We cannot guarantee
              absolute security but will promptly notify affected users in the
              event of a data breach as required by law.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              7. Data Retention
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as your account is
              active or as needed to provide you with our services. If you
              request account deletion, we will remove your personal data within
              30 days, except where retention is required for legal, accounting,
              or compliance purposes. Anonymized or aggregated data that cannot
              identify you may be retained indefinitely for analytics.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              8. Your Rights and Choices
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding
              your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>
                <strong>Access:</strong> Request a copy of the personal data we
                hold about you
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or
                incomplete data
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                data (subject to legal retention requirements)
              </li>
              <li>
                <strong>Portability:</strong> Request your data in a structured,
                machine-readable format
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing
                communications at any time via the link in our emails
              </li>
              <li>
                <strong>Withdraw consent:</strong> Where processing is based on
                consent, you may withdraw it at any time
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-[#000E51] mb-3">
              Texas and U.S. State Privacy Rights
            </h3>
            <p className="text-gray-600 leading-relaxed">
              If you are a resident of Texas or another U.S. state with consumer
              privacy legislation (such as the Texas Data Privacy and Security
              Act, California Consumer Privacy Act, or similar), you have
              additional rights including the right to know what personal
              information we collect and how it is used, the right to delete
              your data, and the right to opt out of the sale of your
              information. We do not sell personal information. To exercise any
              of these rights, please contact us using the details below.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              9. Children&apos;s Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform is not intended for children under the age of 13. We
              do not knowingly collect personal information from children under
              13. If we become aware that we have collected personal data from a
              child under 13, we will take steps to delete that information
              promptly. If you believe a child under 13 has provided us with
              personal information, please contact us immediately.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              10. Third-Party Links and Services
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform may contain links to third-party websites, services,
              or applications (including Google for authentication). We are not
              responsible for the privacy practices of these third parties. We
              encourage you to review the privacy policies of any third-party
              services before providing your information.
            </p>
          </section>

          {/* Changes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. We will post the updated policy on this page
              with a revised &quot;Last updated&quot; date. We encourage you to
              review this policy periodically. Your continued use of our
              platform after changes constitutes acceptance of the updated
              policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#000E51] mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions, concerns, or requests regarding this
              Privacy Policy or our data practices, please contact us:
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
