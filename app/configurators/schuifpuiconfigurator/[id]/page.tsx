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
  profielToeslag?: Record<string, number>; // Toegevoegd voor uitbreiding
}

const getSchuifpuiData = (slug: string) => {
  const data = [
    { slug: "schuifpui-2-vaks", sections: 2, name: "Schuifpui 2-vaks" },
    { slug: "schuifpui-4-vaks", sections: 4, name: "Schuifpui 4-vaks" },
  ];
  return data.find((s) => s.slug === slug) || data[0];
};

export default function SchuifpuiDetailPage() {
  const params = useParams();
  const slug = typeof params?.id === "string" ? params.id : "schuifpui-2-vaks";
  const pui = getSchuifpuiData(slug);

  const [matrix, setMatrix] = useState<PrijzenMatrix | null>(null);
  const [breedte, setBreedte] = useState(3000);
  const [hoogte, setHoogte] = useState(2200);
  const [kleur, setKleur] = useState("");
  const [glas, setGlas] = useState("");
  const [email, setEmail] = useState("");
  const [naam, setNaam] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getMatrix("schuifpui_matrix").then((rawData: any) => {
      if (rawData) {
        setMatrix(rawData);
        if (rawData.kleurToeslag)
          setKleur(Object.keys(rawData.kleurToeslag)[0] ?? "");
        if (rawData.glasTypeM2)
          setGlas(Object.keys(rawData.glasTypeM2)[0] ?? "");
      }
    });
  }, []);

  const berekendePrijs = useMemo(() => {
    if (!matrix) return 0;
    const m2 = (breedte / 1000) * (hoogte / 1000);
    const basis = matrix.basisPui?.[pui.sections.toString()] ?? 0;
    const m2Tarief = matrix.m2Tarief ?? 0;
    const kleurToeslag = matrix.kleurToeslag?.[kleur] ?? 0;
    const glasToeslag = matrix.glasTypeM2?.[glas] ?? 0;

    return Number(
      (basis + m2 * m2Tarief + kleurToeslag + m2 * glasToeslag).toFixed(2),
    );
  }, [matrix, pui.sections, breedte, hoogte, kleur, glas]);

  if (!matrix)
    return <div className="p-10 text-center">Configuratie laden...</div>;

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <Link
          href="/schuifpui"
          className="text-xs uppercase tracking-wider text-slate-400 hover:text-[#1066a3]">
          ← Overzicht
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold mb-6">{pui.name}</h1>
            <div className="bg-slate-50 p-10 rounded-xl border flex items-center justify-center">
              <SlidingDoorDetailSVG sections={pui.sections} />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border p-8 rounded-xl shadow-sm">
              <div className="mb-6">
                <span className="text-xs text-slate-400 uppercase font-bold">
                  Prijsindicatie
                </span>
                <div className="text-3xl font-light">
                  €{" "}
                  {berekendePrijs.toLocaleString("nl-NL", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* Afmetingen */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
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
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
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

              {/* Dynamische Keuzes */}
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                    Kleur kozijn
                  </label>
                  <select
                    value={kleur}
                    onChange={(e) => setKleur(e.target.value)}
                    className="w-full border p-2.5 rounded-lg text-sm capitalize">
                    {Object.keys(matrix.kleurToeslag ?? {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1 uppercase">
                    Glassoort
                  </label>
                  <select
                    value={glas}
                    onChange={(e) => setGlas(e.target.value)}
                    className="w-full border p-2.5 rounded-lg text-sm capitalize">
                    {Object.keys(matrix.glasTypeM2 ?? {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Klantgegevens */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-sm font-bold text-slate-800 mb-3">
                  Gegevens voor offerte
                </h3>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
                  Naam
                </label>
                <input
                  type="text"
                  placeholder="Uw naam"
                  value={naam}
                  onChange={(e) => setNaam(e.target.value)}
                  className="w-full mb-3 p-2 rounded-lg border text-sm"
                />
                <label className="block text-[10px] font-bold text-slate-500 mb-1">
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
                  if (!email || !naam)
                    return alert("Vul a.u.b. uw gegevens in.");
                  setIsSubmitting(true);
                  await saveOfferte(email, {
                    naam,
                    product: pui.name,
                    slug,
                    breedte,
                    hoogte,
                    kleur,
                    glas,
                    prijs: berekendePrijs,
                  });
                  alert("Offerte verstuurd!");
                  setIsSubmitting(false);
                }}
                className="w-full mt-6 bg-[#1066a3] text-white py-4 rounded-lg font-bold uppercase text-[11px] tracking-widest hover:bg-[#0a4d7d] transition-colors">
                {isSubmitting ? "Bezig..." : "Offerte aanvragen"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
