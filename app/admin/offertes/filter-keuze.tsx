"use client";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

type Optie = { href: string; label: string; aantal: number };

/** Keuzemenu voor op een telefoon: wissel tussen alle offertes en de geaccepteerde, met het aantal erbij (opent het eigen keuzemenu van de telefoon). */
export function FilterKeuze({ actief, opties }: { actief: string; opties: Optie[] }) {
  const router = useRouter();
  const huidig = opties.find((o) => o.href === actief) ?? opties[0];
  return (
    <label className="relative block">
      <span className="sr-only">Toon offertes</span>
      <select
        value={actief}
        onChange={(e) => router.push(e.target.value)}
        className="h-12 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-11 text-base font-semibold shadow-xs">
        {opties.map((o) => (
          <option key={o.href} value={o.href}>
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
