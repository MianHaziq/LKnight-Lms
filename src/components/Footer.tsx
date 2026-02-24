import Image from "next/image";
import TransitionLink from "./TransitionLink";

export default function Footer() {
  const platformLinks = [
    { label: "Browse Courses", href: "/courses" },
    { label: "Categories", href: "/categories" },
    { label: "Pricing Plans", href: "/pricing" },
    { label: "For Instructors", href: "/instructors" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/lknight-productions",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="#000E51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 9H2V21H6V9Z" stroke="#000E51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="#000E51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/LKnightProductions",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="#000E51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/lknightproductions",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="#000E51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="4" stroke="#000E51" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.5 6.5H17.51" stroke="#000E51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@lknightproductions",
      icon: (
        <svg width="18" height="18" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3v178.8A162.6 162.6 0 1 1 185 188.3v89.9a74.6 74.6 0 1 0 52.2 71.2V0h88a121 121 0 0 0 1.9 22.2 122.2 122.2 0 0 0 53.9 80.2 121 121 0 0 0 67 20.1z" fill="#000E51"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="w-full bg-[#F8F9FA] border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-4">
            {/* Logo */}
            <TransitionLink href="/" className="inline-block mb-4">
              <Image
                src="/icon/main-logo.svg"
                alt="LKnight LMS"
                width={120}
                height={40}
                className="h-[36px] w-auto"
              />
            </TransitionLink>

            {/* Tagline */}
            <p className="text-[#64748B] text-sm leading-relaxed mb-6 max-w-[280px]">
              Empowering learners worldwide with world-class courses designed to help you master new skills and advance your career.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-[#000E51] hover:bg-[#000E51] hover:border-[#000E51] group transition-all duration-200"
                >
                  <div className="group-hover:[&_svg_path]:stroke-white group-hover:[&_svg_rect]:stroke-white group-hover:[&_svg_circle]:stroke-white transition-colors duration-200">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-[#000E51] font-semibold text-sm mb-4">Platform</h3>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <TransitionLink
                    href={link.href}
                    className="text-[#64748B] text-sm hover:text-[#FF6F00] transition-colors duration-200"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[#000E51] font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <TransitionLink
                    href={link.href}
                    className="text-[#64748B] text-sm hover:text-[#FF6F00] transition-colors duration-200"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h3 className="text-[#000E51] font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <TransitionLink
                    href={link.href}
                    className="text-[#64748B] text-sm hover:text-[#FF6F00] transition-colors duration-200"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 lg:col-span-4 lg:col-start-1 mt-4 lg:mt-0">
            <h3 className="text-[#000E51] font-semibold text-sm mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:inquiries@lknightproductions.com"
                  className="text-[#64748B] text-sm hover:text-[#FF6F00] transition-colors duration-200"
                >
                  inquiries@lknightproductions.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:Lunka_Crawford@lknightproductions.com"
                  className="text-[#64748B] text-sm hover:text-[#FF6F00] transition-colors duration-200"
                >
                  Lunka_Crawford@lknightproductions.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+18329535517"
                  className="text-[#64748B] text-sm hover:text-[#FF6F00] transition-colors duration-200"
                >
                  (832) 953-5517
                </a>
              </li>
              <li>
                <span className="text-[#64748B] text-sm leading-relaxed">
                  7312 Louetta Rd. Ste. B118-160,<br />
                  Spring, Texas 77379
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <p className="text-[#64748B] text-sm text-center">
            © 2025 LKnight LMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
