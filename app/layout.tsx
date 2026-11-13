import type { Metadata } from "next";
import { Overpass, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { CenterToast } from "./components/CenterToast";
import { InmeetBalk } from "./components/InmeetBalk";
import { NavGate } from "./components/NavGate";

// Huisstijl bartmooi.nl
const overpass = Overpass({
  variable: "--font-overpass",
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
  return (
    <html
      lang="nl"
      className={`${overpass.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NavGate>
          <Navbar />
          <InmeetBalk />
        </NavGate>

        {/* De rest van de pagina (children) komt hieronder */}
        <main className="flex-grow">{children}</main>
        <CenterToast />
      </body>
    </html>
  );
}
