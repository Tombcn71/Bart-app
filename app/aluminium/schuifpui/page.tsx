"use client";
import { useState } from "react";
import Link from "next/link";
import { InmeetServiceCard } from "@/app/components/InmeetServiceCard";
import { SchuifpuiTweevaks, SchuifpuiViervaks } from "@/lib/schuifpui-svgs";

const puien = [
  { id: 1, category: "2-vaks", slug: "schuifpui-2-vaks", name: "Schuifpui 2-vaks", best: true, v: 2,   components: <SchuifpuiTweevaks /> },
  { id: 2, category: "4-vaks", slug: "schuifpui-4-vaks", name: "Schuifpui 4-vaks", best: true, v: 4,   components: <SchuifpuiViervaks /> },
];

export default function AluSchuifpuiOverzicht() {
  const [activeType, setActiveType] = useState("2-vaks");

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-[#1066a3] pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3">Aluminium schuifpuien</h1>
          <p className="text-[#1066a3] font-medium text-sm md:text-xl uppercase tracking-tighter">Kies uw gewenste indeling</p>
        </div>
        <div className="flex bg-[#f4f7f9] p-1 rounded-xl">
          {["2-vaks", "4-vaks"].map((t) => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-lg transition-all ${activeType === t ? "bg-[#1066a3] text-white shadow-md" : "text-[#666666]"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {puien.filter((p) => p.category === activeType).map((item) => (
          <Link href={`/aluminium/schuifpuiconfigurator/${item.slug}`} key={item.id} className="group flex flex-col h-full">
            <div className="relative aspect-[4/3] bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
              {item.best && (
                <div className="absolute top-3 left-3 bg-[#1066a3] text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest z-10 uppercase">POPULAIR</div>
              )}
              <div style={{ width: item.v > 1.5 ? "100%" : "70%" }}>
                <svg viewBox={`0 0 ${item.v * 100} 160`} className="w-full h-auto">{item.components}</svg>
              </div>
            </div>
            <div className="mt-4 md:mt-6 text-center">
              <h3 className="font-bold text-[#1a1a1a] text-sm md:text-base uppercase tracking-tight">{item.name}</h3>
              <div className="mt-2 text-[10px] font-bold text-[#1066a3] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Stel nu samen →</div>
            </div>
          </Link>
        ))}
        <div className="col-span-full border-t border-slate-100 mt-4" />
        <InmeetServiceCard />
      </div>
    </div>
  );
}
