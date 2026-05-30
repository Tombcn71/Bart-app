"use client";
import { useState } from "react";
import Link from "next/link";
import { InmeetServiceCard } from "@/app/components/InmeetServiceCard";
import { RolluikSVG, InbouwRolluikSVG, ScreenSVG } from "@/lib/rolluik-svgs";

const producten = [
  {
    id: 1,
    slug: "rolluik",
    name: "Rolluik",
    best: true,
    description: "Opbouw rolluik met zichtbare kast bovenaan het kozijn.",
    component: <RolluikSVG />,
  },
  {
    id: 2,
    slug: "inbouw-rolluik",
    name: "Inbouw rolluik",
    best: true,
    description: "Kast verborgen in de muur — strak en volledig geïntegreerd.",
    component: <InbouwRolluikSVG />,
  },
  {
    id: 3,
    slug: "screen",
    name: "Screen",
    best: false,
    description: "Transparant zonnescherm dat licht filtert en inkijk beperkt.",
    component: <ScreenSVG />,
  },
];

export default function RolluikenOverzicht() {
  const [activeType, setActiveType] = useState<string | null>(null);
  const zichtbaar = activeType ? producten.filter(p => p.slug === activeType) : producten;

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-[#1066a3] pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3 tracking-tight">
            Rolluiken &amp; screens
          </h1>
          <p className="text-[#1066a3] font-medium text-sm md:text-xl uppercase tracking-tighter">
            Kies uw type
          </p>
        </div>
        <div className="flex bg-[#f4f7f9] p-1 rounded-xl flex-wrap gap-1">
          {producten.map(p => (
            <button
              key={p.slug}
              onClick={() => setActiveType(activeType === p.slug ? null : p.slug)}
              className={`px-4 py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${
                activeType === p.slug ? "bg-[#1066a3] text-white shadow-md" : "text-[#666666]"
              }`}>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {zichtbaar.map((item) => (
          <Link href={`/rolluikconfigurator/${item.slug}`} key={item.id} className="group flex flex-col h-full">
            <div className="relative aspect-square bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
              {item.best && (
                <div className="absolute top-3 left-3 bg-[#1066a3] text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest z-10 uppercase">POPULAIR</div>
              )}
              <div style={{ width: "70%" }}>
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
