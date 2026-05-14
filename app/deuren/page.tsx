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

// --- SVG DEUR COMPONENTEN ---
const SingleDoorBase = ({ type }: { type: "voordeur" | "achterdeur" }) => (
  <g transform="translate(20, 5)">
    <rect
      x="0"
      y="0"
      width="60"
      height="90"
      fill="none"
      stroke={COLORS.textDark}
      strokeWidth="1"
    />
    {type === "voordeur" ? (
      <>
        <rect
          x="10"
          y="10"
          width="40"
          height="35"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <line
          x1="10"
          y1="27.5"
          x2="50"
          y2="27.5"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <line
          x1="30"
          y1="10"
          x2="30"
          y2="45"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <rect
          x="15"
          y="60"
          width="30"
          height="20"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
      </>
    ) : (
      <>
        <rect
          x="5"
          y="5"
          width="50"
          height="80"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <path
          d="M5 5 L55 45 L5 85"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="0.6"
          strokeDasharray="1.5,1.5"
        />
      </>
    )}
    <circle cx="56" cy="45" r="1.5" fill={COLORS.textDark} />
  </g>
);

const DoubleDoorBase = ({ hasSideLights = false, hasPlinth = false }) => {
  const width = hasSideLights ? 180 : 100;
  return (
    <g>
      <rect
        x="5"
        y="5"
        width={width - 10}
        height="90"
        fill="none"
        stroke={COLORS.textDark}
        strokeWidth="1"
      />
      {hasSideLights && (
        <>
          <line
            x1="45"
            y1="5"
            x2="45"
            y2="95"
            stroke={COLORS.textDark}
            strokeWidth="1"
          />
          <line
            x1="135"
            y1="5"
            x2="135"
            y2="95"
            stroke={COLORS.textDark}
            strokeWidth="1"
          />
          <line
            x1="20"
            y1="48"
            x2="30"
            y2="48"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <line
            x1="155"
            y1="43"
            x2="155"
            y2="53"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
        </>
      )}
      <g transform={hasSideLights ? "translate(45, 0)" : "translate(0, 0)"}>
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          fill="none"
          stroke={COLORS.textDark}
          strokeWidth="1"
        />
        <line
          x1="50"
          y1="5"
          x2="50"
          y2="95"
          stroke={COLORS.textDark}
          strokeWidth="1"
        />
        <path
          d="M10 10 L45 50 L10 90"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="0.6"
          strokeDasharray="1.5,1.5"
        />
        <path
          d="M90 10 L55 50 L90 90"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="0.6"
          strokeDasharray="1.5,1.5"
        />
        {hasPlinth && (
          <>
            <line
              x1="5"
              y1="65"
              x2="95"
              y2="65"
              stroke={COLORS.textDark}
              strokeWidth="1"
            />
            <rect
              x="10"
              y="70"
              width="35"
              height="20"
              fill="#f1f5f9"
              stroke="none"
            />
            <rect
              x="55"
              y="70"
              width="35"
              height="20"
              fill="#f1f5f9"
              stroke="none"
            />
          </>
        )}
        <circle cx="46" cy="50" r="1.5" fill={COLORS.textDark} />
        <circle cx="54" cy="50" r="1.5" fill={COLORS.textDark} />
      </g>
    </g>
  );
};

export default function BartMooiDeurenConfigurator() {
  const [activeType, setActiveType] = useState("Enkele deur");

  const deuren = [
    {
      id: 1,
      category: "Enkele deur",
      slug: "voordeur",
      name: "Voordeur",
      best: true,
      v: 1,
      components: <SingleDoorBase type="voordeur" />,
    },
    {
      id: 2,
      category: "Enkele deur",
      slug: "achterdeur",
      name: "Achterdeur",
      best: true,
      v: 1,
      components: <SingleDoorBase type="achterdeur" />,
    },
    {
      id: 3,
      category: "Dubbele deur",
      slug: "dubbele-deur",
      name: "Dubbele deur",
      best: true,
      v: 1,
      components: <DoubleDoorBase />,
    },
    {
      id: 4,
      category: "Dubbele deur",
      slug: "dubbele-deur-zijlichten",
      name: "Dubbele deur met zijlichten",
      best: true,
      v: 1.8,
      components: <DoubleDoorBase hasSideLights />,
    },
    {
      id: 5,
      category: "Dubbele deur",
      slug: "dubbele-deur-borstwering",
      name: "Dubbele deur met borstwering",
      best: true,
      v: 1,
      components: <DoubleDoorBase hasPlinth />,
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      {/* Header Section - Nu flexibel voor mobiel */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-[#1066a3] pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3 tracking-tight uppercase">
            Kunststof deuren
          </h1>
          <p className="text-[#1066a3] font-medium text-sm md:text-xl uppercase tracking-tighter">
            Kies uw gewenste indeling{" "}
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest lg:text-right">
            In welk type deur ben je geïnteresseerd?
          </p>
          <div className="flex bg-[#f4f7f9] p-1 rounded-xl w-full lg:w-auto overflow-hidden">
            {["Enkele deur", "Dubbele deur"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 md:py-3 text-[11px] md:text-sm font-bold rounded-lg transition-colors ${
                  activeType === type
                    ? "bg-[#1066a3] text-white shadow-md"
                    : "text-[#666666]"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid - 1 kolom op mobiel, 2 op tablet, 3 op desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {deuren
          .filter((d) => d.category === activeType)
          .map((item) => (
            <Link
              href={`/deurconfigurator/${item.slug}`}
              key={item.id}
              className="group flex flex-col h-full">
              <div className="relative aspect-[4/3] bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
                {item.best && (
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#1066a3] text-white text-[8px] md:text-[9px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full tracking-widest z-10 uppercase">
                    POPULAIR
                  </div>
                )}
                <div className="w-full h-full flex items-center justify-center">
                  <div style={{ width: item.v > 1.5 ? "100%" : "60%" }}>
                    <svg
                      viewBox={`0 0 ${item.v * 100} 100`}
                      className="w-full h-auto">
                      {item.components}
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-6 text-center">
                <h3 className="font-bold text-[#1a1a1a] text-sm md:text-base uppercase tracking-tight leading-tight">
                  {item.name}
                </h3>
                <div className="mt-1 md:mt-2 text-[10px] font-bold text-[#1066a3] uppercase tracking-widest lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  Stel nu samen →
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
