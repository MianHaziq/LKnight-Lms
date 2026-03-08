import Image from "next/image";

export default function CEOSection() {
  return (
    <section className="w-full relative min-h-[600px] sm:min-h-[650px] lg:min-h-[750px]">
      {/* Gradient Background - White at top, Dark blue at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 20%, #000E51 60%, #000E51 100%)",
        }}
      />

      {/* Content Container */}
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pb-12 flex justify-start min-h-[600px] sm:min-h-[650px] lg:min-h-[750px]">
        {/* Card */}
        <div
          className="bg-white overflow-hidden w-full rounded-2xl lg:rounded-[22px] p-5 sm:p-6 lg:py-6 lg:pl-6 lg:pr-11"
          style={{
            boxShadow: "0 4px 30px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            maxWidth: "1332px",
          }}
        >
          <div className="flex flex-col lg:flex-row items-stretch gap-6 sm:gap-8 lg:gap-11">
            {/* CEO Image */}
            <div className="relative w-full lg:w-[433px] h-[400px] sm:h-[480px] lg:h-[556px] flex-shrink-0 rounded-2xl lg:rounded-[20.67px] overflow-hidden">
              <Image
                src="/ceo.jpeg"
                alt="Lunka Crawford - Founder & CEO, LKnight Productions"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 433px"
                priority
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center py-2 sm:py-4 lg:py-5">
              {/* Label */}
              <span className="text-[#FF6F00] text-xs sm:text-sm font-medium tracking-wider uppercase mb-2 lg:mb-3">
                Meet Our CEO
              </span>

              {/* Name */}
              <h2 className="text-[#000E51] text-2xl sm:text-3xl lg:text-[42px] font-bold leading-tight mb-1 lg:mb-2">
                Lunka Crawford
              </h2>

              {/* Title */}
              <p className="text-[#FF6F00] text-sm lg:text-base italic border-b border-[#FF6F00] inline-block self-start pb-0.5 mb-5 lg:mb-6">
                Founder & CEO, LKnight Productions
              </p>

              {/* Description */}
              <div className="space-y-3 lg:space-y-4 text-[#64748B] text-[13px] sm:text-[14px] lg:text-[15px] leading-[1.8]">
                <p>
                  I built LKnight because I have seen what leadership pressure
                  does behind closed doors. For nearly two decades, I worked
                  inside organizations navigating talent strategy, executive
                  dynamics, and performance tension. What became clear to me is
                  this: skill alone is not enough. Leaders need structure,
                  self-awareness, and the ability to regulate under pressure.
                </p>
                <p>
                  I did not build LKnight to inspire leaders. I built it to
                  refine them.
                </p>
                <p>
                  This work is strategic and deeply human. We address both
                  performance and presence because sustainable leadership
                  requires both. LKnight exists to strengthen the leader and the
                  organization at the same time.
                </p>
                <p className="text-[#000E51] font-medium italic mt-4 lg:mt-6">
                  Thank you for investing in your growth. This is work that
                  lasts.
                </p>
                <p className="text-[#000E51] font-semibold mt-2">
                  — Lunka Crawford
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
