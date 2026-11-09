"use client";
import { useState } from "react";
import Link from "next/link";
import { Wrench, Recycle, Building2, Sparkles } from "lucide-react";

import { KozijnTechnisch, TECHNISCH } from "@/app/components/KozijnTechnisch";
import { DEUR_ALU_BEGINMATEN } from "@/lib/deuren-alu";

// De aluminium deuren zoals Creon ze aanbiedt: negen typen.
const deuren = [
  { id: 1, category: "Enkele deur", slug: "aluminium-deur", name: "Deur", best: true },
  { id: 2, category: "Enkele deur", slug: "aluminium-deur-met-zijlicht", name: "Deur met zijlicht", best: true },
  { id: 3, category: "Enkele deur", slug: "aluminium-deur-met-zijlichten", name: "Deur met twee zijlichten", best: false },
  { id: 4, category: "Enkele deur", slug: "aluminium-deur-2-vaks", name: "Deur met borstwering (2 vaks)", best: false },
  { id: 5, category: "Enkele deur", slug: "aluminium-deur-3vaks", name: "Deur, 3 vaks", best: false },
  { id: 6, category: "Enkele deur", slug: "aluminium-deur-met-zijlicht-met-borstwering", name: "Deur met zijlicht en borstwering", best: false },
  { id: 7, category: "Dubbele deur", slug: "aluminium-dubbele-deur", name: "Dubbele deur", best: true },
  { id: 8, category: "Dubbele deur", slug: "aluminium-dubbele-deur-2-vaks", name: "Dubbele deur met borstwering (2 vaks)", best: false },
  { id: 9, category: "Dubbele deur", slug: "aluminium-dubbele-deur-met-zijlichten", name: "Dubbele deur met zijlichten", best: false },
];

export default function AluDeurenOverzicht() {
  const [activeType, setActiveType] = useState("Enkele deur");

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-brand pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3">
            Aluminium deuren
          </h1>
          <p className="text-brand-text font-medium text-sm md:text-xl uppercase tracking-tighter">
            Kies uw gewenste indeling
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
                  activeType === type ? "bg-brand text-white shadow-md" : "text-[#666666]"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {deuren.filter((d) => d.category === activeType).map((item) => (
          <Link href={`/aluminium/deurconfigurator/${item.slug}`} key={item.id} className="group flex flex-col h-full">
            <div className="relative bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden min-h-[220px]">
              {item.best && (
                <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-brand text-white text-[8px] md:text-[9px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full tracking-widest z-10 uppercase">
                  POPULAIR
                </div>
              )}
              <div className="flex h-56 w-full items-center justify-center">
                <KozijnTechnisch
                  breedte={(DEUR_ALU_BEGINMATEN[item.slug] ?? [900, 2200])[0]}
                  hoogte={(DEUR_ALU_BEGINMATEN[item.slug] ?? [900, 2200])[1]}
                  spec={TECHNISCH[item.slug]}
                  maten={false}
                  className="h-full max-w-full"
                />
              </div>
            </div>
            <div className="mt-4 md:mt-6 text-center">
              <h3 className="font-bold text-[#1a1a1a] text-sm md:text-base uppercase tracking-tight leading-tight">
                {item.name}
              </h3>
              <div className="mt-1 md:mt-2 text-[10px] font-bold text-brand-text uppercase tracking-widest lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                Stel nu samen →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
