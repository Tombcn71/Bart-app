"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
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

interface DeurMatrix {
  basisPrijs: number;
  m2Tarief: number;
  montageKosten: number;
  kleurToeslag: Record<string, number>;
  typeBeslag: Record<string, number>;
  paneelToeslag: Record<string, number>;
}

export default function DeurConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "voordeur";

  const [matrix, setMatrix] = useState<DeurMatrix | null>(null);
  const [breedte, setBreedte] = useState(1000);
  const [hoogte, setHoogte] = useState(2100);
  const [kleur, setKleur] = useState("");
  const [beslag, setBeslag] = useState("");
  const [paneel, setPaneel] = useState("");
  const [aantal, setAantal] = useState(1);
  const [email, setEmail] = useState("");
  const [naam, setNaam] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deurOpties: Record<
    string,
    { v: number; name: string; comp: React.ReactNode }
  > = {
    // ── Enkele deur ──────────────────────────────────────────────────────────
    voordeur:                      { v: 1,   name: "Voordeur",                                   comp: <SingleDoorBase type="voordeur" /> },
    achterdeur:                    { v: 1,   name: "Achterdeur",                                  comp: <SingleDoorBase type="achterdeur" /> },
    "voordeur-bovenlicht":         { v: 1,   name: "Voordeur met bovenlicht",                     comp: <VoordeurBovenlicht /> },
    "achterdeur-bovenlicht":       { v: 1,   name: "Achterdeur met bovenlicht",                   comp: <AchterdeurBovenlicht /> },
    "achterdeur-borstwering":      { v: 1,   name: "Achterdeur met borstwering",                  comp: <AchterdeurBorstwering /> },
    "achterdeur-borstwering-bovenlicht": { v: 1, name: "Achterdeur met borstwering en bovenlicht", comp: <AchterdeurBorstweringBovenlicht /> },
    "deur-zijlicht":               { v: 1.5, name: "Deur met zijlicht",                          comp: <DeurZijlicht /> },
    "voordeur-zijlicht":           { v: 1.5, name: "Voordeur met zijlicht",                      comp: <VoordeurZijlicht /> },
    "deur-zijlicht-bovenlicht":    { v: 1.5, name: "Deur met zijlicht en bovenlicht",            comp: <DeurZijlichtBovenlicht /> },
    "voordeur-zijlicht-bovenlicht":{ v: 1.5, name: "Voordeur met zijlicht en bovenlicht",        comp: <VoordeurZijlichtBovenlicht /> },
    "deur-zijlicht-borstwering":   { v: 1.5, name: "Deur met zijlicht en borstwering",           comp: <DeurZijlichtBorstwering /> },
    "deur-zijlichten":             { v: 1.8, name: "Deur met twee zijlichten",                   comp: <DeurZijlichten /> },
    // ── Dubbele deur ─────────────────────────────────────────────────────────
    "dubbele-deur":                         { v: 1,   name: "Dubbele deur",                                comp: <DoubleDoorBase /> },
    "dubbele-deur-zijlichten":              { v: 1.8, name: "Dubbele deur met zijlichten",                comp: <DoubleDoorBase hasSideLights /> },
    "dubbele-deur-borstwering":             { v: 1,   name: "Dubbele deur met borstwering",               comp: <DoubleDoorBase hasPlinth /> },
    "dubbele-deur-bovenlicht":              { v: 1,   name: "Dubbele deur met bovenlicht",                comp: <DubbeleDeurBovenlicht /> },
    "dubbele-deur-zijlicht":               { v: 1.5, name: "Dubbele deur met zijlicht",                  comp: <DubbeleDeurZijlicht /> },
    "dubbele-deur-zijlichten-bovenlichten": { v: 1.8, name: "Dubbele deur met zijlichten en bovenlichten", comp: <DubbeleDeurZijlichtenBovenlichten /> },
    "dubbele-deur-borstwering-bovenlicht":  { v: 1,   name: "Dubbele deur met borstwering en bovenlicht", comp: <DubbeleDeurBorstweringBovenlicht /> },
  };

  const deur = deurOpties[slug] || deurOpties.voordeur;

  useEffect(() => {
    getMatrix("deur_matrix").then((data: any) => {
      if (data) {
        setMatrix(data as DeurMatrix);
        setKleur(Object.keys(data.kleurToeslag || {})[0] || "");
        setBeslag(Object.keys(data.typeBeslag || {})[0] || "");
        setPaneel(Object.keys(data.paneelToeslag || {})[0] || "");
      }
    });
  }, []);

  const berekendePrijs = useMemo(() => {
    if (!matrix) return 0;
    const m2 = (breedte / 1000) * (hoogte / 1000);
    const kToeslag = matrix.kleurToeslag?.[kleur] ?? 0;
    const bToeslag = matrix.typeBeslag?.[beslag] ?? 0;
    const pToeslag = matrix.paneelToeslag?.[paneel] ?? 0;

    return (
      (matrix.basisPrijs +
        m2 * matrix.m2Tarief +
        kToeslag +
        bToeslag +
        pToeslag +
        matrix.montageKosten) *
      aantal
    );
  }, [matrix, breedte, hoogte, aantal, kleur, beslag, paneel]);

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
              <svg viewBox={`0 0 ${deur.v * 100} 160`} className="w-full h-auto">
                {deur.comp}
              </svg>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border rounded-xl p-6 space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Prijsindicatie
                </span>
                <div className="text-3xl font-light">
                  €{" "}
                  {berekendePrijs.toLocaleString("nl-NL", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Breedte (mm)
                  </label>
                  <input
                    type="number"
                    value={breedte}
                    onChange={(e) => setBreedte(Number(e.target.value))}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Hoogte (mm)
                  </label>
                  <input
                    type="number"
                    value={hoogte}
                    onChange={(e) => setHoogte(Number(e.target.value))}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Kleur
                </label>
                <select
                  value={kleur}
                  onChange={(e) => setKleur(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-sm capitalize">
                  {Object.keys(matrix.kleurToeslag || {}).map((k) => (
                    <option key={k} value={k}>
                      {k.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Beslag
                </label>
                <select
                  value={beslag}
                  onChange={(e) => setBeslag(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-sm capitalize">
                  {Object.keys(matrix.typeBeslag || {}).map((k) => (
                    <option key={k} value={k}>
                      {k.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Paneel
                </label>
                <select
                  value={paneel}
                  onChange={(e) => setPaneel(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-sm capitalize">
                  {Object.keys(matrix.paneelToeslag || {}).map((k) => (
                    <option key={k} value={k}>
                      {k.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subsidie Blok */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mt-4">
                <h3 className="text-sm font-bold text-slate-800">
                  Check uw subsidie
                </h3>
                <label className="block text-[10px] mt-2 font-bold text-slate-500 uppercase">
                  Naam
                </label>
                <input
                  type="text"
                  placeholder="Uw naam"
                  value={naam}
                  onChange={(e) => setNaam(e.target.value)}
                  className="w-full p-2 rounded-lg border text-sm"
                />
                <label className="block text-[10px] mt-2 font-bold text-slate-500 uppercase">
                  E-mailadres
                </label>
                <input
                  type="email"
                  placeholder="Uw e-mailadres"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded-lg border text-sm"
                />
              </div>

              <button
                disabled={isSubmitting}
                onClick={async () => {
                  if (!email || !naam) return alert("Vul gegevens in!");
                  setIsSubmitting(true);
                  await saveOfferte(email, {
                    naam,
                    deurNaam: deur.name,
                    slug,
                    breedte,
                    hoogte,
                    kleur,
                    beslag,
                    paneel,
                    aantal,
                    prijs: berekendePrijs,
                  });
                  alert("Offerte verstuurd!");
                  setIsSubmitting(false);
                }}
                className="w-full bg-[#1066a3] text-white py-4 rounded-lg font-bold uppercase text-[11px] tracking-widest">
                {isSubmitting
                  ? "Bezig..."
                  : "Bereken subsidie & Vraag offerte aan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
