import type { Metadata } from "next";
import { Unbounded, IBM_Plex_Sans, JetBrains_Mono, Oswald } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollHud from "@/components/ScrollHud";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

// Genuinely condensed grotesk for the one giant hero wordmark — Unbounded
// (the regular display face) reads geometric/normal-width, not condensed.
const wordmark = Oswald({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-wordmark",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ryder — Unity Mobile Game Developer",
  description:
    "Ryder — Unity developer for mobile games: gameplay systems, hand-written URP/HLSL shaders, native ad-mediation integration, and hard performance forensics.",
  metadataBase: new URL("https://rydlands.com"),
  openGraph: {
    title: "Ryder — Unity Mobile Game Developer",
    description:
      "Gameplay systems, URP/HLSL shaders, native/monetization integration, and shipped mobile game case studies.",
    url: "https://rydlands.com",
    siteName: "rydlands.com",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${wordmark.variable}`}>
      <body>
        <GrainOverlay />
        <CustomCursor />
        <ScrollHud />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
