import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Cinzel_Decorative } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://raid-tool.vercel.app"),
  title: {
    default: "RAID Tool — Champion Reference for RAID: Shadow Legends",
    template: "%s | RAID Tool",
  },
  description:
    "Browse 990+ champions with stats, skills, ratings, and tier placements. The community-driven reference tool for RAID: Shadow Legends.",
  openGraph: {
    type: "website",
    siteName: "RAID Tool",
    title: "RAID Tool — Champion Reference for RAID: Shadow Legends",
    description: "Browse 990+ champions with stats, skills, ratings, and tier placements.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RAID Tool — Champion Reference for RAID: Shadow Legends",
    description: "Browse 990+ champions with stats, skills, ratings, and tier placements.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${cinzelDecorative.variable} font-sans antialiased`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
