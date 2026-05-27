"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { getMatrix } from "@/lib/data";
import {
  GlassVast,
  GlassDK,
  GlassKiep,
  GlassVastBovenlichtKiep,
  GlassDkBovenlichtVast,
  GlassDkBovenlichtKiep,
  GlassDkBorstweringVast,
  // Nieuwe 2-vaks SVG's:
  GlassKiepKiep,
  GlassDkDkStolpBovenlichtVast,
  GlassDkVastBovenlichtenVast,
  GlassDkBovenlichtKiepVast,
  GlassVastBovenlichtKiepVast,
  GlassDkBovenlichtVastVast,
  // Nieuwe 3-vaks SVG's:
  GlassDkVastVastKozijn,
  GlassDkDkDkKozijn,
  GlassDkVastDkBovenlichtenVast,
  GlassVastDkVastBovenlichtenVast,
} from "@/lib/kozijn-svgs";

const COLORS = {
  primary: "#1066a3",
  border: "#e2e8f0",
  text: "#4a5568",
  frame: "#2d3748",
};

const getKozijnData = (slug: string) => {
  const data = [
    // ==========================================
    // 1 VAK MODELLEN
    // ==========================================
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
      slug: "vast-bovenlicht-kiep",
      v: 1,
      types: ["vast", "kiep"],
      name: "Vast raam met bovenlicht (kiep) kozijn",
      components: <GlassVastBovenlichtKiep x={0} />,
    },
    {
      slug: "dk-bovenlicht-vast",
      v: 1,
      types: ["dk", "vast"],
      name: "Draai / kiep met bovenlicht (vast) kozijn",
      components: <GlassDkBovenlichtVast x={0} />,
    },
    {
      slug: "dk-bovenlicht-kiep",
      v: 1,
      types: ["dk", "kiep"],
      name: "Draai / kiep met bovenlicht (kiep) kozijn",
      components: <GlassDkBovenlichtKiep x={0} />,
    },
    {
      slug: "dk-borstwering-vast",
      v: 1,
      types: ["dk", "vast"],
      name: "Draai / kiep met borstwering(vast) kozijn",
      components: <GlassDkBorstweringVast x={0} />,
    },

    // ==========================================
    // 2 VAKKEN MODELLEN (EXACT MATCH MET OVERZICHT)
    // ==========================================
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
      slug: "dk-dk-gelijk", // <-- Gecorrigeerd naar overzicht
      v: 2,
      types: ["dk", "dk"],
      name: "Draai kiep - Draai kiep gelijk kozijn",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} mirror />,
      ],
    },
    {
      slug: "dk-13-vast-23", // <-- Gecorrigeerd naar overzicht
      v: 2,
      types: ["dk", "vast"],
      name: "Draai / kiep 1/3 - vast 2/3 kozijn",
      components: [
        <g key="1" transform="scale(0.66, 1)">
          <GlassDK x={0} />
        </g>,
        <g key="2" transform="translate(33, 0) scale(1.33, 1)">
          <GlassVast x={50} />
        </g>,
      ],
    },
    {
      slug: "vast-vast-horizontaal", // <-- Gecorrigeerd naar overzicht
      v: 2,
      types: ["vast", "vast"],
      name: "Vast - Vast kozijn (horizontaal)",
      components: [
        <g key="1">
          <rect
            x="6"
            y="6"
            width="188"
            height="44"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.4"
          />
          <line
            x1="98"
            y1="28"
            x2="102"
            y2="28"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />
          <line
            x1="100"
            y1="26"
            x2="100"
            y2="30"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="53"
            x2="200"
            y2="53"
            stroke={COLORS.frame}
            strokeWidth="1"
          />
          <rect
            x="6"
            y="59"
            width="188"
            height="35"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="0.4"
          />
        </g>,
      ],
    },
    {
      slug: "kiep-vast-liggend", // <-- Gecorrigeerd naar overzicht
      v: 2,
      types: ["kiep", "vast"],
      name: "Kiep - vast kozijn",
      components: [<GlassKiep key="1" x={0} />, <GlassVast key="2" x={100} />],
    }, // ontbrekende 2-vaks
    {
      slug: "kiep-kiep-kozijn",
      v: 2,
      types: ["kiep", "kiep"],
      name: "Kiep - kiep kozijn",
      components: [<GlassKiepKiep key="1" x={0} />],
    },
    {
      slug: "dk-dk-stolp-bovenlicht-vast-2vaks",
      v: 2,
      types: ["dk", "dk"],
      name: "Draai/kiep - draai stolp kozijn met bovenlicht (vast)",
      components: [<GlassDkDkStolpBovenlichtVast key="1" x={0} />],
    },
    {
      slug: "dk-vast-bovenlichten-vast-2vaks",
      v: 2,
      types: ["dk", "vast"],
      name: "Draai / kiep - vast kozijn met bovenlichten (vast)",
      components: [<GlassDkVastBovenlichtenVast key="1" x={0} />],
    },
    {
      slug: "dk-bovenlicht-kiep-vast-2vaks",
      v: 2,
      types: ["dk", "kiep"],
      name: "Draai / kiep (met bovenlicht kiep) - vast kozijn",
      components: [<GlassDkBovenlichtKiepVast key="1" x={0} />],
    },
    {
      slug: "vast-bovenlicht-kiep-vast-2vaks",
      v: 2,
      types: ["vast", "kiep"],
      name: "Vast (met bovenlicht kiep) - vast kozijn",
      components: [<GlassVastBovenlichtKiepVast key="1" x={0} />],
    },
    {
      slug: "dk-bovenlicht-vast-vast-2vaks",
      v: 2,
      types: ["dk", "vast"],
      name: "Draai / kiep (met bovenlicht vast) - vast kozijn",
      components: [<GlassDkBovenlichtVastVast key="1" x={0} />],
    },

    // ==========================================
    // 3 VAKKEN MODELLEN
    // ==========================================
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
    // ontbrekende 3-vaks
    {
      slug: "draai-kiep-vast-vast-kozijn",
      v: 3,
      types: ["dk", "vast", "vast"],
      name: "Draai / kiep - vast - vast kozijn",
      components: [<GlassDkVastVastKozijn key="1" x={0} />],
    },
    {
      slug: "draai-kiep-draai-kiep-draai-kiep-kozijn",
      v: 3,
      types: ["dk", "dk", "dk"],
      name: "Draai/kiep - Draai/kiep - Draai/kiep kozijn",
      components: [<GlassDkDkDkKozijn key="1" x={0} />],
    },
    {
      slug: "draai-kiep-vast-dk-bovenlichten-vast",
      v: 3,
      types: ["dk", "vast", "dk"],
      name: "Draai / kiep - vast - draai / kiep kozijn met bovenlichten (vast)",
      components: [<GlassDkVastDkBovenlichtenVast key="1" x={0} />],
    },
    {
      slug: "vast-dk-vast-bovenlichten-vast",
      v: 3,
      types: ["vast", "dk", "vast"],
      name: "Vast - draai / kiep - vast kozijn met bovenlichten (vast)",
      components: [<GlassVastDkVastBovenlichtenVast key="1" x={0} />],
    },
    // ==========================================
    // 4 VAKKEN MODELLEN
    // ==========================================
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
      name: "4x Draai kiep kozijn",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} />,
        <GlassDK key="3" x={200} />,
        <GlassDK key="4" x={300} />,
      ],
    },
  ];

  // Fallback naar data[0] weggehaald: als er een mismatch is zie je dat direct
  return data.find((k) => k.slug === slug) || null;
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
    if (!matrix || !kozijn) return 0;

    const breedtePerSectie = breedte / kozijn.v;
    const m2Tarief = matrix.m2Tarief ?? 150;
    let totaleKozijnPrijs = matrix.basisPrijs ?? 200;

    kozijn.types.forEach(() => {
      let vakBreedte = breedtePerSectie;
      let vakHoogte = hoogte;

      const m2PerVak = (vakBreedte / 1000) * (vakHoogte / 1000);

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

  if (!kozijn) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Fout: Kozijn met slug "{slug}" is niet gevonden op de detailpagina!
      </div>
    );
  }

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
