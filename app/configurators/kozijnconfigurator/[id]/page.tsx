"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { addToCart, getCart } from "@/lib/cart";
import { CartAddedModal } from "@/app/components/CartAddedModal";
import { getMatrix } from "@/lib/data";
import {
  GlassVast, GlassDK, GlassKiep, GlassVastBovenlichtKiep, GlassDkBovenlichtVast,
  GlassDkBovenlichtKiep, GlassDkBorstweringVast, GlassKiepKiep,
  GlassDkDkStolpBovenlichtVast, GlassDkVastBovenlichtenVast, GlassDkBovenlichtKiepVast,
  GlassVastBovenlichtKiepVast, GlassDkBovenlichtVastVast, GlassDkVastVastKozijn,
  GlassDkDkDkKozijn, GlassDkVastDkBovenlichtenVast, GlassVastDkVastBovenlichtenVast,
} from "@/lib/kozijn-svgs";

const FRAME_COLOR = "#2d3748";

const DEFAULT_MATRIX = {
  basisPrijs: 0, m2Tarief: 0,
  kleurToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "ral-kleur": 0 },
  kleurBuitenkantToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "basalt-grijs": 0, "kwarts-grijs": 0, zwart: 0 },
  glasToeslag: { "hr-plus-plus": 0, "triple-glas": 0 },
  profielToeslag: { "vlak-82": 0, "creon-82": 0, "creon-verdiept-120": 0, "creon-verdiept-120-hvl": 0 },
  aanslagToeslag: { ja: 0, nee: 0 },
  afstandshouderToeslag: { aluminium: 0, zwart: 0 },
  roedenToeslag: { geen: 0, "6-vaks-18mm": 0, "8-vaks-18mm": 0, "6-vaks-26mm": 0, "8-vaks-26mm": 0 },
  ventilatieRoosterToeslag: { nee: 0, ja: 0 },
  voorborenToeslag: { "niet-voorboren": 0, voorboren: 0 },
};

