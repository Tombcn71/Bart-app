"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminLink, setAdminLink] = useState(
    "https://admin.budgetkozijnenshop.nl",
  );
  const [isOfferte, setIsOfferte] = useState(false); // Nieuwe state

  useEffect(() => {
    const hostname = window.location.hostname;

    // Check voor Admin link
    if (hostname.includes("localhost")) {
      setAdminLink("http://admin.localhost:3000/");
    }

    // Check voor Offerte subdomein
    if (hostname.startsWith("offerte.")) {
      setIsOfferte(true);
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

        {/* Desktop Menu: Alleen zichtbaar op offerte subdomein */}
        {isOfferte && (
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
              href="/harmonicadeur"
              className="hover:text-[#1066a3] transition-colors">
              Harmonicadeur
            </Link>
            <Link
              href="/schuifpui"
              className="hover:text-[#1066a3] transition-colors">
              Schuifpui
            </Link>
          </div>
        )}

        {/* Rechter Sectie */}
        <div className="flex items-center gap-2 md:gap-4">
          <a
            href={adminLink}
            className="bg-[#1066a3] hover:bg-[#0d5282] text-white font-bold p-2.5 md:py-3 md:px-6 rounded-xl flex items-center gap-3 transition-all group">
            <span className="text-sm tracking-tight">ADMIN</span>
          </a>

          {/* Hamburger Menu (alleen tonen op offerte subdomein) */}
          {isOfferte && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#1066a3]">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5">
                {isOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobiel Menu Overlay: Alleen zichtbaar op offerte subdomein */}
      {isOfferte && (
        <div
          className={`md:hidden overflow-hidden transition-all bg-white border-t ${isOpen ? "max-h-64" : "max-h-0"}`}>
          <div className="flex flex-col p-4 gap-4 text-center font-bold text-[#2d3748] uppercase">
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
      )}
    </nav>
  );
};

export default Navbar;
