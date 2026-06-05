"use client";

import { useRef, useState } from "react";

export default function RefundFAQ() {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <section className="w-full bg-white py-12 lg:py-16 border-t border-[#E2E8F0]">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-[#000E51] text-[11px] font-semibold uppercase tracking-[0.15em]">
            Refund Policy
          </span>
          <h2 className="text-[#000E51] text-xl sm:text-2xl lg:text-[26px] font-bold mt-2 tracking-[-0.3px]">
            Frequently Asked
          </h2>
        </div>

        <div
          className={`bg-white border rounded-lg overflow-hidden transition-colors duration-200 ${
            open ? "border-[#000E51]/40" : "border-[#E2E8F0] hover:border-[#000E51]/30"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left"
          >
            <span className="text-[#000E51] text-[15px] font-semibold">
              Can I get a refund?
            </span>
            <svg
              className={`flex-shrink-0 text-[#64748B] transition-transform duration-300 ease-out ${
                open ? "rotate-180" : "rotate-0"
              }`}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            style={{
              gridTemplateRows: open ? "1fr" : "0fr",
            }}
            className="grid transition-[grid-template-rows] duration-300 ease-out"
          >
            <div className="overflow-hidden">
              <div
                ref={contentRef}
                className={`px-5 sm:px-6 pb-5 border-t border-[#E2E8F0] transition-opacity duration-300 ${
                  open ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-[#64748B] text-sm leading-[1.75] pt-4">
                  We offer a{" "}
                  <span className="font-semibold text-[#000E51]">
                    14-day money-back guarantee
                  </span>{" "}
                  for the LKnight Learning Hub. If you are not satisfied with
                  your purchase, please contact us within 14 days of your
                  enrollment date to request a refund. Refund eligibility may be
                  limited if a substantial portion of the course content has
                  been accessed or completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
