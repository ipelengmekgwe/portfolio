import type { Metadata, Viewport } from "next";
import { EB_Garamond, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ipelengmekgwe.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ipeleng Mekgwe — Software Engineering Lead",
    template: "%s · Ipeleng Mekgwe",
  },
  description:
    "A portfolio in five chapters. A decade of software engineering across fintech, marketing, logistics, and retail — written like a book.",
  applicationName: "Mekgwe & Co.",
  authors: [{ name: "Ipeleng Mekgwe", url: "https://github.com/ipelengmekgwe" }],
  creator: "Ipeleng Mekgwe",
  keywords: [
    "Ipeleng Mekgwe",
    "Software Engineering Lead",
    "C#",
    ".NET",
    "Next.js",
    "Cape Town",
    "FinChoice",
    "fintech engineer",
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: SITE_URL,
    title: "Ipeleng Mekgwe — Software Engineering Lead",
    description: "A portfolio in five chapters.",
    siteName: "Mekgwe & Co.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ipeleng Mekgwe — Software Engineering Lead",
    description: "A portfolio in five chapters.",
  },
  robots: {
    index: true,
    follow: true,
  },
  // Next.js auto-detects src/app/icon.svg as the favicon. Bitmap variants
  // (favicon.ico, apple-icon.png) can be added as files in src/app/ later;
  // referencing files that don't exist creates 404s in the console.
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5EFE0" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${garamond.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
