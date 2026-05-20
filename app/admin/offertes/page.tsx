"use client";
import React, { useState } from "react";

export default function OffertesPagina() {
  const [offertes] = useState([
    {
      id: "OFF-2026-001",
      klant: "Jan de Vries",
      type: "Kozijnen",
      status: "Nieuw",
      datum: "20 mei 2026",
      bedrag: "€ 2.450",
    },
    {
      id: "OFF-2026-002",
      klant: "Pieter Bakker",
      type: "Schuifpui",
      status: "In behandeling",
      datum: "19 mei 2026",
      bedrag: "€ 4.100",
    },
    {
      id: "OFF-2026-003",
      klant: "Anja Meijer",
      type: "Deuren",
      status: "Verzonden",
      datum: "18 mei 2026",
      bedrag: "€ 1.850",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Offertes</h1>
          <p className="text-sm text-slate-500">
            Beheer al je klantoffertes op één plek.
          </p>
        </div>
        <button className="bg-[#1066a3] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0d5485] transition-colors">
          + Nieuwe Offerte
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Klant</th>
              <th className="py-4 px-6">Type</th>
              <th className="py-4 px-6">Bedrag</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {offertes.map((offerte) => (
              <tr key={offerte.id} className="hover:bg-slate-50/50">
                <td className="py-4 px-6 font-bold text-slate-800">
                  {offerte.id}
                </td>
                <td className="py-4 px-6">{offerte.klant}</td>
                <td className="py-4 px-6">{offerte.type}</td>
                <td className="py-4 px-6">{offerte.bedrag}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                    {offerte.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-[#1066a3] font-bold cursor-pointer hover:underline">
                  Bewerken
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
