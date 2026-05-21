"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { saveOfferte } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

// --- STYLING (BartMooi Style) ---
const COLORS = {
  primary: "hsl(var(--primary))",
  textDark: "hsl(var(--foreground))",
  textLight: "hsl(var(--muted-foreground))",
  frame: "hsl(var(--foreground))",
  glass: "hsl(var(--muted-foreground))",
}

// --- DYNAMISCHE PRIJS MATRIX ---
const BASE_RATES = {
  basisPui: {
    2: 1850, // Starttarief 2-vaks
    4: 2950, // Starttarief 4-vaks
  },
  profielType: {
    evolutionDrivePlus: 1.15,
    evolutionDrive: 1.0,
  },
  aanslag: {
    nee: 0,
    ja: 85,
  },
  kleurBinnen: {
    wit: 0,
    creme: 0,
    witHout: 95,
    cremeHout: 95,
    antracietHout: 145,
    zwartHout: 165,
  },
  kleurBuitenProfiel: {
    wit: 0,
    creme: 0,
    witHout: 110,
    cremeHout: 110,
    blauwHout: 145,
    groenHout: 145,
    antracietHout: 145,
    zwartHout: 185,
    zwartgrijsHout: 185,
  },
  kleurBuitenVleugel: {
    wit: 0,
    creme: 0,
    witHout: 110,
    cremeHout: 110,
    blauwHout: 145,
    groenHout: 145,
    antracietHout: 145,
    zwartHout: 185,
    zwartgrijsHout: 185,
  },
  glasTypeM2: {
    dubbelGelaagd: 165,
    dubbel: 90,
    tripleGelaagd: 245,
  },
  afstandshouder: {
    alu: 0,
    zwart: 35,
  },
  roeden: {
    geen: 0,
    vaks6: 185,
    vaks8: 245,
  },
  ventilatieRooster: {
    nee: 0,
    vast: 195,
    alle: 380,
  },
  krukType: {
    binnenSleutel: 0,
    beideZijden: 85,
    binnenKomBuiten: 115,
  },
  m2TariefConstructie: 140,
};

