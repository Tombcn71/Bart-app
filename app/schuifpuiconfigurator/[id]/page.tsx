"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// --- STYLING (BartMooi Style) ---
const COLORS = {
  primary: "#1066a3",
  textDark: "#2d3748",
  textLight: "#666666",
  frame: "#2d3748",
  glass: "#cbd5e1",
};

// --- GROTE SVG COMPONENT VOOR CONFIGURATIE ---
const SlidingDoorDetailSVG = ({ sections }: { sections: 2 | 4 }) => {
  const isFourVaks = sections === 4;
  const width = isFourVaks ? 180 : 90;
  const sectionWidth = width / sections;

  return (
    <svg
      viewBox={`0 0 ${width + 10} 100`}
      className="w-full h-auto drop-shadow-2xl"
      style={{ maxHeight: "400px" }}
      preserveAspectRatio="xMidYMid meet">
      <g transform="translate(5, 10)">
        <rect
          x="0"
          y="0"
          width={width}
          height="80"
          fill="none"
          stroke={COLORS.frame}
          strokeWidth="1.2"
        />

        {sections === 2 ? (
          <>
            <rect
              x="2"
              y="2"
              width={sectionWidth - 3}
              height="76"
              fill="none"
              stroke={COLORS.frame}
              strokeWidth="0.8"
            />
            <g transform={`translate(${sectionWidth / 4}, 38)`}>
              <line
                x1="0"
                y1="0"
                x2="6"
                y2="0"
                stroke={COLORS.glass}
                strokeWidth="0.8"
              />
              <line
                x1="3"
                y1="-3"
                x2="3"
                y2="3"
                stroke={COLORS.glass}
                strokeWidth="0.8"
              />
            </g>
            <rect
              x={sectionWidth + 1}
              y="2"
              width={sectionWidth - 3}
              height="76"
              fill="none"
              stroke={COLORS.frame}
              strokeWidth="0.8"
            />
            <g transform={`translate(${sectionWidth + 15}, 40)`}>
              <line
                x1="0"
                y1="0"
                x2="15"
                y2="0"
                stroke={COLORS.frame}
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="0"
                x2="4"
                y2="-4"
                stroke={COLORS.frame}
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="0"
                x2="4"
                y2="4"
                stroke={COLORS.frame}
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
                    height="76"
                    fill="none"
                    stroke={COLORS.frame}
                    strokeWidth="0.8"
                  />
                  {isFixed ? (
                    <g
                      transform={`translate(${xPos + sectionWidth / 2 - 3}, 38)`}>
                      <line
                        x1="0"
                        y1="0"
                        x2="6"
                        y2="0"
                        stroke={COLORS.glass}
                        strokeWidth="0.8"
                      />
                      <line
                        x1="3"
                        y1="-3"
                        x2="3"
                        y2="3"
                        stroke={COLORS.glass}
                        strokeWidth="0.8"
                      />
                    </g>
                  ) : (
                    <g
                      transform={`translate(${xPos + (isMovingLeft ? 10 : sectionWidth - 25)}, 40)`}>
                      <line
                        x1="0"
                        y1="0"
                        x2="15"
                        y2="0"
                        stroke={COLORS.frame}
                        strokeWidth="1"
                      />
                      <line
                        x1={isMovingLeft ? 0 : 15}
                        y1="0"
                        x2={isMovingLeft ? 4 : 11}
                        y2="-4"
                        stroke={COLORS.frame}
                        strokeWidth="1"
                      />
                      <line
                        x1={isMovingLeft ? 0 : 15}
                        y1="0"
                        x2={isMovingLeft ? 4 : 11}
                        y2="4"
                        stroke={COLORS.frame}
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
    </svg>
  );
};

const getPuiData = (slug: string) => {
  const data = {
    "schuifpui-2-vaks": {
      sections: 2,
      name: "Schuifpui 2-vaks",
      price: "2.450,00",
    },
    "schuifpui-4-vaks": {
      sections: 4,
      name: "Schuifpui 4-vaks",
      price: "4.890,00",
    },
  };
  return data[slug as keyof typeof data] || data["schuifpui-2-vaks"];
};

export default function SchuifpuiDetailPage() {
  const params = useParams();
  const slug = params.id as string;
  const pui = getPuiData(slug);

  return (
    <div className="w-full min-h-screen bg-white font-sans text-slate-600">
      <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-12">
        {/* Breadcrumb */}
        <Link
          href="/schuifpui"
          className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 md:mb-10 inline-block hover:text-[#1066a3] transition-colors">
          ← Terug naar overzicht
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LINKERKANT: VISUALISATIE */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="border-l-4 border-[#1066a3] pl-4 md:pl-6 mb-6 md:mb-8">
              <h1 className="text-xl md:text-3xl font-black uppercase text-slate-800 tracking-tight leading-tight">
                {pui.name}
              </h1>
              <p className="text-[#1066a3] text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                Configuratie
              </p>
            </div>

            <div className="bg-[#f8fafc] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-16 border border-slate-100 flex items-center justify-center min-h-[300px] md:min-h-[550px] shadow-inner relative overflow-hidden">
              <div className="w-full max-w-[600px]">
                <SlidingDoorDetailSVG sections={pui.sections as 2 | 4} />
              </div>

              <div className="absolute bottom-4 md:bottom-8 left-0 right-0 text-center">
                <span className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] md:tracking-[0.4em] text-slate-300 bg-white/80 py-1.5 px-3 md:py-2 md:px-4 rounded-full border border-slate-100">
                  Buitenaanzicht technisch
                </span>
              </div>
            </div>
          </div>

          {/* RECHTERKANT: CONFIGURATIE OPTIES */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-100/50 sticky top-8">
              {/* Prijs Header */}
              <div className="flex justify-between items-center mb-6 md:mb-10 pb-6 md:pb-8 border-b border-slate-50">
                <div>
                  <span className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-1 md:mb-2">
                    Indicatieprijs
                  </span>
                  <div className="flex items-start">
                    <span className="text-xs md:text-sm font-black text-slate-800 mt-1 mr-0.5 md:mr-1">
                      €
                    </span>
                    <span className="text-2xl md:text-4xl font-black text-slate-800 tracking-tighter">
                      {pui.price}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-green-50 text-green-600 text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 rounded-full uppercase tracking-widest mb-1 md:mb-2">
                    Op voorraad
                  </div>
                  <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase">
                    Incl. BTW
                  </span>
                </div>
              </div>

              {/* Maten */}
              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                      Breedte (mm)
                    </label>
                    <input
                      type="number"
                      placeholder="3000"
                      className="w-full border-2 border-slate-100 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50/50 text-sm font-bold focus:border-[#1066a3] focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                      Hoogte (mm)
                    </label>
                    <input
                      type="number"
                      placeholder="2200"
                      className="w-full border-2 border-slate-100 p-3 md:p-4 rounded-xl md:rounded-2xl bg-slate-50/50 text-sm font-bold focus:border-[#1066a3] focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Kleur Selectie */}
                <div className="space-y-3 md:space-y-4">
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                    Kleurprofiel
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 border-2 border-[#1066a3] rounded-xl bg-white text-left">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-[#374151] shadow-inner"></div>
                      <span className="text-[9px] md:text-[10px] font-bold uppercase text-slate-700">
                        RAL 7016
                      </span>
                    </button>
                    <button className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 border-2 border-slate-100 rounded-xl bg-slate-50/50 hover:bg-white transition-colors text-left">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-md bg-white border border-slate-200 shadow-inner"></div>
                      <span className="text-[9px] md:text-[10px] font-bold uppercase text-slate-400">
                        RAL 9010
                      </span>
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-2 md:pt-4">
                  <button className="w-full bg-[#1066a3] text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[10px] md:text-[11px] shadow-lg shadow-[#1066a3]/20 hover:bg-[#0d5486] hover:-translate-y-0.5 transition-all duration-300">
                    Offerte aanvragen
                  </button>
                  <p className="text-center text-[8px] md:text-[9px] text-slate-400 mt-4 md:mt-6 font-bold uppercase tracking-widest leading-relaxed">
                    Gratis inmeten & advies aan huis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
