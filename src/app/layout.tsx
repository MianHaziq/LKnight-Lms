import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import NavigationProgress from "@/components/NavigationProgress";
import { Providers } from "@/components/Providers";
import MaintenanceCheck from "@/components/MaintenanceCheck";
import JsonLd from "@/components/JsonLd";
import ChatBotButton from "@/components/ChatBotButton";
import {
  defaultMetadata,
  organizationSchema,
  websiteSchema,
  educationalOrganizationSchema,
  localBusinessSchema,
} from "@/lib/seo";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000E51" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={educationalOrganizationSchema} />
        <JsonLd data={localBusinessSchema} />
      </head>
      <body className={`${outfit.variable} ${inter.variable} antialiased`}>
        <Providers>
          <MaintenanceCheck>
            <NavigationProgress />
            {children}
            <ChatBotButton />
          </MaintenanceCheck>
        </Providers>
      </body>
    </html>
  );
}
