"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GeminiAssistent } from "@/app/test-assistent/GeminiAssistent";

/**
 * Marleen staat op alle klantpagina's (catalogus, alle calculators, offerte) en blijft doorpraten als de klant
 * van pagina wisselt. Niet bij het beheer van Bart, de monteur-pagina's, de widget en de testpagina.
 */
export function AssistentGlobaal() {
  const pad = usePathname() || "/";
  // Na het maximum aantal gesprekken deze maand verdwijnt de bal.
  const [beschikbaar, setBeschikbaar] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/marleen-status").then((r) => r.json()).then((d) => setBeschikbaar(!!d.beschikbaar)).catch(() => setBeschikbaar(false));
  }, []);
  const verberg =
    pad.startsWith("/admin") ||
    pad.startsWith("/meten") ||
    pad.startsWith("/terugbellen") ||
    pad.startsWith("/widget") ||
    pad.startsWith("/test-assistent");
  if (verberg || !beschikbaar) return null;
  return <GeminiAssistent />;
}