// --- DYNAMISCHE SVG VISUALISATIE (2 of 4 vaks) ---
const SlidingDoorDetailSVG = ({ sections }: { sections: number }) => {
  const isFourVaks = sections === 4;
  const width = isFourVaks ? 160 : 100; // Maakt de 4-vaks breder in verhouding
  const sectionWidth = width / sections;

  return (
    <svg
      viewBox={`0 0 ${width + 10} 85`}
      className="w-full h-auto drop-shadow-xl transition-all duration-300"
      style={{ maxHeight: "350px" }}
      preserveAspectRatio="xMidYMid meet">
      <g transform="translate(5, 5)">
        {/* Buitenkader van de pui */}
        <rect
          x="0"
          y="0"
          width={width}
          height="75"
          fill="none"
          stroke={COLORS.frame}
          strokeWidth="1.5"
        />

        {sections === 2 ? (
          <>
            {/* 2-VAKS: Links vast, rechts schuivend */}
            {/* Linker deel (Vast glas met kruis-indicator) */}
            <rect
              x="1.5"
              y="1.5"
              width={sectionWidth - 2}
              height="72"
              fill="none"
              stroke={COLORS.frame}
              strokeWidth="1"
            />
            <g transform={`translate(${sectionWidth / 2 - 3}, 35)`}>
              <line
                x1="0"
                y1="0"
                x2="6"
                y2="0"
                stroke={COLORS.glass}
                strokeWidth="1"
              />
              <line
                x1="3"
                y1="-3"
                x2="3"
                y2="3"
                stroke={COLORS.glass}
                strokeWidth="1"
              />
            </g>

            {/* Rechter deel (Schuifvleugel met pijl naar links) */}
            <rect
              x={sectionWidth + 0.5}
              y="1.5"
              width={sectionWidth - 2}
              height="72"
              fill="none"
              stroke={COLORS.frame}
              strokeWidth="1"
            />
            <g
              transform={`translate(${sectionWidth + sectionWidth / 2 - 10}, 37)`}>
              <line
                x1="0"
                y1="0"
                x2="16"
                y2="0"
                stroke={COLORS.primary}
                strokeWidth="1.2"
              />
              <line
                x1="0"
                y1="0"
                x2="4"
                y2="-3"
                stroke={COLORS.primary}
                strokeWidth="1.2"
              />
              <line
                x1="0"
                y1="0"
                x2="4"
                y2="3"
                stroke={COLORS.primary}
                strokeWidth="1.2"
              />
            </g>
          </>
        ) : (
          <>
            {/* 4-VAKS: Buitenste delen vast, middelste twee delen schuiven naar buiten */}
            {[0, 1, 2, 3].map((i) => {
              const xPos = i * sectionWidth;
              const isFixed = i === 0 || i === 3;
              const isMovingLeft = i === 1;

              return (
                <g key={i}>
                  <rect
                    x={xPos + 1}
                    y="1.5"
                    width={sectionWidth - 2}
                    height="72"
                    fill="none"
                    stroke={COLORS.frame}
                    strokeWidth="1"
                  />
                  {isFixed ? (
                    /* Vast glas indicator */
                    <g
                      transform={`translate(${xPos + sectionWidth / 2 - 3}, 35)`}>
                      <line
                        x1="0"
                        y1="0"
                        x2="6"
                        y2="0"
                        stroke={COLORS.glass}
                        strokeWidth="1"
                      />
                      <line
                        x1="3"
                        y1="-3"
                        x2="3"
                        y2="3"
                        stroke={COLORS.glass}
                        strokeWidth="1"
                      />
                    </g>
                  ) : (
                    /* Schuifpijlen: Deel 2 schuift naar links, Deel 3 schuift naar rechts */
                    <g
                      transform={`translate(${xPos + sectionWidth / 2 - 7}, 37)`}>
                      <line
                        x1="0"
                        y1="0"
                        x2="14"
                        y2="0"
                        stroke={COLORS.primary}
                        strokeWidth="1.2"
                      />
                      {isMovingLeft ? (
                        <>
                          <line
                            x1="0"
                            y1="0"
                            x2="4"
                            y2="-3"
                            stroke={COLORS.primary}
                            strokeWidth="1.2"
                          />
                          <line
                            x1="0"
                            y1="0"
                            x2="4"
                            y2="3"
                            stroke={COLORS.primary}
                            strokeWidth="1.2"
                          />
                        </>
                      ) : (
                        <>
                          <line
                            x1="14"
                            y1="0"
                            x2="10"
                            y2="-3"
                            stroke={COLORS.primary}
                            strokeWidth="1.2"
                          />
                          <line
                            x1="14"
                            y1="0"
                            x2="10"
                            y2="3"
                            stroke={COLORS.primary}
                            strokeWidth="1.2"
                          />
                        </>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </>
        )}
      </g>
    </svg>
  );
};

export default function SchuifpuiDetailPage() {
  const params = useParams();
  const slug = (params.id as string) || "schuifpui-2-vaks";
  const initialSections = slug === "schuifpui-4-vaks" ? 4 : 2;

  // --- CONFIGURATOR STATES ---
  const [verdeling, setVerdeling] = useState<number>(initialSections);
  const [breedte, setBreedte] = useState<number>(3500);
  const [hoogte, setHoogte] = useState<number>(2200);

  const [profiel, setProfiel] = useState<string>("evolutionDrivePlus");
  const [aanslag, setAanslag] = useState<string>("nee");

  const [kleurBinnen, setKleurBinnen] = useState<string>("wit");
  const [kleurBuitenProfiel, setKleurBuitenProfiel] =
    useState<string>("antracietHout");
  const [kleurBuitenVleugel, setKleurBuitenVleugel] =
    useState<string>("antracietHout");

  const [glas, setGlas] = useState<string>("dubbelGelaagd");
  const [afstandshouder, setAfstandshouder] = useState<string>("zwart");
  const [roeden, setRoeden] = useState<string>("geen");

  const [ventilatie, setVentilatie] = useState<string>("nee");
  const [draairichting, setDraairichting] = useState<string>("rechtsActief");
  const [kruk, setKruk] = useState<string>("binnenSleutel");
  const [voorboren, setVoorboren] = useState<string>("nee");
  const [aantal, setAantal] = useState<number>(1);

  // --- BINNENWERKSE MATEN CALCULATIE ---
  const binnenwerkseBreedte = useMemo(
    () => Math.max(0, breedte - 136),
    [breedte],
  );
  const binnenwerkseHoogte = useMemo(() => Math.max(0, hoogte - 120), [hoogte]);

  // --- DYNAMISCHE PRIJSBEREKENING ---
  const berekendePrijs = useMemo(() => {
    if (!breedte || !hoogte) return 0;

    const m2 = (breedte / 1000) * (hoogte / 1000);
    const basis =
      BASE_RATES.basisPui[verdeling as keyof typeof BASE_RATES.basisPui] ||
      1850;
    const profielMult =
      BASE_RATES.profielType[profiel as keyof typeof BASE_RATES.profielType] ||
      1.0;

    const extraKosten =
      (BASE_RATES.glasTypeM2[glas as keyof typeof BASE_RATES.glasTypeM2] || 0) *
        m2 +
      BASE_RATES.m2TariefConstructie * m2 +
      (BASE_RATES.aanslag[aanslag as keyof typeof BASE_RATES.aanslag] || 0) +
      (BASE_RATES.kleurBinnen[
        kleurBinnen as keyof typeof BASE_RATES.kleurBinnen
      ] || 0) +
      (BASE_RATES.kleurBuitenProfiel[
        kleurBuitenProfiel as keyof typeof BASE_RATES.kleurBuitenProfiel
      ] || 0) +
      (BASE_RATES.kleurBuitenVleugel[
        kleurBuitenVleugel as keyof typeof BASE_RATES.kleurBuitenVleugel
      ] || 0) +
      (BASE_RATES.afstandshouder[
        afstandshouder as keyof typeof BASE_RATES.afstandshouder
      ] || 0) +
      (BASE_RATES.roeden[roeden as keyof typeof BASE_RATES.roeden] || 0) +
      (BASE_RATES.ventilatieRooster[
        ventilatie as keyof typeof BASE_RATES.ventilatieRooster
      ] || 0) +
      (BASE_RATES.krukType[kruk as keyof typeof BASE_RATES.krukType] || 0);

    const subTotaal = basis * profielMult + extraKosten;
    return parseFloat((subTotaal * aantal).toFixed(2));
  }, [
    verdeling,
    breedte,
    hoogte,
    profiel,
    aanslag,
    kleurBinnen,
    kleurBuitenProfiel,
    kleurBuitenVleugel,
    glas,
    afstandshouder,
    roeden,
    ventilatie,
    kruk,
    aantal,
  ]);

  const geformatteerdePrijs = berekendePrijs.toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="w-full min-h-screen bg-white font-sans text-slate-600">
      <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-12">
        {/* Breadcrumb */}
        <Link
          href="/schuifpui"
          className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 md:mb-10 inline-block hover:text-[#1066a3] transition-colors">
          ← Terug naar overzicht
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LINKERKANT: VISUALISATIE (DYNAMISCH) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="border-l-4 border-[#1066a3] pl-4 md:pl-6 mb-6 md:mb-8">
              <h1 className="text-xl md:text-3xl font-black uppercase text-slate-800 tracking-tight leading-tight">
                Schuifpui {verdeling}-vaks op maat
              </h1>
              <p className="text-[#1066a3] text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                Hoogwaardig schuifdeursysteem
              </p>
            </div>

            <div className="bg-[#f8fafc] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-12 border border-slate-100 flex items-center justify-center min-h-[300px] md:min-h-[450px] shadow-inner relative overflow-hidden">
              <div className="w-full max-w-[550px]">
                <SlidingDoorDetailSVG sections={verdeling} />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] text-slate-400 bg-white shadow-sm py-1.5 px-3 rounded-full border border-slate-100">
                  Buitenaanzicht (Dynamisch)
                </span>
              </div>
            </div>

            {/* Binnenwerkse Maten Display Box */}
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-wide">
              <div>
                <span className="text-slate-400 block text-[9px]">
                  Binnenwerkse breedte
                </span>
                <span className="text-slate-700 text-sm">
                  {binnenwerkseBreedte} mm
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">
                  Binnenwerkse hoogte
                </span>
                <span className="text-slate-700 text-sm">
                  {binnenwerkseHoogte} mm
                </span>
              </div>
            </div>
          </div>

          {/* RECHTERKANT: CONFIGURATIE FORMULIER */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-slate-100/50">
              {/* STAP 1: AFMETINGEN & VERDELING */}
              <div className="mb-6 pb-6 border-b border-slate-100 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="bg-[#1066a3] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Afmetingen &amp; Verdeling
                </h3>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">
                    Verdeling model
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setVerdeling(2)}
                      className={`p-3 border-2 rounded-xl text-xs font-bold uppercase transition-all ${verdeling === 2 ? "border-[#1066a3] bg-white text-[#1066a3]" : "border-slate-100 bg-slate-50/50 text-slate-400"}`}>
                      2-delig (Tweedelig)
                    </button>
                    <button
                      onClick={() => setVerdeling(4)}
                      className={`p-3 border-2 rounded-xl text-xs font-bold uppercase transition-all ${verdeling === 4 ? "border-[#1066a3] bg-white text-[#1066a3]" : "border-slate-100 bg-slate-50/50 text-slate-400"}`}>
                      4-delig (Vierdelig)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Breedte (mm)
                    </span>
                    <input
                      type="number"
                      value={breedte}
                      onChange={(e) =>
                        setBreedte(Math.max(0, Number(e.target.value)))
                      }
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Hoogte (mm)
                    </span>
                    <input
                      type="number"
                      value={hoogte}
                      onChange={(e) =>
                        setHoogte(Math.max(0, Number(e.target.value)))
                      }
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* STAP 2: PROFIEL EN AANSLAG */}
              <div className="mb-6 pb-6 border-b border-slate-100 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="bg-[#1066a3] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Profiel &amp; Aanslag
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Type profiel
                    </span>
                    <select
                      value={profiel}
                      onChange={(e) => setProfiel(e.target.value)}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold outline-none cursor-pointer focus:border-[#1066a3]">
                      <option value="evolutionDrivePlus">
                        EvolutionDrive Plus (Aanbevolen)
                      </option>
                      <option value="evolutionDrive">
                        EvolutionDrive (Creon)
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Aanslag
                    </span>
                    <select
                      value={aanslag}
                      onChange={(e) => setAanslag(e.target.value)}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold outline-none cursor-pointer focus:border-[#1066a3]">
                      <option value="nee">Nee</option>
                      <option value="ja">Ja (losse aanslag)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* STAP 3: KLEUREN */}
              <div className="mb-6 pb-6 border-b border-slate-100 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="bg-[#1066a3] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  Kleurconfiguratie
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Kleur (binnenkant)
                    </span>
                    <select
                      value={kleurBinnen}
                      onChange={(e) => setKleurBinnen(e.target.value)}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                      <option value="wit">Wit</option>
                      <option value="creme">Crème wit</option>
                      <option value="witHout">Wit (Houtmotief)</option>
                      <option value="cremeHout">Crème wit (Houtmotief)</option>
                      <option value="antracietHout">
                        Antraciet (Houtmotief)
                      </option>
                      <option value="zwartHout">Zwart (Houtmotief)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Kleur profiel (buitenkant)
                      </span>
                      <select
                        value={kleurBuitenProfiel}
                        onChange={(e) => setKleurBuitenProfiel(e.target.value)}
                        className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                        <option value="wit">Wit</option>
                        <option value="creme">Crème wit</option>
                        <option value="witHout">Wit (Houtmotief)</option>
                        <option value="cremeHout">
                          Crème wit (Houtmotief)
                        </option>
                        <option value="blauwHout">Blauw (Houtmotief)</option>
                        <option value="groenHout">Groen (Houtmotief)</option>
                        <option value="antracietHout">
                          Antraciet (Houtmotief)
                        </option>
                        <option value="zwartHout">Zwart (Houtmotief)</option>
                        <option value="zwartgrijsHout">
                          Zwart grijs (Houtmotief)
                        </option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Kleur bewegende delen
                      </span>
                      <select
                        value={kleurBuitenVleugel}
                        onChange={(e) => setKleurBuitenVleugel(e.target.value)}
                        className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                        <option value="wit">Wit</option>
                        <option value="creme">Crème wit</option>
                        <option value="witHout">Wit (Houtmotief)</option>
                        <option value="cremeHout">
                          Crème wit (Houtmotief)
                        </option>
                        <option value="blauwHout">Blauw (Houtmotief)</option>
                        <option value="groenHout">Groen (Houtmotief)</option>
                        <option value="antracietHout">
                          Antraciet (Houtmotief)
                        </option>
                        <option value="zwartHout">Zwart (Houtmotief)</option>
                        <option value="zwartgrijsHout">
                          Zwart grijs (Houtmotief)
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAP 4: VULLING */}
              <div className="mb-6 pb-6 border-b border-slate-100 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="bg-[#1066a3] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                    4
                  </span>
                  Vulling &amp; Glas
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Type glas
                    </span>
                    <select
                      value={glas}
                      onChange={(e) => setGlas(e.target.value)}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                      <option value="dubbelGelaagd">
                        Dubbel glas dubbelzijdig gelaagd
                      </option>
                      <option value="dubbel">Dubbel glas (HR++)</option>
                      <option value="tripleGelaagd">
                        Triple glas dubbelzijdig gelaagd
                      </option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Afstandshouder
                      </span>
                      <select
                        value={afstandshouder}
                        onChange={(e) => setAfstandshouder(e.target.value)}
                        className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                        <option value="alu">Aluminium afstandshouder</option>
                        <option value="zwart">
                          Zwarte afstandshouder (extra isolerend)
                        </option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Roeden
                      </span>
                      <select
                        value={roeden}
                        onChange={(e) => setRoeden(e.target.value)}
                        className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                        <option value="geen">Geen roeden</option>
                        <option value="vaks6">
                          Tussen het glas (18 mm) - 6 vaks verdeling
                        </option>
                        <option value="vaks8">
                          Tussen het glas (18 mm) - 8 vaks verdeling
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAP 5: EIGENSCHAPPEN */}
              <div className="mb-6 pb-6 border-b border-slate-100 space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="bg-[#1066a3] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                    5
                  </span>
                  Eigenschappen &amp; Beslag
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Ventilatierooster
                    </span>
                    <select
                      value={ventilatie}
                      onChange={(e) => setVentilatie(e.target.value)}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                      <option value="nee">Nee</option>
                      <option value="vast">Ja in het vaste gedeelte</option>
                      <option value="alle">Ja, in alle delen</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Draairichting / Volgorde
                    </span>
                    <select
                      value={draairichting}
                      onChange={(e) => setDraairichting(e.target.value)}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                      <option value="rechtsActief">
                        Rechter deur actief van binnenuit
                      </option>
                      <option value="linksActief">
                        Linker deur actief van binnenuit
                      </option>
                      <option value="vastLinks">
                        Vaste gedeelte links van binnenuit
                      </option>
                      <option value="vastRechts">
                        Vaste gedeelte rechts van binnenuit
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Type kruk
                    </span>
                    <select
                      value={kruk}
                      onChange={(e) => setKruk(e.target.value)}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                      <option value="binnenSleutel">
                        Kruk binnenzijde (met sleutel)
                      </option>
                      <option value="beideZijden">
                        Kruk + cilinder beide zijden
                      </option>
                      <option value="binnenKomBuiten">
                        Kruk + cilinder binnenzijde / komgreep buitenzijde
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Voorboren (gratis)
                    </span>
                    <select
                      value={voorboren}
                      onChange={(e) => setVoorboren(e.target.value)}
                      className="w-full border-2 border-slate-100 p-3 rounded-xl text-xs font-bold focus:border-[#1066a3] outline-none">
                      <option value="nee">Niet voorboren</option>
                      <option value="ja">
                        Kozijn voorboren 6 mm links / boven / rechts
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* TOTAAL EN BESTELLEN */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">
                      Totaalprijs
                    </span>
                    <span className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                      € {geformatteerdePrijs}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">
                      Incl. 21% BTW
                    </span>
                  </div>

                  {/* Aantal Selector */}
                  <div className="flex items-center border-2 border-slate-100 rounded-xl p-1 bg-slate-50/50">
                    <button
                      onClick={() => setAantal(Math.max(1, aantal - 1))}
                      className="w-8 h-8 font-black text-slate-600 hover:bg-white rounded-lg transition-colors">
                      -
                    </button>
                    <span className="w-10 text-center font-black text-xs text-slate-800">
                      {aantal}
                    </span>
                    <button
                      onClick={() => setAantal(aantal + 1)}
                      className="w-8 h-8 font-black text-slate-600 hover:bg-white rounded-lg transition-colors">
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const payload = {
                      verdeling,
                      breedte,
                      hoogte,
                      profiel,
                      aanslag,
                      kleurBinnen,
                      kleurBuitenProfiel,
                      kleurBuitenVleugel,
                      glas,
                      afstandshouder,
                      roeden,
                      ventilatie,
                      draairichting,
                      kruk,
                      voorboren,
                      aantal,
                      prijs: berekendePrijs,
                    };

                    // Zorg dat je de functie saveOfferte correct hebt geïmporteerd
                    await saveOfferte("schuifpui", payload);
                    alert("Schuifpui succesvol toegevoegd aan de aanvraag!");
                  }}
                  className="w-full bg-[#1066a3] hover:bg-[#0d5486] text-white py-5 rounded-xl transition-all font-black uppercase tracking-widest text-[11px] shadow-lg shadow-[#1066a3]/20">
                  Voeg toe aan aanvraag
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
