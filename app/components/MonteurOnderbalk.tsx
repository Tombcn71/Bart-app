"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FilePlus, Link2, Menu } from "lucide-react";

const ITEMS = [
  { id: "offertes", href: "/admin/offertes", label: "Aanvragen", icon: FileText },
  { id: "maken", href: "/meten/inmeten", label: "Offerte maken", icon: FilePlus },
  { id: "link", href: "/meten/reageer", label: "Link versturen", icon: Link2 },
  { id: "meer", href: "/admin/offertes?menu=1", label: "Meer", icon: Menu },
] as const;

/** Vaste balk onderin op een telefoon, zodat je tijdens het offerte maken niet op het pijltje terug hoeft. */
export function MonteurOnderbalk({ actief }: { actief: "maken" | "link" | null }) {
  // Andere vaste balken onderin (prijs en "Toevoegen") komen er net boven te staan: zie globals.css.
  useEffect(() => {
    document.documentElement.dataset.monteurBalk = "1";
    return () => {
      delete document.documentElement.dataset.monteurBalk;
    };
  }, []);
  return (
    <>
      <nav
        aria-label="Hoofdmenu"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        <ul className="grid grid-cols-4">
          {ITEMS.map(({ id, href, label, icon: Icon }) => (
            <li key={id}>
              <Link
                href={href}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${actief === id ? "text-brand-text" : "text-slate-500"}`}>
                <Icon className="size-6" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

/** Op de schermen van de web app (Link versturen e.d.). Op het startscherm staan de grote knoppen al, daar dus niet. */
export function AppOnderbalk() {
  const pad = usePathname() ?? "";
  if (pad === "/meten") return null;
  return <MonteurOnderbalk actief={pad.startsWith("/meten/reageer") ? "link" : pad.startsWith("/meten/inmeten") ? "maken" : null} />;
}
