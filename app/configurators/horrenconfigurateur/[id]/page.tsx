"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { getMatrix } from "@/lib/data";
import { InzethorSVG, KlemhorSVG, PlisseHordeurSVG } from "@/lib/hor-svgs";

const HOR_INFO: Record<string, { name: string; matrixKey: string; component: React.ReactNode }> = {
  "inzethor":       { name: "Inzethor",       matrixKey: "inzethor_matrix",       component: <InzethorSVG /> },
  "klemhor":        { name: "Klemhor",         matrixKey: "klemhor_matrix",        component: <KlemhorSVG /> },
  "plisse-hordeur": { name: "Plisse hordeur",  matrixKey: "plisse_hordeur_matrix", component: <PlisseHordeurSVG /> },
};

const DEFAULTS = { basisPrijs: 0, m2Tarief: 0, montageKosten: 0, kleurToeslag: { wit: 0, antraciet: 0 } };
const KLEUREN = ["wit", "antraciet"];

export default function HorConfigurator() {
  const { id } = useParams();
  const slug = typeof id === "string" && id in HOR_INFO ? id : "inzethor";
  const info = HOR_INFO[slug];

  const [matrix, setMatrix]       = useState<any>(null);
  const [breedte, setBreedte]     = useState(800);
  const [hoogte, setHoogte]       = useState(1200);
  const [kleur, setKleur]         = useState("wit");
  const [aantal, setAantal]       = useState(1);
  const [naam, setNaam]           = useState("");
  const [woonplaats, setWoonplaats] = useState("");
  const [email, setEmail]         = useState("");
  const [verzonden, setVerzonden] = useState(false);
  const [bezig, setBezig]         = useState(false);

  useEffect(() => {
    getMatrix(info.matrixKey).then(m => setMatrix({ ...DEFAULTS, ...(m ?? {}) }));
  }, [info.matrixKey]);

  const m2 = (breedte / 1000) * (hoogte / 1000);
  const prijs = matrix
    ? Math.round(
        ((matrix.basisPrijs ?? 0)
          + m2 * (matrix.m2Tarief ?? 0)
          + (matrix.kleurToeslag?.[kleur] ?? 0)
          + (matrix.montageKosten ?? 0)
        ) * aantal * 100
      ) / 100
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    await saveOfferte(email, { naam, woonplaats, product: info.name, slug, breedte, hoogte, kleur, aantal, prijs });
    setVerzonden(true);
    setBezig(false);
  }

  if (verzonden) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center">
        <div className="text-5xl mb-6">✓</div>
        <h2 className="text-2xl font-bold text-[#1066a3] mb-3">Offerte verzonden!</h2>
        <p className="text-slate-600 mb-8">U ontvangt uw offerte op <strong>{email}</strong>.</p>
        <Link href="/horren" className="text-[#1066a3] font-semibold hover:underline">← Terug naar horren</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <Link href="/horren" className="text-sm text-slate-400 hover:text-[#1066a3] mb-8 inline-block">
        ← Terug naar horren
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
        <div className="lg:col-span-7">
          <h1 className="text-2xl font-semibold mb-6">{info.name}</h1>
          <div className="bg-slate-50 p-10 rounded-xl border flex items-center justify-center">
            <div style={{ width: "40%", maxWidth: 200 }}>{info.component}</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-xl shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Breedte (mm)</label>
              <input type="number" min={300} max={2500} value={breedte}
                onChange={e => setBreedte(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hoogte (mm)</label>
              <input type="number" min={300} max={3000} value={hoogte}
                onChange={e => setHoogte(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kleur</label>
              <div className="flex gap-2 flex-wrap">
                {KLEUREN.map(k => (
                  <button key={k} type="button" onClick={() => setKleur(k)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                      kleur === k ? "bg-[#1066a3] text-white border-[#1066a3]" : "border-slate-200 text-slate-600"
                    }`}>{k}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Aantal</label>
              <input type="number" min={1} max={50} value={aantal}
                onChange={e => setAantal(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
            </div>
            <div className="bg-[#f4f7f9] rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Prijsindicatie</span>
                <span className="text-xl font-bold text-[#1066a3]">
                  € {prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Excl. btw · indicatie</p>
            </div>
            <hr className="border-slate-100" />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Uw naam</label>
              <input required value={naam} onChange={e => setNaam(e.target.value)} placeholder="Jan de Vries"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Woonplaats</label>
              <input value={woonplaats} onChange={e => setWoonplaats(e.target.value)} placeholder="Amsterdam"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">E-mailadres</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jan@email.nl"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
            </div>
            <button type="submit" disabled={bezig}
              className="w-full bg-[#1066a3] text-white font-bold py-3 rounded-xl hover:bg-[#0d5491] transition-colors disabled:opacity-50">
              {bezig ? "Verzenden..." : "Offerte aanvragen"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
