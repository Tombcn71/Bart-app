"use client";
import React, { useState } from "react";
import Link from "next/link";
import { InmeetServiceCard } from "@/app/components/InmeetServiceCard";
// 🛠️ Alle benodigde SVG componenten centraal importeren uit je lib:
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

// --- BARTMOOI KLEURENPALET & STYLING ---
const COLORS = {
  primary: "#1066a3",
  textDark: "#2d3748",
  textLight: "#666666",
  bgLight: "#f4f7f9",
};

export default function KozijnConfigurator() {
  const [activeTab, setActiveTab] = useState(1);

  const kozijnen = [
    // ==========================================
    // 1 VAK MODELLEN
    // ==========================================
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
    {
      id: 12,
      slug: "vast-bovenlicht-kiep",
      v: 1,
      name: "Vast raam met bovenlicht (kiep) kozijn",
      best: false,
      components: [<GlassVastBovenlichtKiep key="1" x={0} />],
    },
    {
      id: 13,
      slug: "dk-bovenlicht-vast",
      v: 1,
      name: "Draai / kiep met bovenlicht (vast) kozijn",
      best: false,
      components: [<GlassDkBovenlichtVast key="1" x={0} />],
    },
    {
      id: 14,
      slug: "dk-bovenlicht-kiep",
      v: 1,
      name: "Draai / kiep met bovenlicht (kiep) kozijn",
      best: false,
      components: [<GlassDkBovenlichtKiep key="1" x={0} />],
    },
    {
      id: 15,
      slug: "dk-borstwering-vast",
      v: 1,
      name: "Draai / kiep met borstwering(vast) kozijn",
      best: false,
      components: [<GlassDkBorstweringVast key="1" x={0} />],
    },

    // ==========================================
    // 2 VAKKEN MODELLEN
    // ==========================================
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
    {
      id: 16,
      slug: "dk-dk-gelijk",
      v: 2,
      name: "Draai kiep - Draai kiep gelijk kozijn",
      best: false,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} mirror />,
      ],
    },
    {
      id: 17,
      slug: "dk-13-vast-23",
      v: 2,
      name: "Draai / kiep 1/3 - vast 2/3 kozijn",
      best: false,
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
      id: 18,
      slug: "vast-vast-horizontaal",
      v: 2,
      name: "Vast - Vast kozijn (horizontaal)",
      best: false,
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
            stroke={COLORS.textDark}
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
      id: 19,
      slug: "kiep-vast-liggend",
      v: 2,
      name: "Kiep - vast kozijn",
      best: false,
      components: [<GlassKiep key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      id: 20,
      slug: "kiep-kiep-kozijn",
      v: 2,
      name: "Kiep - kiep kozijn",
      best: false,
      components: [<GlassKiepKiep key="1" x={0} />],
    },
    {
      id: 21,
      slug: "dk-dk-stolp-bovenlicht-vast-2vaks",
      v: 2,
      name: "Draai/kiep - draai stolp kozijn met bovenlicht (vast)",
      best: false,
      components: [<GlassDkDkStolpBovenlichtVast key="1" x={0} />],
    },
    {
      id: 22,
      slug: "dk-vast-bovenlichten-vast-2vaks",
      v: 2,
      name: "Draai / kiep - vast kozijn met bovenlichten (vast)",
      best: false,
      components: [<GlassDkVastBovenlichtenVast key="1" x={0} />],
    },
    {
      id: 23,
      slug: "dk-bovenlicht-kiep-vast-2vaks",
      v: 2,
      name: "Draai / kiep (met bovenlicht kiep) - vast kozijn",
      best: false,
      components: [<GlassDkBovenlichtKiepVast key="1" x={0} />],
    },
    {
      id: 24,
      slug: "vast-bovenlicht-kiep-vast-2vaks",
      v: 2,
      name: "Vast (met bovenlicht kiep) - vast kozijn",
      best: false,
      components: [<GlassVastBovenlichtKiepVast key="1" x={0} />],
    },
    {
      id: 25,
      slug: "dk-bovenlicht-vast-vast-2vaks",
      v: 2,
      name: "Draai / kiep (met bovenlicht vast) - vast kozijn",
      best: false,
      components: [<GlassDkBovenlichtVastVast key="1" x={0} />],
    },

    // ==========================================
    // 3 VAKKEN MODELLEN (SCREENSHOT 3)
    // ==========================================
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
    {
      id: 26,
      slug: "draai-kiep-vast-vast-kozijn",
      v: 3,
      name: "Draai / kiep - vast - vast kozijn",
      best: false,
      components: [<GlassDkVastVastKozijn key="1" x={0} />],
    },
    {
      id: 27,
      slug: "draai-kiep-draai-kiep-draai-kiep-kozijn",
      v: 3,
      name: "Draai/kiep - Draai/kiep - Draai/kiep kozijn",
      best: false,
      components: [<GlassDkDkDkKozijn key="1" x={0} />],
    },
    {
      id: 28,
      slug: "draai-kiep-vast-dk-bovenlichten-vast",
      v: 3,
      name: "Draai / kiep - vast - draai / kiep kozijn met bovenlichten (vast)",
      best: false,
      components: [<GlassDkVastDkBovenlichtenVast key="1" x={0} />],
    },
    {
      id: 29,
      slug: "vast-dk-vast-bovenlichten-vast",
      v: 3,
      name: "Vast - draai / kiep - vast kozijn met bovenlichten (vast)",
      best: false,
      components: [<GlassVastDkVastBovenlichtenVast key="1" x={0} />],
    },

    // ==========================================
    // 4 VAKKEN MODELLEN
    // ==========================================
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
          Kunststof kozijnen
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
              href={`/kozijnconfigurator/${item.slug}`}
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
        <div className="col-span-full border-t border-slate-100 mt-4" />
        <InmeetServiceCard />
      </div>
    </div>
  );
}
