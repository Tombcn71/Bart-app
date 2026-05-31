"use client";
import { FormField } from "@/app/components/FormField";
import { CartAddedModal } from "@/app/components/CartAddedModal";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { addToCart, getCart } from "@/lib/cart";
import { getMatrix } from "@/lib/data";
import {
  SingleDoorBase,
  DoubleDoorBase,
  AchterdeurBovenlicht,
  VoordeurBovenlicht,
  AchterdeurBorstwering,
  AchterdeurBorstweringBovenlicht,
  DeurZijlicht,
  VoordeurZijlicht,
  DeurZijlichtBovenlicht,
  VoordeurZijlichtBovenlicht,
  DeurZijlichtBorstwering,
  DeurZijlichten,
  DubbeleDeurBovenlicht,
  DubbeleDeurZijlicht,
  DubbeleDeurZijlichtenBovenlichten,
  DubbeleDeurBorstweringBovenlicht,
} from "@/lib/deur-svgs";

const DEFAULT_MATRIX = {
  basisPrijs: 0,
  m2Tarief: 0,
  montageKosten: 0,
  kleurToeslag: { wit: 0, antraciet: 0, "ral-kleur": 0 },
  typeBeslag: { standaard: 0, premium: 0 },
  paneelToeslag: { glad: 0, houtnerf: 0 },
  profielToeslag: { "creon-120": 0, "creon-120-hvl": 0 },
  onderdorpelToeslag: { "doorlopend-kader": 0, dts: 0 },
  draairichtingToeslag: {
    "buiten-links": 0,
    "buiten-rechts": 0,
    "binnen-links": 0,
    "binnen-rechts": 0,
  },
  kleurBuitenkantToeslag: {
    wit: 0,
    "creme-wit": 0,
    antraciet: 0,
    "basalt-grijs": 0,
    "kwarts-grijs": 0,
    zwart: 0,
  },
  afstandshouderToeslag: { aluminium: 0, zwart: 0 },
  roedenToeslag: {
    geen: 0,
    "6-vaks-18mm": 0,
    "8-vaks-18mm": 0,
    "6-vaks-26mm": 0,
    "8-vaks-26mm": 0,
  },
  glasToeslag: {
    "Dubbel glas": 0,
    "Dubbel glas (mat buitenzijde)": 0,
    "Dubbel glas binnen zijde gelaagd": 0,
    "Dubbel glas binnen zijde gelaagd (mat buitenzijde)": 0,
    "Dubbel glas dubbelzijdig gelaagd": 0,
    "Dubbel glas dubbelzijdig gelaagd (mat buitenzijde)": 0,
    Sandwichpaneel: 0,
    "Geen glas (glaslatten voor 24 mm glas)": 0,
    "Triple glas": 0,
    "Triple matglas (mat middelste ruit)": 0,
    "Triple glas binnen zijde gelaagd": 0,
    "Triple glas binnen zijde gelaagd (mat middelste ruit)": 0,
    "Triple glas dubbelzijdig gelaagd": 0,
    "Triple glas dubbelzijdig gelaagd (mat middelste ruit)": 0,
  },
};

const deurOpties: Record<
  string,
  { v: number; name: string; comp: React.ReactNode }
