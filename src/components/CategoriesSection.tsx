import CategoryCard, { CategoryCardProps } from "./CategoryCard";

// Category Icons as components for reusability
const WebDevIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
    <path d="M16 18L22 12L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const VaultIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AIIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 9H9.01M15 9H15.01M9 15C9 15 10.5 17 12 17C13.5 17 15 15 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DesignIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BusinessIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MarketingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
    <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DatabaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
    <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M21 12C21 13.66 17 15 12 15C7 15 3 13.66 3 12" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 5V19C3 20.66 7 22 12 22C17 22 21 20.66 21 19V5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CybersecurityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Categories data - This will be fetched from admin panel/API later
const categoriesData: CategoryCardProps[] = [
  {
    id: "web-development",
    icon: <WebDevIcon />,
    iconBgColor: "bg-primary",
    title: "Web Development",
    description: "Build modern web applications",
    courseCount: 124,
    href: "/categories/web-development",
  },
  {
    id: "vault-community",
    icon: <VaultIcon />,
    iconBgColor: "bg-secondary",
    title: "The Vault Community",
    description: "Anonymous, psychologically safe growth.",
    courseCount: 89,
    href: "/categories/vault-community",
  },
  {
    id: "ai-ml",
    icon: <AIIcon />,
    iconBgColor: "bg-amber-500",
    title: "AI & Machine Learning",
    description: "Build intelligent systems and models",
    courseCount: 67,
    href: "/categories/ai-machine-learning",
  },
  {
    id: "design",
    icon: <DesignIcon />,
    iconBgColor: "bg-pink-500",
    title: "Design",
    description: "Create beautiful user experiences",
    courseCount: 95,
    href: "/categories/design",
  },
  {
    id: "business",
    icon: <BusinessIcon />,
    iconBgColor: "bg-orange-400",
    title: "Business",
    description: "Master business and management skills",
    courseCount: 112,
    href: "/categories/business",
  },
  {
    id: "marketing",
    icon: <MarketingIcon />,
    iconBgColor: "bg-red-500",
    title: "Marketing",
    description: "Learn digital marketing strategies",
    courseCount: 78,
    href: "/categories/marketing",
  },
  {
    id: "database",
    icon: <DatabaseIcon />,
    iconBgColor: "bg-blue-500",
    title: "Database",
    description: "Design and manage databases",
    courseCount: 45,
    href: "/categories/database",
  },
  {
    id: "cybersecurity",
    icon: <CybersecurityIcon />,
    iconBgColor: "bg-green-500",
    title: "Cybersecurity",
    description: "Protect systems and networks",
    courseCount: 56,
    href: "/categories/cybersecurity",
  },
];

interface CategoriesSectionProps {
  categories?: CategoryCardProps[];
}

export default function CategoriesSection({
  categories = categoriesData,
}: CategoriesSectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3 sm:mb-4">
            Explore Learning Categories
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-2xl mx-auto">
            Discover courses across various domains to find your perfect learning path
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
