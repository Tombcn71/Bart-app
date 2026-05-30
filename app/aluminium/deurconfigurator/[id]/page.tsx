"use client";
import { showToast } from "@/app/components/CenterToast";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { getMatrix } from "@/lib/data";
import {
  SingleDoorBase, DoubleDoorBase, AchterdeurBovenlicht, VoordeurBovenlicht,
  AchterdeurBorstwering, AchterdeurBorstweringBovenlicht, DeurZijlicht, VoordeurZijlicht,
  DeurZijlichtBovenlicht, VoordeurZijlichtBovenlicht, DeurZijlichtBorstwering,
  DeurZijlichten, DubbeleDeurBovenlicht, DubbeleDeurZijlicht,
  DubbeleDeurZijlichtenBovenlichten, DubbeleDeurBorstweringBovenlicht,
} from "@/lib/deur-svgs";

const DEFAULT_MATRIX = {
  basisPrijs: 0, m2Tarief: 0, montageKosten: 0,
  kleurToeslag: { wit: 0, antraciet: 0, "ral-kleur": 0 },
  typeBeslag: { standaard: 0, premium: 0 },
  paneelToeslag: { glad: 0, houtnerf: 0 },
  profielToeslag: { "creon-120": 0, "creon-120-hvl": 0 },
  onderdorpelToeslag: { "doorlopend-kader": 0, "dts": 0 },
  draairichtingToeslag: { "buiten-links": 0, "buiten-rechts": 0, "binnen-links": 0, "binnen-rechts": 0 },
  kleurBuitenkantToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "basalt-grijs": 0, "kwarts-grijs": 0, zwart: 0 },
  afstandshouderToeslag: { aluminium: 0, zwart: 0 },
  roedenToeslag: { geen: 0, "6-vaks-18mm": 0, "8-vaks-18mm": 0, "6-vaks-26mm": 0, "8-vaks-26mm": 0 },
  glasToeslag: {
    "Dubbel glas": 0,
    "Dubbel glas (mat buitenzijde)": 0,
    "Dubbel glas binnen zijde gelaagd": 0,
    "Dubbel glas binnen zijde gelaagd (mat buitenzijde)": 0,
    "Dubbel glas dubbelzijdig gelaagd": 0,
    "Dubbel glas dubbelzijdig gelaagd (mat buitenzijde)": 0,
    "Sandwichpaneel": 0,
    "Geen glas (glaslatten voor 24 mm glas)": 0,
    "Triple glas": 0,
    "Triple matglas (mat middelste ruit)": 0,
    "Triple glas binnen zijde gelaagd": 0,
    "Triple glas binnen zijde gelaagd (mat middelste ruit)": 0,
    "Triple glas dubbelzijdig gelaagd": 0,
    "Triple glas dubbelzijdig gelaagd (mat middelste ruit)": 0,
  },
};

