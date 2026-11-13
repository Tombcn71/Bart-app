"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Tekening of foto op een gevel, met de schakelaar ertussen. Zelfde weergave als in de calculator
 * (ProductConfigurator): dezelfde knoppen, hetzelfde fotovak en een staand vak voor hoge, smalle producten.
 * Zonder `foto` blijft alleen de tekening staan en is er geen schakelaar.
 */
export function TekeningFoto({
  naam,
  svg,
  foto,
  staand,
}: {
  naam: string;
  /** Technische tekening als svg-tekst. */
  svg: string | null;
  /** Pad van de foto op een gevel, of null als er voor dit product geen foto is. */
  foto: string | null;
  /** Hoger dan breed (een deur): een staand vak, zodat de tekening groot genoeg is. */
  staand: boolean;
}) {
  const [weergave, setWeergave] = useState<"tekening" | "foto">("tekening");
  const heeftFoto = !!foto;
  const toonFoto = heeftFoto && weergave === "foto";
  const staandVak = "mx-auto aspect-4/5 w-full max-w-[34rem]";
  const knop = (actief: boolean) =>
    `min-w-28 rounded-lg px-6 py-2.5 text-sm font-bold transition-colors ${actief ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`;

  return (
    <div className="space-y-3">
      {heeftFoto && (
        <div role="group" aria-label="Tekening of foto" className="flex w-fit rounded-xl bg-slate-100 p-1">
          {(["tekening", "foto"] as const).map((w) => (
            <button key={w} type="button" aria-pressed={weergave === w} onClick={() => setWeergave(w)} className={knop(weergave === w)}>
              {w === "tekening" ? "Tekening" : "Foto"}
            </button>
          ))}
        </div>
      )}
      {toonFoto && foto ? (
        <div>
          <div className={`relative overflow-hidden rounded-xl bg-slate-100 ${staand ? staandVak : "aspect-4/3"}`}>
            <Image
              src={foto}
              alt={`${naam} op een gevel van zandkleurige steen`}
              fill
              sizes="(min-width: 1024px) 652px, calc(100vw - 32px)"
              priority
              className="object-cover"
            />
          </div>
          <p className="mt-1.5 text-center text-xs text-slate-700">Buitenkant</p>
        </div>
      ) : svg ? (
        <div className={`flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 ${staand ? `${staandVak} p-3 sm:p-5` : heeftFoto ? "aspect-4/3 p-3 sm:p-5" : "h-40 p-3 sm:aspect-video sm:h-auto sm:p-5"}`}>
          {/* De tekeningen zetten zelf width 100% en height auto; dat dwingen we binnen het vak. */}
          <div
            className="flex h-full max-w-full items-center justify-center [&>svg]:h-full! [&>svg]:max-h-full! [&>svg]:w-auto! [&>svg]:max-w-full!"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      ) : null}
    </div>
  );
}
