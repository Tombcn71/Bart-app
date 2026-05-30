"use client";
import { useState } from "react";
import Link from "next/link";
import { InmeetServiceCard } from "@/app/components/InmeetServiceCard";
import { InzethorSVG, KlemhorSVG } from "@/lib/hor-svgs";

const horren = [
  {
    id: 1,
    slug: "inzethor",
    name: "Inzethor",
    best: true,
    description: "Wordt ingezet in het kozijn — geen boren of schroeven nodig.",
    component: <InzethorSVG />,
  },
  {
    id: 2,
    slug: "klemhor",
    name: "Klemhor",
    best: false,
    description: "Wordt vastgeklemd aan het kozijn met klembeugels aan de zijkant.",
    component: <KlemhorSVG />,
  },
];

export default function HorrenOverzicht() {
  const [activeType, setActiveType] = useState<string | null>(null);

  const zichtbaar = activeType ? horren.filter(h => h.slug === activeType) : horren;

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-[#1066a3] pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3 tracking-tight">
            Kunststof horren
          </h1>
          <p className="text-[#1066a3] font-medium text-sm md:text-xl uppercase tracking-tighter">
            Kies uw hortype
          </p>
        </div>
        <div className="flex bg-[#f4f7f9] p-1 rounded-xl">
          {["inzethor", "klemhor"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(activeType === t ? null : t)}
              className={`px-6 md:px-8 py-2.5 md:py-3 text-xs md:text-sm font-bold rounded-lg transition-all capitalize ${
                activeType === t ? "bg-[#1066a3] text-white shadow-md" : "text-[#666666]"
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {zichtbaar.map((item) => (
          <Link href={`/horrenconfigurateur/${item.slug}`} key={item.id} className="group flex flex-col h-full">
            <div className="relative aspect-[3/4] bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
              {item.best && (
                <div className="absolute top-3 left-3 bg-[#1066a3] text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest z-10 uppercase">POPULAIR</div>
              )}
              <div style={{ width: "60%" }}>
                {item.component}
              </div>
            </div>
            <div className="mt-3 px-1">
              <p className="font-bold text-[#2d3748] text-sm md:text-base">{item.name}</p>
              <p className="text-xs text-slate-500 mt-1">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16">
        <InmeetServiceCard />
      </div>
    </div>
  );
}
