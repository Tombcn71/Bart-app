"use client";
import React, { useState } from "react";

export default function AdminDashboard() {
  const [offertes] = useState([
    {
      id: "OFF-2026-001",
      klant: "Jan de Vries",
      type: "Kozijnen",
      status: "Nieuw",
      datum: "20 mei 2026",
    },
    {
      id: "OFF-2026-002",
      klant: "Pieter Bakker",
      type: "Schuifpui",
      status: "In behandeling",
      datum: "19 mei 2026",
    },
    {
      id: "OFF-2026-003",
      klant: "Anja Meijer",
      type: "Deuren",
      status: "Verzonden",
      datum: "18 mei 2026",
    },
    {
      id: "OFF-2026-004",
      klant: "Bart Schouten",
      type: "Kozijnen",
      status: "Nieuw",
      datum: "17 mei 2026",
    },
  ]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      {/* MAIN CONTENT - ZONDER SIDEBAR */}
      <main className="max-w-7xl mx-auto flex flex-col gap-8">
        <header className="bg-white border border-gray-200 rounded-2xl px-8 py-6 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Dashboard
            </h1>
          </div>
          <a
            href="https://offerte.budgetkozijnenshop.nl/"
            target="_blank"
            className="bg-[#2cb1e1] hover:bg-[#1fa1cf] text-white px-5 py-2.5 rounded-xl font-bold text-sm">
            Bekijk App ↗
          </a>
        </header>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Nieuwe Leads
                </p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">21</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Totaal Offertes
                </p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">148</h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Geconverteerd
                </p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">64%</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <tbody className="text-sm divide-y divide-slate-100 text-slate-600 font-medium">
                  {offertes.map((offerte) => (
                    <tr key={offerte.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {offerte.id}
                      </td>
                      <td className="py-4 px-6">{offerte.klant}</td>
                      <td className="py-4 px-6">{offerte.type}</td>
                      <td className="py-4 px-6">{offerte.datum}</td>
                      <td className="py-4 px-6">{offerte.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
