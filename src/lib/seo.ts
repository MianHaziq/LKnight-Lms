import { Metadata } from "next";

// Site configuration
export const siteConfig = {
  name: "LKnight Learning Hub",
  shortName: "LKnight LMS",
  description:
    "Master new skills with expert-led courses. LKnight Learning Hub by LKnight Productions offers 500+ professional courses in leadership, technology, and business designed for executives and career-focused learners in Spring, Texas and worldwide.",
  url: "https://www.lknightlearninghub.com",
  ogImage: "/og-image.jpg",
  creator: "LKnight Productions",
  email: "inquiries@lknightproductions.com",
  phone: "+18329535517",
  phoneDisplay: "(832) 953-5517",
  address: {
    street: "7312 Louetta Rd. Ste. B118-160",
    city: "Spring",
    state: "Texas",
    stateCode: "TX",
    zip: "77379",
    country: "US",
  },
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
    "LKnight Learning Hub",
    "lknightlearninghub",
    "LKnight Productions",
    "lknightproductions",
    "business courses",
    "technology courses",
    "Spring Texas online courses",
    "professional courses online",
    "executive learning platform",
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
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
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
    google: "googledcee5e0222d41472",
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
  alternateName: ["LKnight LMS", "LKnight Productions", "lknightlearninghub"],
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon/main-logo.svg`,
  sameAs: [
    "https://www.linkedin.com/company/lknight-productions",
    "https://www.facebook.com/LKnightProductions",
    "https://www.instagram.com/lknightproductions",
    "https://www.tiktok.com/@lknightproductions",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: `+1-${siteConfig.phoneDisplay}`,
    email: siteConfig.email,
    areaServed: "US",
    availableLanguage: "English",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.stateCode,
    postalCode: siteConfig.address.zip,
    addressCountry: siteConfig.address.country,
  },
};

export const educationalOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: siteConfig.name,
  alternateName: "LKnight Learning Hub",
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon/main-logo.svg`,
  email: siteConfig.email,
  telephone: `+1-${siteConfig.phoneDisplay}`,
  areaServed: "Worldwide",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.stateCode,
    postalCode: siteConfig.address.zip,
    addressCountry: siteConfig.address.country,
  },
  teaches: [
    "Leadership",
    "Business Management",
    "Technology",
    "Professional Development",
    "Executive Skills",
  ],
};

// LocalBusiness schema for Google Maps / Local SEO
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}/#localbusiness`,
  name: siteConfig.name,
  alternateName: ["LKnight LMS", "LKnight Productions", "lknightlearninghub"],
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon/main-logo.svg`,
  image: `${siteConfig.url}/icon/main-logo.svg`,
  telephone: `+1-${siteConfig.phoneDisplay}`,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.stateCode,
    postalCode: siteConfig.address.zip,
    addressCountry: siteConfig.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 30.0235,
    longitude: -95.5103,
  },
  priceRange: "$$",
  sameAs: [
    "https://www.linkedin.com/company/lknight-productions",
    "https://www.facebook.com/LKnightProductions",
    "https://www.instagram.com/lknightproductions",
    "https://www.tiktok.com/@lknightproductions",
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
