"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const [isProductenOpen, setIsProductenOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="w-64 bg-gradient-to-b from-[#1066a3] to-[#2cb1e1] text-white flex flex-col shrink-0 shadow-xl">
        {/* Logo Sectie */}
        <div className="p-6 bg-white border-b border-gray-100 flex justify-center items-center h-24">
          <img
            src="/bartmooi-logo-1.png"
            alt="BartMooi Logo"
            className="max-h-[50px] w-auto object-contain"
          />
        </div>

        {/* Navigatie */}
        <nav className="flex-1 p-4 space-y-2 text-sm font-semibold">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
            Dashboard
          </Link>
          <Link
            href="/offertes"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors">
            Offertes
          </Link>
          {/* ... Hier kun je de rest van je links toevoegen ... */}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
