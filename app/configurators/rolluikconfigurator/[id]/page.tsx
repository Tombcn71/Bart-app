"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { RolluikSVG, InbouwRolluikSVG, ScreenSVG } from "@/lib/rolluik-svgs";

const rolluikData: Record<string, { name: string; component: React.ReactNode; basisPrijs: number }> = {
  "rolluik":         { name: "Rolluik",         component: <RolluikSVG />,        basisPrijs: 120 },
  "inbouw-rolluik":  { name: "Inbouw rolluik",  component: <InbouwRolluikSVG />,  basisPrijs: 175 },
  "screen":          { name: "Screen",          component: <ScreenSVG />,         basisPrijs: 145 },
};

const KLEUREN = ["wit", "antraciet", "crème-wit", "RAL kleur"];
const BEDIENINGEN = ["handmatig", "elektrisch"];

export default function RolluikConfigurator() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "rolluik";
  const product = rolluikData[slug] ?? rolluikData["rolluik"];

  const [breedte, setBreedte]     = useState(1000);
  const [hoogte, setHoogte]       = useState(1200);
  const [kleur, setKleur]         = useState("wit");
  const [bediening, setBediening] = useState("handmatig");
  const [aantal, setAantal]       = useState(1);
  const [naam, setNaam]           = useState("");
  const [email, setEmail]         = useState("");
  const [verzonden, setVerzonden] = useState(false);
  const [bezig, setBezig]         = useState(false);

  const m2 = (breedte / 1000) * (hoogte / 1000);
  const elektrischToeslag = bediening === "elektrisch" ? 85 : 0;
  const prijs = Math.round((product.basisPrijs * m2 + elektrischToeslag) * aantal * 100) / 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    await saveOfferte(email, { naam, product: product.name, slug, breedte, hoogte, kleur, aantal, prijs });
    setVerzonden(true);
    setBezig(false);
  }

  if (verzonden) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center">
        <div className="text-5xl mb-6">✓</div>
        <h2 className="text-2xl font-bold text-[#1066a3] mb-3">Offerte verzonden!</h2>
        <p className="text-slate-600 mb-8">U ontvangt uw offerte op <strong>{email}</strong>.</p>
        <Link href="/rolluiken" className="text-[#1066a3] font-semibold hover:underline">← Terug naar rolluiken</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <Link href="/rolluiken" className="text-sm text-slate-400 hover:text-[#1066a3] mb-8 inline-block">
        ← Terug naar rolluiken
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
        <div className="lg:col-span-7">
          <h1 className="text-2xl font-semibold mb-6">{product.name}</h1>
          <div className="bg-slate-50 p-10 rounded-xl border flex items-center justify-center">
            <div style={{ width: "50%", maxWidth: 220 }}>{product.component}</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="bg-white border p-6 rounded-xl shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Breedte (mm)</label>
              <input type="number" min={400} max={4000} value={breedte}
                onChange={e => setBreedte(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Hoogte (mm)</label>
              <input type="number" min={400} max={3000} value={hoogte}
                onChange={e => setHoogte(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kleur</label>
              <div className="flex gap-2 flex-wrap">
                {KLEUREN.map(k => (
                  <button key={k} type="button" onClick={() => setKleur(k)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                      kleur === k ? "bg-[#1066a3] text-white border-[#1066a3]" : "border-slate-200 text-slate-600"
                    }`}>{k}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Bediening</label>
              <div className="flex gap-2">
                {BEDIENINGEN.map(b => (
                  <button key={b} type="button" onClick={() => setBediening(b)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                      bediening === b ? "bg-[#1066a3] text-white border-[#1066a3]" : "border-slate-200 text-slate-600"
                    }`}>{b}</button>
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
