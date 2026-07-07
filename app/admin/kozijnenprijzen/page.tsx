"use client";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { saveMatrix } from "@/app/actions";
import { getMatrix } from "@/lib/data";

const BASE_DEFAULTS = {
  basisPrijs: 0, m2Tarief: { vast: 0, dk: 0, kiep: 0 },
  kleurToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "ral-kleur": 0 },
  kleurBuitenkantToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "basalt-grijs": 0, "kwarts-grijs": 0, zwart: 0 },
  glasToeslag: { "hr-plus-plus": 0, "triple-glas": 0 },
  profielToeslag: { "vlak-82": 0, "creon-82": 0, "creon-verdiept-120": 0, "creon-verdiept-120-hvl": 0 },
  aanslagToeslag: { ja: 0, nee: 0 },
  afstandshouderToeslag: { aluminium: 0, zwart: 0 },
  roedenToeslag: { geen: 0, "6-vaks-18mm": 0, "8-vaks-18mm": 0, "6-vaks-26mm": 0, "8-vaks-26mm": 0 },
  ventilatieRoosterToeslag: { nee: 0, ja: 0 },
  voorborenToeslag: { "niet-voorboren": 0, voorboren: 0 },
};

const KOZIJN_TYPE_LABELS: Record<string, string> = {
  vast: "Vast",
  dk: "Draai-kiep",
  kiep: "Kiep",
};

type Materiaal = "kunststof" | "aluminium";

export default function KozijnenPrijzen() {
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
        getMatrix("kozijn_matrix"),
        getMatrix("alu_kozijn_matrix"),
      ]);
      const fixGlas = (data: any) => {
        const m = { ...BASE_DEFAULTS, ...(data && Object.keys(data).length ? data : {}) };
        m.glasToeslag = Object.fromEntries(
          Object.keys(BASE_DEFAULTS.glasToeslag).map(k => [k, data?.glasToeslag?.[k] ?? 0])
        );
        // Oude data had m2Tarief als los getal; migreer naar per-type tarief.
        m.m2Tarief = typeof data?.m2Tarief === "number"
          ? { vast: data.m2Tarief, dk: data.m2Tarief, kiep: data.m2Tarief }
          : { ...BASE_DEFAULTS.m2Tarief, ...(data?.m2Tarief || {}) };
        return m;
      };
      setPrijzen({ kunststof: fixGlas(kData), aluminium: fixGlas(aData) });
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const key = materiaal === "kunststof" ? "kozijn_matrix" : "alu_kozijn_matrix";
    const result = await saveMatrix(key, prijzen[materiaal]);
    setSaving(false);
    if (result.success) toast.success(`${materiaal === "kunststof" ? "Kunststof" : "Aluminium"} prijzen opgeslagen!`);
    else toast.error("Fout bij opslaan.");
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

  if (loading) return <div className="p-6">Prijzen ophalen...</div>;

  const huidig = prijzen[materiaal];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Kozijn & Glas Prijslijst</h1>
          <p className="text-slate-500 text-sm">Beheer hier de kozijnmatrix prijzen.</p>
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
              <th className="py-4 px-6 w-40">Prijs / Factor</th>
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
                        <td className="py-2 px-6 text-slate-600 capitalize pl-10 text-sm">
                          - {key === "m2Tarief" ? KOZIJN_TYPE_LABELS[subKey] ?? subKey : subKey.replace(/-/g, " ").replace(/creon /gi, "").trim()}
                        </td>
                        <td className="py-2 px-6">
                          <input
                            type="number"
                            step="0.01"
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
