"use client";
import { useState } from "react";
import Link from "next/link";
import { InmeetServiceCard } from "@/app/components/InmeetServiceCard";
import {
  GlassVast, GlassDK, GlassKiep, GlassVastBovenlichtKiep, GlassDkBovenlichtVast,
  GlassDkBovenlichtKiep, GlassDkBorstweringVast, GlassKiepKiep, GlassDkDkStolpBovenlichtVast,
  GlassDkVastBovenlichtenVast, GlassDkBovenlichtKiepVast, GlassVastBovenlichtKiepVast,
  GlassDkBovenlichtVastVast, GlassDkVastVastKozijn, GlassDkDkDkKozijn,
  GlassDkVastDkBovenlichtenVast, GlassVastDkVastBovenlichtenVast,
} from "@/lib/kozijn-svgs";

const kozijnen = [
  { id: 1,  v: 1, slug: "vast-kozijn",                            name: "Vast kozijn",                              best: true,  components: [<GlassVast key="1" x={0} />] },
  { id: 2,  v: 1, slug: "draai-kiep-kozijn",                      name: "Draai kiep kozijn",                        best: true,  components: [<GlassDK key="1" x={0} />] },
  { id: 3,  v: 1, slug: "kiep-kozijn",                            name: "Kiep kozijn",                              best: true,  components: [<GlassKiep key="1" x={0} />] },
  { id: 4,  v: 1, slug: "vast-bovenlicht-kiep",                   name: "Vast met bovenlicht kiep",                 best: false, components: [<GlassVastBovenlichtKiep key="1" x={0} />] },
  { id: 5,  v: 1, slug: "dk-bovenlicht-vast",                     name: "Draai/kiep met bovenlicht vast",           best: false, components: [<GlassDkBovenlichtVast key="1" x={0} />] },
  { id: 6,  v: 1, slug: "dk-bovenlicht-kiep",                     name: "Draai/kiep met bovenlicht kiep",           best: false, components: [<GlassDkBovenlichtKiep key="1" x={0} />] },
  { id: 7,  v: 1, slug: "dk-borstwering-vast",                    name: "Draai/kiep met borstwering",               best: false, components: [<GlassDkBorstweringVast key="1" x={0} />] },
  { id: 8,  v: 2, slug: "draai-kiep-vast-kozijn",                 name: "Draai kiep - Vast",                        best: true,  components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />] },
  { id: 9,  v: 2, slug: "draai-kiep-draai-stolp-kozijn",          name: "Draai kiep - Draai kiep",                 best: true,  components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} mirror />] },
  { id: 10, v: 2, slug: "vast-vast-kozijn",                       name: "Vast - Vast",                              best: true,  components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />] },
  { id: 11, v: 2, slug: "kiep-kiep-kozijn",                       name: "Kiep - Kiep",                              best: false, components: [<GlassKiepKiep key="1" x={0} />] },
  { id: 12, v: 2, slug: "dk-dk-stolp-bovenlicht-vast-2vaks",      name: "Draai/kiep - draai stolp met bovenlicht",  best: false, components: [<GlassDkDkStolpBovenlichtVast key="1" x={0} />] },
  { id: 13, v: 2, slug: "dk-vast-bovenlichten-vast-2vaks",        name: "Draai/kiep - vast met bovenlichten",       best: false, components: [<GlassDkVastBovenlichtenVast key="1" x={0} />] },
  { id: 14, v: 2, slug: "dk-bovenlicht-kiep-vast-2vaks",          name: "Draai/kiep bovenlicht kiep - vast",        best: false, components: [<GlassDkBovenlichtKiepVast key="1" x={0} />] },
  { id: 15, v: 2, slug: "vast-bovenlicht-kiep-vast-2vaks",        name: "Vast bovenlicht kiep - vast",              best: false, components: [<GlassVastBovenlichtKiepVast key="1" x={0} />] },
  { id: 16, v: 2, slug: "dk-bovenlicht-vast-vast-2vaks",          name: "Draai/kiep bovenlicht vast - vast",        best: false, components: [<GlassDkBovenlichtVastVast key="1" x={0} />] },
  { id: 17, v: 3, slug: "draai-kiep-vast-draai-kiep-kozijn",      name: "Draai kiep - Vast - Draai kiep",           best: true,  components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassDK key="3" x={200} mirror />] },
  { id: 18, v: 3, slug: "vast-vast-vast-kozijn",                  name: "Vast - Vast - Vast",                       best: true,  components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />] },
  { id: 19, v: 3, slug: "vast-draai-kiep-vast-kozijn",            name: "Vast - Draai kiep - Vast",                 best: true,  components: [<GlassVast key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassVast key="3" x={200} />] },
  { id: 20, v: 3, slug: "draai-kiep-vast-vast-kozijn",            name: "Draai/kiep - Vast - Vast",                 best: false, components: [<GlassDkVastVastKozijn key="1" x={0} />] },
  { id: 21, v: 3, slug: "draai-kiep-draai-kiep-draai-kiep-kozijn",name: "Draai/kiep - Draai/kiep - Draai/kiep",    best: false, components: [<GlassDkDkDkKozijn key="1" x={0} />] },
  { id: 22, v: 3, slug: "draai-kiep-vast-dk-bovenlichten-vast",   name: "Draai/kiep - Vast - Draai/kiep bovenlicht",best: false, components: [<GlassDkVastDkBovenlichtenVast key="1" x={0} />] },
  { id: 23, v: 3, slug: "vast-dk-vast-bovenlichten-vast",         name: "Vast - Draai/kiep - Vast bovenlichten",    best: false, components: [<GlassVastDkVastBovenlichtenVast key="1" x={0} />] },
  { id: 24, v: 4, slug: "draai-kiep-vast-vast-draai-kiep-kozijn", name: "Draai kiep - Vast - Vast - Draai kiep",    best: true,  components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />, <GlassDK key="4" x={300} mirror />] },
  { id: 25, v: 4, slug: "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn", name: "4x Draai kiep", best: true, components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassDK key="3" x={200} />, <GlassDK key="4" x={300} />] },
];

