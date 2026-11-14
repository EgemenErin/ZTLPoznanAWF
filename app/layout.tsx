import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { JsonLd } from "@/components/json-ld";
import { MotionBoot } from "@/components/motion-boot";
import "./globals.css";
import { getLocale } from "@/lib/i18n-server";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LEGAL_NAME,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_IMAGE,
  absoluteUrl,
  organizationLd,
  websiteLd,
} from "@/lib/seo";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_LEGAL_NAME, url: SITE_URL }],
  creator: SITE_LEGAL_NAME,
  publisher: SITE_LEGAL_NAME,
  category: "culture",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "pl_PL",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: absoluteUrl(SOCIAL_IMAGE.url),
        width: SOCIAL_IMAGE.width,
        height: SOCIAL_IMAGE.height,
        alt: SOCIAL_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [absoluteUrl(SOCIAL_IMAGE.url)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#5c1f25",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${display.variable} ${body.variable} grain font-sans antialiased`}>
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <MotionBoot locale={locale} />
        {children}
      </body>
    </html>
  );
}
