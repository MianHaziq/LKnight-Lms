"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { contactApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pre-fill form with logged-in user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    setIsLoading(true);

    try {
      const response = await contactApi.submit(formData);
      setSubmitStatus({
        type: "success",
        message: response.message || "Message sent successfully! We'll get back to you soon.",
      });
      setFormData({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setSubmitStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to send message. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subjects = [
    { value: "lms-access", label: "LMS Access & Membership Questions" },
    { value: "corporate-licensing", label: "Corporate LMS Licensing" },
    { value: "leadership-workshops", label: "Leadership Workshops & Training" },
    { value: "executive-coaching", label: "Executive Coaching & Elevation Series" },
    { value: "speaking-keynote", label: "Speaking & Keynote Engagements" },
    { value: "insight-survey", label: "Insight Survey & Organizational Assessment" },
    { value: "partnership", label: "Partnership Opportunities" },
    { value: "media-podcast", label: "Media & Podcast Inquiries" },
    { value: "technical-support", label: "Technical Support" },
    { value: "general", label: "General Inquiry" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Header Section */}
      <div className="text-center pt-16 pb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
          Contact Us
        </h1>
        <p className="text-gray-500 text-base">
          Any question or remarks? Just write us a message!
        </p>
      </div>

      {/* Contact Container */}
      <div className="max-w-[1100px] mx-auto px-4 pb-16">
        <div className="bg-white rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.08)] p-2 md:p-3">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Contact Information Card */}
            <div className="relative bg-[#1a1f4e] rounded-xl p-8 md:p-10 lg:w-[380px] text-white overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute bottom-0 right-0 w-[180px] h-[180px] rounded-full bg-[#484c78] opacity-60 translate-x-[30%] translate-y-[30%]" />
              <div className="absolute bottom-[60px] right-[60px] w-[120px] h-[120px] rounded-full bg-[#6b5c4c] opacity-50" />

              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-2">
                  Contact Information
                </h2>
                <p className="text-gray-300 text-sm mb-10">
                  Say something to start a live chat!
                </p>

                {/* Contact Details */}
                <div className="space-y-8 mb-20">
                  {/* Phone */}
                  <div className="flex items-center gap-5">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <a href="tel:+18329535517" className="text-sm hover:underline">(832) 953-5517</a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-5">
                    <div className="w-6 h-6 flex-shrink-0">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-1">
                      <a href="mailto:inquiries@lknightproductions.com" className="text-sm hover:underline">inquiries@lknightproductions.com</a>
                      {/* <a href="mailto:Lunka_Crawford@lknightproductions.com" className="text-sm hover:underline">Lunka_Crawford@lknightproductions.com</a> */}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-5">
                    <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <span className="text-sm leading-relaxed">
                      7312 Louetta Rd. Ste. B118-160,
                      <br />
                      Spring, Texas 77379
                    </span>
                  </div>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-4">
                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/company/lknight-productions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1a1f4e] hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/LKnightProductions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1a1f4e] hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/lknightproductions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1a1f4e] hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://www.tiktok.com/@lknightproductions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[#1a1f4e] hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 448 512" fill="white">
                      <path d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3v178.8A162.6 162.6 0 1 1 185 188.3v89.9a74.6 74.6 0 1 0 52.2 71.2V0h88a121 121 0 0 0 1.9 22.2 122.2 122.2 0 0 0 53.9 80.2 121 121 0 0 0 67 20.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="flex-1 p-6 md:p-10 lg:p-12 relative">
              {/* Status Message */}
              {submitStatus && (
                <div
                  className={`p-4 rounded-lg mb-2 text-sm ${
                    submitStatus.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-600"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="w-full border-b border-gray-300 pb-2 text-sm text-gray-900 focus:outline-none focus:border-[#1a1f4e] transition-colors bg-transparent placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full border-b border-gray-300 pb-2 text-sm text-gray-900 focus:outline-none focus:border-[#1a1f4e] transition-colors bg-transparent placeholder:text-gray-900"
                    />
                  </div>
                </div>

                {/* Email and Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full border-b border-gray-300 pb-2 text-sm text-gray-900 focus:outline-none focus:border-[#1a1f4e] transition-colors bg-transparent placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">
                      Phone Number <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (832) 953-5517"
                      className="w-full border-b border-gray-300 pb-2 text-sm text-gray-900 focus:outline-none focus:border-[#1a1f4e] transition-colors bg-transparent placeholder:text-gray-900"
                    />
                  </div>
                </div>

                {/* Subject Selection - Custom Dropdown */}
                <div ref={dropdownRef} className="relative">
                  <label className="block text-xs text-gray-500 mb-2">
                    Inquiry Subject <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`w-full flex items-center justify-between border-b pb-2 pt-1 text-sm text-left transition-colors bg-transparent cursor-pointer ${
                      isDropdownOpen ? "border-[#1a1f4e]" : "border-gray-300"
                    }`}
                  >
                    <span className={formData.subject ? "text-gray-900" : "text-gray-400"}>
                      {formData.subject
                        ? subjects.find((s) => s.value === formData.subject)?.label
                        : "Select an inquiry subject..."}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M6 9L12 15L18 9" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden transition-all duration-200 origin-top ${
                      isDropdownOpen
                        ? "opacity-100 scale-y-100 translate-y-0"
                        : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="max-h-[280px] overflow-y-auto py-1 scrollbar-thin">
                      {subjects.map((subject) => (
                        <button
                          key={subject.value}
                          type="button"
                          onClick={() => handleSubjectSelect(subject.value)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 flex items-center gap-3 cursor-pointer ${
                            formData.subject === subject.value
                              ? "bg-[#FFF4E5] text-[#FF6F00] font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              formData.subject === subject.value
                                ? "bg-[#FF6F00]"
                                : "bg-gray-300"
                            }`}
                          />
                          {subject.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write your message.."
                    rows={1}
                    className="w-full border-b border-gray-300 pb-2 text-sm text-gray-900 focus:outline-none focus:border-[#1a1f4e] transition-colors resize-none bg-transparent placeholder:text-gray-400"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#FF6F00] hover:bg-[#e66300] text-white px-8 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Contact us
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
                            fill="white"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Plane SVG Decoration */}
              {/* <div className="absolute bottom-0 right-0 w-[200px] h-[160px] pointer-events-none hidden lg:block">
                <Image
                  src="/icon/plane.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
