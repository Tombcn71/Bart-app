"use client";
import { ChevronDown } from "lucide-react";

type Optie = { key: string; label: string; aantal: number };

/** Keuzemenu voor op een telefoon: kies een status, met het aantal erbij (opent het eigen keuzemenu van de telefoon). */
export function FilterKeuze({ waarde, onKies, opties }: { waarde: string; onKies: (key: string) => void; opties: Optie[] }) {
  const huidig = opties.find((o) => o.key === waarde) ?? opties[0];
  return (
    <label className="relative block">
      <span className="sr-only">Toon aanvragen</span>
      <select
        value={waarde}
        onChange={(e) => onKies(e.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-11 text-base font-semibold shadow-xs">
        {opties.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label} ({o.aantal})
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center gap-2 text-muted-foreground">
        <span className="text-base font-semibold text-foreground">{huidig.aantal}</span>
        <ChevronDown className="size-5" />
      </span>
    </label>
  );
}
