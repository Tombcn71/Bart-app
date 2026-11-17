"use client";
import { useState } from "react";

/** Bedragveld: leeg als er niets is ingevuld, en je kunt met een komma typen. */
export function PrijsVeld({
  label,
  waarde,
  onChange,
  waarschuwing = false,
  eenheid = "€",
  breedte = "w-32",
  standaard,
  leeg = "0,00",
}: {
  label: string;
  waarde: number;
  onChange: (n: number) => void;
  waarschuwing?: boolean;
  eenheid?: "€" | "%" | "uur";
  /** Tailwind-breedte van het veld. */
  breedte?: string;
  /** De standaardwaarde: wijkt het bedrag hiervan af, dan staat ze eronder en kleurt het veld. */
  standaard?: number;
  /** Wat in een leeg veld staat, bijvoorbeeld "inbegrepen" voor een bedrag dat bewust ontbreekt. */
  leeg?: string;
}) {
  const [tekst, setTekst] = useState(waarde ? String(waarde).replace(".", ",") : "");
  const afwijkt = standaard !== undefined && Math.abs(waarde - standaard) > 0.004;
  const fmt = (n: number) => String(n).replace(".", ",");
  return (
    <div className={`${breedte} shrink-0`}>
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <span
        className={`pointer-events-none absolute inset-y-0 flex items-center text-base text-foreground/80 ${eenheid !== "€" ? "right-3" : "left-3"}`}>
        {eenheid}
      </span>
      <input
        inputMode="decimal"
        value={tekst}
        placeholder={leeg}
        onChange={(e) => {
          const t = e.target.value.replace(".", ",");
          if (!/^-?\d*(,\d{0,2})?$/.test(t)) return;
          setTekst(t);
          onChange(parseFloat(t.replace(",", ".")) || 0);
        }}
        className={`w-full rounded-lg border py-1.5 text-right text-base tabular-nums ${eenheid === "uur" ? "pr-11 pl-3" : eenheid === "%" ? "pr-7 pl-3" : "pr-3 pl-7"} ${
          waarschuwing ? "border-amber-400 dark:border-amber-500/40 bg-amber-50" : afwijkt ? "border-brand-text" : "border-border"
        }`}
      />
    </label>
    {afwijkt && standaard !== undefined && (
      <button
        type="button"
        onClick={() => {
          setTekst(standaard ? fmt(standaard) : "");
          onChange(standaard);
        }}
        className="mt-0.5 block w-full text-right text-xs text-brand-text hover:underline">
        standaard {eenheid === "%" ? `${fmt(standaard)}%` : eenheid === "uur" ? `${fmt(standaard)} uur` : `€ ${fmt(standaard)}`}
      </button>
    )}
    </div>
  );
}

export function Kaart({ titel, uitleg, notitie, children }: { titel: string; uitleg?: string; notitie?: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-muted/40 px-4 py-3">
        <h2 className="text-base font-bold text-foreground">{titel}</h2>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </section>
  );
}

export function Rij({ naam, children, hoofdletters = false }: { naam: string; children: React.ReactNode; hoofdletters?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <span className={`text-sm text-foreground ${hoofdletters ? "capitalize" : ""}`}>{naam}</span>
      {children}
    </div>
  );
}

