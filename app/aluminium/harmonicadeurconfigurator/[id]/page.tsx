"use client";
import { showToast } from "@/app/components/CenterToast";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { getMatrix } from "@/lib/data";
import { HarmonicadeurSVG } from "@/lib/harmonicadeur-svgs";

const DEFAULT_MATRIX = {
  basisPrijs: 0, m2Tarief: 0, montageKosten: 0,
  profielToeslag: { "aluprof-mb86": 0, standaard: 0 },
  aanslagToeslag: { ja: 0, nee: 0 },
  typeLakToeslag: { glad: 0, structuur: 0, houtmotief: 0 },
  kleurBuitenzijdeToeslag: { "ral-9016-wit": 0, "ral-7016-antraciet": 0, "ral-9005-zwart": 0, "ral-kleur": 0 },
  kleurBinnenzijdeToeslag: { "ral-9016-wit": 0, "ral-7016-antraciet": 0, "ral-9005-zwart": 0, "ral-kleur": 0 },
  glasToeslag: { "dubbel-glas": 0, "dubbel-glas-gelaagd": 0, "triple-glas": 0 },
  draairichtingToeslag: { "naar-binnen-vouwend": 0, "naar-buiten-vouwend": 0 },
  volgordeToeslag: { "loopdeur-links": 0, "loopdeur-rechts": 0 },
  voorborenToeslag: { "niet-voorboren": 0, voorboren: 0 },
};

const opties: Record<string, { sections: 3 | 4 | 5; name: string }> = {
  driedelig: { sections: 3, name: "Driedelige harmonicadeur" },
  vierdelig: { sections: 4, name: "Vierdelige harmonicadeur" },
  vijfdelig: { sections: 5, name: "Vijfdelige harmonicadeur" },
};

