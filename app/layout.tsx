import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import GrainOverlay from "@/components/GrainOverlay";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
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
  title: "Ryder — Unity Game Developer",
  description:
    "Ryder — Unity Game Developer chuyên mobile games, gameplay systems, URP shaders và tối ưu hiệu năng.",
  metadataBase: new URL("https://rydlands.com"),
  openGraph: {
    title: "Ryder — Unity Game Developer",
    description:
      "Portfolio của Ryder: gameplay systems, URP/HLSL shaders, và các dự án mobile game đã triển khai.",
    url: "https://rydlands.com",
    siteName: "rydlands.com",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <GrainOverlay />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