const getKozijnData = (slug: string) => {
  const data = [
    { slug: "vast-kozijn",                             v: 1, types: ["vast"],             name: "Vast kozijn",                    components: <GlassVast x={0} /> },
    { slug: "draai-kiep-kozijn",                       v: 1, types: ["dk"],               name: "Draai kiep kozijn",              components: <GlassDK x={0} /> },
    { slug: "kiep-kozijn",                             v: 1, types: ["kiep"],             name: "Kiep kozijn",                    components: <GlassKiep x={0} /> },
    { slug: "vast-bovenlicht-kiep",                    v: 1, types: ["vast","kiep"],       name: "Vast met bovenlicht kiep",       components: <GlassVastBovenlichtKiep x={0} /> },
    { slug: "dk-bovenlicht-vast",                      v: 1, types: ["dk","vast"],         name: "Draai/kiep met bovenlicht vast", components: <GlassDkBovenlichtVast x={0} /> },
    { slug: "dk-bovenlicht-kiep",                      v: 1, types: ["dk","kiep"],         name: "Draai/kiep met bovenlicht kiep", components: <GlassDkBovenlichtKiep x={0} /> },
    { slug: "dk-borstwering-vast",                     v: 1, types: ["dk","vast"],         name: "Draai/kiep met borstwering",    components: <GlassDkBorstweringVast x={0} /> },
    { slug: "draai-kiep-vast-kozijn",                  v: 2, types: ["dk","vast"],         name: "Draai kiep - Vast",             components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />] },
    { slug: "draai-kiep-draai-stolp-kozijn",           v: 2, types: ["dk","dk"],           name: "Draai kiep - Draai kiep",       components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} mirror />] },
    { slug: "vast-vast-kozijn",                        v: 2, types: ["vast","vast"],       name: "Vast - Vast",                   components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />] },
    { slug: "dk-dk-gelijk",                            v: 2, types: ["dk","dk"],           name: "Draai kiep - Draai kiep gelijk", components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} mirror />] },
    { slug: "kiep-vast-liggend",                       v: 2, types: ["kiep","vast"],       name: "Kiep - vast kozijn",            components: [<GlassKiep key="1" x={0} />, <GlassVast key="2" x={100} />] },
    { slug: "kiep-kiep-kozijn",                        v: 2, types: ["kiep","kiep"],       name: "Kiep - kiep kozijn",            components: [<GlassKiepKiep key="1" x={0} />] },
    { slug: "dk-dk-stolp-bovenlicht-vast-2vaks",       v: 2, types: ["dk","dk"],           name: "Draai/kiep - draai stolp bovenlicht", components: [<GlassDkDkStolpBovenlichtVast key="1" x={0} />] },
    { slug: "dk-vast-bovenlichten-vast-2vaks",         v: 2, types: ["dk","vast"],         name: "Draai/kiep - vast bovenlichten",components: [<GlassDkVastBovenlichtenVast key="1" x={0} />] },
    { slug: "dk-bovenlicht-kiep-vast-2vaks",           v: 2, types: ["dk","kiep"],         name: "Draai/kiep bovenlicht kiep - vast", components: [<GlassDkBovenlichtKiepVast key="1" x={0} />] },
    { slug: "vast-bovenlicht-kiep-vast-2vaks",         v: 2, types: ["vast","kiep"],       name: "Vast bovenlicht kiep - vast",   components: [<GlassVastBovenlichtKiepVast key="1" x={0} />] },
    { slug: "dk-bovenlicht-vast-vast-2vaks",           v: 2, types: ["dk","vast"],         name: "Draai/kiep bovenlicht vast - vast", components: [<GlassDkBovenlichtVastVast key="1" x={0} />] },
    { slug: "draai-kiep-vast-draai-kiep-kozijn",       v: 3, types: ["dk","vast","dk"],    name: "Draai kiep - Vast - Draai kiep",components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassDK key="3" x={200} mirror />] },
    { slug: "vast-vast-vast-kozijn",                   v: 3, types: ["vast","vast","vast"],name: "Vast - Vast - Vast",            components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />] },
    { slug: "vast-draai-kiep-vast-kozijn",             v: 3, types: ["vast","dk","vast"],  name: "Vast - Draai kiep - Vast",      components: [<GlassVast key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassVast key="3" x={200} />] },
    { slug: "draai-kiep-vast-vast-kozijn",             v: 3, types: ["dk","vast","vast"],  name: "Draai/kiep - Vast - Vast",      components: [<GlassDkVastVastKozijn key="1" x={0} />] },
    { slug: "draai-kiep-draai-kiep-draai-kiep-kozijn", v: 3, types: ["dk","dk","dk"],      name: "3x Draai/kiep",                 components: [<GlassDkDkDkKozijn key="1" x={0} />] },
    { slug: "draai-kiep-vast-dk-bovenlichten-vast",    v: 3, types: ["dk","vast","dk"],    name: "DK - Vast - DK bovenlichten",   components: [<GlassDkVastDkBovenlichtenVast key="1" x={0} />] },
    { slug: "vast-dk-vast-bovenlichten-vast",          v: 3, types: ["vast","dk","vast"],  name: "Vast - DK - Vast bovenlichten", components: [<GlassVastDkVastBovenlichtenVast key="1" x={0} />] },
    { slug: "draai-kiep-vast-vast-draai-kiep-kozijn",  v: 4, types: ["dk","vast","vast","dk"], name: "DK - Vast - Vast - DK",     components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />, <GlassDK key="4" x={300} mirror />] },
    { slug: "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn", v: 4, types: ["dk","dk","dk","dk"], name: "4x Draai kiep", components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassDK key="3" x={200} />, <GlassDK key="4" x={300} />] },
  ];
  return data.find((k) => k.slug === slug) || null;
};

