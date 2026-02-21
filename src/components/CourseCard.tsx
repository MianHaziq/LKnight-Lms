import Image from "next/image";
import Link from "next/link";

export interface CourseCardProps {
  id: string;
  slug: string;
  image: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  categoryColor?: string;
  title: string;
  description: string;
  hours: number;
  modules: number;
  rating: number;
  studentsCount: number;
  instructor: string;
  href?: string;
}

// Level badge colors
const levelColors = {
  Beginner: "bg-secondary",
  Intermediate: "bg-blue-500",
  Advanced: "bg-green-500",
};

export default function CourseCard({
  slug,
  image,
  level,
  category,
  categoryColor = "text-secondary",
  title,
  description,
  hours,
  modules,
  rating,
  studentsCount,
  instructor,
  href,
}: CourseCardProps) {
  const courseLink = href || `/courses/${slug}`;

  // Format student count (e.g., 15420 -> 15,420)
  const formatStudentCount = (count: number) => {
    return count.toLocaleString();
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100">
      {/* Image Container */}
      <Link href={courseLink} className="block relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Level Badge */}
        <span
          className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-white text-xs sm:text-sm font-semibold ${levelColors[level]}`}
        >
          {level}
        </span>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 lg:p-6">
        {/* Category */}
        <span className={`text-xs sm:text-sm font-medium ${categoryColor}`}>
          {category}
        </span>

        {/* Title */}
        <Link href={courseLink}>
          <h3 className="text-base sm:text-lg font-bold text-primary mt-2 mb-2 line-clamp-2 group-hover:text-secondary transition-colors duration-200">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{description}</p>

        {/* Stats Row */}
        <div className="flex items-center gap-4 sm:gap-6 mb-3 text-gray-500">
          {/* Hours */}
          <div className="flex items-center gap-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs sm:text-sm">{hours} hours</span>
          </div>

          {/* Modules */}
          <div className="flex items-center gap-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                rx="1"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className="text-xs sm:text-sm">{modules} modules</span>
          </div>
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-1.5 mb-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-secondary"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="text-sm font-semibold text-primary">{rating}</span>
          <span className="text-sm text-gray-400">
            ({formatStudentCount(studentsCount)} students)
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-600">
            By <span className="font-medium text-primary">{instructor}</span>
          </span>
          <Link
            href={courseLink}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-secondary text-white text-xs sm:text-sm font-semibold rounded-lg hover:opacity-90 transition-all duration-200"
          >
            Enroll Now
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="transform group-hover:translate-x-0.5 transition-transform duration-200"
            >
              <path
                d="M3.33337 8H12.6667M12.6667 8L8.00004 3.33333M12.6667 8L8.00004 12.6667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
