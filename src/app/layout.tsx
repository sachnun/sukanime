import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { MusicPlayerProvider } from "@/lib/MusicPlayerContext";
import MusicPlayer from "@/components/ui/MusicPlayer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Sukanime",
    template: "%s — Sukanime",
  },
  description: "Nonton anime subtitle Indonesia gratis dengan kualitas terbaik. Streaming anime online terlengkap.",
  keywords: ["anime", "nonton anime", "streaming anime", "anime sub indo", "anime subtitle indonesia"],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>
        <MusicPlayerProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <MusicPlayer />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
