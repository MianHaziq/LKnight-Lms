import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MeetTheTeam from "@/components/MeetTheTeam";
import TestimonialSection from "@/components/TestimonialSection";
import RefundFAQ from "@/components/RefundFAQ";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About Us - Our Mission & Story",
  description:
    "Learn about LKnight Learning Hub's mission to strengthen leaders, teams, and organizations through practical, expert-led leadership development.",
  keywords: ["about lknight", "our story", "education mission", "learning community"],
  canonical: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Background Image */}
      <section
        className="w-full relative bg-[#000E51]"
        style={{
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
    {/* Background Image Overlay */}
<div
  className="absolute inset-0 opacity-55"
  style={{
    backgroundImage: "url('/aboutheader.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
/>

        {/* Content */}
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h1 className="text-white text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight mb-4">
              Leadership Development That Changes How People Lead
            </h1>
            <p className="text-white/80 text-sm sm:text-base lg:text-[16px] leading-relaxed max-w-[600px] mx-auto">
              LKnight Learning Hub was built to help leaders think clearly, communicate effectively, and lead people well under pressure. Through the combined lens of organizational strategy and clinical mental health insight, we provide practical leadership development designed for the realities leaders face every day.
            </p>
          </div>
        </div>
      </section>


      {/* Our Story Section */}
      <section className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 lg:max-w-[500px]">
              <h2 className="text-[#000E51] text-xl sm:text-2xl lg:text-[28px] font-bold mb-5">
                Our Story
              </h2>

            <div className="space-y-4 text-[#64748B] text-sm lg:text-[15px] leading-[1.8]">
  <p>
    LKnight Productions was founded by Lunka Crawford,
    organizational strategist and HR executive, alongside co-founder
    Ken Crawford, licensed psychotherapist and mental health
    professional.
  </p>

  <p>
    After years of navigating complex organizational challenges,
    leadership breakdowns, culture shifts, and high-pressure business
    environments, they recognized a common pattern: organizations were
    investing in leadership development, but leaders were still
    struggling beneath the surface.
  </p>

  <p>
    Not because they lacked intelligence or capability — but because
    pressure changes how people think, communicate, respond, and lead.
    By combining organizational strategy with clinical insight, LKnight
    was created to bridge the gap between leadership performance and
    human behavior.
  </p>

  <p>
    The LKnight Learning Hub delivers practical leadership development
    built for real-world application. Courses focus on communication,
    emotional regulation, executive presence, accountability, burnout
    prevention, team dynamics, trust, and organizational health —
    creating transformation that impacts people, culture, and execution.
  </p>
</div>
            </div>

            {/* Right Image with Stats Badge */}
            <div className="flex-1 w-full lg:max-w-[650px] relative">
              {/* Main Image */}
            <div className="relative w-full h-[280px] sm:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden">
  <img
    src="/50kImage.jpeg"
    alt="LKnight Productions - Our Story"
    className="w-full h-full object-cover"
  />
</div>

              {/* Stats Badge */}
              {/* <div
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#000E51]/90 backdrop-blur-sm text-white px-5 py-4 sm:px-6 sm:py-5"
                style={{
                  borderRadius: "12px",
                }}
              >
                <div className="text-2xl sm:text-3xl lg:text-[36px] font-bold leading-none">
                  50K+
                </div>
                <div className="text-white/70 text-xs sm:text-sm mt-1">
                  Active Learners
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
{/* Our Values Section */}
<section className="w-full bg-[#F8F9FC] py-14 lg:py-16">
  <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
    {/* Header */}
    <div className="text-center mb-10 lg:mb-12">
      <h2 className="text-[#000E51] text-xl sm:text-2xl lg:text-[26px] font-bold mb-3">
        Our Values
      </h2>
      <p className="text-[#64748B] text-sm lg:text-[15px] max-w-2xl mx-auto leading-relaxed">
        The principles that shape how we lead, teach, and serve organizations through LKnight.
      </p>
    </div>

    {/* Values Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      
      {/* Self-Awareness */}
      <div className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-all duration-300">
        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#E8EAF6] flex items-center justify-center mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="text-[#000E51] text-sm lg:text-[15px] font-semibold mb-3">
          Self-Awareness
        </h3>

        <p className="text-[#64748B] text-xs lg:text-[13px] leading-relaxed">
          Strong leadership starts with self-awareness. How leaders communicate,
          regulate pressure, and make decisions impacts every part of an organization.
        </p>
      </div>

      {/* Human-Centered Leadership */}
      <div className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-all duration-300">
        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#E8EAF6] flex items-center justify-center mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="text-[#000E51] text-sm lg:text-[15px] font-semibold mb-3">
          Human-Centered Leadership
        </h3>

        <p className="text-[#64748B] text-xs lg:text-[13px] leading-relaxed">
          People are not machines. We help leaders build cultures rooted in clarity,
          accountability, trust, and emotional intelligence.
        </p>
      </div>

      {/* Courageous Conversations */}
      <div className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-all duration-300">
        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#E8EAF6] flex items-center justify-center mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 9H16"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M8 13H13"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h3 className="text-[#000E51] text-sm lg:text-[15px] font-semibold mb-3">
          Courageous Conversations
        </h3>

        <p className="text-[#64748B] text-xs lg:text-[13px] leading-relaxed">
          Growth requires honesty. We create space for leaders and teams to navigate
          difficult conversations, conflict, feedback, and change with intention.
        </p>
      </div>

      {/* Sustainable Leadership */}
      <div className="flex flex-col items-center text-center bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] hover:shadow-md transition-all duration-300">
        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-[#E8EAF6] flex items-center justify-center mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2V6"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 18V22"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M4.93 4.93L7.76 7.76"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M16.24 16.24L19.07 19.07"
              stroke="#000E51"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="5"
              stroke="#000E51"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <h3 className="text-[#000E51] text-sm lg:text-[15px] font-semibold mb-3">
          Sustainable Leadership
        </h3>

        <p className="text-[#64748B] text-xs lg:text-[13px] leading-relaxed">
          Leadership should not come at the expense of health, identity, or
          relationships. Sustainable leadership creates healthier cultures and stronger teams.
        </p>
      </div>
    </div>
  </div>
</section>



{/* Founders Section */}
<section className="w-full bg-white py-14 lg:py-20 overflow-hidden">
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
    
    {/* Main Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-[460px_minmax(0,1fr)] gap-10 lg:gap-14 items-center">
      
      {/* Left Side - Image */}
      <div className="relative flex justify-center lg:justify-start">
        
        {/* Background Shape */}
        <div className="absolute bottom-[-18px] right-[-18px] w-[92%] h-[92%] rounded-[36px] bg-[#E8EAF6]" />

        {/* Image */}
        <div className="relative z-10 w-full max-w-[440px]">
          <img
            src="/founder.jpeg"
            alt="Lunka Crawford and Ken Crawford"
            className="w-full h-[620px] object-cover object-top rounded-[30px] shadow-[0_20px_60px_rgba(0,14,81,0.10)]"
          />

          {/* Floating Card */}
          <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl border border-[#E2E8F0]">
            <p className="text-[#000E51] text-sm font-semibold leading-none mb-1">
              LKnight Productions
            </p>

            <p className="text-[#64748B] text-xs">
              Leadership • Culture • Growth
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="max-w-[760px]">
        
        {/* Badge — removed per client request (Founders & Leadership) */}
        {/* <div className="inline-flex items-center gap-2 bg-[#E8EAF6] text-[#000E51] text-[11px] font-semibold px-4 py-2 rounded-full mb-5">
          <span className="w-2 h-2 rounded-full bg-[#000E51]" />
          Founders
        </div> */}

        {/* Heading */}
        <h2 className="text-[#000E51] text-2xl sm:text-5xl lg:text-[36px] leading-[1.05] tracking-[-2px] font-bold mb-6">
          Building Healthier Leadership Cultures That Strengthen People & Performance
        </h2>

        {/* Paragraphs */}
        <div className="space-y-5 text-[#64748B] text-[15px] lg:text-[16px] leading-[1.9]">
          
          <p>
            LKnight Productions was founded by{" "}
            <span className="font-semibold text-[#000E51]">
              Lunka Crawford
            </span>{" "}
            and{" "}
            <span className="font-semibold text-[#000E51]">
              Ken Crawford
            </span>{" "}
            with a shared mission: helping leaders lead people more effectively
            without losing themselves in the process.
          </p>

          <p>
            Together, they bring two powerful lenses into one leadership
            experience. Lunka brings nearly two decades of experience in
            organizational strategy, HR leadership, employee relations,
            leadership development, and workplace culture transformation across
            complex enterprise environments.
          </p>

          <p>
            Ken brings over 15 years of experience in the mental health field,
            including clinical expertise in emotional regulation, behavioral
            patterns, communication, stress, trauma, and relational dynamics.
          </p>

          <p>
            Their combined approach helps leaders move beyond surface-level
            development into real behavioral change that impacts communication,
            trust, accountability, team health, and organizational performance.
          </p>

          <p>
            Through workshops, executive coaching, speaking engagements,
            consulting, and the LKnight Learning Hub, Lunka and Ken help
            organizations build healthier leadership cultures that strengthen
            both people and execution.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-8">
          
          <div className="bg-[#F8F9FC] border border-[#E2E8F0] rounded-2xl px-6 py-5 min-w-[190px]">
            <h3 className="text-[#000E51] text-3xl font-bold leading-none mb-2">
              20+
            </h3>

            <p className="text-[#64748B] text-[11px] uppercase tracking-wide leading-relaxed">
              Years in HR &amp; Organizational Strategy
            </p>
          </div>

          <div className="bg-[#F8F9FC] border border-[#E2E8F0] rounded-2xl px-6 py-5 min-w-[190px]">
            <h3 className="text-[#000E51] text-3xl font-bold leading-none mb-2">
              15+
            </h3>

            <p className="text-[#64748B] text-[11px] uppercase tracking-wide leading-relaxed">
              Years Mental Health Expertise
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Refund Policy Section */}
      <RefundFAQ />

      {/* Meet the Team Section */}
      {/* <MeetTheTeam /> */}
      <TestimonialSection page="about" />

      <Footer />
    </div>
  );
}
