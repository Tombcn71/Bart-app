"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function stuur(soort: string, bron?: string) {
  try {
    const d = JSON.stringify({ soort, bron, pad: location.pathname });
    navigator.sendBeacon?.("/api/tel", new Blob([d], { type: "text/plain" }));
  } catch {}
}

/** Telt bezoeken van deze site en het openen van een calculator. Zonder cookies. */
export function Telling() {
  const pad = usePathname();
  useEffect(() => {
    if (/^\/(admin|meten|terugbellen|widget|test-assistent)/.test(pad)) return;
    let bron: string | undefined;
    try {
      const q = new URLSearchParams(location.search);
      if (q.get("niet-tellen")) localStorage.setItem("niet_tellen", "1");
      if (q.get("wel-tellen")) localStorage.removeItem("niet_tellen");
      if (localStorage.getItem("niet_tellen")) return;
    } catch {}
    try {
      const van = new URLSearchParams(location.search).get("van");
      if (van) sessionStorage.setItem("bezoek_van", van.slice(0, 30));
      bron = sessionStorage.getItem("bezoek_van") ?? undefined;
      if (!sessionStorage.getItem("bezoek_geteld")) {
        sessionStorage.setItem("bezoek_geteld", "1");
        stuur("site_bezoek", bron);
      }
    } catch {}
    if (/configurator|configurateur/.test(pad)) stuur("calc", bron);
  }, [pad]);
  return null;
}
