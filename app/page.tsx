"use client";
import React, { useState } from "react";
import Link from "next/link";

// --- BARTMOOI KLEURENPALET & STYLING ---
const COLORS = {
  primary: "#1066a3",
  textDark: "#2d3748",
  textLight: "#666666",
  bgLight: "#f4f7f9",
};

// SVG Componenten
const GlassVast = ({ x }: { x: number }) => (
  <g transform={`translate(${x}, 0)`}>
    <rect
      x="6"
      y="6"
      width="88"
      height="88"
      fill="none"
      stroke="#cbd5e1"
      strokeWidth="0.4"
    />
    <line x1="48" y1="50" x2="52" y2="50" stroke="#cbd5e1" strokeWidth="0.8" />
    <line x1="50" y1="48" x2="50" y2="52" stroke="#cbd5e1" strokeWidth="0.8" />
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
      strokeWidth="0.4"
    />
    <path
      d="M12 12 L88 50 L12 88"
      fill="none"
      stroke={COLORS.primary}
      strokeWidth="0.6"
      strokeDasharray="1.5,1.5"
    />
    <rect
      x="10"
      y="10"
      width="80"
      height="80"
      fill="none"
      stroke={COLORS.textDark}
      strokeWidth="0.8"
    />
    <rect
      x="84"
      y="46"
      width="1.5"
      height="8"
      rx="0.5"
      fill={COLORS.textDark}
    />
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
      strokeWidth="0.4"
    />
    <path
      d="M12 12 L50 88 L88 12"
      fill="none"
      stroke={COLORS.primary}
      strokeWidth="0.6"
      strokeDasharray="1.5,1.5"
    />
    <rect
      x="10"
      y="10"
      width="80"
      height="80"
      fill="none"
      stroke={COLORS.textDark}
      strokeWidth="0.8"
    />
    <rect x="46" y="8" width="8" height="1.5" rx="0.5" fill={COLORS.textDark} />
  </g>
);

export default function BartMooiConfigurator() {
  const [activeTab, setActiveTab] = useState(1);

  const kozijnen = [
    {
      id: 1,
      slug: "vast-kozijn",
      v: 1,
      name: "Vast kozijn",
      best: true,
      components: [<GlassVast key="1" x={0} />],
    },
    {
      id: 2,
      slug: "draai-kiep-kozijn",
      v: 1,
      name: "Draai kiep kozijn",
      best: true,
      components: [<GlassDK key="1" x={0} />],
    },
    {
      id: 3,
      slug: "kiep-kozijn",
      v: 1,
      name: "Kiep kozijn",
      best: true,
      components: [<GlassKiep key="1" x={0} />],
    },

    // 2 vakken
    {
      id: 4,
      slug: "draai-kiep-vast-kozijn",
      v: 2,
      name: "Draai kiep - vast",
      best: true,
      components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      id: 5,
      slug: "draai-kiep-draai-stolp-kozijn",
      v: 2,
      name: "Draai kiep - Draai kiep",
      best: true,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} mirror />,
      ],
    },
    {
      id: 6,
      slug: "vast-vast-kozijn",
      v: 2,
      name: "Vast - Vast",
      best: true,
      components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />],
    },

    // 3 vakken
    {
      id: 7,
      slug: "draai-kiep-vast-draai-kiep-kozijn",
      v: 3,
      name: "Draai kiep - vast - Draai kiep",
      best: true,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassDK key="3" x={200} mirror />,
      ],
    },
    {
      id: 8,
      slug: "vast-vast-vast-kozijn",
      v: 3,
      name: "Vast - Vast - Vast",
      best: true,
      components: [
        <GlassVast key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassVast key="3" x={200} />,
      ],
    },
    {
      id: 9,
      slug: "vast-draai-kiep-vast-kozijn",
      v: 3,
      name: "Vast - Draai kiep - Vast",
      best: true,
      components: [
        <GlassVast key="1" x={0} />,
        <GlassDK key="2" x={100} />,
        <GlassVast key="3" x={200} />,
      ],
    },

    // 4 vakken
    {
      id: 10,
      slug: "draai-kiep-vast-vast-draai-kiep-kozijn",
      v: 4,
      name: "Draai kiep - Vast - Vast - Draai kiep",
      best: true,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassVast key="3" x={200} />,
        <GlassDK key="4" x={300} mirror />,
      ],
    },
    {
      id: 11,
      slug: "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn",
      v: 4,
      name: "4x Draai kiep kozijn",
      best: true,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} />,
        <GlassDK key="3" x={200} />,
        <GlassDK key="4" x={300} />,
      ],
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-8 md:p-16 font-sans bg-white min-h-screen">
      <div className="mb-12 border-l-4 border-[#1066a3] pl-6">
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
          Kunstof kozijnen
        </h1>
        <p className="text-[#1066a3] font-medium text-xl uppercase tracking-tighter">
          Kies uw gewenste indeling{" "}
        </p>
      </div>

      <div className="flex justify-start mb-12">
        <div className="flex bg-[#f4f7f9] p-1.5 rounded-xl">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setActiveTab(n)}
              className={`px-8 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === n ? "bg-[#1066a3] text-white shadow-md" : "text-[#666666] hover:text-[#1066a3]"}`}>
              {n} {n === 1 ? "vak" : "vakken"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {kozijnen
          .filter((k) => k.v === activeTab)
          .map((item) => (
            <Link
              href={`/configurator/${item.slug}`}
              key={item.id}
              className="group">
              <div className="relative h-[280px] bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-8 shadow-sm">
                {item.best && (
                  <div className="absolute top-4 left-4 bg-[#1066a3] text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest z-10 uppercase">
                    POPULAIR
                  </div>
                )}
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    style={{ width: `${item.v * 20 + 20}%`, maxWidth: "100%" }}>
                    <svg
                      viewBox={`0 0 ${item.v * 100} 100`}
                      className="w-full h-auto">
                      <rect
                        x="0.5"
                        y="0.5"
                        width={item.v * 100 - 1}
                        height="99"
                        fill="none"
                        stroke={COLORS.textDark}
                        strokeWidth="1"
                      />
                      {Array.from({ length: item.v - 1 }).map((_, i) => (
                        <line
                          key={i}
                          x1={(i + 1) * 100}
                          y1="0"
                          x2={(i + 1) * 100}
                          y2="100"
                          stroke={COLORS.textDark}
                          strokeWidth="1"
                        />
                      ))}
                      {item.components}
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="mt-6 text-center font-bold text-[#1a1a1a] text-base group-hover:text-[#1066a3] transition-colors uppercase tracking-tight">
                {item.name}
              </h3>
              <div className="mt-2 text-center text-[10px] font-bold text-[#1066a3] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                Bekijk configurator →
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
