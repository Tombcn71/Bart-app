"use client";
import { Calculator } from "lucide-react";

/** Welkomscherm voor de klant: kop, een kort verhaal over hoe het werkt, en de knop (zonder te scrollen in beeld). */
export function WelkomScherm({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative isolate overflow-hidden bg-brand-dark">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 -z-10 size-96 rounded-full bg-brand/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-32 -z-10 size-96 rounded-full bg-brand/50 blur-3xl" />

      <div className="mx-auto flex h-[calc(100svh-5rem)] max-w-xl flex-col items-center justify-center px-6 text-center md:h-[calc(100svh-6rem)]">
        <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-white text-brand-text shadow-xl shadow-black/20 md:size-20">
          <Calculator className="size-8 md:size-10" />
        </span>
        <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-5xl">Bereken uw offerte</h1>
        <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg">
          Stel uw kozijn samen en zie direct wat het kost. Wissel met één knop naar de fotoweergave en zie hoe het kozijn
          er realistisch op uw gevel uitziet. De offerte ontvangt u direct in uw mail.
        </p>

        <button
          type="button"
          onClick={onStart}
          className="mt-9 w-full rounded-full bg-white px-10 py-4 text-base font-bold text-brand-text shadow-xl shadow-black/20 transition hover:scale-[1.02] active:scale-[0.98] sm:w-auto">
          Aan de slag
        </button>
      </div>
    </div>
  );
}
