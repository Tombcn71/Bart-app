"use client";
import React, { useState } from "react";

export default function SchuifpuiPrijzenPagina() {
  const [puiData, setPuiData] = useState({
    basis: { "2-vaks": 1850, "4-vaks": 2950, "Constructie p/m²": 140 },
    profiel: {
      "EvolutionDrive (Factor)": 1.0,
      "EvolutionDrive Plus (Factor)": 1.15,
    },
    glas: {
      "HR++ Dubbel": 90,
      "Dubbel Gelaagd": 165,
      "Triple Gelaagd": 245,
      "Zwarte Afstandshouder": 35,
    },
    kleur: {
      "Wit/Crème (Binnen)": 0,
      "Houtstructuur Wit/Crème (Binnen)": 95,
      "Antraciet (Binnen)": 145,
      "Zwart (Binnen)": 165,
    },
    beslag: {
      "Roeden 6-vaks": 185,
      "Roeden 8-vaks": 245,
      "Rooster Vast Deel": 195,
      "Rooster Alle Delen": 380,
      "Kruk Beide Zijden": 85,
      "Kruk Binnen/Kom Buiten": 115,
    },
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
        <h3 className="font-black text-slate-800 uppercase text-sm">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between px-6 py-3 border-b border-slate-50">
            <span className="text-sm text-slate-600">{key}</span>
            <input
              type="number"
              step="0.01"
              value={value as number}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setPuiData((prev) => ({
                  ...prev,
                  [sectionKey]: {
                    ...(prev[sectionKey as keyof typeof puiData] as any),
                    [key]: val,
                  },
                }));
              }}
              className="border border-slate-200 rounded-lg px-3 py-1 w-24 text-sm text-right font-medium"
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
          <h1 className="text-2xl font-black text-slate-800">
            Schuifpui Prijzen
          </h1>
          <p className="text-slate-500">
            Beheer de tarieven voor de schuifpui-calculator.
          </p>
        </div>
        <button className="bg-[#1066a3] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#0d5485] transition-all">
          Prijzen Opslaan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          title="1. Basis & Profiel"
          data={{ ...puiData.basis, ...puiData.profiel }}
          sectionKey="basis"
        />
        <Section
          title="2. Glas & Opties"
          data={puiData.glas}
          sectionKey="glas"
        />
        <Section
          title="3. Kleuren (Meerprijs Binnen)"
          data={puiData.kleur}
          sectionKey="kleur"
        />
        <Section
          title="4. Beslag & Roeden"
          data={puiData.beslag}
          sectionKey="beslag"
        />
      </div>
    </div>
  );
}
