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
  const [afstandshouder, setAfstandshouder] = useState("aluminium");
  const [profiel, setProfiel] = useState("vlak-82");
  const [aanslag, setAanslag] = useState(true);
  const [ventilatieRooster, setVentilatieRooster] = useState("nee");
  const [voorboren, setVoorboren] = useState("niet");
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
    let totaleKozijnPrijs = 0;
    kozijn.types.forEach((vakType: string) => {
      const multiplier = matrix[vakType] ?? 1.0;
      const materiaalPrijs = matrix.kunststof ?? 0;
      const glasToeslag = matrix.glasToeslag?.[glas] ?? 0;
      const afstandshouderToeslag =
        afstandshouder === "zwart"
          ? (matrix.afstandshouder?.["zwart-warm-edge"] ?? 15)
          : 0;
      const kleurToeslag = matrix.kleurToeslag?.[kleur] ?? 0;
      const profielToeslag = matrix.profielToeslag?.[profiel] ?? 0;
      const aanslagToeslag = aanslag ? (matrix.aanslagKosten ?? 0) : 0;
      const roosterToeslag =
        ventilatieRooster === "ja" ? (matrix.ventilatieRooster ?? 50) : 0;
      totaleKozijnPrijs +=
        m2PerVak * materiaalPrijs * multiplier +
        m2PerVak * glasToeslag +
        afstandshouderToeslag +
        kleurToeslag +
        profielToeslag +
        aanslagToeslag +
        roosterToeslag;
    });
    return parseFloat((totaleKozijnPrijs * aantal).toFixed(2));
  }, [
    breedte,
    hoogte,
    kleur,
    glas,
    afstandshouder,
    profiel,
    aanslag,
    ventilatieRooster,
    aantal,
    kozijn,
    matrix,
  ]);

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
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="mb-6 border-b pb-6">
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
                  <input
                    type="number"
                    value={breedte}
                    onChange={(e) => setBreedte(Number(e.target.value))}
                    className="border p-2.5 rounded-lg text-sm"
                    placeholder="Breedte"
                  />
                  <input
                    type="number"
                    value={hoogte}
                    onChange={(e) => setHoogte(Number(e.target.value))}
                    className="border p-2.5 rounded-lg text-sm"
                    placeholder="Hoogte"
                  />
                </div>
                <select
                  value={glas}
                  onChange={(e) => setGlas(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-sm">
                  <option value="hr-plus-plus">HR++ Glas</option>
                  <option value="triple">Triple Glas</option>
                </select>
                <select
                  value={kleur}
                  onChange={(e) => setKleur(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-sm">
                  <option value="wit">Wit (RAL 9016)</option>
                  <option value="antraciet">Antraciet (RAL 7016)</option>
                </select>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mt-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    Check uw subsidie
                  </h3>
                  <input
                    type="text"
                    placeholder="Uw naam"
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                    className="w-full mt-2 p-2 rounded-lg border text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Uw e-mailadres"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mt-2 p-2 rounded-lg border text-sm"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!email || !naam) {
                      alert("Vul naam en e-mail in!");
                      return;
                    }
                    setIsSubmitting(true);
                    await saveOfferte(email, {
                      naam,
                      kozijnNaam: kozijn.name,
                      slug,
                      breedte,
                      hoogte,
                      kleur,
                      glas,
                      afstandshouder,
                      profiel,
                      aanslag,
                      ventilatieRooster,
                      voorboren,
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
