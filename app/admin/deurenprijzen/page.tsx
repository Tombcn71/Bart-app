"use client";
import React, { useState } from "react";

export default function DeurenPrijzenPagina() {
  // We groeperen de matrix in secties voor betere leesbaarheid
  const [deurData, setDeurData] = useState({
    basis: {
      voordeur: 950,
      achterdeur: 880,
      dubbel: 1650,
      zijlichten: 2100,
      borstwering: 1750,
    },
    profiel: { vlak82: 1.0, verdiept120: 1.12, verdiept120hvl: 1.25 },
    dorpels: { alu: 0, kader: -30, dts: 95 },
    m2Tarief: 185,
  });

  const Section = ({
    title,
    data,
    sectionKey,
  }: {
    title: string;
    data: any;
    sectionKey: string;
  }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-black text-slate-800 uppercase text-sm tracking-wide">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between px-6 py-3 border-b border-slate-50 last:border-0">
            <span className="text-sm text-slate-600 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <input
              type="number"
              step="0.01"
              value={value as number}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setDeurData((prev) => ({
                  ...prev,
                  [sectionKey]: {
                    ...(prev[sectionKey as keyof typeof deurData] as any),
                    [key]: val,
                  },
                }));
              }}
              className="border border-slate-200 rounded-lg px-3 py-1 w-28 text-sm text-right font-medium"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Deuren Prijzen</h1>
          <p className="text-slate-500">
            Beheer de tarieven voor alle deurtypen en opties.
          </p>
        </div>
        <button className="bg-[#2cb1e1] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#1fa1cf] transition-all shadow-sm">
          Alle prijzen opslaan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          title="1. Basis Deurtypen"
          data={deurData.basis}
          sectionKey="basis"
        />
        <Section
          title="2. Profiel Multipliers"
          data={deurData.profiel}
          sectionKey="profiel"
        />
        <Section
          title="3. Dorpels & Extra's"
          data={deurData.dorpels}
          sectionKey="dorpels"
        />

        {/* Losse input voor m2 tarief */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-black text-slate-800 mb-2">Grootte Toeslag</h3>
          <p className="text-sm text-slate-500 mb-4">
            Standaard m² tarief voor de berekening.
          </p>
          <input
            type="number"
            value={deurData.m2Tarief}
            onChange={(e) =>
              setDeurData((prev) => ({
                ...prev,
                m2Tarief: parseFloat(e.target.value),
              }))
            }
            className="border border-slate-200 rounded-lg px-4 py-2 w-full font-bold text-lg text-slate-800 focus:ring-2 focus:ring-[#1066a3] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
