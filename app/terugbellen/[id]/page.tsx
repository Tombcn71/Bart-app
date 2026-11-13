"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Check, Phone } from "lucide-react";
import { BEDRIJF } from "@/lib/bedrijf";

const WANNEER = ["Zo snel mogelijk", "Vandaag", "Morgen"] as const;
const DAGDEEL = ["ochtend", "middag", "avond"] as const;

/** De klant vraagt om teruggebeld te worden (vanuit de herinneringsmail). Kort en rustig, in de huisstijl van het bedrijf. */
export default function TerugbellenPagina() {
  const { id } = useParams();
  const offerteId = typeof id === "string" ? id : "";
  const bedrijf = { naam: "BartMooi", telefoon: BEDRIJF.telefoon };
  const [wanneer, setWanneer] = useState<(typeof WANNEER)[number]>("Zo snel mogelijk");
  const [dagdeel, setDagdeel] = useState<(typeof DAGDEEL)[number] | "">("");
  const [status, setStatus] = useState<"idle" | "bezig" | "klaar" | "fout">("idle");

  async function verstuur() {
    setStatus("bezig");
    try {
      const r = await fetch(`/api/offerte/${offerteId}/terugbellen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wanneer, dagdeel }),
      });
      setStatus(r.ok ? "klaar" : "fout");
    } catch {
      setStatus("fout");
    }
  }

  const chip = (actief: boolean) =>
    `rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${actief ? "border-brand bg-brand text-white" : "border-slate-300 text-slate-800 hover:border-slate-500"}`;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
        {status === "klaar" ? (
          <div className="text-center">
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand text-white">
              <Check className="size-6" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Bedankt, we bellen u terug</h1>
            <p className="mt-2 text-slate-600">{bedrijf.naam} neemt contact met u op.</p>
            {bedrijf.telefoon && (
              <a href={`tel:${bedrijf.telefoon.replace(/[^\d+]/g, "")}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-text">
                <Phone className="size-4" /> Liever nu bellen? {bedrijf.telefoon}
              </a>
            )}
          </div>
        ) : (
          <>
            <h1 className="text-xl font-bold text-slate-900">Wilt u dat {bedrijf.naam} u terugbelt?</h1>
            <p className="mt-2 text-sm text-slate-600">Over uw offerte. Kies wanneer het u uitkomt.</p>

            <p className="mt-6 mb-2 text-xs font-bold text-slate-800 uppercase">Wanneer</p>
            <div className="flex flex-wrap gap-2">
              {WANNEER.map((w) => (
                <button key={w} type="button" aria-pressed={wanneer === w} onClick={() => setWanneer(w)} className={chip(wanneer === w)}>
                  {w}
                </button>
              ))}
            </div>

            {wanneer !== "Zo snel mogelijk" && (
              <>
                <p className="mt-5 mb-2 text-xs font-bold text-slate-800 uppercase">Dagdeel</p>
                <div className="flex flex-wrap gap-2">
                  {DAGDEEL.map((d) => (
                    <button key={d} type="button" aria-pressed={dagdeel === d} onClick={() => setDagdeel(dagdeel === d ? "" : d)} className={chip(dagdeel === d)}>
                      {d}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              type="button"
              onClick={verstuur}
              disabled={status === "bezig"}
              className="mt-7 w-full rounded-full bg-brand py-3.5 text-base font-bold text-white transition hover:bg-brand-dark disabled:opacity-60">
              {status === "bezig" ? "Versturen…" : "Bel mij terug"}
            </button>
            {status === "fout" && <p className="mt-3 text-center text-sm text-red-600">Het lukte niet. Probeer het zo nog eens.</p>}
          </>
        )}
      </div>
    </div>
  );
}
