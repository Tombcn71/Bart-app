"use client";
import { useBron } from "@/lib/use-bron";

/** De kop van het overzicht: voor de klant "Wat wilt u berekenen?", in inmeetmodus (Bart zelf) "Wat wil je inmeten?". */
export function ProductenKop() {
  const bron = useBron();
  return (
    <h1 className="mb-4 shrink-0 text-center text-2xl font-bold tracking-tight text-slate-900 md:mb-8 md:text-4xl">
      {bron === "onspot" ? "Wat wil je inmeten?" : "Wat wilt u berekenen?"}
    </h1>
  );
}