export default function ConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "vast-kozijn";
  const kozijn = getKozijnData(slug);

  const [matrix, setMatrix] = useState<any>(null);
  const [breedte, setBreedte] = useState(1000);
  const [hoogte, setHoogte] = useState(1000);
  const [kleur, setKleur] = useState("");
  const [kleurBuitenkant, setKleurBuitenkant] = useState("");
  const [glas, setGlas] = useState("");
  const [profiel, setProfiel] = useState("");
  const [aanslag, setAanslag] = useState("");
  const [afstandshouder, setAfstandshouder] = useState("");
  const [roeden, setRoeden] = useState("");
  const [ventilatieRooster, setVentilatieRooster] = useState("");
  const [voorboren, setVoorboren] = useState("");
  const [aantal, setAantal] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  function handleAdd() {
    addToCart({
      slug, product: kozijn?.name ?? "Kozijn", prijs: berekendePrijs,
      specs: { breedte, hoogte, kleur, kleurBuitenkant, glas, profiel, aanslag, afstandshouder, roeden, ventilatieRooster, voorboren, aantal },
    });
    setCartCount(getCart().length);
    setModalOpen(true);
  }

  useEffect(() => {
    getMatrix("kozijn_matrix").then((data: any) => {
      const m = { ...DEFAULT_MATRIX, ...(data && Object.keys(data).length ? data : {}) };
      // Zorg dat glasToeslag alleen de sleutels uit DEFAULT_MATRIX bevat (verwijdert oude DB-sleutels)
      m.glasToeslag = Object.fromEntries(
        Object.keys(DEFAULT_MATRIX.glasToeslag).map(k => [k, data?.glasToeslag?.[k] ?? 0])
      );
      setMatrix(m);
      setKleur(Object.keys(m.kleurToeslag || {})[0] || "");
      setKleurBuitenkant(Object.keys(m.kleurBuitenkantToeslag || {})[0] || "");
      setGlas(Object.keys(m.glasToeslag)[0] || "");
      setProfiel(Object.keys(m.profielToeslag || {})[0] || "");
      setAanslag(Object.keys(m.aanslagToeslag || {})[0] || "");
      setAfstandshouder(Object.keys(m.afstandshouderToeslag || {})[0] || "");
      setRoeden(Object.keys(m.roedenToeslag || {})[0] || "");
      setVentilatieRooster(Object.keys(m.ventilatieRoosterToeslag || {})[0] || "");
      setVoorboren(Object.keys(m.voorborenToeslag || {})[0] || "");
    });
  }, []);

  // Binnenwerkse maten: buitenwerkse - 54mm (27mm aanslag per zijde)
  const binnenwerksBreedte = Math.max(0, breedte - 54);
  const binnenwerkseHoogte = Math.max(0, hoogte - 54);

  const berekendePrijs = useMemo(() => {
    if (!matrix || !kozijn) return 0;
    const breedtePerSectie = breedte / kozijn.v;
    let totaal = matrix.basisPrijs ?? 0;
    kozijn.types.forEach(() => {
      const m2 = (breedtePerSectie / 1000) * (hoogte / 1000);
      totaal +=
        m2 * (matrix.m2Tarief ?? 0) +
        m2 * (matrix.glasToeslag?.[glas] ?? 0) +
        (matrix.kleurToeslag?.[kleur] ?? 0) +
        (matrix.kleurBuitenkantToeslag?.[kleurBuitenkant] ?? 0) +
        (matrix.profielToeslag?.[profiel] ?? 0) +
        (matrix.aanslagToeslag?.[aanslag] ?? 0) +
        (matrix.afstandshouderToeslag?.[afstandshouder] ?? 0) +
        (matrix.roedenToeslag?.[roeden] ?? 0) +
        (matrix.ventilatieRoosterToeslag?.[ventilatieRooster] ?? 0) +
        (matrix.voorborenToeslag?.[voorboren] ?? 0);
    });
    return parseFloat((totaal * aantal).toFixed(2));
  }, [breedte, hoogte, kleur, kleurBuitenkant, glas, profiel, aanslag, afstandshouder, roeden, ventilatieRooster, voorboren, aantal, matrix, kozijn]);

  if (!matrix) return <div className="p-10 text-center">Prijzen ophalen...</div>;
  if (!kozijn) return <div className="p-10 text-center text-red-500">Kozijn niet gevonden.</div>;

  const sel = (label: string, value: string, setter: (v: string) => void, opties: Record<string, number>) => (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase">{label}</label>
      <select value={value} onChange={(e) => setter(e.target.value)} className="w-full border p-2.5 rounded-lg text-sm capitalize">
        {Object.keys(opties).map((k) => <option key={k} value={k}>{k.replace(/-/g, " ").replace(/creon /gi, "").trim()}</option>)}
      </select>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-10">
        <Link href="/kozijnen" className="text-slate-400 text-[11px] uppercase tracking-wider hover:text-[#1066a3]">
          ← Overzicht
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold uppercase text-slate-800 mb-6">{kozijn.name}</h1>
            <div className="bg-slate-50 rounded-xl p-10 flex items-center justify-center">
              <svg viewBox={`0 0 ${kozijn.v * 100} 100`} className="w-full max-h-[400px]">
                <rect x="0.4" y="0.4" width={kozijn.v * 100 - 0.8} height="99.2" fill="white" stroke={FRAME_COLOR} strokeWidth="0.8" />
                {Array.from({ length: kozijn.v - 1 }).map((_, i) => (
                  <line key={i} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="100" stroke={FRAME_COLOR} strokeWidth="0.8" />
                ))}
                {kozijn.components}
              </svg>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Prijsindicatie</span>
                <div className="text-3xl text-slate-800">€ {berekendePrijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</div>
              </div>

              {/* Afmetingen */}
              <div className="grid grid-cols-2 gap-3">
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
              {sel("Kleur binnenkant", kleur, setKleur, matrix.kleurToeslag || {})}
              {sel("Kleur buitenkant", kleurBuitenkant, setKleurBuitenkant, matrix.kleurBuitenkantToeslag || {})}
              {sel("Type glas", glas, setGlas, matrix.glasToeslag || {})}
              {sel("Type afstandshouder", afstandshouder, setAfstandshouder, matrix.afstandshouderToeslag || {})}
              {sel("Roeden", roeden, setRoeden, matrix.roedenToeslag || {})}
              {sel("Ventilatie rooster", ventilatieRooster, setVentilatieRooster, matrix.ventilatieRoosterToeslag || {})}
              {sel("Voorboren", voorboren, setVoorboren, matrix.voorborenToeslag || {})}

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Aantal</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAantal(Math.max(1, aantal - 1))} className="w-9 h-9 rounded-lg border text-lg font-bold text-slate-600 hover:bg-slate-50">−</button>
                  <span className="text-sm font-bold w-6 text-center">{aantal}</span>
                  <button onClick={() => setAantal(aantal + 1)} className="w-9 h-9 rounded-lg border text-lg font-bold text-slate-600 hover:bg-slate-50">+</button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-[#1066a3] text-white py-4 rounded-lg font-bold uppercase text-[11px] tracking-widest hover:bg-[#0d5491] transition-colors">
                Toevoegen aan offerte
              </button>
              <p className="text-center text-[11px] text-slate-400">Ontvang uw subsidie-indicatie bij de offerte</p>
            </div>
          </div>
        </div>
      </div>

      <CartAddedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={kozijn.name}
        breedte={breedte}
        hoogte={hoogte}
        aantal={aantal}
        prijs={berekendePrijs}
        cartCount={cartCount}
        onAddAnother={() => setModalOpen(false)}
      />
    </div>
  );
}
