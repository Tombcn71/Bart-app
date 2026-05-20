"use client";
import React from "react";

export default function DummyHomePage() {
  // Dynamische link naar het offerte subdomein op basis van de omgeving
  const isLocal =
    typeof window !== "undefined" &&
    window.location.hostname.includes("localhost");
  const offerteLink = isLocal
    ? "http://offerte.localhost:3000/"
    : "https://offerte.budgetkozijnenshop.nl";

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[#f8fafc] flex items-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 w-full">
        {/* HERO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* LINKERKANT: TEXT & BUTTON */}
          <div className="lg:col-span-6 space-y-6 md:max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-[1.1]">
              Kozijnen en deuren <br className="hidden md:inline" />
              <span className="text-[#1066a3]">op maat.</span> <br />
              <span className="text-slate-700 font-extrabold text-3xl md:text-4xl lg:text-5xl block mt-2">
                Vakmanschap dat het verschil maakt voor jouw woning.
              </span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
              Wij zijn gespecialiseerd in de levering en montage van
              energiezuinige kozijnen, deuren en zonweringssystemen. Poolse
              precisie gecombineerd met Duitse kwaliteit. Met jarenlange
              ervaring op de Nederlandse markt.
            </p>

            <div className="pt-4">
              <a
                href={offerteLink}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1066a3] to-[#2cb1e1] hover:from-[#0d5282] hover:to-[#1fa1cf] text-white font-bold py-4 px-8 rounded-2xl text-sm md:text-base tracking-tight shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group">
                <span>Bereken jouw kunststof kozijnen</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* RECHTERKANT: FOTO IN ARC (BOOG) */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[540px] aspect-[4/5] overflow-hidden rounded-t-[180px] md:rounded-t-[240px] border-[12px] border-white shadow-xl bg-slate-100">
              <img
                src="/bartpic.jpg"
                alt="BartMooi Vakmanschap"
                className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
