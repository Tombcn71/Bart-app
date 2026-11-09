"use client";
import { useState } from "react";
import Link from "next/link";
import { KozijnTechnisch, TECHNISCH } from "@/app/components/KozijnTechnisch";

// Alleen de aluminium schuifpui die er in de prijzen echt is.
const puien = [
  { id: 1, category: "2-vaks", slug: "schuifpui", name: "Schuifpui", best: true, v: 2 },
];
const uitvoeringen = Array.from(new Set(puien.map((p) => p.category)));

export default function AluSchuifpuiOverzicht() {
  const [activeType, setActiveType] = useState("2-vaks");

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-brand pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3">Aluminium schuifpuien</h1>
          <p className="text-brand-text font-medium text-sm md:text-xl uppercase tracking-tighter">Kies uw gewenste indeling</p>
        </div>
        {/* Bij één uitvoering is een wisselknop overbodig. */}
        {uitvoeringen.length > 1 && (
          <div className="flex bg-[#f4f7f9] p-1 rounded-xl">
            {uitvoeringen.map((t) => (
              <button key={t} onClick={() => setActiveType(t)}
                className={`px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-lg transition-all ${activeType === t ? "bg-brand text-white shadow-md" : "text-[#666666]"}`}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {puien.filter((p) => p.category === activeType).map((item) => (
          <Link href={`/aluminium/schuifpuiconfigurator/${item.slug}`} key={item.id} className="group flex flex-col h-full">
            <div className="relative aspect-[4/3] bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
              {item.best && (
                <div className="absolute top-3 left-3 bg-brand text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest z-10 uppercase">POPULAIR</div>
              )}
              <KozijnTechnisch
                breedte={item.v > 2 ? 3500 : 2000}
                hoogte={2000}
                spec={TECHNISCH[item.slug]}
                maten={false}
                className="h-full max-w-full"
              />
            </div>
            <div className="mt-4 md:mt-6 text-center">
              <h3 className="font-bold text-[#1a1a1a] text-sm md:text-base uppercase tracking-tight">{item.name}</h3>
              <div className="mt-2 text-[10px] font-bold text-brand-text opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Stel nu samen →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