const deurOpties: Record<string, { v: number; name: string; comp: React.ReactNode }> = {
  voordeur:                           { v: 1,   name: "Voordeur",                                        comp: <SingleDoorBase type="voordeur" /> },
  achterdeur:                         { v: 1,   name: "Achterdeur",                                       comp: <SingleDoorBase type="achterdeur" /> },
  "voordeur-bovenlicht":              { v: 1,   name: "Voordeur met bovenlicht",                          comp: <VoordeurBovenlicht /> },
  "achterdeur-bovenlicht":            { v: 1,   name: "Achterdeur met bovenlicht",                        comp: <AchterdeurBovenlicht /> },
  "achterdeur-borstwering":           { v: 1,   name: "Achterdeur met borstwering",                       comp: <AchterdeurBorstwering /> },
  "achterdeur-borstwering-bovenlicht":{ v: 1,   name: "Achterdeur met borstwering en bovenlicht",         comp: <AchterdeurBorstweringBovenlicht /> },
  "deur-zijlicht":                    { v: 1.5, name: "Deur met zijlicht",                                comp: <DeurZijlicht /> },
  "voordeur-zijlicht":                { v: 1.5, name: "Voordeur met zijlicht",                            comp: <VoordeurZijlicht /> },
  "deur-zijlicht-bovenlicht":         { v: 1.5, name: "Deur met zijlicht en bovenlicht",                  comp: <DeurZijlichtBovenlicht /> },
  "voordeur-zijlicht-bovenlicht":     { v: 1.5, name: "Voordeur met zijlicht en bovenlicht",              comp: <VoordeurZijlichtBovenlicht /> },
  "deur-zijlicht-borstwering":        { v: 1.5, name: "Deur met zijlicht en borstwering",                 comp: <DeurZijlichtBorstwering /> },
  "deur-zijlichten":                  { v: 1.8, name: "Deur met twee zijlichten",                         comp: <DeurZijlichten /> },
  "dubbele-deur":                     { v: 1,   name: "Dubbele deur",                                     comp: <DoubleDoorBase /> },
  "dubbele-deur-zijlichten":          { v: 1.8, name: "Dubbele deur met zijlichten",                      comp: <DoubleDoorBase hasSideLights /> },
  "dubbele-deur-borstwering":         { v: 1,   name: "Dubbele deur met borstwering",                     comp: <DoubleDoorBase hasPlinth /> },
  "dubbele-deur-bovenlicht":          { v: 1,   name: "Dubbele deur met bovenlicht",                      comp: <DubbeleDeurBovenlicht /> },
  "dubbele-deur-zijlicht":            { v: 1.5, name: "Dubbele deur met zijlicht",                        comp: <DubbeleDeurZijlicht /> },
  "dubbele-deur-zijlichten-bovenlichten": { v: 1.8, name: "Dubbele deur met zijlichten en bovenlichten",  comp: <DubbeleDeurZijlichtenBovenlichten /> },
  "dubbele-deur-borstwering-bovenlicht":  { v: 1,   name: "Dubbele deur met borstwering en bovenlicht",   comp: <DubbeleDeurBorstweringBovenlicht /> },
};

