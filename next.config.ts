import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Bunny CDN image URLs (team, testimonials, course thumbnails)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.b-cdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