const COLORS = { primary: "#1066a3", textDark: "#2d3748" };

export default function AluKozijnenOverzicht() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="max-w-[1200px] mx-auto p-8 md:p-16 font-sans bg-white min-h-screen">
      <div className="mb-12 border-l-4 border-[#1066a3] pl-6">
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">Aluminium kozijnen</h1>
        <p className="text-[#1066a3] font-medium text-xl uppercase tracking-tighter">Kies uw gewenste indeling</p>
      </div>

      <div className="flex justify-start mb-12">
        <div className="flex bg-[#f4f7f9] p-1.5 rounded-xl">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setActiveTab(n)}
              className={`px-8 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === n ? "bg-[#1066a3] text-white shadow-md" : "text-[#666666] hover:text-[#1066a3]"}`}>
              {n} {n === 1 ? "vak" : "vakken"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {kozijnen.filter((k) => k.v === activeTab).map((item) => (
          <Link href={`/aluminium/kozijnconfigurator/${item.slug}`} key={item.id} className="group">
            <div className="relative h-[280px] bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-8 shadow-sm">
              {item.best && (
                <div className="absolute top-4 left-4 bg-[#1066a3] text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest z-10 uppercase">
                  POPULAIR
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center">
                <div style={{ width: `${item.v * 20 + 20}%`, maxWidth: "100%" }}>
                  <svg viewBox={`0 0 ${item.v * 100} 100`} className="w-full h-auto">
                    <rect x="0.5" y="0.5" width={item.v * 100 - 1} height="99" fill="none" stroke={COLORS.textDark} strokeWidth="1" />
                    {Array.from({ length: item.v - 1 }).map((_, i) => (
                      <line key={i} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="100" stroke={COLORS.textDark} strokeWidth="1" />
                    ))}
                    {item.components}
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="mt-6 text-center font-bold text-[#1a1a1a] text-base group-hover:text-[#1066a3] transition-colors uppercase tracking-tight">
              {item.name}
            </h3>
            <div className="mt-2 text-center text-[10px] font-bold text-[#1066a3] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
              Bekijk configurator →
            </div>
          </Link>
        ))}
        <div className="col-span-full border-t border-slate-100 mt-4" />
        <InmeetServiceCard />
      </div>
    </div>
  );
}
