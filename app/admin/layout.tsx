"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isProductenOpen, setIsProductenOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#1066a3] to-[#2cb1e1] text-white flex flex-col shrink-0 shadow-xl">
        <div className="p-6 bg-white border-b border-gray-100 flex justify-center items-center h-24">
          <img
            src="/bartmooi-logo-1.png"
            alt="BartMooi Logo"
            className="max-h-[50px] w-auto object-contain"
          />
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm font-semibold">
          <Link
            href="/admin"
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
            href="/admin/offertes"
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
                  href="/admin/kozijnenprijzen"
                  className="block px-4 py-2 text-sm rounded-lg hover:bg-white/10 opacity-90">
                  Kozijnen Prijzen
                </Link>
                <Link
                  href="/admin/deurenprijzen"
                  className="block px-4 py-2 text-sm rounded-lg hover:bg-white/10 opacity-90">
                  Deuren Prijzen
                </Link>
                <Link
                  href="/admin/schuifpuiprijzen"
                  className="block px-4 py-2 text-sm rounded-lg hover:bg-white/10 opacity-90">
                  Schuifpui Prijzen
                </Link>
              </div>
            )}
          </div>
        </nav>
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

      {/* CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500">Welkom terug, Bart.</p>
          </div>
          <a
            href="https://offerte.budgetkozijnenshop.nl/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#2cb1e1] hover:bg-[#1fa1cf] text-white px-5 py-2.5 rounded-xl font-bold text-sm">
            Bekijk App ↗
          </a>
        </header>

        {/* HIER KOMT DE PAGINA INHOUD */}
        <div className="flex-1 p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
