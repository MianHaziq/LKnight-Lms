"use client";

import { useState, useEffect } from "react";
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
    subject: "general",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

  const handleSubjectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
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
        subject: "general",
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
    { value: "general", label: "General Inquiry" },
    { value: "support", label: "Technical Support" },
    { value: "sales", label: "Course Enrollment" },
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
                    <a href="mailto:inquiries@lknightproductions.com" className="text-sm hover:underline">inquiries@lknightproductions.com</a>
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
                  {/* Twitter */}
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-[#1a1f4e] hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-[#1a1f4e] hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* Discord */}
                  <a
                    href="#"
                    className="w-8 h-8 rounded-full bg-[#1a1f4e] hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
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

                {/* Subject Selection */}
                <div>
                  <label className="block text-xs text-gray-500 mb-4">
                    Select Subject?
                  </label>
                  <div className="flex flex-wrap gap-4 md:gap-6">
                    {subjects.map((subject, index) => (
                      <label
                        key={subject.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className="relative">
                          <input
                            type="radio"
                            name="subject"
                            value={subject.value}
                            checked={formData.subject === subject.value}
                            onChange={() => handleSubjectChange(subject.value)}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              formData.subject === subject.value
                                ? "border-[#1a1f4e]"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.subject === subject.value && (
                              <div className="w-2 h-2 bg-[#1a1f4e] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-700">
                          {subject.label}
                        </span>
                      </label>
                    ))}
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
              <div className="absolute bottom-0 right-0 w-[200px] h-[160px] pointer-events-none hidden lg:block">
                <Image
                  src="/icon/plane.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
