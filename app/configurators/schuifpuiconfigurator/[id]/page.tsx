"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { getMatrix } from "@/lib/data";
import { SlidingDoorDetailSVG } from "@/lib/schuifpui-svgs";

interface PrijzenMatrix {
  basisPui: Record<string, number>;
  m2Tarief: number;
  kleurToeslag: Record<string, number>;
  glasTypeM2: Record<string, number>;
}

const getSchuifpuiData = (slug: string) => {
  const data = [
    { slug: "schuifpui-2-vaks", sections: 2, name: "Schuifpui 2-vaks" },
    { slug: "schuifpui-4-vaks", sections: 4, name: "Schuifpui 4-vaks" },
  ];
  return data.find((s) => s.slug === slug) || data[0];
};

export default function SchuifpuiDetailPage() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "schuifpui-2-vaks";
  const pui = getSchuifpuiData(slug);

  const [matrix, setMatrix] = useState<PrijzenMatrix | null>(null);
  const [breedte, setBreedte] = useState<number>(3000);
  const [hoogte, setHoogte] = useState<number>(2200);
  const [kleur, setKleur] = useState("");
  const [glas, setGlas] = useState("");
  const [aantal, setAantal] = useState(1);

  useEffect(() => {
    getMatrix("schuifpui_matrix").then((rawData) => {
      if (rawData) {
        const data = rawData as PrijzenMatrix;
        setMatrix(data);

        // Veilige initialisatie
        if (data.kleurToeslag && typeof data.kleurToeslag === "object") {
          setKleur(Object.keys(data.kleurToeslag)[0] || "");
        }
        if (data.glasTypeM2 && typeof data.glasTypeM2 === "object") {
          setGlas(Object.keys(data.glasTypeM2)[0] || "");
        }
      }
    });
  }, []);

  const berekendePrijs = useMemo(() => {
    if (!matrix) return 0;
    const m2 = (breedte / 1000) * (hoogte / 1000);

    const basis = Number(matrix.basisPui?.[pui.sections.toString()] || 0);
    const m2Tarief = Number(matrix.m2Tarief || 0);
    const kleurToeslag = Number(matrix.kleurToeslag?.[kleur] || 0);
    const glasToeslag = Number(matrix.glasTypeM2?.[glas] || 0);

    return parseFloat(
      (
        (basis + m2 * m2Tarief + kleurToeslag + m2 * glasToeslag) *
        aantal
      ).toFixed(2),
    );
  }, [matrix, pui.sections, breedte, hoogte, kleur, glas, aantal]);

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
          href="/schuifpui"
          className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#1066a3]">
          ← Overzicht
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold mb-6">{pui.name}</h1>
            <div className="bg-slate-50 p-10 rounded-xl border flex items-center justify-center">
              <SlidingDoorDetailSVG sections={pui.sections} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border rounded-xl p-8 shadow-sm space-y-6">
              <div className="text-3xl font-light">
                €{" "}
                {berekendePrijs.toLocaleString("nl-NL", {
                  minimumFractionDigits: 2,
                })}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold">
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
                  <label className="text-[10px] text-slate-400 uppercase font-bold">
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
                <label className="text-[10px] text-slate-400 uppercase font-bold">
                  Kleur
                </label>
                <select
                  value={kleur}
                  onChange={(e) => setKleur(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-sm">
                  {Object.keys(matrix.kleurToeslag || {}).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">
                  Glas Type
                </label>
                <select
                  value={glas}
                  onChange={(e) => setGlas(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-sm">
                  {Object.keys(matrix.glasTypeM2 || {}).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={async () => {
                  const result = await saveOfferte("klant@voorbeeld.nl", {
                    product: pui.name,
                    breedte,
                    hoogte,
                    kleur,
                    glas,
                    aantal,
                    prijs: berekendePrijs,
                  });
                  alert(
                    result.success
                      ? "Offerte succesvol opgeslagen!"
                      : "Er ging iets mis bij het opslaan.",
                  );
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
