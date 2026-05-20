"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  // Voorbeeld data voor de tabel (straks live uit Neon!)
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

  const [isProductenOpen, setIsProductenOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#1066a3] to-[#2cb1e1] text-white flex flex-col shrink-0 shadow-xl">
        {/* Logo Sectie */}
        <div className="p-6 bg-white border-b border-gray-100 flex justify-center items-center h-24">
          <img
            src="/bartmooi-logo-1.png"
            alt="BartMooi Logo"
            className="max-h-[50px] w-auto object-contain"
          />
        </div>

        {/* Navigatie Links */}
        <nav className="flex-1 p-4 space-y-2 text-sm font-semibold">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>

          <Link
            href="/offertes"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Offertes
          </Link>

          {/* Dropdown Menu: Producten / Prijzen */}
          <div>
            <button
              onClick={() => setIsProductenOpen(!isProductenOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span>Producten</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isProductenOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isProductenOpen && (
              <div className="mt-1 ml-6 pl-4 border-l border-white/20 space-y-1">
                <Link
                  href="/prijzen"
                  className="block px-4 py-2 text-sm rounded-lg hover:bg-white/10 opacity-90 hover:opacity-100">
                  Kozijnen Prijzen
                </Link>
                <Link
                  href="/prijzen/deuren"
                  className="block px-4 py-2 text-sm rounded-lg hover:bg-white/10 opacity-90 hover:opacity-100">
                  Deuren Prijzen
                </Link>
                <Link
                  href="/prijzen/schuifpui"
                  className="block px-4 py-2 text-sm rounded-lg hover:bg-white/10 opacity-90 hover:opacity-100">
                  Schuifpui Prijzen
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Bottom User info */}
        <div className="p-4 border-t border-white/10 bg-black/10 text-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
            B
          </div>
          <div>
            <p className="font-bold leading-tight">BartMooi Beheer</p>
            <p className="opacity-60 text-[10px]">Ingelogd als Admin</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Welkom terug, Bart. Dit is het live overzicht.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Live site bekijken knop */}
            <a
              href="http://offerte.localhost:3000/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2cb1e1] hover:bg-[#1fa1cf] text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-tight shadow-sm transition-colors flex items-center gap-2">
              Bekijk Website ↗
            </a>
          </div>
        </header>

        {/* Dashboard Grid Content */}
        <div className="flex-1 p-8 overflow-y-auto space-y-8">
          {/* STATS CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Nieuwe Leads
                </p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">21</h3>
              </div>
              <div className="p-4 bg-blue-50 text-[#1066a3] rounded-xl">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Totaal Offertes
                </p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">148</h3>
              </div>
              <div className="p-4 bg-cyan-50 text-[#2cb1e1] rounded-xl">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Geconverteerd
                </p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">64%</h3>
              </div>
              <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* RECENTE OFFERTES TABEL */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">
                Recente Offerteaanvragen
              </h2>
              <button className="text-sm font-bold text-[#1066a3] hover:text-[#2cb1e1] transition-colors">
                Bekijk alle aanvragen →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Offerte Nr</th>
                    <th className="py-4 px-6">Klant</th>
                    <th className="py-4 px-6">Type Product</th>
                    <th className="py-4 px-6">Datum</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actie</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 text-slate-600 font-medium">
                  {offertes.map((offerte) => (
                    <tr
                      key={offerte.id}
                      className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {offerte.id}
                      </td>
                      <td className="py-4 px-6">{offerte.klant}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-bold">
                          {offerte.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {offerte.datum}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            offerte.status === "Nieuw"
                              ? "bg-blue-50 text-[#1066a3]"
                              : offerte.status === "In behandeling"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-green-50 text-green-600"
                          }`}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              offerte.status === "Nieuw"
                                ? "bg-[#1066a3]"
                                : offerte.status === "In behandeling"
                                  ? "bg-amber-500"
                                  : "bg-green-500"
                            }`}
                          />
                          {offerte.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-sm font-bold text-[#1066a3] hover:underline">
                          Openen
                        </button>
                      </td>
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
