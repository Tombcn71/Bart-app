import type { Metadata } from "next";
import { GeminiAssistent } from "./GeminiAssistent";

// Verborgen testpagina voor de assistent Roos. Geen link ernaartoe en Google mag hem niet tonen.
export const metadata: Metadata = {
  title: "Test assistent",
  robots: { index: false, follow: false },
};

const VOORBEELDEN = [
  "Wat is het verschil tussen dubbel en triple glas?",
  "Ik heb een raam in mijn woonkamer dat niet open kan. Wat past daar?",
  "Wat kost een kozijn van 1200 bij 1500?",
  "Wat is de levertijd?",
  "Kan ik subsidie krijgen?",
];

export default function TestAssistentPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">Testpagina</p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Praat met de assistent</h1>
      <p className="mt-3 text-slate-600">
        Klik op de bal rechtsonder en praat met Roos. Deze pagina staat nergens op de site en is alleen om te testen.
      </p>

      <h2 className="mt-10 text-sm font-semibold text-slate-900">Probeer bijvoorbeeld</h2>
      <ul className="mt-3 space-y-2">
        {VOORBEELDEN.map((v) => (
          <li key={v} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
            &ldquo;{v}&rdquo;
          </li>
        ))}
      </ul>

      <GeminiAssistent />
    </div>
  );
}
