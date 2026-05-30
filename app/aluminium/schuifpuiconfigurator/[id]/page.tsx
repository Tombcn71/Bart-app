"use client";
import { showToast } from "@/app/components/CenterToast";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { getMatrix } from "@/lib/data";
import { SlidingDoorDetailSVG } from "@/lib/schuifpui-svgs";

const DEFAULT_MATRIX = {
  basisPui: { "2": 0, "4": 0 },
  m2Tarief: 0,
  kleurToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "ral-kleur": 0 },
  kleurBuitenkantToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "basalt-grijs": 0, "kwarts-grijs": 0, zwart: 0 },
  kleurBewegendeToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "basalt-grijs": 0, "kwarts-grijs": 0, zwart: 0 },
  glasTypeM2: { "dubbel-glas": 0, "dubbel-glas-gelaagd": 0, "triple-glas": 0, "hr-plus-plus": 0 },
  profielToeslag: { "evolution-drive-plus": 0, standaard: 0 },
  aanslagToeslag: { nee: 0, ja: 0 },
  afstandshouderToeslag: { aluminium: 0, zwart: 0 },
  roedenToeslag: { geen: 0, "6-vaks-18mm": 0, "8-vaks-18mm": 0, "6-vaks-26mm": 0, "8-vaks-26mm": 0 },
  ventilatieRoosterToeslag: { nee: 0, ja: 0 },
  draairichtingToeslag: { "vaste-deel-links": 0, "vaste-deel-rechts": 0 },
  krukToeslag: { "kruk-binnen-sleutel": 0, "kruk-binnen": 0, greep: 0 },
  voorborenToeslag: { "niet-voorboren": 0, voorboren: 0 },
};

const puiData = [
  { slug: "schuifpui-2-vaks", sections: 2, name: "Schuifpui 2-vaks" },
  { slug: "schuifpui-4-vaks", sections: 4, name: "Schuifpui 4-vaks" },
];