> = {
  voordeur: {
    v: 1,
    name: "Voordeur",
    comp: <SingleDoorBase type="voordeur" />,
  },
  achterdeur: {
    v: 1,
    name: "Achterdeur",
    comp: <SingleDoorBase type="achterdeur" />,
  },
  "voordeur-bovenlicht": {
    v: 1,
    name: "Voordeur met bovenlicht",
    comp: <VoordeurBovenlicht />,
  },
  "achterdeur-bovenlicht": {
    v: 1,
    name: "Achterdeur met bovenlicht",
    comp: <AchterdeurBovenlicht />,
  },
  "achterdeur-borstwering": {
    v: 1,
    name: "Achterdeur met borstwering",
    comp: <AchterdeurBorstwering />,
  },
  "achterdeur-borstwering-bovenlicht": {
    v: 1,
    name: "Achterdeur met borstwering en bovenlicht",
    comp: <AchterdeurBorstweringBovenlicht />,
  },
  "deur-zijlicht": {
    v: 1.5,
    name: "Deur met zijlicht",
    comp: <DeurZijlicht />,
  },
  "voordeur-zijlicht": {
    v: 1.5,
    name: "Voordeur met zijlicht",
    comp: <VoordeurZijlicht />,
  },
  "deur-zijlicht-bovenlicht": {
    v: 1.5,
    name: "Deur met zijlicht en bovenlicht",
    comp: <DeurZijlichtBovenlicht />,
  },
  "voordeur-zijlicht-bovenlicht": {
    v: 1.5,
    name: "Voordeur met zijlicht en bovenlicht",
    comp: <VoordeurZijlichtBovenlicht />,
  },
  "deur-zijlicht-borstwering": {
    v: 1.5,
    name: "Deur met zijlicht en borstwering",
    comp: <DeurZijlichtBorstwering />,
  },
  "deur-zijlichten": {
    v: 1.8,
    name: "Deur met twee zijlichten",
    comp: <DeurZijlichten />,
  },
  "dubbele-deur": { v: 1.5, name: "Dubbele deur", comp: <DoubleDoorBase /> },
  "dubbele-deur-zijlichten": {
    v: 1.8,
    name: "Dubbele deur met zijlichten",
    comp: <DoubleDoorBase hasSideLights />,
  },
  "dubbele-deur-borstwering": {
    v: 1.5,
    name: "Dubbele deur met borstwering",
    comp: <DoubleDoorBase hasPlinth />,
  },
  "dubbele-deur-bovenlicht": {
    v: 1.5,
    name: "Dubbele deur met bovenlicht",
    comp: <DubbeleDeurBovenlicht />,
  },
  "dubbele-deur-zijlicht": {
    v: 1.8,
    name: "Dubbele deur met zijlicht",
    comp: <DubbeleDeurZijlicht />,
  },
  "dubbele-deur-zijlichten-bovenlichten": {
    v: 1.8,
    name: "Dubbele deur met zijlichten en bovenlichten",
    comp: <DubbeleDeurZijlichtenBovenlichten />,
  },
  "dubbele-deur-borstwering-bovenlicht": {
    v: 1.5,
    name: "Dubbele deur met borstwering en bovenlicht",
    comp: <DubbeleDeurBorstweringBovenlicht />,
  },
};

