import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { MotionBoot } from "@/components/motion-boot";
import "./globals.css";
import { getLocale } from "@/lib/i18n-server";

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
  title: "ZTL Poznań AWF",
  description:
    "Zespół Tańca Ludowego Poznań AWF: wydarzenia, oferta, newsletter i społeczność.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
        <MotionBoot locale={locale} />
        {children}
      </body>
    </html>
  );
}
