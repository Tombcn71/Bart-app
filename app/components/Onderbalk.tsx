"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, FilePlus, Link2, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

const ITEMS = [
  { href: "/admin/offertes", label: "Aanvragen", icon: FileText },
  { href: "/meten/inmeten", label: "Offerte maken", icon: FilePlus },
  { href: "/meten/reageer", label: "Link versturen", icon: Link2 },
];

/** Vaste balk onderin op een telefoon, zoals in een app: de drie dingen die je het vaakst doet en "Meer" voor de rest van het menu. */
export function Onderbalk() {
  const pathname = usePathname();
  const { toggleSidebar, setOpenMobile } = useSidebar();
  // Vanuit de calculator ("Meer") komt de monteur hier met ?menu=1: het menu gaat meteen open.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("menu") !== "1") return;
    setOpenMobile(true);
    window.history.replaceState(null, "", window.location.pathname);
  }, [setOpenMobile]);
  return (
    <nav
      aria-label="Hoofdmenu"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const actief = href === "/admin/offertes" && pathname.startsWith("/admin/offertes");
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${actief ? "text-brand-text" : "text-muted-foreground"}`}>
                <Icon className="size-6" />
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Menu className="size-6" />
            Meer
          </button>
        </li>
      </ul>
    </nav>
  );
}
