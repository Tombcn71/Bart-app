"use client";
import React, { useState } from "react";
import Link from "next/link";

// --- STYLING ---
const COLORS = {
  primary: "#1066a3",
  textDark: "#2d3748",
  textLight: "#666666",
  bgLight: "#f4f7f9",
};

// --- GEFIXTE SVG SCHUIFPUI COMPONENT ---
const SlidingDoorSVG = ({ sections }: { sections: 2 | 4 }) => {
  const isFourVaks = sections === 4;
  const baseWidth = isFourVaks ? 180 : 90;
  const sectionWidth = baseWidth / sections;

  return (
    <g transform="translate(0, 5)">
      <rect
        x="0"
        y="0"
        width={baseWidth}
        height="90"
        fill="none"
        stroke={COLORS.textDark}
        strokeWidth="1"
      />

      {sections === 2 ? (
        <>
          <rect
            x="2"
            y="2"
            width={sectionWidth - 3}
            height="86"
            fill="none"
            stroke={COLORS.textDark}
            strokeWidth="0.8"
          />
          <g transform={`translate(${sectionWidth / 2 - 2}, 43)`}>
            <line
              x1="0"
              y1="0"
              x2="4"
              y2="0"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            <line
              x1="2"
              y1="-2"
              x2="2"
              y2="2"
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
          </g>

          <rect
            x={sectionWidth + 1}
            y="2"
            width={sectionWidth - 3}
            height="86"
            fill="none"
            stroke={COLORS.textDark}
            strokeWidth="0.8"
          />
          <g transform={`translate(${sectionWidth + 10}, 45)`}>
            <line
              x1="0"
              y1="0"
              x2="12"
              y2="0"
              stroke={COLORS.textDark}
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2="3"
              y2="-3"
              stroke={COLORS.textDark}
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2="3"
              y2="3"
              stroke={COLORS.textDark}
              strokeWidth="1"
            />
          </g>
        </>
      ) : (
        <>
          {[0, 1, 2, 3].map((i) => {
            const xPos = i * sectionWidth;
            const isFixed = i === 0 || i === 3;
            const isMovingLeft = i === 1;

            return (
              <g key={i}>
                <rect
                  x={xPos + 1}
                  y="2"
                  width={sectionWidth - 2}
                  height="86"
                  fill="none"
                  stroke={COLORS.textDark}
                  strokeWidth="0.8"
                />
                {isFixed ? (
                  <g
                    transform={`translate(${xPos + sectionWidth / 2 - 2}, 43)`}>
                    <line
                      x1="0"
                      y1="0"
                      x2="4"
                      y2="0"
                      stroke="#cbd5e1"
                      strokeWidth="0.8"
                    />
                    <line
                      x1="2"
                      y1="-2"
                      x2="2"
                      y2="2"
                      stroke="#cbd5e1"
                      strokeWidth="0.8"
                    />
                  </g>
                ) : (
                  <g
                    transform={`translate(${xPos + (isMovingLeft ? 5 : sectionWidth - 15)}, 45)`}>
                    <line
                      x1="0"
                      y1="0"
                      x2="10"
                      y2="0"
                      stroke={COLORS.textDark}
                      strokeWidth="1"
                    />
                    <line
                      x1={isMovingLeft ? 0 : 10}
                      y1="0"
                      x2={isMovingLeft ? 3 : 7}
                      y2="-3"
                      stroke={COLORS.textDark}
                      strokeWidth="1"
                    />
                    <line
                      x1={isMovingLeft ? 0 : 10}
                      y1="0"
                      x2={isMovingLeft ? 3 : 7}
                      y2="3"
                      stroke={COLORS.textDark}
                      strokeWidth="1"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </>
      )}
    </g>
  );
};

export default function SchuifpuiOverview() {
  const [activeType, setActiveType] = useState("2-vaks");

  const puien = [
    {
      id: 1,
      category: "2-vaks",
      slug: "schuifpui-2-vaks",
      name: "Schuifpui 2-vaks",
      best: true,
      v: 1,
      components: <SlidingDoorSVG sections={2} />,
    },
    {
      id: 2,
      category: "4-vaks",
      slug: "schuifpui-4-vaks",
      name: "Schuifpui 4-vaks",
      best: true,
      v: 1.8,
      components: <SlidingDoorSVG sections={4} />,
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      {/* Header Section - Mobile Optimized */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-[#1066a3] pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3 tracking-tight">
            Kunststof schuifpuien
          </h1>
          <p className="text-[#1066a3] font-medium text-sm md:text-xl uppercase tracking-tighter">
            Kies uw gewenste indeling
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest lg:text-right">
            In welke uitvoering ben je geïnteresseerd?
          </p>
          <div className="flex bg-[#f4f7f9] p-1 rounded-xl w-full">
            {["2-vaks", "4-vaks"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex-1 lg:flex-none px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-lg transition-all ${
                  activeType === type
                    ? "bg-[#1066a3] text-white shadow-md"
                    : "text-[#666666] hover:text-[#1066a3]"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Section - Responsive Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {puien
          .filter((p) => p.category === activeType)
          .map((item) => (
            <Link
              href={`/schuifpuiconfigurator/${item.slug}`}
              key={item.id}
              className="group flex flex-col h-full">
              <div className="relative aspect-[4/3] bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
                {item.best && (
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#1066a3] text-white text-[8px] md:text-[9px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full tracking-widest z-10 uppercase">
                    POPULAIR
                  </div>
                )}
                <div className="w-full h-full flex items-center justify-center">
                  <div style={{ width: item.v > 1.5 ? "100%" : "70%" }}>
                    <svg
                      viewBox={`0 0 ${item.v * 100} 100`}
                      className="w-full h-auto drop-shadow-sm">
                      {item.components}
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-6 text-center">
                <h3 className="font-bold text-[#1a1a1a] text-sm md:text-base group-hover:text-[#1066a3] transition-colors uppercase tracking-tight leading-tight">
                  {item.name}
                </h3>
                <div className="mt-1 md:mt-2 text-[10px] font-bold text-[#1066a3] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                  Stel nu samen →
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
