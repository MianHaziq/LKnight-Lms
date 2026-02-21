export default function VaultSidebar() {
  const guidelines = [
    "Respect anonymity and privacy",
    "Be supportive and constructive",
    "Share experiences, not advice",
    "No promotional content",
  ];

  const trendingTopics = [
    "#BurnoutPrevention",
    "#RemoteLeadership",
    "#ImposterSyndrome",
    "#DifficultConversations",
  ];

  const stats = [
    { value: "1.2K", label: "Active Members" },
    { value: "5.8K", label: "Discussions" },
    { value: "24K", label: "Replies" },
    { value: "98%", label: "Positive" },
  ];

  return (
    <div className="space-y-5">
      {/* Community Guidelines */}
      <div className="bg-[#000E51] rounded-xl p-5">
        <h3 className="text-white text-base font-semibold mb-4 flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#FF6F00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16V12"
              stroke="#FF6F00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8H12.01"
              stroke="#FF6F00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Community Guidelines
        </h3>
        <ul className="space-y-3">
          {guidelines.map((guideline, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full border border-[#FF6F00]/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6F00]" />
              </div>
              <span className="text-white/70 text-sm">{guideline}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trending Topics */}
      <div className="bg-[#000E51] rounded-xl p-5">
        <h3 className="text-white text-base font-semibold mb-4 flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23 6L13.5 15.5L8.5 10.5L1 18"
              stroke="#FF6F00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 6H23V12"
              stroke="#FF6F00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Trending Topics
        </h3>
        <div className="space-y-2.5">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="text-[#FF6F00] text-sm hover:text-[#FF8C33] cursor-pointer transition-colors"
            >
              {topic}
            </div>
          ))}
        </div>
      </div>

      {/* Community Stats */}
      <div className="bg-[#000E51] rounded-xl p-5">
        <h3 className="text-white text-base font-semibold mb-4 flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 20V10"
              stroke="#FF6F00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 20V4"
              stroke="#FF6F00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 20V14"
              stroke="#FF6F00"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Community Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-white text-xl lg:text-2xl font-bold">
                {stat.value}
              </div>
              <div className="text-white/50 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