export default function AluSchuifpuiDetailPage() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "schuifpui-2-vaks";
  const pui = puiData.find((s) => s.slug === slug) || puiData[0];

  const [matrix, setMatrix] = useState<any>(null);
  const [breedte, setBreedte] = useState(2500);
  const [hoogte, setHoogte] = useState(2200);
  const [kleur, setKleur] = useState("");
  const [kleurBuitenkant, setKleurBuitenkant] = useState("");
  const [kleurBewegende, setKleurBewegende] = useState("");
  const [glas, setGlas] = useState("");
  const [profiel, setProfiel] = useState("");
  const [aanslag, setAanslag] = useState("");
  const [afstandshouder, setAfstandshouder] = useState("");
  const [roeden, setRoeden] = useState("");
  const [ventilatieRooster, setVentilatieRooster] = useState("");
  const [draairichting, setDraairichting] = useState("");
  const [kruk, setKruk] = useState("");
  const [voorboren, setVoorboren] = useState("");
  const [aantal, setAantal] = useState(1);
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getMatrix("alu_schuifpui_matrix").then((data: any) => {
      const m = { ...DEFAULT_MATRIX, ...(data && Object.keys(data).length ? data : {}) };
      setMatrix(m);
      setKleur(Object.keys(m.kleurToeslag || {})[0] || "");
      setKleurBuitenkant(Object.keys(m.kleurBuitenkantToeslag || {})[0] || "");
      setKleurBewegende(Object.keys(m.kleurBewegendeToeslag || {})[0] || "");
      setGlas(Object.keys(m.glasTypeM2 || {})[0] || "");
      setProfiel(Object.keys(m.profielToeslag || {})[0] || "");
      setAanslag(Object.keys(m.aanslagToeslag || {})[0] || "");
      setAfstandshouder(Object.keys(m.afstandshouderToeslag || {})[0] || "");
      setRoeden(Object.keys(m.roedenToeslag || {})[0] || "");
      setVentilatieRooster(Object.keys(m.ventilatieRoosterToeslag || {})[0] || "");
      setDraairichting(Object.keys(m.draairichtingToeslag || {})[0] || "");
      setKruk(Object.keys(m.krukToeslag || {})[0] || "");
      setVoorboren(Object.keys(m.voorborenToeslag || {})[0] || "");
    });
  }, []);

  const berekendePrijs = useMemo(() => {
    if (!matrix) return 0;
    const m2 = (breedte / 1000) * (hoogte / 1000);
    return Number((
      (matrix.basisPui?.[pui.sections.toString()] ?? 0) +
      m2 * (matrix.m2Tarief ?? 0) +
      m2 * (matrix.glasTypeM2?.[glas] ?? 0) +
      (matrix.kleurToeslag?.[kleur] ?? 0) +
      (matrix.kleurBuitenkantToeslag?.[kleurBuitenkant] ?? 0) +
      (matrix.kleurBewegendeToeslag?.[kleurBewegende] ?? 0) +
      (matrix.profielToeslag?.[profiel] ?? 0) +
      (matrix.aanslagToeslag?.[aanslag] ?? 0) +
      (matrix.afstandshouderToeslag?.[afstandshouder] ?? 0) +
      (matrix.roedenToeslag?.[roeden] ?? 0) +
      (matrix.ventilatieRoosterToeslag?.[ventilatieRooster] ?? 0) +
      (matrix.draairichtingToeslag?.[draairichting] ?? 0) +
      (matrix.krukToeslag?.[kruk] ?? 0) +
      (matrix.voorborenToeslag?.[voorboren] ?? 0)
    ).toFixed(2)) * aantal;
  }, [matrix, pui.sections, breedte, hoogte, kleur, kleurBuitenkant, kleurBewegende, glas, profiel, aanslag, afstandshouder, roeden, ventilatieRooster, draairichting, kruk, voorboren, aantal]);

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
        <Link href="/aluminium/schuifpui" className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#1066a3]">
          ← Overzicht
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold mb-2">Aluminium — {pui.name}</h1>
            <div className="bg-slate-50 p-10 rounded-xl border flex items-center justify-center">
              <SlidingDoorDetailSVG sections={pui.sections} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border p-6 rounded-xl shadow-sm space-y-4">
              <div>
                <span className="text-xs text-slate-400 uppercase font-bold">Prijsindicatie</span>
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
                <div>Binnenwerkse breedte: <span className="font-bold text-slate-700">{breedte} mm</span></div>
                <div>Binnenwerkse hoogte: <span className="font-bold text-slate-700">{hoogte} mm</span></div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Verdeling</label>
                <div className="w-full border p-2.5 rounded-lg text-sm bg-slate-50 text-slate-600">{pui.name}</div>
              </div>

              {sel("Type profiel", profiel, setProfiel, matrix.profielToeslag || {})}
              {sel("Aanslag", aanslag, setAanslag, matrix.aanslagToeslag || {})}
              {sel("Kleur binnenkant", kleur, setKleur, matrix.kleurToeslag || {})}
              {sel("Kleur buitenkant profiel", kleurBuitenkant, setKleurBuitenkant, matrix.kleurBuitenkantToeslag || {})}
              {sel("Kleur bewegende delen buitenkant", kleurBewegende, setKleurBewegende, matrix.kleurBewegendeToeslag || {})}
              {sel("Type glas", glas, setGlas, matrix.glasTypeM2 || {})}
              {sel("Type afstandshouder", afstandshouder, setAfstandshouder, matrix.afstandshouderToeslag || {})}
              {sel("Roeden", roeden, setRoeden, matrix.roedenToeslag || {})}
              {sel("Ventilatie rooster", ventilatieRooster, setVentilatieRooster, matrix.ventilatieRoosterToeslag || {})}
              {sel("Draairichting / Volgorde", draairichting, setDraairichting, matrix.draairichtingToeslag || {})}
              {sel("Type kruk", kruk, setKruk, matrix.krukToeslag || {})}
              {sel("Voorboren", voorboren, setVoorboren, matrix.voorborenToeslag || {})}

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Aantal</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAantal(Math.max(1, aantal - 1))} className="w-9 h-9 rounded-lg border text-lg font-bold text-slate-600 hover:bg-slate-50">−</button>
                  <span className="text-sm font-bold w-6 text-center">{aantal}</span>
                  <button onClick={() => setAantal(aantal + 1)} className="w-9 h-9 rounded-lg border text-lg font-bold text-slate-600 hover:bg-slate-50">+</button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-slate-800">Check uw subsidie</h3>
                <label className="block text-[10px] mt-2 font-bold text-slate-500 uppercase">Naam</label>
                <input type="text" placeholder="Uw naam" value={naam} onChange={(e) => setNaam(e.target.value)} className="w-full p-2 rounded-lg border text-sm" />
                <label className="block text-[10px] mt-2 font-bold text-slate-500 uppercase">E-mailadres</label>
                <input type="email" placeholder="Uw e-mailadres" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded-lg border text-sm" />
              </div>

              <button
                disabled={isSubmitting}
                onClick={async () => {
                  if (!email || !naam) { showToast("Vul a.u.b. uw gegevens in.", "error"); return; }
                  setIsSubmitting(true);
                  await saveOfferte(email, {
                    naam, product: `Aluminium ${pui.name}`, slug, breedte, hoogte,
                    kleur, kleurBuitenkant, kleurBewegende, glas, profiel, aanslag,
                    afstandshouder, roeden, ventilatieRooster, draairichting, kruk, voorboren,
                    aantal, prijs: berekendePrijs,
                  });
                  showToast(`Bedankt, uw offerte is succesvol verstuurd naar ${email}`);
                  setIsSubmitting(false);
                }}
                className="w-full bg-[#1066a3] text-white py-4 rounded-lg font-bold uppercase text-[11px] tracking-widest hover:bg-[#0a4d7d] transition-colors">
                {isSubmitting ? "Bezig..." : "Offerte aanvragen"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
