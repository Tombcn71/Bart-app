"use client";
import { useState } from "react";
import Link from "next/link";
import { SchuifpuiTweevaks, SchuifpuiViervaks } from "@/lib/schuifpui-svgs";
import { KozijnTechnisch, TECHNISCH } from "@/app/components/KozijnTechnisch";
import { PUI_KUNSTSTOF_BEGINMATEN } from "@/lib/schuifpui";

export default function SchuifpuiOverview() {
  const [activeType, setActiveType] = useState("2-vaks");

  const puien = [
    {
      id: 1,
      category: "2-vaks",
      slug: "schuifpui-2-vaks",
      name: "Schuifpui 2-vaks",
      best: true,
      v: 2,
      components: <SchuifpuiTweevaks />,
    },
    {
      id: 2,
      category: "4-vaks",
      slug: "schuifpui-4-vaks",
      name: "Schuifpui 4-vaks",
      best: true,
      v: 4,
      components: <SchuifpuiViervaks />,
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      {/* Header Section - Mobile Optimized */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-brand pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3 tracking-tight">
            Kunststof schuifpuien
          </h1>
          <p className="text-brand-text font-medium text-sm md:text-xl uppercase tracking-tighter">
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
                    ? "bg-brand text-white shadow-md"
                    : "text-[#666666] hover:text-brand-text"
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
              <div className={`relative aspect-[4/3] ${TECHNISCH[item.slug] ? "bg-slate-50" : "bg-white"} border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden`}>
                {item.best && (
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-brand text-white text-[8px] md:text-[9px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full tracking-widest z-10 uppercase">
                    POPULAIR
                  </div>
                )}
                <div className="w-full h-full flex items-center justify-center">
                  {TECHNISCH[item.slug] ? (
                    // De nieuwe technische tekening, in de verhoudingen van de beginmaat van dit type.
                    <KozijnTechnisch
                      breedte={(PUI_KUNSTSTOF_BEGINMATEN[item.slug] ?? [2500, 2200])[0]}
                      hoogte={(PUI_KUNSTSTOF_BEGINMATEN[item.slug] ?? [2500, 2200])[1]}
                      spec={TECHNISCH[item.slug]}
                      maten={false}
                      className="h-full max-w-full"
                    />
                  ) : (
                    <div style={{ width: item.v > 1.5 ? "100%" : "70%" }}>
                      <svg
                        viewBox={`0 0 ${item.v * 100} 160`}
                        className="w-full h-auto drop-shadow-sm">
                        {item.components}
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-6 text-center">
                <h3 className="font-bold text-[#1a1a1a] text-sm md:text-base group-hover:text-brand-text transition-colors uppercase tracking-tight leading-tight">
                  {item.name}
                </h3>
                <div className="mt-1 md:mt-2 text-[10px] font-bold text-brand-text opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                  Stel nu samen →
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
