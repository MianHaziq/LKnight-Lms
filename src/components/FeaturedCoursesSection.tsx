import Link from "next/link";
import CourseCard, { CourseCardProps } from "./CourseCard";

// Featured courses data - This will be fetched from admin panel/API later
// When backend is ready, replace this with API call: const courses = await fetchFeaturedCourses()
const featuredCoursesData: CourseCardProps[] = [
  {
    id: "course-1",
    slug: "complete-web-development-bootcamp-2024",
    image: "/icon/webCourse.png",
    level: "Beginner",
    category: "Web Development",
    categoryColor: "text-secondary",
    title: "Complete Web Development Bootcamp 2024",
    description:
      "Learn HTML, CSS, JavaScript, React, Node.js, and more to become a full-stack developer.",
    hours: 42,
    modules: 28,
    rating: 4.9,
    studentsCount: 15420,
    instructor: "Dr. Sarah Chen",
  },
  {
    id: "course-2",
    slug: "ai-deep-learning-masterclass-bootcamp-2024",
    image: "/icon/aiCourse.png",
    level: "Advanced",
    category: "AI & ML",
    categoryColor: "text-secondary",
    title: "AI & Deep Learning Masterclass Bootcamp 2024",
    description:
      "Dive deep into neural networks, TensorFlow, and cutting-edge AI technologies.",
    hours: 35,
    modules: 22,
    rating: 4.9,
    studentsCount: 8920,
    instructor: "Dr. Emily Zhang",
  },
  {
    id: "course-3",
    slug: "ui-ux-design-beginner-to-professional",
    image: "/icon/uiCourse.jpg",
    level: "Beginner",
    category: "Design",
    categoryColor: "text-secondary",
    title: "UI/UX Design: From Beginner to Professional",
    description:
      "Learn design principles, Figma, prototyping and create stunning user interfaces.",
    hours: 28,
    modules: 18,
    rating: 4.7,
    studentsCount: 9870,
    instructor: "Alex Thompson",
  },
];

interface FeaturedCoursesSectionProps {
  courses?: CourseCardProps[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export default function FeaturedCoursesSection({
  courses = featuredCoursesData,
  title = "Featured Courses",
  subtitle = "Our most popular courses loved by thousands of learners",
  showViewAll = true,
  viewAllHref = "/courses",
}: FeaturedCoursesSectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12 lg:mb-14">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 sm:mb-3">
              {title}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500">
              {subtitle}
            </p>
          </div>

          {showViewAll && (
            <Link
              href={viewAllHref}
              className="inline-flex items-center gap-2 text-secondary font-semibold text-sm sm:text-base hover:opacity-80 transition-opacity duration-200 group"
            >
              <span>View All Courses</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="transform group-hover:translate-x-1 transition-transform duration-200"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}
