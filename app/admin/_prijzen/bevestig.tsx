"use client";
import { useEffect } from "react";

/** Klein venster "Weet je het zeker?". Annuleren is de standaardkeuze, Escape sluit het. */
export function Bevestig({
  titel,
  tekst,
  jaLabel,
  onJa,
  onNee,
}: {
  titel: string;
  tekst: string;
  jaLabel: string;
  onJa: () => void;
  onNee: () => void;
}) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && onNee();
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [onNee]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={onNee}>
      <div role="alertdialog" aria-modal="true" aria-label={titel} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-slate-900">{titel}</h3>
        <p className="mt-2 text-sm text-slate-600">{tekst}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" autoFocus onClick={onNee} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Annuleren
          </button>
          <button type="button" onClick={onJa} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
            {jaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
