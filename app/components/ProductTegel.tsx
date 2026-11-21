"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { KozijnTechnisch, TECHNISCH } from "./KozijnTechnisch";
import { useBron } from "@/lib/use-bron";

/** Eén product in het overzicht: de technische tekening staat los (geen vak), met naam en een korte tekst eronder. */
export function ProductTegel({
  name,
  tekst,
  href,
  spec,
  breedte,
  hoogte,
  className = "",
}: {
  name: string;
  tekst: string;
  href: string;
  spec: string;
  breedte: number;
  hoogte: number;
  className?: string;
}) {
  const s = TECHNISCH[spec];
  // Offerte maken (Bart zelf) op een telefoon: alleen de naam, zodat alle producten in één beeld staan.
  const compact = useBron() === "onspot";
  return (
    <Link href={href} className={`group flex min-h-0 flex-col items-center text-center ${className}`}>
      <div className={`flex w-full items-center justify-center px-3 ${compact ? "h-28 flex-none pt-0 pb-2 md:h-auto md:min-h-0 md:flex-1 md:pt-2 md:pb-4" : "min-h-0 flex-1 pt-2 pb-4"}`}>
        {s && (
          <KozijnTechnisch
            breedte={breedte}
            hoogte={hoogte}
            spec={s}
            maten={false}
            className="h-full max-h-full w-auto max-w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="shrink-0">
        <p className="flex items-center justify-center gap-1.5 text-base font-bold tracking-wide text-slate-900 uppercase md:text-lg">
          {name}
          <ArrowRight className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        </p>
        <p className={`mx-auto mt-1 max-w-[16rem] text-xs leading-snug text-slate-500 md:text-sm ${compact ? "hidden md:block" : ""}`}>{tekst}</p>
      </div>
    </Link>
  );
}
