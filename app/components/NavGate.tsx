"use client";
import { usePathname } from "next/navigation";

/**
 * Toont het menu (en de inmeetbalk) alleen op de pagina's van de calculator. De keuze volgt de pagina waar je nu
 * bent, ook als je binnen de app doorklikt (bijvoorbeeld van de web app naar de calculator).
 */
export function NavGate({ children }: { children: React.ReactNode }) {
  const pad = usePathname() ?? "";
  const verberg =
    pad.startsWith("/admin") ||
    pad.startsWith("/meten") ||
    pad.startsWith("/terugbellen") ||
    /^\/offerte\/[0-9a-f-]{36}/i.test(pad);
  return verberg ? null : <>{children}</>;
}
