import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GlobalGradientStage from "@/components/GlobalGradientStage";
import { Analytics } from '@vercel/analytics/react';

// Premium streetwear typography
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Zolar — Borderline Black & Spin for Purpose",
  description: "Zolar landing — neon black and kinetic white releases.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/zolar-wordmark.svg", type: "image/svg+xml" }
    ],
  },
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased page-vignette`}
      >
        <GlobalGradientStage />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
