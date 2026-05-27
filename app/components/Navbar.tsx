"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  {
    label: "Kozijnen",
    items: [
      { label: "Kunststof kozijnen", href: "/kozijnen" },
      { label: "Aluminium kozijnen", href: "/aluminium/kozijnen" },
    ],
  },
  {
    label: "Deuren",
    items: [
      { label: "Kunststof deuren", href: "/deuren" },
      { label: "Aluminium deuren", href: "/aluminium/deuren" },
    ],
  },
  {
    label: "Harmonicadeur",
    items: [
      { label: "Kunststof harmonicadeur", href: "/harmonicadeur" },
      { label: "Aluminium harmonicadeur", href: "/aluminium/harmonicadeur" },
    ],
  },
  {
    label: "Schuifpui",
    items: [
      { label: "Kunststof schuifpui", href: "/schuifpui" },
      { label: "Aluminium schuifpui", href: "/aluminium/schuifpui" },
    ],
  },
];

function DropdownItem({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 hover:text-[#1066a3] transition-colors">
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d={open ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1066a3] transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const [adminLink, setAdminLink] = useState("https://admin.budgetkozijnenshop.nl");
  const [isOfferte, setIsOfferte] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes("localhost")) {
      setAdminLink("http://admin.localhost:3000/");
      setIsOfferte(true);
    }
    if (hostname.startsWith("offerte.")) setIsOfferte(true);
  }, []);

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center h-full py-4 shrink-0">
          <img
            src="/bartmooi-logo-1.png"
            alt="BartMooi Logo"
            className="h-full max-h-[40px] md:max-h-[60px] w-auto object-contain"
          />
        </Link>

        {/* Desktop menu */}
        {isOfferte && (
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-[#2d3748] uppercase tracking-tight">
            {NAV_ITEMS.map((item) => (
              <DropdownItem key={item.label} label={item.label} items={item.items} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4">
          <a
            href={adminLink}
            className="bg-[#1066a3] hover:bg-[#0d5282] text-white font-bold p-2.5 md:py-3 md:px-6 rounded-xl flex items-center gap-3 transition-all">
            <span className="text-sm tracking-tight">ADMIN</span>
          </a>

          {isOfferte && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-[#1066a3]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobiel menu */}
      {isOfferte && (
        <div className={`md:hidden overflow-hidden transition-all bg-white border-t ${isOpen ? "max-h-screen" : "max-h-0"}`}>
          <div className="flex flex-col p-4 gap-1 font-bold text-[#2d3748] uppercase">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <button
                  onClick={() => setOpenMobile(openMobile === item.label ? null : item.label)}
                  className="w-full flex justify-between items-center py-3 hover:text-[#1066a3] transition-colors">
                  {item.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d={openMobile === item.label ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
                  </svg>
                </button>
                {openMobile === item.label && (
                  <div className="flex flex-col pl-4 pb-2 gap-1">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => { setIsOpen(false); setOpenMobile(null); }}
                        className="py-2 text-sm font-medium text-slate-500 hover:text-[#1066a3] normal-case">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
