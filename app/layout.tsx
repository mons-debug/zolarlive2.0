import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalGradientStage from "@/components/GlobalGradientStage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zolar — Borderline Black & Spin for Purpose",
  description: "Zolar landing — neon black and kinetic white releases.",
  openGraph: {
    title: "Zolar — Borderline Black & Spin for Purpose",
    description: "Neon black and kinetic white releases from Zolar.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zolar — Borderline Black & Spin for Purpose",
    description: "Neon black and kinetic white releases from Zolar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased page-vignette`}
      >
        <GlobalGradientStage />
        {children}
      </body>
    </html>
  );
}
