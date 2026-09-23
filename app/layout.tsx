import type { Metadata } from "next";
// Self-hosted via @fontsource, not next/font/google — see the comment on
// the --font-* variables in globals.css for why (Turbopack's next/font/
// google needs a Vercel-only internal package that isn't available
// building on Cloudflare Pages). Each import below is the combined CSS
// for one weight, covering all of that weight's subsets (including
// vietnamese for Unbounded) in one file — no separate subset import
// needed. Genuinely condensed grotesk (Oswald) for the one giant hero
// wordmark — Unbounded (the regular display face) reads geometric/
// normal-width, not condensed.
import "@fontsource/unbounded/600.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/800.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-sans/700.css";
import "@fontsource/jetbrains-mono/100.css";
import "@fontsource/jetbrains-mono/200.css";
import "@fontsource/jetbrains-mono/300.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/jetbrains-mono/800.css";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollHud from "@/components/ScrollHud";
import "./globals.css";

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
    <html lang="en">
      <body>
        <Preloader />
        <GrainOverlay />
        <CustomCursor />
        <ScrollHud />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
