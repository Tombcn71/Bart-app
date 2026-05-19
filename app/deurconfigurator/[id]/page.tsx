"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// --- THEME CONFIGURATION ---
const COLORS = {
  primary: "#1066a3",
  primaryHover: "#0d5486",
  border: "#e2e8f0",
  text: "#4a5568",
  textDark: "#1e293b",
  frame: "#2d3748",
  bgLight: "#f8fafc",
};

// --- PRIJS MATRIX (MERKNEUTRAAL & VOLLEDIG) ---
const BASE_RATES = {
  deurTypeBasis: {
    voordeur: 950,
    achterdeur: 880,
    "dubbele-deur": 1650,
    "dubbele-deur-zijlichten": 2100,
    "dubbele-deur-borstwering": 1750,
  },
  profielMultiplier: {
    vlak82: 1.0,
    verdiept120: 1.12,
    verdiept120hvl: 1.25,
  },
  aanslag: {
    ja: 45,
    nee: 0,
  },
  onderdorpel: {
    alu: 0,
    kader: -30,
    dts: 95,
  },
  kleurBinnen: {
    wit: 0,
    creme: 0,
    witMat: 45,
    cremeMat: 45,
    antracietMat: 75,
    zwartMat: 75,
  },
  kleurBuitenProfiel: {
    wit: 0,
    creme: 0,
    antracietMat: 65,
    blauwMat: 65,
    cremeMat: 45,
    groenMat: 65,
    witMat: 45,
    zwartMat: 75,
    basaltMat: 65,
    kwartsMat: 80,
    monumentenBlauwMat: 75,
    monumentenGroenMat: 75,
    wijnroodMat: 65,
    zwartgrijsMat: 75,
  },
  kleurBuitenVleugel: {
    wit: 0,
    creme: 0,
    antracietMat: 65,
    blauwMat: 65,
    cremeMat: 45,
    groenMat: 65,
    witMat: 45,
    zwartMat: 75,
    basaltMat: 65,
    kwartsMat: 80,
  },
  glas: {
    dubbel: 0,
    dubbelMat: 55,
    dubbelGelaagdBinnen: 85,
    dubbelGelaagdBinnenMat: 135,
    dubbelGelaagdDubbel: 160,
    dubbelGelaagdDubbelMat: 210,
    sandwich: -40,
    geen: -80,
    triple: 120,
    tripleMat: 180,
    tripleGelaagdBinnen: 210,
    tripleGelaagdBinnenMat: 265,
    tripleGelaagdDubbel: 290,
    tripleGelaagdDubbelMat: 345,
  },
  afstandshouder: {
    alu: 0,
    zwart: 25,
    nvt: 0,
  },
  roeden: {
    geen: 0,
    tussen18_6: 115,
    tussen18_8: 145,
    wiener26_6: 220,
    wiener26_8: 275,
  },
  deurkruk: {
    standaardZilver: 0,
    vincentZilver: 35,
    stang800: 95,
    stang1700: 155,
    standaardZwart: 25,
    vincentZwart: 55,
    stang800Zwart: 120,
    stang1700Zwart: 180,
  },
  cilinder: {
    standaard: 0,
    gelijksluitend: 35,
  },
  ventilatieRooster: {
    nee: 0,
    ja: 145,
  },
  m2Tarief: 185,
};

