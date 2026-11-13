import type { Metadata, Viewport } from "next";

/** De voorkant van de web app op de telefoon van Bart: naam, icoon en kleur van BartMooi. */
export const metadata: Metadata = {
  title: { absolute: "BartMooi" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "BartMooi", statusBarStyle: "default" },
  icons: { apple: "/apple-touch-icon.png", icon: "/icons/icon-192.png" },
  robots: { index: false },
};

export const viewport: Viewport = { themeColor: "#1E5079" };

export default function MetenLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-white text-[#1a1a1a]">{children}</div>;
}
