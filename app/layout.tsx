import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/lib/theme-context";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywood.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Cherrywood | Luxury Real Estate & Architecture',
    template: '%s | Cherrywood',
  },
  description:
    'Cherrywood designs and develops state-of-the-art luxury residences and architectural masterpieces in the most sought-after locations.',
  keywords: [
    'luxury real estate',
    'premium residences',
    'architectural developments',
    'Cherrywood',
    'luxury apartments',
    'real estate investment',
  ],
  authors: [{ name: 'Cherrywood', url: siteUrl }],
  creator: 'Cherrywood',
  publisher: 'Cherrywood',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Cherrywood',
    title: 'Cherrywood | Luxury Real Estate & Architecture',
    description:
      'State-of-the-art luxury residences and architectural masterpieces. Explore our portfolio of premium developments.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cherrywood',
    creator: '@cherrywood',
    title: 'Cherrywood | Luxury Real Estate & Architecture',
    description:
      'State-of-the-art luxury residences and architectural masterpieces.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
