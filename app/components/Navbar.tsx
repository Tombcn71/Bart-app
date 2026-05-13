import React from "react";
import Image from "next/image";
import Link from "next/link";
const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      {/* Main Navbar */}
      <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo Sectie met referentie naar bartmooi-logo-1.png */}
        <div className="flex items-center h-full py-4">
          <img
            src="/bartmooi-logo-1.png"
            alt="BartMooi Logo"
            className="h-full w-auto object-contain"
          />
        </div>

        {/* Menu Items */}

        {/* Call to Action Knop */}
        <div className="flex items-center">
          <button className="bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#1066a3] font-bold py-3 px-6 rounded-lg flex items-center gap-3 transition-all group">
            <div className="bg-[#1066a3] text-white p-1 rounded group-hover:scale-110 transition-transform">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[10px] uppercase tracking-tighter opacity-70">
                Gratis
              </span>
              <span className="text-sm tracking-tight">INMETING</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
