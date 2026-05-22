"use client";
import React, { useState, useEffect } from "react";
import { saveMatrix } from "@/app/actions";
import { getMatrix } from "@/lib/data"; // Zorg dat deze import klopt

export default function KozijnenPrijzen() {
  const [prijzen, setPrijzen] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Data ophalen uit de database bij het laden (de enige waarheid)
  useEffect(() => {
    async function loadData() {
      const data = await getMatrix("kozijn_matrix");
      if (data) {
        setPrijzen(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!prijzen) return;
    setSaving(true);
    const result = await saveMatrix("kozijn_matrix", prijzen);
    setSaving(false);
    if (result.success) alert("Prijzen succesvol opgeslagen!");
    else alert("Fout bij opslaan.");
  };

  const handleChange = (key: string, value: any, subKey?: string) => {
    if (subKey) {
      setPrijzen((prev: any) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [subKey]: parseFloat(value),
        },
      }));
    } else {
      setPrijzen({ ...prijzen, [key]: parseFloat(value) });
    }
  };

  if (loading)
    return <div className="p-6">Prijzen ophalen uit database...</div>;
  if (!prijzen) return <div className="p-6">Geen prijsgegevens gevonden.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Kozijn & Glas Prijslijst
          </h1>
          <p className="text-slate-500">
            Bart beheert hier de prijzen in de database.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1066a3] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#0d5486] transition-all">
          {saving ? "Opslaan..." : "Alles Opslaan"}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr className="text-xs font-bold text-slate-400 uppercase">
              <th className="py-4 px-6">Optie</th>
              <th className="py-4 px-6 w-40">Prijs / Factor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.entries(prijzen).map(([key, value]: [string, any]) => {
              // Geen vertaallogica. We tonen de key precies zoals deze in de database staat.
              const label = key.replace(/([A-Z])/g, " $1");

              if (typeof value === "object") {
                return (
                  <React.Fragment key={key}>
                    <tr className="bg-slate-50/50">
                      <td
                        colSpan={2}
                        className="py-2 px-6 font-bold text-slate-700 capitalize text-sm">
                        {label}
                      </td>
                    </tr>
                    {Object.entries(value).map(
                      ([subKey, subValue]: [string, any]) => (
                        <tr key={`${key}-${subKey}`}>
                          <td className="py-2 px-6 text-slate-600 capitalize pl-10 text-sm">
                            - {subKey.replace(/-/g, " ")}
                          </td>
                          <td className="py-2 px-6">
                            <input
                              type="number"
                              step="0.01"
                              value={subValue}
                              className="border border-slate-200 rounded-lg px-3 py-1 w-28 text-sm"
                              onChange={(e) =>
                                handleChange(key, e.target.value, subKey)
                              }
                            />
                          </td>
                        </tr>
                      ),
                    )}
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
                      step="0.01"
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
