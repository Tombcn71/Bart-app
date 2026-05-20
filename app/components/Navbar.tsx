"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminLink, setAdminLink] = useState(
    "https://admin.budgetkozijnenshop.nl",
  );

  useEffect(() => {
    // Deze code draait ALLEEN in de browser (client),
    // waardoor de server hier geen last van heeft en de mismatch stopt.
    const isLocal = window.location.hostname.includes("localhost");
    if (isLocal) {
      setAdminLink("http://admin.localhost:3000/");
    }
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
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
          <Link
            href="/kozijnen"
            className="hover:text-[#1066a3] transition-colors">
            Kozijnen
          </Link>
          <Link
            href="/deuren"
            className="hover:text-[#1066a3] transition-colors">
            Deuren
          </Link>
          <Link
            href="/schuifpui"
            className="hover:text-[#1066a3] transition-colors">
            Schuifpui
          </Link>
        </div>

        {/* Rechter Sectie: ADMIN KNOP */}
        <div className="flex items-center gap-2 md:gap-4">
          <a
            href={adminLink}
            className="bg-[#1066a3] hover:bg-[#0d5282] text-white font-bold p-2.5 md:py-3 md:px-6 rounded-xl flex items-center gap-3 transition-all group">
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:scale-105 transition-transform"></div>
            <span className="text-sm tracking-tight">ADMIN</span>
          </a>

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
            href="/kozijnen"
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
