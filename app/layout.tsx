import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Importeer hier je Navbar component
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BartMooi - Kozijnen op maat",
  description: "Vakmanschap dat het verschil maakt voor jouw woning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* 2. Plaats de Navbar hier, boven de children */}
        <Navbar />

        {/* De rest van de pagina (children) komt hieronder */}
        <main className="flex-grow">{children}</main>

        {/* Eventueel hier later een Footer */}
      </body>
    </html>
  );
}
