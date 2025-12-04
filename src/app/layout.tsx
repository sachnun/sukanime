import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { MusicPlayerProvider } from "@/lib/MusicPlayerContext";
import MusicPlayer from "@/components/ui/MusicPlayer";
import UpdateChecker from "@/components/ui/UpdateChecker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#E50914",
};

export const metadata: Metadata = {
  title: {
    default: "Sukanime",
    template: "%s — Sukanime",
  },
  description: "Nonton anime subtitle Indonesia gratis dengan kualitas terbaik. Streaming anime online terlengkap.",
  keywords: ["anime", "nonton anime", "streaming anime", "anime sub indo", "anime subtitle indonesia"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sukanime",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <MusicPlayerProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <MusicPlayer />
          <UpdateChecker />
        </MusicPlayerProvider>
      </body>
    </html>
  );
}
