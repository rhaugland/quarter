import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: 'QUARTER — One Game. One Shot. Every Day.',
  description: 'A daily AI-generated arcade game. New machine at midnight UTC. Play today\'s machine and compete on the global leaderboard.',
  openGraph: {
    title: 'QUARTER',
    description: 'One Game. One Shot. Every Day.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-black min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
