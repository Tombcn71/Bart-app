"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const COLORS = {
  primary: "#1066a3",
  border: "#e2e8f0",
  text: "#4a5568",
  frame: "#2d3748",
};

// --- SVG DEUR COMPONENTEN (STRICT DESIGN BEHOUDEN) ---
const SingleDoorBase = ({ type }: { type: "voordeur" | "achterdeur" }) => (
  <g transform="translate(20, 5)">
    <rect
      x="0"
      y="0"
      width="60"
      height="90"
      fill="none"
      stroke={COLORS.frame}
      strokeWidth="1"
    />
    {type === "voordeur" ? (
      <>
        <rect
          x="10"
          y="10"
          width="40"
          height="35"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <line
          x1="10"
          y1="27.5"
          x2="50"
          y2="27.5"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <line
          x1="30"
          y1="10"
          x2="30"
          y2="45"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <rect
          x="15"
          y="60"
          width="30"
          height="20"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
      </>
    ) : (
      <>
        <rect
          x="5"
          y="5"
          width="50"
          height="80"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
        <path
          d="M5 5 L55 45 L5 85"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="0.6"
          strokeDasharray="1.5,1.5"
        />
      </>
    )}
    <circle cx="56" cy="45" r="1.5" fill={COLORS.frame} />
  </g>
);

const DoubleDoorBase = ({ hasSideLights = false, hasPlinth = false }) => {
  const width = hasSideLights ? 180 : 100;
  return (
    <g transform="translate(5, 5)">
      <rect
        x="0"
        y="0"
        width={width - 10}
        height="90"
        fill="none"
        stroke={COLORS.frame}
        strokeWidth="1"
      />
      {hasSideLights && (
        <>
          <line
            x1="40"
            y1="0"
            x2="40"
            y2="90"
            stroke={COLORS.frame}
            strokeWidth="1"
          />
          <line
            x1="130"
            y1="0"
            x2="130"
            y2="90"
            stroke={COLORS.frame}
            strokeWidth="1"
          />
          <line
            x1="15"
            y1="45"
            x2="25"
            y2="45"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <line
            x1="145"
            y1="45"
            x2="155"
            y2="45"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
        </>
      )}
      <g transform={hasSideLights ? "translate(40, 0)" : "translate(0, 0)"}>
        <rect
          x="0"
          y="0"
          width="90"
          height="90"
          fill="none"
          stroke={COLORS.frame}
          strokeWidth="1"
        />
        <line
          x1="45"
          y1="0"
          x2="45"
          y2="90"
          stroke={COLORS.frame}
          strokeWidth="1"
        />
        <path
          d="M5 5 L40 45 L5 85"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="0.6"
          strokeDasharray="1.5,1.5"
        />
        <path
          d="M85 5 L50 45 L85 85"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="0.6"
          strokeDasharray="1.5,1.5"
        />
        {hasPlinth && (
          <line
            x1="0"
            y1="65"
            x2="90"
            y2="65"
            stroke={COLORS.frame}
            strokeWidth="1"
          />
        )}
        <circle cx="42" cy="45" r="1.2" fill={COLORS.frame} />
        <circle cx="48" cy="45" r="1.2" fill={COLORS.frame} />
      </g>
    </g>
  );
};

const getDeurData = (slug: string) => {
  const data = [
    {
      slug: "voordeur",
      v: 1,
      name: "Voordeur",
      components: <SingleDoorBase type="voordeur" />,
    },
    {
      slug: "achterdeur",
      v: 1,
      name: "Achterdeur",
      components: <SingleDoorBase type="achterdeur" />,
    },
    {
      slug: "dubbele-deur",
      v: 1,
      name: "Dubbele deur",
      components: <DoubleDoorBase />,
    },
    {
      slug: "dubbele-deur-zijlichten",
      v: 1.8,
      name: "Dubbele deur met zijlichten",
      components: <DoubleDoorBase hasSideLights />,
    },
    {
      slug: "dubbele-deur-borstwering",
      v: 1,
      name: "Dubbele deur met borstwering",
      components: <DoubleDoorBase hasPlinth />,
    },
  ];
  return data.find((d) => d.slug === slug) || data[0];
};

