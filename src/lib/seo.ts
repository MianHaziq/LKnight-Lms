import { Metadata } from "next";

// Site configuration
export const siteConfig = {
  name: "LKnight Learning Hub",
  shortName: "LKnight LMS",
  description:
    "Master new skills with expert-led courses. LKnight Learning Hub offers 500+ professional courses in leadership, technology, and business designed for executives and career-focused learners.",
  url: "https://www.lknightlearninghub.com",
  ogImage: "/og-image.jpg",
  creator: "LKnight Productions",
  keywords: [
    "online courses",
    "e-learning platform",
    "professional development",
    "leadership training",
    "executive education",
    "skill development",
    "career growth",
    "online learning",
    "LKnight LMS",
    "business courses",
    "technology courses",
  ],
  authors: [{ name: "LKnight Productions", url: "https://www.lknightlearninghub.com" }],
};

// Default metadata for the site
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.creator,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@lknightlms",
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "education",
};

// Helper function to create page-specific metadata
export function createMetadata({
  title,
  description,
  keywords = [],
  image,
  noIndex = false,
  canonical,
}: {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonical?: string;
}): Metadata {
  const ogImage = image || siteConfig.ogImage;
  const pageUrl = canonical ? `${siteConfig.url}${canonical}` : undefined;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [ogImage],
    },
    alternates: pageUrl ? { canonical: pageUrl } : undefined,
  };
}

// JSON-LD Schema helpers
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon/main-logo.svg`,
  sameAs: [
    "https://www.facebook.com/lknightlms",
    "https://twitter.com/lknightlms",
    "https://www.linkedin.com/company/lknightlms",
    "https://www.instagram.com/lknightlms",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@lknightlearninghub.com",
  },
};

export const educationalOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon/main-logo.svg`,
  areaServed: "Worldwide",
  teaches: [
    "Leadership",
    "Business Management",
    "Technology",
    "Professional Development",
    "Executive Skills",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteConfig.url}/courses?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// Course schema helper
export function createCourseSchema({
  name,
  description,
  provider = siteConfig.name,
  url,
  image,
  price,
  currency = "USD",
  ratingValue,
  ratingCount,
}: {
  name: string;
  description: string;
  provider?: string;
  url: string;
  image?: string;
  price?: number;
  currency?: string;
  ratingValue?: number;
  ratingCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: provider,
      sameAs: siteConfig.url,
    },
    url,
    image: image || siteConfig.ogImage,
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: currency,
        availability: "https://schema.org/InStock",
      },
    }),
    ...(ratingValue &&
      ratingCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue,
          ratingCount,
        },
      }),
  };
}

// FAQ schema helper
export function createFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb schema helper
export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
