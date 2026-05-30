"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

function clean(s?: string) {
  return s?.replace(/-/g, " ").replace(/creon /gi, "").trim() ?? "";
}

export default function AccepteerOfferte() {
  const { id } = useParams();
  const offerteId = typeof id === "string" ? id : "";

  const [offerte, setOfferte]     = useState<any>(null);
  const [geladen, setGeladen]     = useState(false);
  const [notFound, setNotFound]   = useState(false);
  const [akkoord, setAkkoord]     = useState(false);
  const [naam, setNaam]           = useState("");
  const [status, setStatus]       = useState<"idle" | "bezig" | "done" | "error">("idle");
  const [acceptDatum, setAcceptDatum] = useState("");

  useEffect(() => {
    if (!offerteId) return;
    fetch(`/api/offerte/${offerteId}/data`)
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        if (!json) { setNotFound(true); }
        else { setOfferte(json.data); setNaam(json.data?.naam ?? ""); }
        setGeladen(true);
      })
      .catch(() => { setNotFound(true); setGeladen(true); });
  }, [offerteId]);

  async function handleAccept() {
    if (!akkoord || !naam.trim()) return;
    setStatus("bezig");
    try {
      const res = await fetch(`/api/offerte/${offerteId}/accepteer`, {
        method: "POST",
        body: JSON.stringify({ naam }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setAcceptDatum(new Date().toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short" }));
        setStatus("done");
      } else setStatus("error");
    } catch { setStatus("error"); }
  }

  const datum = new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  const productNaam = offerte?.product || offerte?.kozijnNaam || offerte?.deurNaam || "product";

  // ── Bevestiging ──────────────────────────────────────────────────────────────
  if (status === "done") return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-sm border border-slate-100 p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">Offerte geaccepteerd</h1>
        <p className="text-slate-500 text-sm mb-1">Geaccepteerd door <strong className="text-[#1a1a1a]">{naam}</strong></p>
        <p className="text-slate-400 text-xs mb-6">{acceptDatum}</p>
        <p className="text-sm text-slate-500">
          BartMooi neemt zo spoedig mogelijk contact met u op om de aanbetaling en planning te bespreken.
        </p>
        <p className="text-xs text-slate-300 mt-8">Referentie: {offerteId}</p>
      </div>
    </div>
  );

  // ── Niet gevonden ─────────────────────────────────────────────────────────────
  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-slate-500 mb-4">Deze offerte-link is niet geldig of verlopen.</p>
        <a href="/" className="text-[#1066a3] text-sm font-semibold hover:underline">← Terug naar BartMooi</a>
      </div>
    </div>
  );

  // ── Laden ─────────────────────────────────────────────────────────────────────
  if (!geladen) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-300 text-sm">Offerte ophalen...</p>
    </div>
  );

  // ── Document ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f1f5f9] py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Brief */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Briefhoofd */}
          <div className="px-10 pt-10 pb-6 border-b border-slate-100 flex justify-between items-start">
            <img src="/bartmooi-logo-1.png" alt="BartMooi" className="h-9 w-auto object-contain" />
            <div className="text-right text-xs text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-600">BartMooi B.V.</p>
              <p>Burgemeester Hovylaan 157</p>
              <p>2552 XB Den Haag</p>
              <p>info@offerte-bartmooi.nl</p>
            </div>
          </div>

          <div className="px-10 py-8">
            {/* Datum + aanhef */}
            <p className="text-xs text-slate-400 mb-6">{datum}</p>
            <p className="text-sm text-slate-700 mb-1">Geachte <strong>{offerte?.naam || "klant"}</strong>,</p>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Hierbij ontvangt u de offerte voor uw aanvraag bij BartMooi B.V. Lees de specificaties zorgvuldig door en geef onderaan uw akkoord.
            </p>

            {/* Specificaties */}
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Offerte specificaties</h2>
            <div className="border border-slate-100 rounded-xl overflow-hidden mb-8">
              {(([
                ["Product", productNaam],
                offerte?.materiaal ? ["Materiaal", offerte.materiaal] : null,
                offerte?.breedte && offerte?.hoogte ? ["Maat (B × H)", `${offerte.breedte} mm × ${offerte.hoogte} mm`] : null,
                offerte?.glasType || offerte?.glas ? ["Type glas", offerte.glasType || offerte.glas] : null,
                offerte?.kleur ? ["Kleur", clean(offerte.kleur)] : null,
                offerte?.profiel ? ["Profiel", clean(offerte.profiel)] : null,
                offerte?.beslag ? ["Beslag", clean(offerte.beslag)] : null,
                offerte?.aantal ? ["Aantal", `${offerte.aantal} stuks`] : null,
              ] as ([string, string] | null)[]).filter((r): r is [string, string] => r !== null).map(([label, value], i, arr) => (
                <div key={i} className={`flex px-5 py-3 text-sm ${i < arr.length - 1 ? "border-b border-slate-50" : ""} ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <span className="w-40 text-slate-400 shrink-0">{label}</span>
                  <span className="text-slate-800 font-medium">{value}</span>
                </div>
              ))}
              <div className="flex px-5 py-3 text-sm bg-slate-50">
                <span className="w-40 text-slate-400 flex-shrink-0">Prijsindicatie</span>
                <span className="text-[#1066a3] font-bold">
                  € {offerte?.prijs?.toLocaleString("nl-NL", { minimumFractionDigits: 2 })} excl. btw
                </span>
              </div>
              {offerte?.subsidieIndicatie > 0 && (
                <div className="flex px-5 py-3 text-sm bg-white border-t border-slate-50">
                  <span className="w-40 text-slate-400 flex-shrink-0">ISDE subsidie</span>
                  <span className="text-green-700 font-medium">≈ € {offerte.subsidieIndicatie.toLocaleString("nl-NL")} indicatie</span>
                </div>
              )}
            </div>

            {/* Voorwaarden samenvatting */}
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Voorwaarden</h2>
            <ul className="text-sm text-slate-500 space-y-1.5 mb-8 leading-relaxed">
              <li className="flex gap-2"><span className="text-slate-300">–</span> Betaling: 30% bij akkoord · 40% bij aanvang · 30% na oplevering.</li>
              <li className="flex gap-2"><span className="text-slate-300">–</span> Levertijd circa 6 weken na aanbetaling.</li>
              <li className="flex gap-2"><span className="text-slate-300">–</span> Garantie: 10 jaar kozijnen, 5 jaar hang- en sluitwerk, 2 jaar ventilatieroosters.</li>
              <li className="flex gap-2"><span className="text-slate-300">–</span> Deze offerte is 30 dagen geldig.</li>
            </ul>

            {/* Acceptatie */}
            <div className="border-t border-slate-100 pt-8">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Digitaal akkoord</h2>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Naam</label>
                <input value={naam} onChange={e => setNaam(e.target.value)} placeholder="Voor- en achternaam"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
              </div>

              <label className="flex items-start gap-3 cursor-pointer mb-6 select-none">
                <div className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${akkoord ? "bg-[#1066a3] border-[#1066a3]" : "border-slate-300 bg-white"}`}
                  onClick={() => setAkkoord(v => !v)}>
                  {akkoord && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="2 6 5 9 10 3" /></svg>}
                </div>
                <span className="text-sm text-slate-600 leading-relaxed">
                  Ik heb de offerte gelezen en ga akkoord met de bovenstaande specificaties, prijsindicatie en betalingsvoorwaarden van BartMooi B.V.
                </span>
              </label>

              {status === "error" && (
                <p className="text-sm text-red-500 mb-4">Er is iets misgegaan. Probeer opnieuw.</p>
              )}

              <button disabled={!akkoord || !naam.trim() || status === "bezig"} onClick={handleAccept}
                className="w-full bg-[#1066a3] text-white font-bold py-3 rounded-xl hover:bg-[#0d5491] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                {status === "bezig" ? "Verwerken..." : "Offerte accepteren"}
              </button>
            </div>
          </div>

          {/* Voettekst */}
          <div className="px-10 py-5 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">
              BartMooi B.V. · KvK Den Haag · info@offerte-bartmooi.nl · Referentie: {offerteId.slice(0, 8)}...
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
