import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/lib/theme-context";
import { Toaster } from "@/components/ui/sonner";
import { InstallPrompt } from "@/components/install-prompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Premium serif for display headings
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Clean geometric sans for body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cherrywoodbuilders.com'

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
  authors: [{ name: 'Cherrywoodbuilders', url: siteUrl }],
  creator: 'Abdul Wahab',
  publisher: 'JW&FA Group of Companies',
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
  icons: {
    icon: [
      { url: '/favicon_io/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_io/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon_io/favicon.ico',
    apple: '/favicon_io/apple-touch-icon.png',
  },
  manifest: '/favicon_io/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
        <Toaster />
        <InstallPrompt />
      </body>
    </html>
  );
}
