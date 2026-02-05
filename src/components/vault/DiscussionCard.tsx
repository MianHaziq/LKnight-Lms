interface DiscussionCardProps {
  category: string;
  categoryColor: string;
  timeAgo: string;
  title: string;
  description: string;
  author: string;
  upvotes: number;
  comments: number;
}

export default function DiscussionCard({
  category,
  categoryColor,
  timeAgo,
  title,
  description,
  author,
  upvotes,
  comments,
}: DiscussionCardProps) {
  return (
    <div className="bg-[#000E51] rounded-xl p-5 lg:p-6 hover:bg-[#001166] transition-colors duration-200 cursor-pointer">
      {/* Header - Category & Time */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-md"
          style={{
            backgroundColor: categoryColor,
            color: "#FFFFFF",
          }}
        >
          {category}
        </span>
        <div className="flex items-center gap-1.5 text-white/50 text-xs">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 6V12L16 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white text-base lg:text-[17px] font-semibold mb-2 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">
        {description}
      </p>

      {/* Footer - Author & Stats */}
      <div className="flex items-center justify-between">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#FF6F00]/20 flex items-center justify-center">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                stroke="#FF6F00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="#FF6F00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-white/70 text-sm">{author}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          {/* Upvotes */}
          <div className="flex items-center gap-1.5 text-white/50 text-sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 9V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3L7 10V21H17.28C17.7623 21.0055 18.2304 20.8364 18.5979 20.524C18.9654 20.2116 19.2077 19.7769 19.28 19.3L20.66 10.3C20.7035 10.0134 20.6842 9.72068 20.6033 9.44225C20.5225 9.16382 20.3821 8.90629 20.1919 8.68751C20.0016 8.46873 19.7661 8.29393 19.5016 8.17522C19.2371 8.0565 18.9499 7.99672 18.66 8H14Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V12C2 11.4696 2.21071 10.9609 2.58579 10.5858C2.96086 10.2107 3.46957 10 4 10H7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{upvotes}</span>
          </div>

          {/* Comments */}
          <div className="flex items-center gap-1.5 text-white/50 text-sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