export default function DeurConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "voordeur";
  const deur = deurOpties[slug] || deurOpties.voordeur;

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
  const [modalOpen, setModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  function handleAdd() {
    addToCart({
      slug,
      product: deur.name,
      prijs: berekendePrijs,
      specs: {
        breedte,
        hoogte,
        kleur,
        kleurBuitenkant,
        beslag,
        paneel,
        profiel,
        onderdorpel,
        draairichting,
        afstandshouder,
        roeden,
        glasType,
        aantal,
      },
    });
    setCartCount(getCart().length);
    setModalOpen(true);
  }

  useEffect(() => {
    getMatrix("deur_matrix").then((data: any) => {
      const m = {
        ...DEFAULT_MATRIX,
        ...(data && Object.keys(data).length ? data : {}),
      };
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
        matrix.montageKosten) *
      aantal
    );
  }, [
    matrix,
    breedte,
    hoogte,
    aantal,
    kleur,
    beslag,
    paneel,
    profiel,
    onderdorpel,
    draairichting,
    kleurBuitenkant,
    afstandshouder,
    roeden,
    glasType,
  ]);

  if (!matrix)
    return (
      <div className="p-10 text-center text-slate-400">
        Configuratie laden...
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <Link
          href="/deuren"
          className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#1066a3]">
          ← Overzicht
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold mb-6">{deur.name}</h1>
            <div className="bg-slate-50 p-10 rounded-xl border">
              <svg
                viewBox={`0 0 ${deur.v * 100} 160`}
                className="w-full h-auto">
                {deur.comp}
              </svg>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-1">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-xs font-semibold text-green-800">
                  Bij ons is montage in de prijs inbegrepen
                </span>
              </div>
              {/* Prijs */}
              <div className="px-5 py-4 border-b border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Prijsindicatie
                </span>
                <div className="text-3xl font-light text-slate-800 mt-0.5">
                  €{" "}
                  {berekendePrijs.toLocaleString("nl-NL", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* Accordeon velden */}
              <div className="px-5">
                <FormField
                  label="Afmetingen"
                  value={`${breedte} × ${hoogte} mm`}
                  defaultOpen>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                        Breedte (mm)
                      </label>
                      <input
                        type="number"
                        value={breedte}
                        onChange={(e) => setBreedte(Number(e.target.value))}
                        className="w-full border rounded-lg p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">
                        Hoogte (mm)
                      </label>
                      <input
                        type="number"
                        value={hoogte}
                        onChange={(e) => setHoogte(Number(e.target.value))}
                        className="w-full border rounded-lg p-2.5 text-sm"
                      />
                    </div>
                  </div>
                </FormField>
                <FormField
                  label="Type profiel"
                  value={profiel
                    .replace(/-/g, " ")
                    .replace(/creon /gi, "")
                    .trim()}>
                  <select
                    value={profiel}
                    onChange={(e) => setProfiel(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm">
                    {Object.keys(matrix.profielToeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k
                          .replace(/-/g, " ")
                          .replace(/creon /gi, "")
                          .trim()}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="Onderdorpel"
                  value={onderdorpel.replace(/-/g, " ")}>
                  <select
                    value={onderdorpel}
                    onChange={(e) => setOnderdorpel(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm capitalize">
                    {Object.keys(matrix.onderdorpelToeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="Draairichting"
                  value={draairichting.replace(/-/g, " ")}>
                  <select
                    value={draairichting}
                    onChange={(e) => setDraairichting(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm capitalize">
                    {Object.keys(matrix.draairichtingToeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="Kleur binnenkant"
                  value={kleur.replace(/-/g, " ")}>
                  <select
                    value={kleur}
                    onChange={(e) => setKleur(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm capitalize">
                    {Object.keys(matrix.kleurToeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  label="Kleur buitenkant"
                  value={kleurBuitenkant.replace(/-/g, " ")}>
                  <select
                    value={kleurBuitenkant}
                    onChange={(e) => setKleurBuitenkant(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm capitalize">
                    {Object.keys(matrix.kleurBuitenkantToeslag || {}).map(
                      (k) => (
                        <option key={k} value={k}>
                          {k.replace(/-/g, " ")}
                        </option>
                      ),
                    )}
                  </select>
                </FormField>
                <FormField label="Paneel" value={paneel.replace(/-/g, " ")}>
                  <select
                    value={paneel}
                    onChange={(e) => setPaneel(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm capitalize">
                    {Object.keys(matrix.paneelToeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Beslag" value={beslag.replace(/-/g, " ")}>
                  <select
                    value={beslag}
                    onChange={(e) => setBeslag(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm capitalize">
                    {Object.keys(matrix.typeBeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Afstandshouder" value={afstandshouder}>
                  <select
                    value={afstandshouder}
                    onChange={(e) => setAfstandshouder(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm capitalize">
                    {Object.keys(matrix.afstandshouderToeslag || {}).map(
                      (k) => (
                        <option key={k} value={k}>
                          {k}
                        </option>
                      ),
                    )}
                  </select>
                </FormField>
                <FormField label="Roeden" value={roeden.replace(/-/g, " ")}>
                  <select
                    value={roeden}
                    onChange={(e) => setRoeden(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm">
                    {Object.keys(matrix.roedenToeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Type glas" value={glasType}>
                  <select
                    value={glasType}
                    onChange={(e) => setGlasType(e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm">
                    {Object.keys(matrix.glasToeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Aantal" value={`${aantal} stuks`}>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setAantal(Math.max(1, aantal - 1))}
                      className="w-10 h-10 rounded-lg border text-xl font-bold text-slate-500 hover:bg-slate-50">
                      −
                    </button>
                    <span className="text-lg font-bold w-8 text-center">
                      {aantal}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAantal(aantal + 1)}
                      className="w-10 h-10 rounded-lg border text-xl font-bold text-slate-500 hover:bg-slate-50">
                      +
                    </button>
                  </div>
                </FormField>
              </div>

              <div className="px-5 pb-5 pt-2">
                <button
                  onClick={handleAdd}
                  className="w-full bg-[#1066a3] text-white py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-[#0d5491] transition-colors">
                  Toevoegen aan offerte
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  Ontvang uw subsidie-indicatie bij de offerte
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartAddedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={deur.name}
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