// --- DYNAMISCHE SVG DEUR COMPONENTEN ---
const SingleDoorBase = ({
  type,
  draairichting,
}: {
  type: "voordeur" | "achterdeur";
  draairichting: string;
}) => {
  const isNaarBuiten = draairichting.startsWith("buiten");
  const isLinks = draairichting.endsWith("Links");

  let pathD = "M5 5 L55 45 L5 85";
  if (!isLinks) {
    pathD = "M55 5 L5 45 L55 85";
  }

  return (
    <g transform="translate(20, 5)">
      <rect
        x="0"
        y="0"
        width="60"
        height="90"
        fill="none"
        stroke={COLORS.frame}
        strokeWidth="1"
      />
      {type === "voordeur" ? (
        <>
          <rect
            x="10"
            y="10"
            width="40"
            height="35"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <line
            x1="10"
            y1="27.5"
            x2="50"
            y2="27.5"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <line
            x1="30"
            y1="10"
            x2="30"
            y2="45"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <rect
            x="15"
            y="60"
            width="30"
            height="20"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <circle cx={isLinks ? 54 : 6} cy="48" r="1.2" fill={COLORS.frame} />
        </>
      ) : (
        <>
          <rect
            x="8"
            y="8"
            width="44"
            height="50"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.75"
          />
          <rect
            x="8"
            y="64"
            width="44"
            height="18"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <rect
            x={isLinks ? 51 : 7}
            y="44"
            width="2"
            height="6"
            fill={COLORS.frame}
            rx="0.5"
          />
          <line
            x1={isLinks ? 52 : 8}
            y1="45"
            x2={isLinks ? 49 : 11}
            y2="45"
            stroke={COLORS.frame}
            strokeWidth="1"
          />
        </>
      )}
      <path
        d={pathD}
        fill="none"
        stroke={COLORS.primary}
        strokeWidth="0.5"
        strokeDasharray={isNaarBuiten ? "none" : "2,2"}
      />
    </g>
  );
};

const DoubleDoorBase = ({ hasSideLights = false, hasPlinth = false }) => {
  const width = hasSideLights ? 180 : 100;
  return (
    <g transform="translate(5, 5)">
      <rect
        x="0"
        y="0"
        width={width - 10}
        height="90"
        fill="none"
        stroke={COLORS.frame}
        strokeWidth="1"
      />
      {hasSideLights && (
        <>
          <line
            x1="40"
            y1="0"
            x2="40"
            y2="90"
            stroke={COLORS.frame}
            strokeWidth="1"
          />
          <line
            x1="130"
            y1="0"
            x2="130"
            y2="90"
            stroke={COLORS.frame}
            strokeWidth="1"
          />
          <line
            x1="15"
            y1="45"
            x2="25"
            y2="45"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          <line
            x1="145"
            y1="45"
            x2="155"
            y2="45"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
        </>
      )}
      <g transform={hasSideLights ? "translate(40, 0)" : "translate(0, 0)"}>
        <rect
          x="0"
          y="0"
          width="90"
          height="90"
          fill="none"
          stroke={COLORS.frame}
          strokeWidth="1"
        />
        <line
          x1="45"
          y1="0"
          x2="45"
          y2="90"
          stroke={COLORS.frame}
          strokeWidth="1"
        />
        <path
          d="M5 5 L40 45 L5 85"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="0.6"
          strokeDasharray="1.5,1.5"
        />
        <path
          d="M85 5 L50 45 L85 85"
          fill="none"
          stroke={COLORS.primary}
          strokeWidth="0.6"
          strokeDasharray="1.5,1.5"
        />
        {hasPlinth && (
          <line
            x1="0"
            y1="65"
            x2="90"
            y2="65"
            stroke={COLORS.frame}
            strokeWidth="1"
          />
        )}
        <circle cx="42" cy="45" r="1.2" fill={COLORS.frame} />
        <circle cx="48" cy="45" r="1.2" fill={COLORS.frame} />
      </g>
    </g>
  );
};

