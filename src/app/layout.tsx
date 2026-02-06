import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { RosterProvider } from "@/lib/roster";
import { TeamsProvider } from "@/lib/teams";
import { TierListsProvider } from "@/lib/tier-lists";
import { GuidesProvider } from "@/lib/guides";
import { FusionsProvider } from "@/lib/fusions";
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

export const metadata: Metadata = {
  title: "RAID Tool",
  description: "All-in-one companion toolkit for RAID: Shadow Legends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <RosterProvider>
            <TeamsProvider>
              <TierListsProvider>
                <GuidesProvider>
                  <FusionsProvider>
                    <Navbar />
                    <main>{children}</main>
                  </FusionsProvider>
                </GuidesProvider>
              </TierListsProvider>
            </TeamsProvider>
          </RosterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
