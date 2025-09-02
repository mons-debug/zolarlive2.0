import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GlobalGradientStage from "@/components/GlobalGradientStage";
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

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
  title: "Zolar — Drop 01 | Glow-Inspired Moroccan Streetwear",
  description: "Glow-in-the-dark premium t-shirts, 100% cotton, COD available in Morocco. Limited drop now live.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/zolar-wordmark.svg", type: "image/svg+xml" }
    ],
  },
  openGraph: {
    title: "Zolar — Drop 01 | Glow-Inspired Moroccan Streetwear",
    description: "Glow-in-the-dark premium t-shirts, 100% cotton, COD in Morocco.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zolar — Drop 01 | Glow-Inspired Moroccan Streetwear",
    description: "Glow-in-the-dark premium t-shirts, 100% cotton, COD in Morocco.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '757530543681902');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{display:'none'}}
            src="https://www.facebook.com/tr?id=757530543681902&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
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
