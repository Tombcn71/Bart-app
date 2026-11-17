"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRODUCTEN = [
  { href: "/admin/kozijnenprijzen", label: "Kozijnen" },
  { href: "/admin/deurenprijzen", label: "Deuren" },
  { href: "/admin/schuifpuiprijzen", label: "Schuifpuien" },
  { href: "/admin/harmonicadeuurprijzen", label: "Harmonicadeuren" },
  { href: "/admin/rolluikenprijzen", label: "Rolluiken" },
  { href: "/admin/horrenprijzen", label: "Inzet- en klemhor" },
  { href: "/admin/plissehordeurprijzen", label: "Plissé hordeur" },
];

/** Tabbladen per product boven de prijspagina's. */
export function ProductTabs() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-muted p-1">
      {PRODUCTEN.map((p) => (
        <Link
          key={p.href}
          href={p.href}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
            pathname === p.href ? "bg-brand text-white shadow-md" : "text-foreground/80 hover:text-foreground"
          }`}>
          {p.label}
        </Link>
      ))}
    </nav>
  );
}
