"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { getMatrix } from "@/lib/data";
import { GlassVast, GlassDK, GlassKiep } from "@/lib/kozijn-svgs";

const COLORS = {
  primary: "#1066a3",
  border: "#e2e8f0",
  text: "#4a5568",
  frame: "#2d3748",
};

// ... (getKozijnData blijft ongewijzigd)
const getKozijnData = (slug: string) => {
  const data = [
    {
      slug: "vast-kozijn",
      v: 1,
      types: ["vast"],
      name: "Vast kozijn",
      components: <GlassVast x={0} />,
    },
    {
      slug: "draai-kiep-kozijn",
      v: 1,
      types: ["dk"],
      name: "Draai kiep kozijn",
      components: <GlassDK x={0} />,
    },
    {
      slug: "kiep-kozijn",
      v: 1,
      types: ["kiep"],
      name: "Kiep kozijn",
      components: <GlassKiep x={0} />,
    },
    {
      slug: "draai-kiep-vast-kozijn",
      v: 2,
      types: ["dk", "vast"],
      name: "Draai kiep - vast",
      components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      slug: "draai-kiep-draai-stolp-kozijn",
      v: 2,
      types: ["dk", "dk"],
      name: "Draai kiep - Draai kiep",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} mirror />,
      ],
    },
    {
      slug: "vast-vast-kozijn",
      v: 2,
      types: ["vast", "vast"],
      name: "Vast - Vast",
      components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      slug: "draai-kiep-vast-draai-kiep-kozijn",
      v: 3,
      types: ["dk", "vast", "dk"],
      name: "Draai kiep - vast - Draai kiep",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassDK key="3" x={200} mirror />,
      ],
    },
    {
      slug: "vast-vast-vast-kozijn",
      v: 3,
      types: ["vast", "vast", "vast"],
      name: "Vast - Vast - Vast",
      components: [
        <GlassVast key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassVast key="3" x={200} />,
      ],
    },
    {
      slug: "vast-draai-kiep-vast-kozijn",
      v: 3,
      types: ["vast", "dk", "vast"],
      name: "Vast - Draai kiep - Vast",
      components: [
        <GlassVast key="1" x={0} />,
        <GlassDK key="2" x={100} />,
        <GlassVast key="3" x={200} />,
      ],
    },
    {
      slug: "draai-kiep-vast-vast-draai-kiep-kozijn",
      v: 4,
      types: ["dk", "vast", "vast", "dk"],
      name: "Draai kiep - Vast - Vast - Draai kiep",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassVast key="3" x={200} />,
        <GlassDK key="4" x={300} mirror />,
      ],
    },
    {
      slug: "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn",
      v: 4,
      types: ["dk", "dk", "dk", "dk"],
      name: "Draai kiep - Draai kiep - Draai kiep - Draai kiep",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} />,
        <GlassDK key="3" x={200} />,
        <GlassDK key="4" x={300} />,
      ],
    },
  ];
  return data.find((k) => k.slug === slug) || data[0];
};

export default function ConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "vast-kozijn";
  const kozijn = getKozijnData(slug);
  const [matrix, setMatrix] = useState<any>(null);

  const [breedte, setBreedte] = useState<number>(1000);
  const [hoogte, setHoogte] = useState<number>(1000);
  const [kleur, setKleur] = useState<string>("wit");
  const [glas, setGlas] = useState<string>("hr-plus-plus");
  const [profiel, setProfiel] = useState("vlak-82");
  const [aantal, setAantal] = useState(1);
  const [email, setEmail] = useState("");
  const [naam, setNaam] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getMatrix("kozijn_matrix").then((data) => setMatrix(data));
  }, []);

  const berekendePrijs = useMemo(() => {
    if (!matrix) return 0;
    const m2PerVak = (breedte / 1000) * (hoogte / 1000);
    const m2Tarief = matrix.m2Tarief ?? 150;
    let totaleKozijnPrijs = matrix.basisPrijs ?? 200;
    kozijn.types.forEach(() => {
      totaleKozijnPrijs +=
        m2PerVak * m2Tarief +
        m2PerVak * (matrix.glasToeslag?.[glas] ?? 0) +
        (matrix.kleurToeslag?.[kleur] ?? 0) +
        (matrix.profielToeslag?.[profiel] ?? 0);
    });
    return parseFloat((totaleKozijnPrijs * aantal).toFixed(2));
  }, [breedte, hoogte, kleur, glas, profiel, aantal, matrix, kozijn]);

  if (!matrix)
    return (
      <div className="p-10 text-center">Prijzen ophalen uit database...</div>
    );

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-10">
        <Link
          href="/"
          className="text-slate-400 text-[11px] uppercase tracking-wider mb-6 hover:text-[#1066a3]">
          ← Overzicht
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold uppercase text-slate-800 mb-6">
              {kozijn.name}
            </h1>
            <div className="bg-slate-50 rounded-xl p-10 flex items-center justify-center">
              <svg
                viewBox={`0 0 ${kozijn.v * 100} 100`}
                className="w-full max-h-[400px]">
                <rect
                  x="0.4"
                  y="0.4"
                  width={kozijn.v * 100 - 0.8}
                  height="99.2"
                  fill="white"
                  stroke={COLORS.frame}
                  strokeWidth="0.8"
                />
                {Array.from({ length: kozijn.v - 1 }).map((_, i) => (
                  <line
                    key={i}
                    x1={(i + 1) * 100}
                    y1="0"
                    x2={(i + 1) * 100}
                    y2="100"
                    stroke={COLORS.frame}
                    strokeWidth="0.8"
                  />
                ))}
                {kozijn.components}
              </svg>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Prijsindicatie
                </span>
                <div className="text-3xl text-slate-800">
                  €{" "}
                  {berekendePrijs.toLocaleString("nl-NL", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
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
                    Glassoort
                  </label>
                  <select
                    value={glas}
                    onChange={(e) => setGlas(e.target.value)}
                    className="w-full border p-2.5 rounded-lg text-sm capitalize">
                    {Object.keys(matrix.glasToeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Kleur kozijn
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
                    Profieltype
                  </label>
                  <select
                    value={profiel}
                    onChange={(e) => setProfiel(e.target.value)}
                    className="w-full border p-2.5 rounded-lg text-sm capitalize">
                    {Object.keys(matrix.profielToeslag || {}).map((k) => (
                      <option key={k} value={k}>
                        {k.replace(/-/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

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
                  onClick={async () => {
                    if (!email || !naam) return alert("Vul naam en e-mail in!");
                    setIsSubmitting(true);
                    await saveOfferte(email, {
                      naam,
                      kozijnNaam: kozijn.name,
                      slug,
                      breedte,
                      hoogte,
                      kleur,
                      glas,
                      profiel,
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
    </div>
  );
}