export default function DeurConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "voordeur";

  // --- CONFIGURATOR STATES ---
  const [profiel, setProfiel] = useState<string>("verdiept120");
  const [aanslag, setAanslag] = useState<string>("ja");
  const [onderdorpel, setOnderdorpel] = useState<string>("alu");
  const [draairichting, setDraairichting] = useState<string>("binnenLinks");

  const [breedte, setBreedte] = useState<number>(1000);
  const [hoogte, setHoogte] = useState<number>(2100);

  const [kleurBinnen, setKleurBinnen] = useState<string>("wit");
  const [kleurBuitenProfiel, setKleurBuitenProfiel] = useState<string>("wit");
  const [kleurBuitenVleugel, setKleurBuitenVleugel] = useState<string>("wit");

  const [glas, setGlas] = useState<string>("dubbel");
  const [afstandshouder, setAfstandshouder] = useState<string>("alu");
  const [roeden, setRoeden] = useState<string>("geen");

  const [deurkruk, setDeurkruk] = useState<string>("standaardZilver");
  const [cilinder, setCilinder] = useState<string>("standaard");
  const [ventilatieRooster, setVentilatieRooster] = useState<string>("nee");
  const [voorboren, setVoorboren] = useState<string>("nee");

  const [aantal, setAantal] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<string>("specificaties");

  const deur = useMemo(() => {
    const data = [
      {
        slug: "voordeur",
        v: 1,
        name: "Voordeur",
        components: (
          <SingleDoorBase type="voordeur" draairichting={draairichting} />
        ),
      },
      {
        slug: "achterdeur",
        v: 1,
        name: "Achterdeur",
        components: (
          <SingleDoorBase type="achterdeur" draairichting={draairichting} />
        ),
      },
      {
        slug: "dubbele-deur",
        v: 1,
        name: "Dubbele deur",
        components: <DoubleDoorBase />,
      },
      {
        slug: "dubbele-deur-zijlichten",
        v: 1.8,
        name: "Dubbele deur met zijlichten",
        components: <DoubleDoorBase hasSideLights />,
      },
      {
        slug: "dubbele-deur-borstwering",
        v: 1,
        name: "Dubbele deur met borstwering",
        components: <DoubleDoorBase hasPlinth />,
      },
    ];
    return data.find((d) => d.slug === slug) || data[0];
  }, [slug, draairichting]);

  const berekendePrijs = useMemo(() => {
    if (!breedte || !hoogte) return 0;

    const basisDeurPrijs =
      BASE_RATES.deurTypeBasis[slug as keyof typeof BASE_RATES.deurTypeBasis] ||
      950;
    const profielMult =
      BASE_RATES.profielMultiplier[
        profiel as keyof typeof BASE_RATES.profielMultiplier
      ] || 1.0;
    const aanslagKosten =
      BASE_RATES.aanslag[aanslag as keyof typeof BASE_RATES.aanslag] || 0;
    const dorpelKosten =
      BASE_RATES.onderdorpel[
        onderdorpel as keyof typeof BASE_RATES.onderdorpel
      ] || 0;

    const kBinnen =
      BASE_RATES.kleurBinnen[
        kleurBinnen as keyof typeof BASE_RATES.kleurBinnen
      ] || 0;
    const kBuitenProf =
      BASE_RATES.kleurBuitenProfiel[
        kleurBuitenProfiel as keyof typeof BASE_RATES.kleurBuitenProfiel
      ] || 0;
    const kBuitenVleug =
      BASE_RATES.kleurBuitenVleugel[
        kleurBuitenVleugel as keyof typeof BASE_RATES.kleurBuitenVleugel
      ] || 0;

    const glasKosten =
      BASE_RATES.glas[glas as keyof typeof BASE_RATES.glas] || 0;
    const afstandKosten =
      BASE_RATES.afstandshouder[
        afstandshouder as keyof typeof BASE_RATES.afstandshouder
      ] || 0;
    const roedenKosten =
      BASE_RATES.roeden[roeden as keyof typeof BASE_RATES.roeden] || 0;

    const krukKosten =
      BASE_RATES.deurkruk[deurkruk as keyof typeof BASE_RATES.deurkruk] || 0;
    const cilinderKosten =
      BASE_RATES.cilinder[cilinder as keyof typeof BASE_RATES.cilinder] || 0;
    const roosterKosten =
      BASE_RATES.ventilatieRooster[
        ventilatieRooster as keyof typeof BASE_RATES.ventilatieRooster
      ] || 0;

    const m2 = (breedte / 1000) * (hoogte / 1000);
    const m2Toeslag = m2 * BASE_RATES.m2Tarief;

    const subTotaalPerDeur =
      basisDeurPrijs * profielMult +
      aanslagKosten +
      dorpelKosten +
      kBinnen +
      kBuitenProf +
      kBuitenVleug +
      glasKosten +
      afstandKosten +
      roedenKosten +
      krukKosten +
      cilinderKosten +
      roosterKosten +
      m2Toeslag;

    return parseFloat((subTotaalPerDeur * aantal).toFixed(2));
  }, [
    slug,
    breedte,
    hoogte,
    profiel,
    aanslag,
    onderdorpel,
    kleurBinnen,
    kleurBuitenProfiel,
    kleurBuitenVleugel,
    glas,
    afstandshouder,
    roeden,
    deurkruk,
    cilinder,
    ventilatieRooster,
    aantal,
  ]);

  const geformatteerdePrijs = berekendePrijs.toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="w-full min-h-screen bg-white">
      {/* HEADER SECTIE */}
      <div className="w-full bg-slate-50 border-b border-slate-100 py-4">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link
            href="/deuren"
            className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-slate-400 hover:text-[#1066a3] transition-colors uppercase tracking-wider">
            &larr; Terug naar overzicht
          </Link>
          <div className="hidden sm:flex items-center space-x-6 text-xs font-semibold text-slate-400">
            <span className="text-[#1066a3]">1. Samenstellen</span>
            <span>&rarr;</span>
            <span>2. Overzicht</span>
            <span>&rarr;</span>
            <span>3. Aanvraag</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 md:py-10 font-sans text-slate-600">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* VISUALISATIE EN EXTRA INFORMATIE KOLOM (LINKS) */}
          <div className="lg:col-span-7 flex flex-col w-full space-y-8">
            <div>
              <h1 className="text-xl md:text-3xl font-bold uppercase text-slate-800 mb-2 tracking-tight border-l-4 border-[#1066a3] pl-4">
                {deur.name} Op Maat
              </h1>
              <p className="text-xs text-slate-400 pl-5 uppercase tracking-wider font-semibold">
                Hoogwaardig glad kunststof kozijn &amp; deursysteem
              </p>
            </div>

            {/* SVG Canvas Box */}
            <div className="w-full bg-slate-50/50 rounded-2xl border border-slate-100 p-4 sm:p-12 flex items-center justify-center min-h-[350px] sm:min-h-[480px] shadow-inner relative overflow-hidden group">
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-100 text-[9px] uppercase font-bold tracking-wider text-slate-500 shadow-sm">
                Buitenaanzicht
              </div>
              <svg
                viewBox={`0 0 ${deur.v * 100} 100`}
                className="w-full h-auto drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                style={{ maxHeight: "430px" }}
                preserveAspectRatio="xMidYMid meet">
                {deur.components}
              </svg>
            </div>

            {/* TABBLADEN VOOR PRODUCTINFORMATIE */}
            <div className="w-full border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm">
              <div className="flex border-b border-slate-200 bg-slate-50">
                <button
                  onClick={() => setActiveTab("specificaties")}
                  className={`flex-1 py-3.5 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "specificaties"
                      ? "border-[#1066a3] text-[#1066a3] bg-white"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}>
                  Specificaties
                </button>
                <button
                  onClick={() => setActiveTab("kwaliteit")}
                  className={`flex-1 py-3.5 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "kwaliteit"
                      ? "border-[#1066a3] text-[#1066a3] bg-white"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}>
                  Kwaliteitskeuren
                </button>
                <button
                  onClick={() => setActiveTab("levertijd")}
                  className={`flex-1 py-3.5 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === "levertijd"
                      ? "border-[#1066a3] text-[#1066a3] bg-white"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}>
                  Verzending &amp; Levering
                </button>
              </div>

              <div className="p-6 text-xs leading-relaxed space-y-4">
                {activeTab === "specificaties" && (
                  <div className="space-y-3">
                    <p className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">
                      Technische Producteigenschappen:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-500">
                      <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                        <span className="font-bold block text-slate-700 mb-0.5">
                          Staalversterking
                        </span>
                        Rondom voorzien van zware gegalvaniseerde staalprofielen
                        in zowel kader als vleugel.
                      </div>
                      <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                        <span className="font-bold block text-slate-700 mb-0.5">
                          Dichtingen
                        </span>
                        Hoogwaardige EPDM-lasbare dichtingen voor maximale wind-
                        en waterdichtheid.
                      </div>
                      <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                        <span className="font-bold block text-slate-700 mb-0.5">
                          Inbraakwerendheid
                        </span>
                        Standaard voorbereid voor SKG*** gecertificeerd hang- en
                        sluitwerk en meerpuntssluitingen.
                      </div>
                      <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                        <span className="font-bold block text-slate-700 mb-0.5">
                          Onderhoudsvrij
                        </span>
                        Gladde, uv-bestendige kunststof toplaag. Schilderen of
                        lakken behoort definitief tot de verleden tijd.
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "kwaliteit" && (
                  <div className="space-y-3">
                    <p className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">
                      Certificeringen &amp; Garanties:
                    </p>
                    <p className="text-slate-500">
                      Onze kunststof deuren en kozijnen voldoen aan de strengste
                      Europese kwaliteitsnormen. Elk element wordt geproduceerd
                      onder strikte fabriekskwaliteitscontrole.
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-slate-500">
                      <li>
                        <strong className="text-slate-700">
                          CE-Markering:
                        </strong>{" "}
                        Volledig gecertificeerd volgens EN 14351-1.
                      </li>
                      <li>
                        <strong className="text-slate-700">
                          SKG Gecertificeerd:
                        </strong>{" "}
                        Hang- en sluitwerk opties voldoen aan SKG** of SKG***
                        normen.
                      </li>
                      <li>
                        <strong className="text-slate-700">
                          Garantietermijn:
                        </strong>{" "}
                        10 jaar fabrieksgarantie op de kleurechtheid en
                        vormvastheid van het gladde kunststofprofiel.
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === "levertijd" && (
                  <div className="space-y-3">
                    <p className="font-bold text-slate-700 uppercase tracking-wide text-[11px]">
                      Logistieke afhandeling:
                    </p>
                    <p className="text-slate-500">
                      Omdat elk kozijn en elke deur exact op de millimeter
                      nauwkeurig voor u wordt geproduceerd, hanteren wij een
                      dynamische en transparante levertijd.
                    </p>
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-[11px]">
                      <strong>Let op:</strong> De actuele gemiddelde levertijd
                      voor specifieke gladde kunststof configuraties bedraagt
                      momenteel ca. 6 tot 8 weken. Wij leveren rechtstreeks op
                      bokken aan huis met gespecialiseerd transport.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DYNAMISCH CONFIGURATIE FORMULIER (RECHTS) */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 shadow-md sticky top-6">
              {/* Prijsdisplay */}
              <div className="flex justify-between items-end mb-6 sm:mb-8 border-b border-slate-100 pb-6">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">
                    Calculatie Totaal
                  </span>
                  <span className="text-2xl sm:text-4xl text-slate-800 font-black tracking-tight">
                    &euro; {geformatteerdePrijs}
                  </span>
                </div>
                <span className="text-[10px] text-[#1066a3] font-black uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-md mb-1 shadow-sm">
                  Incl. 21% BTW
                </span>
              </div>

              {/* Aanpasbare opties */}
              <div className="space-y-6 max-h-[620px] overflow-y-auto pr-2 scrollbar-thin">
                {/* STAP 1: PROFIEL EN SELECTIES */}
                <div className="space-y-3 border-b border-slate-50 pb-5">
                  <label className="text-[11px] text-slate-800 uppercase font-black tracking-wider flex items-center">
                    <span className="bg-[#1066a3] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] mr-2">
                      1
                    </span>
                    Profiel &amp; Constructie
                  </label>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Type Profielsysteem
                    </span>
                    <select
                      value={profiel}
                      onChange={(e) => setProfiel(e.target.value)}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                      <option value="vlak82">Vlak profielsysteem 82 mm</option>
                      <option value="verdiept120">
                        Verdiept profielsysteem 120 mm
                      </option>
                      <option value="verdiept120hvl">
                        Verdiept profielsysteem 120 mm (HVL
                        Hout-Verbinding-Look)
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Aanslagflens
                      </span>
                      <select
                        value={aanslag}
                        onChange={(e) => setAanslag(e.target.value)}
                        className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                        <option value="ja">Met aanslag</option>
                        <option value="nee">Zonder aanslag</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Type Dorpel
                      </span>
                      <select
                        value={onderdorpel}
                        onChange={(e) => setOnderdorpel(e.target.value)}
                        className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                        <option value="alu">
                          Aluminium onderdorpel (Standaard)
                        </option>
                        <option value="kader">
                          Rondom doorlopend kader (Vaste drempel)
                        </option>
                        <option value="dts">
                          Luxe DTS laagdrempel-onderdorpel
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Draairichting &amp; Scharnierzijde
                    </span>
                    <select
                      value={draairichting}
                      onChange={(e) => setDraairichting(e.target.value)}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                      <option value="buitenLinks">
                        Naar buiten draaiend - Scharnieren LINKS
                        (buitenaanzicht)
                      </option>
                      <option value="buitenRechts">
                        Naar buiten draaiend - Scharnieren RECHTS
                        (buitenaanzicht)
                      </option>
                      <option value="binnenLinks">
                        Naar binnen draaiend - Scharnieren LINKS
                        (binnenaanzicht)
                      </option>
                      <option value="binnenRechts">
                        Naar binnen draaiend - Scharnieren RECHTS
                        (binnenaanzicht)
                      </option>
                    </select>
                  </div>
                </div>

                {/* STAP 2: AFMETINGEN OP MM */}
                <div className="space-y-3 border-b border-slate-50 pb-5">
                  <label className="text-[11px] text-slate-800 uppercase font-black tracking-wider flex items-center">
                    <span className="bg-[#1066a3] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] mr-2">
                      2
                    </span>
                    Exacte Dimensionering
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Buitenwerkse Breedte (mm)
                      </span>
                      <input
                        type="number"
                        value={breedte}
                        onChange={(e) =>
                          setBreedte(Math.max(0, Number(e.target.value)))
                        }
                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-[#1066a3]/20 outline-none bg-slate-50/30 text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Buitenwerkse Hoogte (mm)
                      </span>
                      <input
                        type="number"
                        value={hoogte}
                        onChange={(e) =>
                          setHoogte(Math.max(0, Number(e.target.value)))
                        }
                        className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-[#1066a3]/20 outline-none bg-slate-50/30 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl text-[9px] text-slate-400 font-medium leading-relaxed">
                    Vul hier de totale buitenwerkse kozijnmaat in millimeters
                    in. Wij produceren exact volgens deze opgave.
                  </div>
                </div>

                {/* STAP 3: STRENG GLADDE KUNSTSTOF KLEUREN */}
                <div className="space-y-3 border-b border-slate-50 pb-5">
                  <label className="text-[11px] text-slate-800 uppercase font-black tracking-wider flex items-center">
                    <span className="bg-[#1066a3] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] mr-2">
                      3
                    </span>
                    Gladde Kunststof Kleuren (Geen Houtmotief)
                  </label>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Afwerking Binnenzijde
                    </span>
                    <select
                      value={kleurBinnen}
                      onChange={(e) => setKleurBinnen(e.target.value)}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                      <option value="wit">Wit (Glad - Standaard)</option>
                      <option value="creme">Cr&egrave;me wit (Glad)</option>
                      <option value="witMat">Wit Mat</option>
                      <option value="cremeMat">Cr&egrave;me wit Mat</option>
                      <option value="antracietMat">Antraciet Mat</option>
                      <option value="zwartMat">Zwart Mat</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Afwerking Buitenkant Profiel (Kozijn)
                    </span>
                    <select
                      value={kleurBuitenProfiel}
                      onChange={(e) => setKleurBuitenProfiel(e.target.value)}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                      <option value="wit">Wit (Glad - Standaard)</option>
                      <option value="creme">Cr&egrave;me wit (Glad)</option>
                      <option value="antracietMat">Antraciet Mat</option>
                      <option value="blauwMat">Blauw Mat</option>
                      <option value="cremeMat">Cr&egrave;me wit Mat</option>
                      <option value="groenMat">Groen Mat</option>
                      <option value="witMat">Wit Mat</option>
                      <option value="zwartMat">Zwart Mat</option>
                      <option value="basaltMat">Basalt grijs Mat</option>
                      <option value="kwartsMat">Kwarts grijs Mat</option>
                      <option value="monumentenBlauwMat">
                        Monumenten blauw Mat
                      </option>
                      <option value="monumentenGroenMat">
                        Monumenten groen Mat
                      </option>
                      <option value="wijnroodMat">Wijnrood Mat</option>
                      <option value="zwartgrijsMat">Zwart grijs Mat</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Afwerking Buitenkant Vleugel (Deurblad)
                    </span>
                    <select
                      value={kleurBuitenVleugel}
                      onChange={(e) => setKleurBuitenVleugel(e.target.value)}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                      <option value="wit">Wit (Glad - Standaard)</option>
                      <option value="creme">Cr&egrave;me wit (Glad)</option>
                      <option value="antracietMat">Antraciet Mat</option>
                      <option value="blauwMat">Blauw Mat</option>
                      <option value="cremeMat">Cr&egrave;me wit Mat</option>
                      <option value="groenMat">Groen Mat</option>
                      <option value="witMat">Wit Mat</option>
                      <option value="zwartMat">Zwart Mat</option>
                      <option value="basaltMat">Basalt grijs Mat</option>
                      <option value="kwartsMat">Kwarts grijs Mat</option>
                    </select>
                  </div>
                </div>

                {/* STAP 4: BEGLAZING EN VULLING */}
                <div className="space-y-3 border-b border-slate-50 pb-5">
                  <label className="text-[11px] text-slate-800 uppercase font-black tracking-wider flex items-center">
                    <span className="bg-[#1066a3] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] mr-2">
                      4
                    </span>
                    Beglazing &amp; Glaslatten
                  </label>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Glastype / Kernvulling
                    </span>
                    <select
                      value={glas}
                      onChange={(e) => setGlas(e.target.value)}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                      <option value="dubbel">
                        HR++ Dubbel helder glas (Standaard)
                      </option>
                      <option value="dubbelMat">
                        HR++ Dubbel mat / satijnglas
                      </option>
                      <option value="dubbelGelaagdBinnen">
                        HR++ Dubbel glas - 1-zijdig gelaagd (Letselveilig)
                      </option>
                      <option value="dubbelGelaagdBinnenMat">
                        HR++ Dubbel matglas - 1-zijdig gelaagd
                      </option>
                      <option value="dubbelGelaagdDubbel">
                        HR++ Dubbel glas - 2-zijdig gelaagd (Inbraakwerend)
                      </option>
                      <option value="dubbelGelaagdDubbelMat">
                        HR++ Dubbel matglas - 2-zijdig gelaagd
                      </option>
                      <option value="sandwich">
                        Geïsoleerd glad kunststof sandwichpaneel (24mm)
                      </option>
                      <option value="geen">
                        Geen glas (Losse levering van glaslatten geschikt voor
                        24mm)
                      </option>
                      <option value="triple">
                        HR+++ Triple helder glas (3-laags)
                      </option>
                      <option value="tripleMat">
                        HR+++ Triple matglas (Middelste ruit mat)
                      </option>
                      <option value="tripleGelaagdBinnen">
                        HR+++ Triple glas - 1-zijdig gelaagd
                      </option>
                      <option value="tripleGelaagdBinnenMat">
                        HR+++ Triple matglas - 1-zijdig gelaagd
                      </option>
                      <option value="tripleGelaagdDubbel">
                        HR+++ Triple glas - 2-zijdig gelaagd
                      </option>
                      <option value="tripleGelaagdDubbelMat">
                        HR+++ Triple matglas - 2-zijdig gelaagd
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Afstandshouder
                      </span>
                      <select
                        value={afstandshouder}
                        onChange={(e) => setAfstandshouder(e.target.value)}
                        className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                        <option value="alu">Aluminium (Standaard)</option>
                        <option value="zwart">
                          Warm-Edge zwart (Thermische onderbreking)
                        </option>
                        <option value="nvt">
                          Niet van toepassing (bijv. Paneelvulling)
                        </option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Kruisroeden
                      </span>
                      <select
                        value={roeden}
                        onChange={(e) => setRoeden(e.target.value)}
                        className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                        <option value="geen">Geen roeden</option>
                        <option value="tussen18_6">
                          In het glas geïntegreerd (18 mm) - 6-vaks
                        </option>
                        <option value="tussen18_8">
                          In het glas geïntegreerd (18 mm) - 8-vaks
                        </option>
                        <option value="wiener26_6">
                          Wienersprossen (Opgeplakt met binnenspouwlat) - 6-vaks
                        </option>
                        <option value="wiener26_8">
                          Wienersprossen (Opgeplakt met binnenspouwlat) - 8-vaks
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* STAP 5: VERGRENDELING EN BESLAG */}
                <div className="space-y-3 pb-2">
                  <label className="text-[11px] text-slate-800 uppercase font-black tracking-wider flex items-center">
                    <span className="bg-[#1066a3] text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] mr-2">
                      5
                    </span>
                    Hang- &amp; Sluitwerk Eigenschappen
                  </label>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Krukset / Greepbeslag
                    </span>
                    <select
                      value={deurkruk}
                      onChange={(e) => setDeurkruk(e.target.value)}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                      <option value="standaardZilver">
                        Kruk/Kruk geanodiseerd zilver - SKG***
                      </option>
                      <option value="vincentZilver">
                        Luxe designkruk Vincent zilver - SKG***
                      </option>
                      <option value="stang800">
                        RVS handgreep rond Recht model - Lengte 800mm
                      </option>
                      <option value="stang1700">
                        RVS handgreep rond Recht model - Lengte 1700mm
                      </option>
                      <option value="standaardZwart">
                        Kruk/Kruk Modern Mat Zwart gecoat - SKG***
                      </option>
                      <option value="vincentZwart">
                        Luxe designkruk Vincent gecoat Zwart - SKG***
                      </option>
                      <option value="stang800Zwart">
                        Mat Zwarte handgreep Recht model - Lengte 800mm
                      </option>
                      <option value="stang1700Zwart">
                        Mat Zwarte handgreep Recht model - Lengte 1700mm
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Cilinderslot
                      </span>
                      <select
                        value={cilinder}
                        onChange={(e) => setCilinder(e.target.value)}
                        className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                        <option value="standaard">
                          Profilcilinder incl. 3 sleutels
                        </option>
                        <option value="gelijksluitend">
                          Gelijksluitend ingesteld (Handig bij meerdere deuren)
                        </option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">
                        Ventilatierooster
                      </span>
                      <select
                        value={ventilatieRooster}
                        onChange={(e) => setVentilatieRooster(e.target.value)}
                        className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                        <option value="nee">Geen ventilatierooster</option>
                        <option value="ja">
                          Inclusief wind- en waterdicht THV rooster
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      Montagevoorbereiding
                    </span>
                    <select
                      value={voorboren}
                      onChange={(e) => setVoorboren(e.target.value)}
                      className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50/50 outline-none text-xs font-bold appearance-none cursor-pointer focus:border-[#1066a3]">
                      <option value="nee">Kozijnstijlen niet voorboren</option>
                      <option value="ja">
                        Kozijnstijlen rondom fabriekmatig voorboren (diameter 6
                        mm)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AANTAL EN VERZEND-ACTIE */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
                <span className="text-[11px] text-slate-500 uppercase font-black tracking-wider">
                  Bestelaantal
                </span>
                <div className="flex items-center space-x-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAantal(Math.max(1, aantal - 1))}
                    className="w-8 h-8 border border-slate-200 bg-white rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-transform">
                    -
                  </button>
                  <span className="text-xs font-black text-slate-800 w-8 text-center">
                    {aantal}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAantal(aantal + 1)}
                    className="w-8 h-8 border border-slate-200 bg-white rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-transform">
                    +
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full bg-[#1066a3] hover:bg-[#0d5486] text-white py-4 rounded-xl shadow-lg shadow-[#1066a3]/20 transition-all text-xs font-black uppercase tracking-[0.15em] active:scale-[0.99]">
                  Voeg toe aan offerteaanvraag
                </button>
              </div>

              {/* USP'S ONDER DE BESTELKNOP */}
              <div className="mt-5 grid grid-cols-3 gap-2 text-center border-t border-slate-50 pt-4 text-slate-400 font-bold uppercase tracking-tight text-[8px]">
                <div className="flex flex-col items-center">
                  <span className="text-[#1066a3] text-sm mb-0.5">✓</span> 100%
                  Maatwerk
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#1066a3] text-sm mb-0.5">✓</span> SKG
                  Gecertificeerd
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[#1066a3] text-sm mb-0.5">✓</span>{" "}
                  Direct van de Fabriek
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
