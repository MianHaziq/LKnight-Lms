"use client";

import Image from "next/image";
import TransitionLink from "./TransitionLink";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { settingsApi } from "@/lib/api";

export default function Navbar() {
  const [platformOpen, setPlatformOpen] = useState(false);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hiddenPages, setHiddenPages] = useState<string[]>([]);

  const platformRef = useRef<HTMLDivElement>(null);
  const enterpriseRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  // Fetch hidden pages from settings
  useEffect(() => {
    const fetchHiddenPages = async () => {
      try {
        const res = await settingsApi.getPublicSettings();
        if (res.success && res.data) {
          setHiddenPages(res.data.hiddenPages || []);
        }
      } catch {
        // Use defaults (no pages hidden)
      }
    };
    fetchHiddenPages();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setPlatformOpen(false);
      }
      if (enterpriseRef.current && !enterpriseRef.current.contains(event.target as Node)) {
        setEnterpriseOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const toggleMobileAccordion = (section: string) => {
    setMobileAccordion(mobileAccordion === section ? null : section);
  };

  // Enterprise dropdown items data
  const enterpriseItems = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="#FF6F00" strokeWidth="1.5"/>
          <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="16" r="1.5" fill="#FF6F00"/>
        </svg>
      ),
      title: "Secure Content Vault",
      description: "Enterprise-grade DRM protection, watermarking, and access controls for confidential learning materials."
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#FF6F00" strokeWidth="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#FF6F00" strokeWidth="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#FF6F00" strokeWidth="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#FF6F00" strokeWidth="1.5"/>
        </svg>
      ),
      title: "Executive Learning Programs",
      description: "Curated courses and certifications designed for C-suite leaders, directors, and senior management."
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke="#FF6F00" strokeWidth="1.5"/>
          <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M15 11L18 14L21 11" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Role-Based Access",
      description: "Granular permissions, SSO integration, and multi-factor authentication for enterprise security."
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21H21" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M5 21V7L12 3L19 7V21" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 21V15H15V21" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 9H9.01" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 9H12.01" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 9H15.01" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round"/>
          <path d="M9 12H9.01" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 12H12.01" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round"/>
          <path d="M15 12H15.01" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: "Multi-Tenant Architecture",
      description: "White-label solutions, organization isolation, and scalable infrastructure for global enterprises."
    }
  ];

  // Platform dropdown items
  const platformItems = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Learning Management",
      description: "Comprehensive LMS with course creation, tracking, and analytics capabilities."
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H8" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Content Library",
      description: "Access thousands of curated courses, videos, and learning resources."
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 20V10" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 20V4" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 20V14" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Analytics Dashboard",
      description: "Real-time insights into learning progress, engagement, and performance metrics."
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="#FF6F00" strokeWidth="1.5"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#FF6F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Team Collaboration",
      description: "Foster teamwork with discussion forums, group projects, and peer learning."
    }
  ];

  const ChevronDown = ({ className = "" }: { className?: string }) => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <>
      <nav className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-[64px] lg:h-[72px]">
            {/* Logo */}
            <div className="flex items-center">
              <TransitionLink href="/" className="flex items-center">
                <Image
                  src="/icon/main-logo.svg"
                  alt="LKnight Productions"
                  width={140}
                  height={45}
                  className="h-[40px] sm:h-[45px] lg:h-[52px] w-auto"
                  priority
                />
              </TransitionLink>
            </div>

            {/* Center Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {/* The Vault Button */}
              {!hiddenPages.includes("vault") && (
                <TransitionLink
                  href="/vault"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6F001A] hover:bg-[#FF6F0033] text-[#FF6F00] text-sm font-semibold rounded-lg transition-all duration-200 mr-4"
                >
                  <Image
                    src="/icon/vault.svg"
                    alt="Vault"
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  The Vault
                </TransitionLink>
              )}

              {/* Platform Dropdown */}
              {!hiddenPages.includes("platform") && <div
                className="relative"
                ref={platformRef}
                onMouseEnter={() => {
                  setPlatformOpen(true);
                  setEnterpriseOpen(false);
                }}
                onMouseLeave={() => setPlatformOpen(false)}
              >
                <button
                  className="flex items-center gap-1.5 px-4 py-2 text-[#1E293B] text-sm font-medium hover:text-[#FF6F00] transition-colors"
                >
                  Platform
                  <ChevronDown className={`transition-transform duration-300 ${platformOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Platform Dropdown Content */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-300 origin-top ${platformOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
                  <div className="w-[580px] bg-white rounded-xl shadow-2xl border border-gray-100 p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {platformItems.map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className="group flex flex-col gap-2 transition-all duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFF4E5] group-hover:bg-[#FF6F00] group-hover:scale-110 transition-all duration-200">
                            <div className="group-hover:[&_svg_*]:stroke-white transition-colors duration-200">
                              {item.icon}
                            </div>
                          </div>
                          <h4 className="text-[15px] font-semibold text-[#000E51] group-hover:text-[#FF6F00] transition-colors duration-200">
                            {item.title}
                          </h4>
                          <p className="text-[13px] text-[#64748B] leading-relaxed">
                            {item.description}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>}

              {/* Enterprise Dropdown */}
              {!hiddenPages.includes("enterprise") && <div
                className="relative"
                ref={enterpriseRef}
                onMouseEnter={() => {
                  setEnterpriseOpen(true);
                  setPlatformOpen(false);
                }}
                onMouseLeave={() => setEnterpriseOpen(false)}
              >
                <button
                  className="flex items-center gap-1.5 px-4 py-2 text-[#1E293B] text-sm font-medium hover:text-[#FF6F00] transition-colors"
                >
                  Enterprise
                  <ChevronDown className={`transition-transform duration-300 ${enterpriseOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Enterprise Dropdown Content */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-300 origin-top ${enterpriseOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
                  <div className="w-[580px] bg-white rounded-xl shadow-2xl border border-gray-100 p-6">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      {enterpriseItems.map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className="group flex flex-col gap-2 transition-all duration-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#FFF4E5] group-hover:bg-[#FF6F00] group-hover:scale-110 transition-all duration-200">
                            <div className="group-hover:[&_svg_*]:stroke-white transition-colors duration-200">
                              {item.icon}
                            </div>
                          </div>
                          <h4 className="text-[15px] font-semibold text-[#000E51] group-hover:text-[#FF6F00] transition-colors duration-200">
                            {item.title}
                          </h4>
                          <p className="text-[13px] text-[#64748B] leading-relaxed">
                            {item.description}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>}

              {/* Regular Links */}
              {!hiddenPages.includes("courses") && (
                <TransitionLink href="/courses" className="px-4 py-2 text-[#1E293B] text-sm font-medium hover:text-[#FF6F00] transition-colors">
                  Courses
                </TransitionLink>
              )}
              {!hiddenPages.includes("pricing") && (
                <TransitionLink href="/pricing" className="px-4 py-2 text-[#1E293B] text-sm font-medium hover:text-[#FF6F00] transition-colors">
                  Pricing
                </TransitionLink>
              )}
              {!hiddenPages.includes("about") && (
                <TransitionLink href="/about" className="px-4 py-2 text-[#1E293B] text-sm font-medium hover:text-[#FF6F00] transition-colors">
                  About
                </TransitionLink>
              )}
              {!hiddenPages.includes("contact") && (
                <TransitionLink href="/contact" className="px-4 py-2 text-[#1E293B] text-sm font-medium hover:text-[#FF6F00] transition-colors">
                  Contact
                </TransitionLink>
              )}
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Globe Icon - Navigate to Vault */}
              {!hiddenPages.includes("vault") && (
                <TransitionLink href="/vault" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-[#FF6F00] hover:bg-[#FFF4E5] transition-all duration-200 cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#1E293B" strokeWidth="1.5"/>
                    <path d="M2 12H22" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="#1E293B" strokeWidth="1.5"/>
                  </svg>
                </TransitionLink>
              )}

              {isAuthenticated && user ? (
                <>
                  {/* Dashboard Button */}
                  <TransitionLink
                    href={isAdmin ? "/admin" : "/dashboard"}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6F00] hover:bg-[#E86400] text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#FF6F00]/25"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    {isAdmin ? "Admin Panel" : "Dashboard"}
                  </TransitionLink>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-3 px-3 py-2 rounded-full border border-gray-200 hover:border-[#FF6F00] hover:bg-[#FFF4E5] transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-[#FF6F00] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#1E293B] max-w-[100px] truncate">
                        {user.firstName}
                      </span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                      >
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Profile Dropdown Menu */}
                    <div className={`absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-200 origin-top-right ${profileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                      {/* User Info Header */}
                      <div className="px-4 py-4 bg-gradient-to-r from-[#000E51] to-[#001a7a]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#FF6F00] rounded-full flex items-center justify-center border-2 border-white/20">
                            <span className="text-white font-bold text-lg">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-white/70 text-sm truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <TransitionLink
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-[#1E293B] hover:bg-[#FFF4E5] hover:text-[#FF6F00] transition-colors"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                          <span className="text-sm font-medium">My Profile</span>
                        </TransitionLink>

                        <TransitionLink
                          href="/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-[#1E293B] hover:bg-[#FFF4E5] hover:text-[#FF6F00] transition-colors"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                          </svg>
                          <span className="text-sm font-medium">Settings</span>
                        </TransitionLink>

                        <div className="border-t border-gray-100 my-2"></div>

                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Login Button */}
                  <TransitionLink href="/signin" className="px-6 py-2.5 text-[#1E293B] text-sm font-semibold border border-gray-200 rounded-full hover:border-[#FF6F00] hover:text-[#FF6F00] transition-all duration-200">
                    Login
                  </TransitionLink>

                  {/* Sign Up Button */}
                  <TransitionLink href="/signup" className="px-6 py-2.5 bg-[#FF6F00] hover:bg-[#E86400] text-white text-sm font-semibold rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6F00]/25">
                    Sign Up
                  </TransitionLink>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-[#1E293B] rounded-full transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                <span className={`w-full h-0.5 bg-[#1E293B] rounded-full transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
                <span className={`w-full h-0.5 bg-[#1E293B] rounded-full transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 h-full w-[85%] max-w-[380px] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <Image
              src="/icon/main-logo.svg"
              alt="LKnight Productions"
              width={120}
              height={40}
              className="h-[36px] w-auto"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* The Vault Button - Mobile */}
            {!hiddenPages.includes("vault") && (
              <div className="px-4 mb-4">
                <TransitionLink
                  href="/vault"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-[#FF6F001A] hover:bg-[#FF6F0033] text-[#FF6F00] text-sm font-semibold rounded-lg transition-all duration-200"
                >
                  <Image
                    src="/icon/vault.svg"
                    alt="Vault"
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  The Vault
                </TransitionLink>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="px-4 space-y-1">
              {/* Platform Accordion */}
              {!hiddenPages.includes("platform") && (
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleMobileAccordion("platform")}
                    className="flex items-center justify-between w-full py-3 text-[#1E293B] text-base font-medium"
                  >
                    Platform
                    <ChevronDown className={`transition-transform duration-300 ${mobileAccordion === "platform" ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${mobileAccordion === "platform" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="pb-3 space-y-3">
                      {platformItems.map((item, index) => (
                        <a key={index} href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#FFF4E5] flex-shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-[#000E51]">{item.title}</h4>
                            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Enterprise Accordion */}
              {!hiddenPages.includes("enterprise") && (
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleMobileAccordion("enterprise")}
                    className="flex items-center justify-between w-full py-3 text-[#1E293B] text-base font-medium"
                  >
                    Enterprise
                    <ChevronDown className={`transition-transform duration-300 ${mobileAccordion === "enterprise" ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${mobileAccordion === "enterprise" ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="pb-3 space-y-3">
                      {enterpriseItems.map((item, index) => (
                        <a key={index} href="#" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#FFF4E5] flex-shrink-0">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-[#000E51]">{item.title}</h4>
                            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Simple Links */}
              {!hiddenPages.includes("courses") && (
                <TransitionLink href="/courses" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[#1E293B] text-base font-medium border-b border-gray-100 hover:text-[#FF6F00] transition-colors">
                  Courses
                </TransitionLink>
              )}
              {!hiddenPages.includes("pricing") && (
                <TransitionLink href="/pricing" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[#1E293B] text-base font-medium border-b border-gray-100 hover:text-[#FF6F00] transition-colors">
                  Pricing
                </TransitionLink>
              )}
              {!hiddenPages.includes("about") && (
                <TransitionLink href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[#1E293B] text-base font-medium border-b border-gray-100 hover:text-[#FF6F00] transition-colors">
                  About
                </TransitionLink>
              )}
              {!hiddenPages.includes("contact") && (
                <TransitionLink href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-[#1E293B] text-base font-medium border-b border-gray-100 hover:text-[#FF6F00] transition-colors">
                  Contact
                </TransitionLink>
              )}
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t border-gray-100 space-y-3">
            {/* Globe - Navigate to Vault */}
            {!hiddenPages.includes("vault") && (
              <TransitionLink href="/vault" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 w-full py-2 text-[#1E293B] text-sm font-medium hover:text-[#FF6F00] transition-colors cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                The Vault
              </TransitionLink>
            )}

            {isAuthenticated && user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-[#FF6F00] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1E293B] truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Dashboard & Profile Links */}
                <div className="space-y-2">
                  <TransitionLink
                    href={isAdmin ? "/admin" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full py-3 px-4 text-white text-sm font-semibold bg-[#FF6F00] rounded-xl hover:bg-[#E86400] transition-all duration-200 shadow-md"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                    {isAdmin ? "Admin Panel" : "Dashboard"}
                  </TransitionLink>

                  <TransitionLink
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full py-3 px-4 text-[#1E293B] text-sm font-medium border border-gray-200 rounded-xl hover:border-[#FF6F00] hover:text-[#FF6F00] transition-all duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    My Profile
                  </TransitionLink>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 text-red-600 text-sm font-semibold border border-red-200 rounded-full hover:bg-red-50 transition-all duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              /* Auth Buttons */
              <div className="flex gap-3">
                <TransitionLink href="/signin" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-3 text-center text-[#1E293B] text-sm font-semibold border border-gray-200 rounded-full hover:border-[#FF6F00] hover:text-[#FF6F00] transition-all duration-200">
                  Login
                </TransitionLink>
                <TransitionLink href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-3 text-center bg-[#FF6F00] hover:bg-[#E86400] text-white text-sm font-semibold rounded-full transition-all duration-200">
                  Sign Up
                </TransitionLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
