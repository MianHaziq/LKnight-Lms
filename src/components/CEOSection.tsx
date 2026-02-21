import Image from "next/image";

export default function CEOSection() {
  return (
    <section className="w-full relative min-h-[650px] lg:min-h-[750px]">
      {/* Gradient Background - White at top, Dark blue at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 20%, #000E51 60%, #000E51 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-12 flex justify-start  min-h-[650px] lg:min-h-[750px]">
        {/* Card - 1332px width on 1440px screen */}
        <div
          className="bg-white overflow-hidden w-full"
          style={{
            borderRadius: "22px",
            padding: "24.8px 45.47px 24.8px 24.8px",
            boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            maxWidth: "1332px",
          }}
        >
          <div
            className="flex flex-col lg:flex-row items-stretch"
            style={{ gap: "45.47px" }}
          >
            {/* CEO Image - 432.98px x 555.95px */}
            <div
              className="relative w-full lg:w-[433px] h-[350px] sm:h-[450px] lg:h-[556px] flex-shrink-0"
              style={{
                borderRadius: "20.67px",
                overflow: "hidden",
              }}
            >
              <Image
                src="/icon/ceo.png"
                alt="Max Tyson - CEO of LKnight"
                fill
                className="object-cover object-top"
                priority
              />
            </div>

            {/* Content - 783.29px width */}
            <div
              className="flex-1 flex flex-col justify-center"
              style={{
                maxWidth: "783.29px",
                paddingTop: "20.67px",
                paddingBottom: "20.67px",
              }}
            >
              {/* Label */}
              <span className="text-[#FF6F00] text-xs sm:text-sm font-medium tracking-wider mb-2 lg:mb-3">
                Meet Our CEO
              </span>

              {/* Name */}
              <h2 className="text-[#000E51] text-2xl sm:text-3xl lg:text-[42px] font-bold leading-tight mb-2 lg:mb-3">
                Max Tyson
              </h2>

              {/* Tagline with underline */}
              <p className="text-[#FF6F00] text-sm lg:text-base italic border-b border-[#FF6F00] inline-block self-start pb-0.5 mb-5 lg:mb-6">
                Driving Vision. Building Excellence.
              </p>

              {/* Description */}
              <div className="space-y-3 lg:space-y-4 text-[#64748B] text-[13px] lg:text-[15px] leading-[1.75]">
                <p>
                  Founder & CEO of LKnight, leads the company with a clear
                  vision — to build powerful, reliable, and future-ready digital
                  solutions. With a strong focus on innovation, quality, and
                  long-term impact, he believes great products are created when
                  strategy meets thoughtful execution.
                </p>
                <p>
                  With years of experience in leadership and digital growth, Max
                  Tyson has worked closely with teams and clients to transform
                  ideas into scalable solutions. His approach combines
                  creativity, discipline, and a deep understanding of modern
                  technology.
                </p>
                <p>
                  Under his leadership, LKnight continues to grow as a trusted
                  partner for businesses looking to innovate, scale, and succeed
                  in the digital world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
