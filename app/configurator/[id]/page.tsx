"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const COLORS = {
  primary: "#1066a3",
  border: "#e2e8f0",
  text: "#4a5568",
  frame: "#2d3748",
};

// SVG componenten met verfijnde lijndiktes
const GlassVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect
      x="6"
      y="6"
      width="88"
      height="88"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="0.3"
    />
    <line x1="48" y1="50" x2="52" y2="50" stroke="#cbd5e1" strokeWidth="0.6" />
    <line x1="50" y1="48" x2="50" y2="52" stroke="#cbd5e1" strokeWidth="0.6" />
  </g>
);

const GlassDK = ({ x, mirror = false }: { x: number; mirror?: boolean }) => (
  <g
    transform={`translate(${x}, 0) ${mirror ? "scale(-1, 1) translate(-100, 0)" : ""}`}>
    <rect
      x="6"
      y="6"
      width="88"
      height="88"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="0.3"
    />
    <path
      d="M12 12 L88 50 L12 88"
      fill="none"
      stroke={COLORS.primary}
      strokeWidth="0.5"
      strokeDasharray="1.5,1.5"
    />
    <rect
      x="10"
      y="10"
      width="80"
      height="80"
      fill="none"
      stroke={COLORS.frame}
      strokeWidth="0.6"
    />
    <rect x="85" y="46" width="1.5" height="8" rx="0.5" fill={COLORS.frame} />
  </g>
);

const GlassKiep = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect
      x="6"
      y="6"
      width="88"
      height="88"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="0.3"
    />
    <path
      d="M12 12 L50 88 L88 12"
      fill="none"
      stroke={COLORS.primary}
      strokeWidth="0.5"
      strokeDasharray="1.5,1.5"
    />
    <rect
      x="10"
      y="10"
      width="80"
      height="80"
      fill="none"
      stroke={COLORS.frame}
      strokeWidth="0.6"
    />
    <rect x="46" y="8" width="8" height="1.5" rx="0.5" fill={COLORS.frame} />
  </g>
);

const getKozijnData = (slug: string) => {
  const data = [
    {
      slug: "vast-kozijn",
      v: 1,
      name: "Vast kozijn",
      components: <GlassVast x={0} />,
    },
    {
      slug: "draai-kiep-kozijn",
      v: 1,
      name: "Draai kiep kozijn",
      components: <GlassDK x={0} />,
    },
    {
      slug: "kiep-kozijn",
      v: 1,
      name: "Kiep kozijn",
      components: <GlassKiep x={0} />,
    },
    {
      slug: "draai-kiep-vast-kozijn",
      v: 2,
      name: "Draai kiep - vast",
      components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      slug: "draai-kiep-draai-stolp-kozijn",
      v: 2,
      name: "Draai kiep - Draai kiep",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} mirror />,
      ],
    },
    {
      slug: "vast-vast-kozijn",
      v: 2,
      name: "Vast - Vast",
      components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      slug: "draai-kiep-vast-draai-kiep-kozijn",
      v: 3,
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

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-10 font-sans text-slate-600">
        <Link
          href="/"
          className="inline-flex items-center text-[11px] font-medium text-slate-400 mb-6 hover:text-[#1066a3] transition-colors uppercase tracking-wider">
          ← Overzicht
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* VISUALISATIE */}
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
            <p className="mt-4 text-[9px] text-slate-400 uppercase tracking-[0.2em] text-center">
              Buitenaanzicht schematisch
            </p>
          </div>

          {/* FORMULIER */}
          <div className="lg:col-span-5 w-full order-2">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-end mb-8 border-b border-slate-50 pb-6">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest mb-1">
                    Prijsindicatie
                  </span>
                  <span className="text-3xl text-slate-800 font-light">
                    € 433,44
                  </span>
                </div>
                <span className="text-[10px] text-[#1066a3] font-bold uppercase tracking-wider pb-1">
                  Incl. BTW
                </span>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Breedte (mm)
                    </label>
                    <input
                      type="number"
                      defaultValue="1200"
                      className="w-full border border-slate-200 p-2.5 rounded-lg focus:border-[#1066a3] outline-none transition-all bg-white text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      Hoogte (mm)
                    </label>
                    <input
                      type="number"
                      defaultValue="1500"
                      className="w-full border border-slate-200 p-2.5 rounded-lg focus:border-[#1066a3] outline-none transition-all bg-white text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                    Specificaties
                  </label>
                  <select className="w-full border border-slate-200 p-3 rounded-lg bg-slate-50/50 outline-none text-xs font-medium appearance-none">
                    <option>Klassiek Verdiept Profiel (120mm)</option>
                  </select>
                  <select className="w-full border border-slate-200 p-3 rounded-lg bg-slate-50/50 outline-none text-xs font-medium appearance-none">
                    <option>Kleur: Antraciet structuur</option>
                  </select>
                  <select className="w-full border border-slate-200 p-3 rounded-lg bg-slate-50/50 outline-none text-xs font-medium appearance-none">
                    <option>Isolatie: HR++ Glas</option>
                  </select>
                </div>

                <button className="w-full bg-[#1066a3] hover:bg-[#0d5486] text-white py-4 px-6 rounded-lg transition-all text-[11px] font-bold uppercase tracking-widest mt-4">
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
