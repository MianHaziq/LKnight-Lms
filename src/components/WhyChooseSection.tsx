export default function WhyChooseSection() {
  return (
    <section className="w-full bg-[#FAFBFC] py-16 lg:py-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-14">
          <span className="text-[#FF6F00] text-xs sm:text-sm font-medium tracking-wider uppercase mb-3 block">
            Our Approach
          </span>
          <h2 className="text-[#000E51] text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight">
            Why Choose LKnight?
          </h2>
        </div>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto">
          <div
            className="bg-white rounded-2xl lg:rounded-[22px] p-6 sm:p-8 lg:p-12"
            style={{
              boxShadow: "0 4px 30px rgba(0,0,0,0.06)",
              border: "1px solid #E5E7EB",
            }}
          >
            {/* Lead Statement */}
            <p className="text-[#000E51] text-base sm:text-lg lg:text-xl font-semibold leading-relaxed mb-6 lg:mb-8">
              Because leadership is not just operational. It is emotional,
              relational, and strategic.
            </p>

            {/* Divider */}
            <div className="w-16 h-1 bg-[#FF6F00] rounded-full mb-6 lg:mb-8" />

            {/* Body */}
            <div className="space-y-5 lg:space-y-6 text-[#64748B] text-[14px] sm:text-[15px] lg:text-base leading-[1.8]">
              <p>
                LKnight integrates nearly two decades of organizational
                leadership and HR experience with over 15 years of clinical
                mental health expertise. We do not just teach skills. We help
                leaders understand their patterns, regulate under pressure, build
                trust, and navigate complexity with clarity and authority.
              </p>
              <p>
                Our programs are practical, structured, and designed for
                real-world teams and organizations — not ideal conditions. The
                result is leadership that is sustainable, self-aware, and
                impactful at every level.
              </p>
            </div>

            {/* Highlights */}
       
          </div>
        </div>

        {/* Old Feature Cards Grid - Commented Out
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconBgColor={feature.iconBgColor}
            />
          ))}
        </div>
        */}
      </div>
    </section>
  );
}
