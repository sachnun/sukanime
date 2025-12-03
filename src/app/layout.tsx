import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SukAnime - Nonton Anime Sub Indo",
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
        <Navbar />
        <main className="min-h-screen pb-8">{children}</main>
      </body>
    </html>
  );
}
