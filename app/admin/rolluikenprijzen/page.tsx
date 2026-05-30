"use client";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { saveMatrix } from "@/app/actions";
import { getMatrix } from "@/lib/data";

const DEFAULTS = {
  basisPrijs: 0,
  m2Tarief: 0,
  montageKosten: 0,
  kleurToeslag: { wit: 0, antraciet: 0, "creme-wit": 0, "ral-kleur": 0 },
  bedieningToeslag: { handmatig: 0, elektrisch: 0 },
};

type RolluikType = "rolluik" | "inbouw-rolluik" | "screen";

const TABS: { key: RolluikType; label: string; matrixKey: string }[] = [
  { key: "rolluik",        label: "Rolluik",        matrixKey: "rolluik_matrix" },
  { key: "inbouw-rolluik", label: "Inbouw rolluik",  matrixKey: "inbouw_rolluik_matrix" },
  { key: "screen",         label: "Screen",          matrixKey: "screen_matrix" },
];

export default function RolluikenPrijzen() {
  const [activeTab, setActiveTab] = useState<RolluikType>("rolluik");
  const [data, setData] = useState<Record<RolluikType, any>>({
    "rolluik": null, "inbouw-rolluik": null, "screen": null,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const results = await Promise.all(TABS.map(t => getMatrix(t.matrixKey)));
      const newData = {} as Record<RolluikType, any>;
      TABS.forEach((t, i) => {
        newData[t.key] = { ...DEFAULTS, ...(results[i] && Object.keys(results[i]).length ? results[i] : {}) };
      });
      setData(newData);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const tab = TABS.find(t => t.key === activeTab)!;
    const result = await saveMatrix(tab.matrixKey, data[activeTab]);
    setSaving(false);
    if (result.success) toast.success(`${tab.label} prijzen opgeslagen!`);
    else toast.error("Fout bij opslaan.");
  };

  const handleChange = (key: string, value: any, subKey?: string) => {
    setData(prev => {
      const current = { ...prev[activeTab] };
      if (subKey) current[key] = { ...current[key], [subKey]: parseFloat(value) || 0 };
      else current[key] = parseFloat(value) || 0;
      return { ...prev, [activeTab]: current };
    });
  };

  if (loading) return <div className="p-6">Prijzen ophalen...</div>;

  const huidig = data[activeTab];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Rolluiken Prijslijst</h1>
          <p className="text-slate-500 text-sm">Stel per type de basisprijs en toeslagen in.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="bg-[#1066a3] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#0d5486] transition-all">
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit gap-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-6 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === t.key ? "bg-[#1066a3] text-white shadow-md" : "text-slate-500 hover:text-slate-800"
            }`}>
            {t.label}
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
                      <td colSpan={2} className="py-2 px-6 font-bold text-slate-700 capitalize text-sm">{label}</td>
                    </tr>
                    {Object.entries(value).map(([subKey, subValue]: [string, any]) => (
                      <tr key={`${key}-${subKey}`}>
                        <td className="py-2 px-6 text-slate-600 capitalize pl-10 text-sm">- {subKey.replace(/-/g, " ")}</td>
                        <td className="py-2 px-6">
                          <input type="number" step="0.01" value={subValue}
                            className="border border-slate-200 rounded-lg px-3 py-1 w-28 text-sm"
                            onChange={e => handleChange(key, e.target.value, subKey)} />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              }
              return (
                <tr key={key}>
                  <td className="py-4 px-6 font-bold text-slate-800 capitalize text-sm">{label}</td>
                  <td className="py-4 px-6">
                    <input type="number" step="0.01" value={value}
                      className="border border-slate-200 rounded-lg px-3 py-1 w-28 text-sm"
                      onChange={e => handleChange(key, e.target.value)} />
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
