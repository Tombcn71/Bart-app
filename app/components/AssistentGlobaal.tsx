"use client";
import { usePathname } from "next/navigation";
import { GeminiAssistent } from "@/app/test-assistent/GeminiAssistent";

/** Marleen staat op de startpagina en op de kozijnpagina's, en blijft doorpraten als de klant naar de calculator gaat. */
export function AssistentGlobaal() {
  const pad = usePathname() || "/";
  const toon = pad === "/" || pad === "/producten" || pad === "/kozijnen" || pad.startsWith("/kozijnconfigurator") || pad.startsWith("/offerte") || pad.startsWith("/accepteer");
  if (!toon) return null;
  return <GeminiAssistent />;
}
