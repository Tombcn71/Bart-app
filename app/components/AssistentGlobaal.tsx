"use client";
import { usePathname } from "next/navigation";
import { GeminiAssistent } from "@/app/test-assistent/GeminiAssistent";

/**
 * Marleen staat op alle klantpagina's (catalogus, alle calculators, offerte) en blijft doorpraten als de klant
 * van pagina wisselt. Niet bij het beheer van Bart, de monteur-pagina's, de widget en de testpagina.
 */
export function AssistentGlobaal() {
  const pad = usePathname() || "/";
  // Tijdelijk uit op de live site (Tom, 23 nov 2026). Op de eigen computer (testen) blijft Marleen zichtbaar.
  if (process.env.NODE_ENV === "production") return null;
  const verberg =
    pad.startsWith("/admin") ||
    pad.startsWith("/meten") ||
    pad.startsWith("/terugbellen") ||
    pad.startsWith("/widget") ||
    pad.startsWith("/test-assistent");
  if (verberg) return null;
  return <GeminiAssistent />;
}
