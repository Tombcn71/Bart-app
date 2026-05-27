"use client";
import React, { useState, useEffect } from "react";
import { saveMatrix } from "@/app/actions";
import { getMatrix } from "@/lib/data";

const BASE_DEFAULTS = {
  basisPrijs: 0, m2Tarief: 0, montageKosten: 0,
  profielToeslag: { "aluprof-mb86": 0, standaard: 0 },
  aanslagToeslag: { ja: 0, nee: 0 },
  typeLakToeslag: { glad: 0, structuur: 0, houtmotief: 0 },
  kleurBuitenzijdeToeslag: { "ral-9016-wit": 0, "ral-7016-antraciet": 0, "ral-9005-zwart": 0, "ral-kleur": 0 },
  kleurBinnenzijdeToeslag: { "ral-9016-wit": 0, "ral-7016-antraciet": 0, "ral-9005-zwart": 0, "ral-kleur": 0 },
  glasToeslag: { "dubbel-glas": 0, "dubbel-glas-gelaagd": 0, "triple-glas": 0 },
  draairichtingToeslag: { "naar-binnen-vouwend": 0, "naar-buiten-vouwend": 0 },
  volgordeToeslag: { "loopdeur-links": 0, "loopdeur-rechts": 0 },
  voorborenToeslag: { "niet-voorboren": 0, voorboren: 0 },
};

type Materiaal = "kunststof" | "aluminium";

export default function HarmonicadeurPrijzenBeheer() {
  const [materiaal, setMateriaal] = useState<Materiaal>("kunststof");
  const [prijzen, setPrijzen] = useState<Record<Materiaal, any>>({
    kunststof: null,
    aluminium: null,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [kData, aData] = await Promise.all([
        getMatrix("harmonicadeur_matrix"),
        getMatrix("alu_harmonicadeur_matrix"),
      ]);
      setPrijzen({
        kunststof: { ...BASE_DEFAULTS, ...(kData && Object.keys(kData).length ? kData : {}) },
        aluminium: { ...BASE_DEFAULTS, ...(aData && Object.keys(aData).length ? aData : {}) },
      });
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const key = materiaal === "kunststof" ? "harmonicadeur_matrix" : "alu_harmonicadeur_matrix";
    const result = await saveMatrix(key, prijzen[materiaal]);
    setSaving(false);
    if (result.success) alert(`${materiaal === "kunststof" ? "Kunststof" : "Aluminium"} prijzen opgeslagen!`);
    else alert("Fout bij opslaan.");
  };

  const handleChange = (key: string, value: any, subKey?: string) => {
    setPrijzen((prev) => {
      const current = { ...prev[materiaal] };
      if (subKey) {
        current[key] = { ...current[key], [subKey]: parseFloat(value) || 0 };
      } else {
        current[key] = parseFloat(value) || 0;
      }
      return { ...prev, [materiaal]: current };
    });
  };

  if (loading) return <div className="p-6">Data laden...</div>;

  const huidig = prijzen[materiaal];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Harmonicadeur Prijslijst</h1>
          <p className="text-slate-500 text-sm">Beheer hier de prijzen voor de harmonicadeur configurator.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1066a3] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#0d5486] transition-all">
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        {(["kunststof", "aluminium"] as Materiaal[]).map((m) => (
          <button
            key={m}
            onClick={() => setMateriaal(m)}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-colors capitalize ${
              materiaal === m
                ? "bg-[#1066a3] text-white shadow-md"
                : "text-slate-500 hover:text-slate-800"
            }`}>
            {m}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr className="text-xs font-bold text-slate-400 uppercase">
              <th className="py-4 px-6">Optie</th>
              <th className="py-4 px-6 w-40">Prijs (€)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {huidig && Object.entries(huidig).map(([key, value]: [string, any]) => {
              const label = key.replace(/([A-Z])/g, " $1");
              if (typeof value === "object") {
                return (
                  <React.Fragment key={key}>
                    <tr className="bg-slate-50/50">
                      <td colSpan={2} className="py-2 px-6 font-bold text-slate-700 capitalize text-sm">
                        {label}
                      </td>
                    </tr>
                    {Object.entries(value).map(([subKey, subValue]: [string, any]) => (
                      <tr key={`${key}-${subKey}`}>
                        <td className="py-2 px-6 text-slate-600 pl-10 text-sm capitalize">
                          {subKey.replace(/-/g, " ")}
                        </td>
                        <td className="py-2 px-6">
                          <input
                            type="number"
                            value={subValue}
                            className="border border-slate-200 rounded-lg px-3 py-1 w-28 text-sm"
                            onChange={(e) => handleChange(key, e.target.value, subKey)}
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }
              return (
                <tr key={key}>
                  <td className="py-4 px-6 font-bold text-slate-800 capitalize text-sm">
                    {label}
                  </td>
                  <td className="py-4 px-6">
                    <input
                      type="number"
                      value={value}
                      className="border border-slate-200 rounded-lg px-3 py-1 w-28 text-sm"
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
