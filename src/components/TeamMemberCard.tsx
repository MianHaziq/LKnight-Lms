import Image from "next/image";

interface TeamMemberCardProps {
  image: string;
  name: string;
  role: string;
  description: string;
  email: string;
  facebook?: string;
  linkedin?: string;
}

export default function TeamMemberCard({
  image,
  name,
  role,
  description,
  email,
  facebook,
  linkedin,
}: TeamMemberCardProps) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[340px]"
      style={{
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* Image Container */}
      <div className="relative w-full h-[260px] sm:h-[280px] lg:h-[300px] bg-gray-50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-top"
        />

        {/* Social Icons */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" />
              </svg>
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#DC2626] flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" />
                <path d="M6 9H2V21H6V9Z" />
                <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-5">
        <h3 className="text-[#1E293B] text-base lg:text-[17px] font-semibold mb-1">
          {name}
        </h3>
        <p className="text-[#64748B] text-xs lg:text-[13px] font-medium mb-1.5">
          {role}
        </p>
        <p className="text-[#94A3B8] text-xs lg:text-[12px] leading-relaxed mb-3">
          {description}
        </p>

        {/* Email */}
        <div className="flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 6L12 13L2 6"
              stroke="#94A3B8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <a
            href={`mailto:${email}`}
            className="text-[#64748B] text-xs lg:text-[12px] hover:text-[#FF6F00] transition-colors truncate"
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  );
}