export default function AluDeurConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "voordeur";
  const deur = deurOpties[slug] ?? deurOpties.voordeur;

  const [matrix, setMatrix] = useState<any>(null);
  const [breedte, setBreedte] = useState(1000);
  const [hoogte, setHoogte] = useState(2100);
  const [kleur, setKleur] = useState("");
  const [beslag, setBeslag] = useState("");
  const [paneel, setPaneel] = useState("");
  const [profiel, setProfiel] = useState("");
  const [onderdorpel, setOnderdorpel] = useState("");
  const [draairichting, setDraairichting] = useState("");
  const [kleurBuitenkant, setKleurBuitenkant] = useState("");
  const [afstandshouder, setAfstandshouder] = useState("");
  const [roeden, setRoeden] = useState("");
  const [glasType, setGlasType] = useState("");
  const [aantal, setAantal] = useState(1);
  const [naam, setNaam] = useState("");
  const [woonplaats, setWoonplaats] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getMatrix("alu_deur_matrix").then((data: any) => {
      const m = { ...DEFAULT_MATRIX, ...(data && Object.keys(data).length ? data : {}) };
      setMatrix(m);
      setKleur(Object.keys(m.kleurToeslag || {})[0] || "");
      setBeslag(Object.keys(m.typeBeslag || {})[0] || "");
      setPaneel(Object.keys(m.paneelToeslag || {})[0] || "");
      setProfiel(Object.keys(m.profielToeslag || {})[0] || "");
      setOnderdorpel(Object.keys(m.onderdorpelToeslag || {})[0] || "");
      setDraairichting(Object.keys(m.draairichtingToeslag || {})[0] || "");
      setKleurBuitenkant(Object.keys(m.kleurBuitenkantToeslag || {})[0] || "");
      setAfstandshouder(Object.keys(m.afstandshouderToeslag || {})[0] || "");
      setRoeden(Object.keys(m.roedenToeslag || {})[0] || "");
      setGlasType(Object.keys(m.glasToeslag || {})[0] || "");
    });
  }, []);

  const berekendePrijs = useMemo(() => {
    if (!matrix) return 0;
    const m2 = (breedte / 1000) * (hoogte / 1000);
    return (
      (matrix.basisPrijs +
        m2 * matrix.m2Tarief +
        (matrix.kleurToeslag?.[kleur] ?? 0) +
        (matrix.typeBeslag?.[beslag] ?? 0) +
        (matrix.paneelToeslag?.[paneel] ?? 0) +
        (matrix.profielToeslag?.[profiel] ?? 0) +
        (matrix.onderdorpelToeslag?.[onderdorpel] ?? 0) +
        (matrix.draairichtingToeslag?.[draairichting] ?? 0) +
        (matrix.kleurBuitenkantToeslag?.[kleurBuitenkant] ?? 0) +
        (matrix.afstandshouderToeslag?.[afstandshouder] ?? 0) +
        (matrix.roedenToeslag?.[roeden] ?? 0) +
        (matrix.glasToeslag?.[glasType] ?? 0) +
        matrix.montageKosten) * aantal
    );
  }, [matrix, breedte, hoogte, aantal, kleur, beslag, paneel, profiel, onderdorpel, draairichting, kleurBuitenkant, afstandshouder, roeden, glasType]);

  if (!matrix) return <div className="p-10 text-center text-slate-400">Configuratie laden...</div>;

  const selectField = (label: string, value: string, setter: (v: string) => void, opties: Record<string, number>) => (
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
        <Link href="/aluminium/deuren" className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#1066a3]">
          ← Overzicht
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold mb-2">Aluminium — {deur.name}</h1>
            <div className="bg-slate-50 p-10 rounded-xl border">
              <svg viewBox={`0 0 ${deur.v * 100} 160`} className="w-full h-auto">{deur.comp}</svg>
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
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Breedte (mm)</label>
                  <input type="number" value={breedte} onChange={(e) => setBreedte(Number(e.target.value))} className="w-full border p-2.5 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Hoogte (mm)</label>
                  <input type="number" value={hoogte} onChange={(e) => setHoogte(Number(e.target.value))} className="w-full border p-2.5 rounded-lg text-sm" />
                </div>
              </div>

              {selectField("Type profiel", profiel, setProfiel, matrix.profielToeslag || {})}
              {selectField("Onderdorpel", onderdorpel, setOnderdorpel, matrix.onderdorpelToeslag || {})}
              {selectField("Draairichting", draairichting, setDraairichting, matrix.draairichtingToeslag || {})}
              {selectField("Kleur binnenkant", kleur, setKleur, matrix.kleurToeslag || {})}
              {selectField("Kleur buitenkant", kleurBuitenkant, setKleurBuitenkant, matrix.kleurBuitenkantToeslag || {})}
              {selectField("Paneel", paneel, setPaneel, matrix.paneelToeslag || {})}
              {selectField("Beslag", beslag, setBeslag, matrix.typeBeslag || {})}
              {selectField("Afstandshouder", afstandshouder, setAfstandshouder, matrix.afstandshouderToeslag || {})}
              {selectField("Roeden", roeden, setRoeden, matrix.roedenToeslag || {})}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Type glas</label>
                <select value={glasType} onChange={e => setGlasType(e.target.value)} className="w-full border p-2.5 rounded-lg text-sm">
                  {Object.keys(matrix.glasToeslag || {}).map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Aantal</label>
                <input type="number" min={1} value={aantal} onChange={(e) => setAantal(Number(e.target.value))} className="w-full border p-2.5 rounded-lg text-sm" />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <h3 className="text-sm font-bold text-slate-800">Check uw subsidie</h3>
                <label className="block text-[10px] mt-2 font-bold text-slate-500 uppercase">Naam</label>
                <input type="text" placeholder="Uw naam" value={naam} onChange={(e) => setNaam(e.target.value)} className="w-full p-2 rounded-lg border text-sm" />
                <input type="text" placeholder="Woonplaats" value={woonplaats} onChange={(e) => setWoonplaats(e.target.value)} className="w-full p-2 rounded-lg border text-sm mt-2" />
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
                    kleur, kleurBuitenkant, beslag, paneel, profiel,
                    onderdorpel, draairichting, afstandshouder, roeden,
                    glasType, aantal, prijs: berekendePrijs,
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