export default function AluHarmonicadeurConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "driedelig";
  const deur = opties[slug] ?? opties.driedelig;

  const [matrix, setMatrix] = useState<any>(null);
  const [breedte, setBreedte] = useState(2400);
  const [hoogte, setHoogte] = useState(2000);
  const [profiel, setProfiel] = useState("");
  const [aanslag, setAanslag] = useState("");
  const [typeLak, setTypeLak] = useState("");
  const [kleurBuiten, setKleurBuiten] = useState("");
  const [kleurBinnen, setKleurBinnen] = useState("");
  const [glas, setGlas] = useState("");
  const [draairichting, setDraairichting] = useState("");
  const [volgorde, setVolgorde] = useState("");
  const [voorboren, setVoorboren] = useState("");
  const [aantal, setAantal] = useState(1);
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getMatrix("alu_harmonicadeur_matrix").then((data: any) => {
      const m = { ...DEFAULT_MATRIX, ...(data && Object.keys(data).length ? data : {}) };
      setMatrix(m);
      setProfiel(Object.keys(m.profielToeslag || {})[0] || "");
      setAanslag(Object.keys(m.aanslagToeslag || {})[0] || "");
      setTypeLak(Object.keys(m.typeLakToeslag || {})[0] || "");
      setKleurBuiten(Object.keys(m.kleurBuitenzijdeToeslag || {})[0] || "");
      setKleurBinnen(Object.keys(m.kleurBinnenzijdeToeslag || {})[0] || "");
      setGlas(Object.keys(m.glasToeslag || {})[0] || "");
      setDraairichting(Object.keys(m.draairichtingToeslag || {})[0] || "");
      setVolgorde(Object.keys(m.volgordeToeslag || {})[0] || "");
      setVoorboren(Object.keys(m.voorborenToeslag || {})[0] || "");
    });
  }, []);

  const binnenwerksBreedte = Math.max(0, breedte - 40);
  const binnenwerkseHoogte = Math.max(0, hoogte - 40);

  const berekendePrijs = useMemo(() => {
    if (!matrix) return 0;
    const m2 = (breedte / 1000) * (hoogte / 1000);
    return (
      (matrix.basisPrijs +
        m2 * matrix.m2Tarief +
        (matrix.profielToeslag?.[profiel] ?? 0) +
        (matrix.aanslagToeslag?.[aanslag] ?? 0) +
        (matrix.typeLakToeslag?.[typeLak] ?? 0) +
        (matrix.kleurBuitenzijdeToeslag?.[kleurBuiten] ?? 0) +
        (matrix.kleurBinnenzijdeToeslag?.[kleurBinnen] ?? 0) +
        (matrix.glasToeslag?.[glas] ?? 0) +
        (matrix.draairichtingToeslag?.[draairichting] ?? 0) +
        (matrix.volgordeToeslag?.[volgorde] ?? 0) +
        (matrix.voorborenToeslag?.[voorboren] ?? 0) +
        matrix.montageKosten) *
      deur.sections * aantal
    );
  }, [matrix, breedte, hoogte, profiel, aanslag, typeLak, kleurBuiten, kleurBinnen, glas, draairichting, volgorde, voorboren, aantal, deur.sections]);

  if (!matrix) return <div className="p-10 text-center text-slate-400">Configuratie laden...</div>;

  const sel = (label: string, value: string, setter: (v: string) => void, opties: Record<string, number>) => (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase">{label}</label>
      <select value={value} onChange={(e) => setter(e.target.value)} className="w-full border p-2.5 rounded-lg text-sm capitalize">
        {Object.keys(opties).map((k) => <option key={k} value={k}>{k.replace(/-/g, " ")}</option>)}
      </select>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <Link href="/aluminium/harmonicadeur" className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#1066a3]">
          ← Overzicht
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold uppercase text-slate-800 mb-2">Aluminium — {deur.name}</h1>
            <div className="bg-slate-50 p-10 rounded-xl border flex items-center justify-center">
              <HarmonicadeurSVG sections={deur.sections} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border rounded-xl p-6 space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Prijsindicatie</span>
                <div className="text-3xl font-light">€ {berekendePrijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Buitenwerkse breedte (mm)</label>
                  <input type="number" value={breedte} onChange={(e) => setBreedte(Number(e.target.value))} className="w-full border p-2.5 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Buitenwerkse hoogte (mm)</label>
                  <input type="number" value={hoogte} onChange={(e) => setHoogte(Number(e.target.value))} className="w-full border p-2.5 rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-500">
                <div>Binnenwerkse breedte: <span className="font-bold text-slate-700">{binnenwerksBreedte} mm</span></div>
                <div>Binnenwerkse hoogte: <span className="font-bold text-slate-700">{binnenwerkseHoogte} mm</span></div>
              </div>

              {sel("Type profiel", profiel, setProfiel, matrix.profielToeslag || {})}
              {sel("Aanslag", aanslag, setAanslag, matrix.aanslagToeslag || {})}
              {sel("Type lak", typeLak, setTypeLak, matrix.typeLakToeslag || {})}
              {sel("Kleur buitenzijde", kleurBuiten, setKleurBuiten, matrix.kleurBuitenzijdeToeslag || {})}
              {sel("Kleur binnenzijde", kleurBinnen, setKleurBinnen, matrix.kleurBinnenzijdeToeslag || {})}
              {sel("Type glas", glas, setGlas, matrix.glasToeslag || {})}
              {sel("Draairichting", draairichting, setDraairichting, matrix.draairichtingToeslag || {})}
              {sel("Volgorde", volgorde, setVolgorde, matrix.volgordeToeslag || {})}
              {sel("Voorboren", voorboren, setVoorboren, matrix.voorborenToeslag || {})}

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Aantal</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAantal(Math.max(1, aantal - 1))} className="w-9 h-9 rounded-lg border text-lg font-bold text-slate-600 hover:bg-slate-50">−</button>
                  <span className="text-sm font-bold w-6 text-center">{aantal}</span>
                  <button onClick={() => setAantal(aantal + 1)} className="w-9 h-9 rounded-lg border text-lg font-bold text-slate-600 hover:bg-slate-50">+</button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <h3 className="text-sm font-bold text-slate-800">Check uw subsidie</h3>
                <label className="block text-[10px] mt-2 font-bold text-slate-500 uppercase">Naam</label>
                <input type="text" placeholder="Uw naam" value={naam} onChange={(e) => setNaam(e.target.value)} className="w-full p-2 rounded-lg border text-sm" />
                <label className="block text-[10px] mt-2 font-bold text-slate-500 uppercase">E-mailadres</label>
                <input type="email" placeholder="Uw e-mailadres" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded-lg border text-sm" />
              </div>

              <button
                disabled={isSubmitting}
                onClick={async () => {
                  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
                  if (!naam || !emailOk) { showToast("Vul a.u.b. uw naam en e-mailadres in om verder te gaan.", "error"); return; }
                  setIsSubmitting(true);
                  await saveOfferte(email, {
                    naam, deurNaam: `Aluminium ${deur.name}`, slug, breedte, hoogte,
                    binnenwerksBreedte, binnenwerkseHoogte,
                    profiel, aanslag, typeLak, kleurBuiten, kleurBinnen,
                    glas, draairichting, volgorde, voorboren,
                    aantal, prijs: berekendePrijs,
                  });
                  showToast(`Bedankt, uw offerte is succesvol verstuurd naar ${email}`);
                  setIsSubmitting(false);
                }}
                className="w-full bg-[#1066a3] text-white py-4 rounded-lg font-bold uppercase text-[11px] tracking-widest">
                {isSubmitting ? "Bezig..." : "Bereken subsidie & Vraag offerte aan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
