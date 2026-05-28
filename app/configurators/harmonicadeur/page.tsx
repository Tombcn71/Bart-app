"use client";
import Link from "next/link";
import { InmeetServiceCard } from "@/app/components/InmeetServiceCard";
import { HarmonicadeurDriedelig, HarmonicadeurVierdelig, HarmonicadeurVijfdelig } from "@/lib/harmonicadeur-svgs";

const deuren = [
  {
    id: 1,
    slug: "driedelig",
    name: "Driedelige harmonicadeur",
    best: true,
    sections: 3,
    component: <HarmonicadeurDriedelig />,
  },
  {
    id: 2,
    slug: "vierdelig",
    name: "Vierdelige harmonicadeur",
    best: true,
    sections: 4,
    component: <HarmonicadeurVierdelig />,
  },
  {
    id: 3,
    slug: "vijfdelig",
    name: "Vijfdelige harmonicadeur",
    best: false,
    sections: 5,
    component: <HarmonicadeurVijfdelig />,
  },
];

export default function HarmonicadeurOverzicht() {
  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-[#1066a3] pl-4 md:pl-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3">
            Kunststof harmonicadeuren
          </h1>
          <p className="text-[#1066a3] font-medium text-sm md:text-xl uppercase tracking-tighter">
            Kies uw gewenste indeling
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {deuren.map((item) => (
          <Link
            href={`/harmonicadeurconfigurator/${item.slug}`}
            key={item.id}
            className="group flex flex-col h-full">
            <div className="relative bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden min-h-[220px]">
              {item.best && (
                <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#1066a3] text-white text-[8px] md:text-[9px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full tracking-widest z-10 uppercase">
                  POPULAIR
                </div>
              )}
              <div className="w-full flex items-center justify-center">
                <div style={{ width: item.sections > 3 ? "100%" : "80%" }}>
                  {item.component}
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
        <div className="col-span-full border-t border-slate-100 mt-4" />
        <InmeetServiceCard />
      </div>
    </div>
  );
}
