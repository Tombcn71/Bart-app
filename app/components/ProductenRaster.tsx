"use client";
import { useBron } from "@/lib/use-bron";

/**
 * Het raster van het productoverzicht. Voor een klant vult het raster het hele scherm; voor Bart zelf (Offerte maken)
 * op een telefoon staat alles dicht bij elkaar bovenaan, zonder grote gaten ertussen.
 */
export function ProductenRaster({ kolommen, smal, children }: { kolommen: string; smal: boolean; children: React.ReactNode }) {
  const compact = useBron() === "onspot";
  return (
    <div className={`bg-white md:h-[calc(100svh-6rem)] ${compact ? "" : "h-[calc(100svh-5rem)]"}`}>
      <div className={`mx-auto flex w-full max-w-[1400px] flex-col px-4 md:h-full md:px-6 md:py-10 ${compact ? "pt-6 pb-6" : "h-full pt-6 pb-4"}`}>
        <h1 className={`shrink-0 text-center font-bold tracking-tight text-slate-900 md:mb-8 md:text-4xl ${compact ? "mb-7 text-xl" : "mb-4 text-2xl"}`}>
          Wat wil je berekenen?
        </h1>
        <div
          className={`grid md:min-h-0 md:flex-1 md:auto-rows-fr md:gap-x-10 md:gap-y-8 ${
            compact ? "gap-x-3 gap-y-5" : "min-h-0 flex-1 auto-rows-fr gap-x-4 gap-y-8"
          } ${kolommen} ${smal ? "mx-auto w-full max-w-4xl" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
