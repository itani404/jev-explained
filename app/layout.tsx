import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  GITHUB_PROFILE_URL,
  GITHUB_USER,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  authors: [{ name: GITHUB_USER, url: GITHUB_PROFILE_URL }],
  creator: GITHUB_USER,
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_TITLE,
    title: "Jev, explained: typed decisions, not text",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Jev, explained: typed decisions, not text",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
