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
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-10 font-sans text-slate-600">
        <Link
          href="/"
          className="inline-flex items-center text-[11px] font-medium text-slate-400 mb-6 hover:text-[#1066a3] transition-colors uppercase tracking-wider">
          ← Overzicht
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-7 flex flex-col w-full order-1">
            <h1 className="text-xl md:text-2xl font-semibold uppercase text-slate-800 mb-6 tracking-tight">
              {kozijn.name}
            </h1>
            <div className="w-full bg-slate-50/50 rounded-xl border border-slate-100 p-4 md:p-10 flex items-center justify-center min-h-[300px]">
              <svg
                viewBox={`0 0 ${kozijn.v * 100} 100`}
                className="w-full h-auto"
                style={{ maxHeight: "400px" }}
                preserveAspectRatio="xMidYMid meet">
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
          <div className="lg:col-span-5 w-full order-2">
            {/* Formulier gedeelte blijft volledig intact */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-end mb-8 border-b border-slate-50 pb-6">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                    Prijsindicatie
                  </span>
                  <span className="text-3xl text-slate-800 font-light">
                    €{" "}
                    {berekendePrijs.toLocaleString("nl-NL", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Breedte (mm)
                    </label>
                    <input
                      type="number"
                      value={breedte}
                      onChange={(e) => setBreedte(Number(e.target.value))}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Hoogte (mm)
                    </label>
                    <input
                      type="number"
                      value={hoogte}
                      onChange={(e) => setHoogte(Number(e.target.value))}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Type Beglazing
                    </label>
                    <select
                      value={glas}
                      onChange={(e) => setGlas(e.target.value)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white">
                      <option value="hr-plus-plus">
                        HR++ Glas (Standaard)
                      </option>
                      <option value="triple">Triple Glas</option>
                      <option value="mat">Matglas</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Afstandshouder
                    </label>
                    <select
                      value={afstandshouder}
                      onChange={(e) => setAfstandshouder(e.target.value)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white">
                      <option value="aluminium">Aluminium (Standaard)</option>
                      <option value="zwart">Zwart (Warm-edge)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Profiel
                    </label>
                    <select
                      value={profiel}
                      onChange={(e) => setProfiel(e.target.value)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white">
                      <option value="vlak-82">Vlak profiel 82</option>
                      <option value="verdiept-120">Verdiept profiel 120</option>
                      <option value="verdiept-120-hvl">Verdiept 120 HVL</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Kleur
                    </label>
                    <select
                      value={kleur}
                      onChange={(e) => setKleur(e.target.value)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white">
                      <option value="wit">Wit (RAL 9016)</option>
                      <option value="creme-wit">Crème wit (RAL 9001)</option>
                      <option value="antraciet">Antraciet (Houtmotief)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Ventilatie rooster
                    </label>
                    <select
                      value={ventilatieRooster}
                      onChange={(e) => setVentilatieRooster(e.target.value)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white">
                      <option value="nee">Nee</option>
                      <option value="ja">Ja</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Voorboren
                    </label>
                    <select
                      value={voorboren}
                      onChange={(e) => setVoorboren(e.target.value)}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white">
                      <option value="niet">Niet voorboren</option>
                      <option value="links-boven-rechts">
                        Kozijn voorboren 6 mm links / boven / rechts
                      </option>
                      <option value="rondom">
                        Kozijn voorboren 6 mm links / boven / rechts / onder
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Aantal
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={aantal}
                      onChange={(e) => setAantal(Number(e.target.value))}
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await saveOfferte("klant@voorbeeld.nl", {
                      kozijnNaam: kozijn.name,
                      breedte,
                      hoogte,
                      profiel,
                      aanslag,
                      kleur,
                      glas,
                      afstandshouder,
                      ventilatieRooster,
                      voorboren,
                      aantal,
                      prijs: berekendePrijs,
                    });
                    alert("Offerte opgeslagen!");
                  }}
                  className="w-full bg-[#1066a3] text-white py-4 px-6 rounded-lg font-bold uppercase text-[11px] tracking-widest">
                  Voeg toe aan aanvraag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
