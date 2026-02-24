"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";

// Feature item component
const FeatureItem = ({
  text,
  included,
}: {
  text: string;
  included: boolean;
}) => (
  <div className="flex items-start gap-2.5 py-[6px]">
    {included ? (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="flex-shrink-0 mt-0.5"
      >
        <path
          d="M11.6669 3.5L5.25023 9.91667L2.33356 7"
          stroke="#1a1f4e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="flex-shrink-0 mt-0.5"
      >
        <path
          d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
          stroke="#d1d5db"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
    <span
      className={`text-[13px] leading-tight ${
        included ? "text-gray-600" : "text-gray-400"
      }`}
    >
      {text}
    </span>
  </div>
);

// Plan icon component
const PlanIcon = ({
  type,
}: {
  type: "basic" | "pro" | "team" | "enterprise";
}) => {
  return (
    <div className="w-7 h-7 flex-shrink-0">
      {type === "basic" && (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="28" height="28" rx="6" fill="#1a1f4e" fillOpacity="0.1" />
          <path
            d="M9 11H11V19H9V11ZM13 8H15V19H13V8ZM17 14H19V19H17V14Z"
            fill="#1a1f4e"
          />
        </svg>
      )}
      {type === "pro" && (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="28" height="28" rx="6" fill="#FF6F00" fillOpacity="0.15" />
          <path
            d="M14 7L15.545 11.91L20.5 12.18L16.59 15.36L17.82 20.18L14 17.27L10.18 20.18L11.41 15.36L7.5 12.18L12.455 11.91L14 7Z"
            fill="#FF6F00"
          />
        </svg>
      )}
      {type === "team" && (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="28" height="28" rx="6" fill="#1a1f4e" fillOpacity="0.1" />
          <path
            d="M11 13C12.1046 13 13 12.1046 13 11C13 9.89543 12.1046 9 11 9C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13Z"
            fill="#1a1f4e"
          />
          <path
            d="M17 13C18.1046 13 19 12.1046 19 11C19 9.89543 18.1046 9 17 9C15.8954 9 15 9.89543 15 11C15 12.1046 15.8954 13 17 13Z"
            fill="#1a1f4e"
          />
          <path
            d="M11 15C8.79 15 7 16.79 7 19H15C15 16.79 13.21 15 11 15Z"
            fill="#1a1f4e"
          />
          <path
            d="M17 15C16.53 15 16.09 15.1 15.67 15.24C16.5 16.27 17 17.58 17 19H21C21 16.79 19.21 15 17 15Z"
            fill="#1a1f4e"
          />
        </svg>
      )}
      {type === "enterprise" && (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="28" height="28" rx="6" fill="#1a1f4e" fillOpacity="0.1" />
          <path
            d="M8 20H20V10L14 7L8 10V20ZM10 12H12V14H10V12ZM10 16H12V18H10V16ZM14 12H16V14H14V12ZM14 16H16V18H14V16Z"
            fill="#1a1f4e"
          />
        </svg>
      )}
    </div>
  );
};

// Pricing card component
interface PricingCardProps {
  type: "basic" | "pro" | "team" | "enterprise";
  name: string;
  description: string;
  price: string;
  period: string;
  savings?: string;
  buttonText: string;
  features: { text: string; included: boolean }[];
  isPopular?: boolean;
}

const PricingCard = ({
  type,
  name,
  description,
  price,
  period,
  savings,
  buttonText,
  features,
  isPopular = false,
}: PricingCardProps) => {
  return (
    <div className={`relative ${isPopular ? "lg:-mt-4 lg:mb-4" : ""}`}>
      {/* Most Popular Badge - Outside card */}
      {isPopular && (
        <div className="flex justify-center mb-0">
          <span className="bg-[#FF6F00] text-white text-[11px] font-medium px-4 py-1.5 rounded-t-lg">
            Most Popular
          </span>
        </div>
      )}

      <div
        className={`bg-white rounded-[10px] p-5 lg:p-6 h-full ${
          isPopular
            ? "shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-l-[3px] border-l-[#FF6F00] border-t border-r border-b border-t-gray-100 border-r-gray-100 border-b-gray-100"
            : "shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100"
        }`}
      >
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 mb-1.5">
            <PlanIcon type={type} />
            <h3 className="text-[15px] font-semibold text-gray-900">{name}</h3>
          </div>
          <p className="text-[12px] text-gray-500 leading-relaxed pl-[38px]">
            {description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-5">
          <div className="flex items-baseline">
            <span className="text-[32px] font-bold text-gray-900 leading-none">
              {price}
            </span>
            {period && (
              <span className="text-gray-400 text-[13px] ml-0.5">{period}</span>
            )}
          </div>
          {savings && (
            <p className="text-[#FF6F00] text-[12px] mt-1">{savings}</p>
          )}
        </div>

        {/* CTA Button */}
        <button
          className={`w-full py-2.5 px-4 rounded-[6px] text-[13px] font-medium transition-all mb-5 ${
            isPopular
              ? "bg-[#FF6F00] hover:bg-[#e66300] text-white shadow-sm"
              : "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          {buttonText}
        </button>

        {/* Features */}
        <div className="space-y-0">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              text={feature.text}
              included={feature.included}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const plans: PricingCardProps[] = [
    {
      type: "basic",
      name: "Basic",
      description: "Perfect for casual learners exploring new skills",
      price: "$190",
      period: "/yr",
      savings: "Save $38 per year",
      buttonText: "Start Basic",
      features: [
        { text: "Access to 100+ courses", included: true },
        { text: "HD video quality", included: true },
        { text: "Course completion certificates", included: true },
        { text: "Mobile app access", included: true },
        { text: "Email support", included: true },
        { text: "Offline downloads", included: false },
        { text: "Live sessions", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      type: "pro",
      name: "Pro",
      description: "For dedicated learners serious about growth",
      price: "$390",
      period: "/yr",
      savings: "Save $78 per year",
      buttonText: "Start Pro",
      isPopular: true,
      features: [
        { text: "Access to all 500+ courses", included: true },
        { text: "4K video quality", included: true },
        { text: "Course completion certificates", included: true },
        { text: "Mobile app access", included: true },
        { text: "Offline downloads", included: true },
        { text: "Live Q&A sessions", included: true },
        { text: "Priority support", included: true },
        { text: "Learning paths", included: true },
      ],
    },
    {
      type: "team",
      name: "Team",
      description: "Perfect for small teams and startups",
      price: "$990",
      period: "/yr",
      savings: "Save $198 per year",
      buttonText: "Start Team Plan",
      features: [
        { text: "Everything in Pro", included: true },
        { text: "Up to 10 team members", included: true },
        { text: "Team admin dashboard", included: true },
        { text: "Progress tracking", included: true },
        { text: "Custom learning paths", included: true },
        { text: "Team analytics", included: true },
        { text: "Dedicated account manager", included: true },
      ],
    },
    {
      type: "enterprise",
      name: "Enterprise",
      description: "For organizations with advanced needs",
      price: "Custom",
      period: "",
      buttonText: "Contact Sales",
      features: [
        { text: "Everything in Team", included: true },
        { text: "Unlimited team members", included: true },
        { text: "SSO integration", included: true },
        { text: "Custom branding", included: true },
        { text: "API access", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom content creation", included: true },
        { text: "Dedicated success manager", included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      <Navbar />

      {/* Header Section */}
      <div className="bg-[#1a1f4e] pt-20 pb-36 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-bold text-white mb-3 leading-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 text-[14px] md:text-[15px] max-w-xl mx-auto">
            Choose the plan that fits your leadership level. All plans include a
            14-day free trial.
          </p>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="relative">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 -mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4 items-start">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>

        {/* 50K+ Active Learners Badge */}
        <div className="flex justify-end max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mt-6">
          <div className="bg-[#1a1f4e] text-white px-5 py-3 rounded-lg shadow-lg inline-block">
            <div className="text-[22px] font-bold text-[#FF6F00] leading-tight">
              50K+
            </div>
            <div className="text-[11px] text-gray-300">Active Learners</div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </div>
  );
}
