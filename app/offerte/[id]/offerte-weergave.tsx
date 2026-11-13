"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, Mail, FileText } from "lucide-react";
import { TekeningFoto } from "@/app/components/TekeningFoto";

export type OfferteItemWeergave = {
  product: string;
  prijs: number;
  btw: string;
  specs: [string, string][];
  /** Technische tekening (svg), of null. */
  svg: string | null;
  /** Foto van het kozijn op een gevel, of null als daar geen foto voor is. */
  foto: string | null;
  /** Hoger dan breed (deur): staand vak. */
  staand: boolean;
};

const euro = (n: number) => `€ ${n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function ItemKaart({ item, nummer, totaalItems }: { item: OfferteItemWeergave; nummer: number; totaalItems: number }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {totaalItems > 1 ? `Product ${nummer} van ${totaalItems}` : "Uw product"}
        </p>
        <h2 className="text-lg font-bold text-slate-900 mt-1">{item.product}</h2>
      </div>

      <div className="md:grid md:grid-cols-2 md:items-start">
      {(item.svg || item.foto) && (
        <div className="px-5 pb-4">
          <TekeningFoto naam={item.product} svg={item.svg} foto={item.foto} staand={item.staand} />
          <p className="text-xs text-slate-400 mt-2">Schematische weergave — niet op schaal</p>
        </div>
      )}

      <dl className="border-t border-slate-100 md:border-t-0 md:border-l">
        {item.specs.map(([label, waarde], i) => (
          <div key={i} className={`flex gap-3 px-5 py-2.5 text-sm ${i % 2 ? "bg-slate-50/60" : ""}`}>
            <dt className="w-2/5 shrink-0 text-slate-500">{label}</dt>
            <dd className="font-medium text-slate-800">{waarde}</dd>
          </div>
        ))}
        <div className="flex gap-3 px-5 py-3 text-sm bg-slate-50 border-t border-slate-100">
          <dt className="w-2/5 shrink-0 text-slate-500">Prijsindicatie</dt>
          <dd className="font-bold text-brand-text">
            {euro(item.prijs)} <span className="font-normal text-slate-400">{item.btw}</span>
          </dd>
        </div>
      </dl>
      </div>
    </section>
  );
}

export function OfferteWeergave({
  offerteId,
  bedrijf,
  klantNaam,
  intro,
  items,
  totaal,
  btw,
  geaccepteerd,
  datum,
  geldigTot,
  referentie,
  klantPlaats,
}: {
  offerteId: string;
  bedrijf: {
    naam: string;
    email: string | null;
    telefoon: string | null;
    website: string | null;
    adres: string | null;
    postcode: string | null;
    plaats: string | null;
    kvk: string | null;
  };
  datum: string;
  geldigTot: string;
  referentie: string;
  klantPlaats: string;
  klantNaam: string;
  intro: string;
  items: OfferteItemWeergave[];
  totaal: number;
  btw: string;
  /** Eerder gegeven akkoord (naam + datum), of null. */
  geaccepteerd: { door: string; op: string } | null;
}) {
  const [gekopieerd, setGekopieerd] = useState(false);
  const [akkoord, setAkkoord] = useState(false);
  const [naam, setNaam] = useState(klantNaam);
  const [status, setStatus] = useState<"idle" | "bezig" | "error">("idle");
  const akkoordRef = useRef<HTMLDivElement>(null);
  const [klaar, setKlaar] = useState<{ door: string; op: string } | null>(geaccepteerd);

  async function accepteer() {
    if (!akkoord || !naam.trim()) return;
    setStatus("bezig");
    try {
      const res = await fetch(`/api/offerte/${offerteId}/accepteer`, {
        method: "POST",
        body: JSON.stringify({ naam }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) { setStatus("error"); return; }
      setKlaar({ door: naam.trim(), op: new Date().toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" }) });
      setStatus("idle");
      setTimeout(() => akkoordRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    } catch { setStatus("error"); }
  }

  const deelTekst = `Offerte van ${bedrijf.naam}`;
  const [pagina, setPagina] = useState("");
  useEffect(() => setPagina(window.location.href), []);
  const deelLink = (kanaal: "whatsapp" | "mail") => {
    const url = pagina;
    return kanaal === "whatsapp"
      ? `https://wa.me/?text=${encodeURIComponent(`${deelTekst}: ${url}`)}`
      : `mailto:?subject=${encodeURIComponent(deelTekst)}&body=${encodeURIComponent(url)}`;
  };

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    } catch {
      /* geen toegang tot het klembord */
    }
  }

  return (
    <>

      <main className="max-w-xl md:max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* Briefhoofd: links offertegegevens, rechts het bedrijf */}
        <section className="rounded-2xl border border-slate-100 bg-white px-5 py-6 shadow-sm md:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 text-sm text-slate-600">
              <p className="text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">Offerte</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{klantNaam || "Uw offerte"}</p>
              {klantPlaats && <p>{klantPlaats}</p>}
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                <dt className="text-slate-400">Datum</dt><dd className="font-medium text-slate-800">{datum}</dd>
                <dt className="text-slate-400">Referentie</dt><dd className="font-medium text-slate-800">{referentie}</dd>
                <dt className="text-slate-400">Geldig tot</dt><dd className="font-medium text-slate-800">{geldigTot}</dd>
              </dl>
            </div>
            <div className="hidden min-w-0 break-words text-sm leading-relaxed text-slate-500 sm:block sm:text-right">
              <p className="mb-1 text-xl font-bold leading-tight text-brand-text">{bedrijf.naam}</p>
              {bedrijf.adres && <p>{bedrijf.adres}</p>}
              {(bedrijf.postcode || bedrijf.plaats) && <p>{[bedrijf.postcode, bedrijf.plaats].filter(Boolean).join(" ")}</p>}
              {bedrijf.telefoon && <p>{bedrijf.telefoon}</p>}
              {bedrijf.email && <p>{bedrijf.email}</p>}
              {bedrijf.website && <p>{bedrijf.website}</p>}
              {bedrijf.kvk && <p>KvK {bedrijf.kvk}</p>}
              {bedrijf.telefoon && (
                <a href={`tel:${bedrijf.telefoon.replace(/[^\d+]/g, "")}`} className="mt-3 inline-block rounded-full border border-brand-text/30 px-4 py-2 text-sm font-semibold text-brand-text">
                  Bel ons
                </a>
              )}
            </div>
          </div>
          <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm leading-relaxed text-slate-600 sm:mt-6">
            <p>{intro}</p>
            <p>Gaat u akkoord, dan plannen wij samen de inmeting. Na de inmeting en een voorschot of aanbetaling kunnen wij gaan beginnen.</p>
          </div>
        </section>

        {items.map((item, i) => (
          <ItemKaart key={i} item={item} nummer={i + 1} totaalItems={items.length} />
        ))}

        {items.length > 1 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex justify-between text-sm">
            <span className="font-semibold text-slate-700">Totaal</span>
            <span className="font-bold text-brand-text">
              {euro(totaal)} <span className="font-normal text-slate-400">{btw}</span>
            </span>
          </div>
        )}

        <div ref={akkoordRef} className="scroll-mt-6">
        {klaar && (
          <section className="rounded-2xl border border-green-200 bg-green-50 px-5 py-5">
            <p className="flex items-center gap-2 font-bold text-green-800"><Check className="size-5" /> Akkoord ontvangen, bedankt!</p>
            <p className="mt-2 text-sm text-green-900/80 leading-relaxed">
              Geaccepteerd door <strong>{klaar.door}</strong> op {klaar.op}. {bedrijf.naam} neemt contact met u op om de inmeting te plannen. Uw offerte kunt u hier altijd terugvinden of downloaden.
            </p>
            <a href={`/api/offerte/${offerteId}/klant?download=1`} className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-green-700 py-3 text-sm font-bold text-white">
              <FileText className="size-4" /> Download uw offerte als pdf
            </a>
          </section>
        )}
        {!klaar && (
          <section className="rounded-2xl bg-white border border-slate-100 shadow-sm px-5 py-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Digitaal akkoord</h2>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Naam</label>
            <input value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="Voor- en achternaam"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            <label className="mt-4 flex items-start gap-3 cursor-pointer select-none">
              <input type="checkbox" checked={akkoord} onChange={(e) => setAkkoord(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--brand)]" />
              <span className="text-sm text-slate-600 leading-relaxed">
                Ik heb de offerte gelezen en ga akkoord met de specificaties en prijsindicatie van {bedrijf.naam.replace(/\.$/, "")}.
              </span>
            </label>
            {status === "error" && <p className="mt-3 text-sm text-red-500">Er is iets misgegaan. Probeer opnieuw.</p>}
            <button type="button" disabled={!akkoord || !naam.trim() || status === "bezig"} onClick={accepteer}
              className="mt-5 w-full rounded-xl bg-brand py-3 text-sm font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed">
              {status === "bezig" ? "Verwerken..." : "Akkoord geven"}
            </button>
          </section>
        )}
        </div>

        <div className="grid gap-3 pt-2">
          {!klaar && (
            <a href={`/api/offerte/${offerteId}/klant?download=1`} className="rounded-xl border border-slate-200 bg-white text-center py-3 text-sm font-semibold text-slate-700">
              Download als pdf
            </a>
          )}
          <p className="text-xs text-slate-400 text-center">
            Vragen? {bedrijf.email ? <a href={`mailto:${bedrijf.email}`} className="underline">{bedrijf.email}</a> : bedrijf.naam}
          </p>
        </div>

        <footer className="rounded-2xl border border-slate-100 bg-white px-5 py-5 text-sm leading-relaxed text-slate-700 shadow-sm sm:hidden">
          <p className="text-base font-bold text-slate-900">{bedrijf.naam}</p>
          {bedrijf.adres && <p>{bedrijf.adres}</p>}
          {(bedrijf.postcode || bedrijf.plaats) && <p>{[bedrijf.postcode, bedrijf.plaats].filter(Boolean).join(" ")}</p>}
          {bedrijf.telefoon && <p>Telefoon: <a href={`tel:${bedrijf.telefoon.replace(/[^\d+]/g, "")}`} className="font-semibold text-brand-text">{bedrijf.telefoon}</a></p>}
          {bedrijf.email && <p>E-mail: <a href={`mailto:${bedrijf.email}`} className="font-semibold text-brand-text">{bedrijf.email}</a></p>}
          {bedrijf.website && <p>Website: {bedrijf.website}</p>}
          {bedrijf.kvk && <p>KvK-nummer: {bedrijf.kvk}</p>}
        </footer>
      </main>

      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3">
        <div className="max-w-xl md:max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-700 mr-auto">Delen</span>
          <a href={deelLink("whatsapp")} target="_blank" rel="noopener" aria-label="Delen via WhatsApp"
            className="flex size-11 items-center justify-center rounded-full bg-[#25D366] text-white">
            <svg viewBox="0 0 24 24" className="size-6" fill="currentColor" aria-hidden><path d="M12.04 2a9.9 9.9 0 0 0-8.45 15.07L2 22l5.07-1.55A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .92.98-2.92-.2-.31a8.2 8.2 0 1 1 6.72 3.64Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.42-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.06 0 1.21.88 2.38 1 2.55.12.16 1.73 2.64 4.2 3.7.59.26 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.23-.16-.48-.28Z"/></svg>
          </a>
          <a href={deelLink("mail")} aria-label="Delen via e-mail"
            className="flex size-11 items-center justify-center rounded-full bg-brand text-white">
            <Mail className="size-5" />
          </a>
          <button type="button" onClick={kopieer} aria-label="Kopieer link"
            className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
            {gekopieerd ? <Check className="size-5" /> : <Link2 className="size-5" />}
          </button>
        </div>
      </div>
    </>
  );
}
