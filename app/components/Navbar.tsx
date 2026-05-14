"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
        {/* Logo Sectie */}
        <Link href="/" className="flex items-center h-full py-4 shrink-0">
          <img
            src="/bartmooi-logo-1.png"
            alt="BartMooi Logo"
            className="h-full max-h-[40px] md:max-h-[60px] w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#2d3748] uppercase tracking-tight">
          <Link href="/" className="hover:text-[#1066a3] transition-colors">
            Kozijnen
          </Link>
          <Link
            href="/deuren"
            className="hover:text-[#1066a3] transition-colors">
            Deuren{" "}
          </Link>
          <Link
            href="/schuifpui
            "
            className="hover:text-[#1066a3] transition-colors">
            Schuifpui
          </Link>
        </div>

        {/* Rechter Sectie: Acties */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1066a3] font-bold p-2.5 md:py-3 md:px-6 rounded-xl flex items-center gap-3 transition-all group">
            <div className="bg-[#1066a3] text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                {/* GEFIXED: x2="6" veranderd naar y2="6" */}
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-[10px] uppercase tracking-tighter opacity-70">
                Gratis
              </span>
              <span className="text-sm tracking-tight text-slate-800">
                INMETING
              </span>
            </div>
          </button>

          {/* Hamburger Menu knop */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#1066a3] focus:outline-none">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobiel Menu Overlay */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-slate-50 ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col p-4 gap-4 text-center font-bold text-[#2d3748] uppercase tracking-wide">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="py-2 hover:text-[#1066a3]">
            Kozijnen
          </Link>
          <Link
            href="/deuren"
            onClick={() => setIsOpen(false)}
            className="py-2 hover:text-[#1066a3]">
            Deuren
          </Link>
          <Link
            href="/schuifpui"
            onClick={() => setIsOpen(false)}
            className="py-2 hover:text-[#1066a3]">
            Schuifpui
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
