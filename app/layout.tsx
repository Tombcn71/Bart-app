import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
// Importeer de headers functie van Next.js
import { headers } from "next/headers";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Haal de huidige host (URL) op vanaf de server headers
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // 2. Controleer of de bezoeker op het admin-subdomein zit
  const isAdminSubdomain = host.startsWith("admin.");

  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-background`}>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {/* 3. Toon de Navbar ALLEEN als de gebruiker NIET op het admin-subdomein zit */}
          {!isAdminSubdomain && <Navbar />}

          {/* De rest van de pagina (children) komt hieronder */}
          <main className="flex-grow">{children}</main>
        </TooltipProvider>
        {/* Eventueel hier later een Footer */}
      </body>
    </html>
  );
}
