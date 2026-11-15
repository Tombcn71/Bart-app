"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const SLEUTEL = "bart-admin-thema";

/**
 * Donkere modus voor het beheer. Alleen hier staat de klasse "dark" op <html>; de klantpagina's blijven licht.
 * De keuze wordt onthouden in deze browser; zonder keuze volgt het beheer het systeem.
 */
export function AdminTheme() {
  const [donker, setDonker] = useState(false);

  useEffect(() => {
    let keuze: string | null = null;
    try { keuze = localStorage.getItem(SLEUTEL); } catch {}
    const aan = keuze ? keuze === "donker" : matchMedia("(prefers-color-scheme: dark)").matches;
    setDonker(aan);
    document.documentElement.classList.toggle("dark", aan);
    return () => document.documentElement.classList.remove("dark");
  }, []);

  const wissel = () => {
    const aan = !donker;
    setDonker(aan);
    document.documentElement.classList.toggle("dark", aan);
    try { localStorage.setItem(SLEUTEL, aan ? "donker" : "licht"); } catch {}
  };

  return (
    <button
      type="button"
      onClick={wissel}
      title={donker ? "Lichte modus" : "Donkere modus"}
      aria-label={donker ? "Schakel naar lichte modus" : "Schakel naar donkere modus"}
      className="rounded-xl p-2.5 text-muted-foreground hover:bg-muted">
      {donker ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
