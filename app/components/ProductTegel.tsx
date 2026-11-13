"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { KozijnTechnisch, TECHNISCH } from "./KozijnTechnisch";

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
  return (
    <Link href={href} className={`group flex min-h-0 flex-col items-center text-center ${className}`}>
      <div className="flex min-h-0 w-full flex-1 items-center justify-center px-3 pt-2 pb-4">
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
        <p className="mx-auto mt-1 max-w-[16rem] text-xs leading-snug text-slate-500 md:text-sm">{tekst}</p>
      </div>
    </Link>
  );
}