export default function DeurConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "voordeur";
  const deur = getDeurData(slug);

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-10 font-sans text-slate-600">
        {/* Back button: Always top */}
        <Link
          href="/deuren"
          className="inline-flex items-center text-[10px] sm:text-[11px] font-medium text-slate-400 mb-6 hover:text-[#1066a3] transition-colors uppercase tracking-wider">
          ← Terug naar deurenoverzicht
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* VISUALISATIE: Order 1 op mobiel & desktop */}
          <div className="lg:col-span-7 flex flex-col w-full">
            <h1 className="text-xl md:text-2xl font-bold uppercase text-slate-800 mb-6 tracking-tight border-l-4 border-[#1066a3] pl-4">
              {deur.name}
            </h1>

            <div className="w-full bg-slate-50/50 rounded-2xl border border-slate-100 p-4 sm:p-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] shadow-inner overflow-hidden">
              <svg
                viewBox={`0 0 ${deur.v * 100} 100`}
                className="w-full h-auto drop-shadow-xl"
                style={{ maxHeight: "450px" }}
                preserveAspectRatio="xMidYMid meet">
                {deur.components}
              </svg>
            </div>
            <p className="mt-4 sm:mt-6 text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em] sm:tracking-[0.3em] text-center">
              Buitenaanzicht technische tekening
            </p>
          </div>

          {/* FORMULIER: Order 2 op mobiel & desktop */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-sm">
              <div className="flex justify-between items-end mb-6 sm:mb-8 border-b border-slate-50 pb-6">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">
                    Vanaf prijs
                  </span>
                  <span className="text-2xl sm:text-3xl text-slate-800 font-black">
                    € 895,00
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-[#1066a3] font-bold uppercase tracking-wider pb-1">
                  Incl. BTW & Montage
                </span>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {/* Maten: Stacked on tiny screens, side-by-side on rest */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-tight">
                      Breedte (mm)
                    </label>
                    <input
                      type="number"
                      placeholder="bijv. 900"
                      className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-[#1066a3]/20 outline-none transition-all bg-slate-50/30 text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-tight">
                      Hoogte (mm)
                    </label>
                    <input
                      type="number"
                      placeholder="bijv. 2100"
                      className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-[#1066a3]/20 outline-none transition-all bg-slate-50/30 text-sm font-bold"
                    />
                  </div>
                </div>

                {/* Opties */}
                <div className="space-y-3">
                  <label className="text-[10px] text-slate-500 uppercase font-black tracking-tight">
                    Configuratie & Kleur
                  </label>
                  <div className="relative">
                    <select className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer pr-10">
                      <option>Draairichting: Naar binnen draaiend</option>
                      <option>Draairichting: Naar buiten draaiend</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                  <div className="relative">
                    <select className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer pr-10">
                      <option>Kleur: RAL 7016 Antraciet (Houtlook)</option>
                      <option>Kleur: RAL 9010 Zuiver Wit</option>
                      <option>Kleur: RAL 9001 Crèmewit</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                  <div className="relative">
                    <select className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer pr-10">
                      <option>Beslag: SKG*** Veiligheidspakket</option>
                      <option>Beslag: RVS deurgreep recht</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Actie knop */}
                <div className="pt-2">
                  <button className="w-full bg-[#1066a3] hover:bg-[#0d5486] text-white py-4 sm:py-5 px-6 rounded-xl shadow-lg shadow-[#1066a3]/20 transition-all text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">
                    Stel mijn {deur.name.toLowerCase()} samen
                  </button>
                </div>

                <p className="text-[9px] text-slate-400 text-center font-medium leading-relaxed uppercase tracking-tighter sm:tracking-normal">
                  Onze adviseurs nemen binnen 24 uur contact op{" "}
                  <br className="hidden sm:block" />
                  voor een definitieve inmeting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
