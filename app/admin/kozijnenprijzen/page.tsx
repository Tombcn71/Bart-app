"use client";
import React, { useState } from "react";

export default function KozijnenPrijzen() {
  const [prijzen, setPrijzen] = useState({
    kunststof: 280,
    vast: 0.7,
    dk: 1.0,
    kiep: 0.95,
    hr2: 120,
    triple: 180,
    wit: 0,
    antraciet: 50,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800">
          Kozijn & Glas Prijslijst
        </h1>
        <p className="text-slate-500">Beheer de tarieven voor de calculator.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr className="text-xs font-bold text-slate-400 uppercase">
              <th className="py-4 px-6">Optie</th>
              <th className="py-4 px-6">Prijs / Factor</th>
              <th className="py-4 px-6">Actie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Object.entries(prijzen).map(([key, value]) => (
              <tr key={key}>
                <td className="py-4 px-6 font-bold text-slate-800 capitalize">
                  {key}
                </td>
                <td className="py-4 px-6">
                  <input
                    type="number"
                    value={value}
                    className="border rounded-lg px-3 py-1 w-24"
                    onChange={(e) =>
                      setPrijzen({
                        ...prijzen,
                        [key]: parseFloat(e.target.value),
                      })
                    }
                  />
                </td>
                <td className="py-4 px-6">
                  <button className="text-[#1066a3] font-bold text-sm">
                    Opslaan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
