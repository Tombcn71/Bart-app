"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { getMatrix } from "@/lib/data";
import { SingleDoorBase, DoubleDoorBase } from "@/lib/deur-svgs";

export default function DeurConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "voordeur";

  const [matrix, setMatrix] = useState<any>(null);
  const [breedte, setBreedte] = useState(1000);
  const [hoogte, setHoogte] = useState(2100);
  const [kleur, setKleur] = useState("wit");
  const [glas, setGlas] = useState("hr-plus-plus");
  const [aantal, setAantal] = useState(1);

  // Configuratie direct gekoppeld
  const deurOpties: any = {
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
    "dubbele-deur": { v: 1, name: "Dubbele deur", comp: <DoubleDoorBase /> },
    "dubbele-deur-zijlichten": {
      v: 1.8,
      name: "Dubbele deur met zijlichten",
      comp: <DoubleDoorBase hasSideLights />,
    },
  };

  const deur = deurOpties[slug] || deurOpties.voordeur;

  useEffect(() => {
    getMatrix("deur_matrix").then(setMatrix);
  }, []);

  const berekendePrijs = useMemo(() => {
    if (!matrix) return 0;
    const m2 = (breedte / 1000) * (hoogte / 1000);
    // Gebruik || 0 om te voorkomen dat er ongewenste getallen worden opgeteld
    const basis = Number(matrix.deurTypeBasis?.[slug] || 0);
    const m2Tarief = Number(matrix.m2Tarief || 0);
    const kleurToeslag = Number(matrix.kleurToeslag?.[kleur] || 0);
    const glasToeslag = Number(matrix.glasToeslag?.[glas] || 0);

    return (basis + m2 * m2Tarief + kleurToeslag + m2 * glasToeslag) * aantal;
  }, [matrix, slug, breedte, hoogte, aantal, kleur, glas]);

  if (!matrix) return <div className="p-10 text-center">Laden...</div>;

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
              <svg viewBox={`0 0 ${deur.v * 100} 100`} className="w-full">
                {deur.comp}
              </svg>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white border rounded-xl p-6 space-y-6">
              <div className="text-3xl font-light">
                €{" "}
                {berekendePrijs.toLocaleString("nl-NL", {
                  minimumFractionDigits: 2,
                })}
              </div>
              {/* ... Rest van je input velden blijven hetzelfde ... */}
              <button
                onClick={async () => {
                  await saveOfferte("klant@voorbeeld.nl", {
                    deurNaam: deur.name,
                    slug,
                    breedte,
                    hoogte,
                    kleur,
                    glas,
                    aantal,
                    prijs: berekendePrijs,
                  });
                  alert("Offerte opgeslagen!");
                }}
                className="w-full bg-[#1066a3] text-white py-4 rounded-lg font-bold uppercase text-[11px] tracking-widest">
                Voeg toe aan aanvraag
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
