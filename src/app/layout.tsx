import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PingLog — The 1-line Changelog & Roadmap widget for modern SaaS",
  description:
    "Announce product updates, collect user feedback, and prioritize your roadmap without bloating your app. Installs in 30 seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
