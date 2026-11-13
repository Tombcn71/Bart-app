"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { addToCart, getCart } from "@/lib/cart";
import { CartAddedModal } from "@/app/components/CartAddedModal";
import { NumberInput } from "@/app/components/NumberInput";
import { FormField } from "@/app/components/FormField";
import { getMatrix } from "@/lib/matrix";
import { STANDAARD_KEUZES } from "@/lib/standaardopties";
import { BEGINMATEN } from "@/lib/beginmaten";
import { ALU_BEGINMATEN, ALU_CATALOGUS } from "@/lib/aluminium";
import { EXTRA_MAAT, MAATGRENZEN_ALU, MAATGRENZEN_KUNSTSTOF } from "@/lib/maatgrenzen";
import { berekenStandaard, btwPercentage, eersteKeuze, isStandaardModel, keuzeNaam, nieuwStandaardModel, KOZIJN_CATALOGUS } from "@/lib/prijsmodel";
import { GevelFoto, GevelKeuze, type GevelId, KOZIJN_KLEUREN, heeftGevelFoto } from "@/app/components/GevelFoto";
import { KozijnTechnisch, TECHNISCH } from "@/app/components/KozijnTechnisch";
import Image from "next/image";
import { FOTO_GEVELS, FOTO_TYPES, fotoKleurVan, kozijnFotoPad, type FotoGevel } from "@/lib/kozijnfotos";
import {
  GlassVast,
  GlassDK,
  GlassKiep,
  GlassVastBovenlichtKiep,
  GlassDkBovenlichtVast,
  GlassDkBovenlichtKiep,
  GlassDkBorstweringVast,
  GlassKiepKiep,
  GlassDkDkStolpBovenlichtVast,
  GlassDkVastBovenlichtenVast,
  GlassDkBovenlichtKiepVast,
  GlassVastBovenlichtKiepVast,
  GlassDkBovenlichtVastVast,
  GlassDkVastVastKozijn,
  GlassDkDkDkKozijn,
  GlassDkVastDkBovenlichtenVast,
  GlassVastDkVastBovenlichtenVast,
} from "@/lib/kozijn-svgs";

const FRAME_COLOR = "#2d3748";

const DEFAULT_MATRIX = {
  basisPrijs: 0,
  m2Tarief: { vast: 0, dk: 0, kiep: 0 },
  kleurToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "ral-kleur": 0 },
  kleurBuitenkantToeslag: {
    wit: 0,
    "creme-wit": 0,
    antraciet: 0,
    "basalt-grijs": 0,
    "kwarts-grijs": 0,
    zwart: 0,
  },
  glasToeslag: { "hr-plus-plus": 0, "triple-glas": 0 },
  profielToeslag: {
    "vlak-82": 0,
    "creon-82": 0,
    "creon-verdiept-120": 0,
    "creon-verdiept-120-hvl": 0,
  },
  aanslagToeslag: { ja: 0, nee: 0 },
  afstandshouderToeslag: { aluminium: 0, zwart: 0 },
  roedenToeslag: {
    geen: 0,
    "6-vaks-18mm": 0,
    "8-vaks-18mm": 0,
    "6-vaks-26mm": 0,
    "8-vaks-26mm": 0,
  },
  ventilatieRoosterToeslag: { nee: 0, ja: 0 },
  voorborenToeslag: { "niet-voorboren": 0, voorboren: 0 },
};

const KOZIJNEN = [
    {
      slug: "vast-kozijn",
      v: 1,
      types: ["vast"],
      name: "Vast kozijn",
      components: <GlassVast x={0} />,
    },
    {
      slug: "draai-kiep-kozijn",
      v: 1,
      types: ["dk"],
      name: "Draai kiep kozijn",
      components: <GlassDK x={0} />,
    },
    {
      slug: "kiep-kozijn",
      v: 1,
      types: ["kiep"],
      name: "Kiep kozijn",
      components: <GlassKiep x={0} />,
    },
    {
      slug: "vast-bovenlicht-kiep",
      v: 1,
      types: ["vast", "kiep"],
      name: "Vast met bovenlicht kiep",
      components: <GlassVastBovenlichtKiep x={0} />,
    },
    {
      slug: "dk-bovenlicht-vast",
      v: 1,
      types: ["dk", "vast"],
      name: "Draai/kiep met bovenlicht vast",
      components: <GlassDkBovenlichtVast x={0} />,
    },
    {
      slug: "dk-bovenlicht-kiep",
      v: 1,
      types: ["dk", "kiep"],
      name: "Draai/kiep met bovenlicht kiep",
      components: <GlassDkBovenlichtKiep x={0} />,
    },
    {
      slug: "dk-borstwering-vast",
      v: 1,
      types: ["dk", "vast"],
      name: "Draai/kiep met borstwering",
      components: <GlassDkBorstweringVast x={0} />,
    },
    {
      slug: "dk-13-vast-23",
      v: 2,
      types: ["dk", "vast"],
      aandelen: [1 / 3, 2 / 3],
      deling: 200 / 3,
      populair: true,
      name: "Draai kiep 1/3 - Vast 2/3",
      components: [
        <g key="1" transform="scale(0.6667, 1)">
          <GlassDK x={0} />
        </g>,
        <g key="2" transform="translate(66.67, 0) scale(1.3333, 1)">
          <GlassVast x={0} />
        </g>,
      ],
    },
    {
      slug: "draai-kiep-vast-kozijn",
      v: 2,
      types: ["dk", "vast"],
      name: "Draai kiep - Vast",
      components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      slug: "draai-kiep-draai-stolp-kozijn",
      v: 2,
      types: ["dk", "dk"],
      name: "Draai kiep - Draai kiep",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} mirror />,
      ],
    },
    {
      slug: "vast-vast-kozijn",
      v: 2,
      types: ["vast", "vast"],
      name: "Vast - Vast",
      components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      slug: "dk-dk-gelijk",
      v: 2,
      types: ["dk", "dk"],
      name: "Draai kiep - Draai kiep gelijk",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} mirror />,
      ],
    },
    {
      slug: "kiep-vast-liggend",
      v: 2,
      types: ["kiep", "vast"],
      name: "Kiep - vast kozijn",
      components: [<GlassKiep key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      slug: "kiep-kiep-kozijn",
      v: 2,
      types: ["kiep", "kiep"],
      name: "Kiep - kiep kozijn",
      components: [<GlassKiepKiep key="1" x={0} />],
    },
    {
      slug: "dk-dk-stolp-bovenlicht-vast-2vaks",
      v: 2,
      types: ["dk", "dk"],
      name: "Draai/kiep - draai stolp bovenlicht",
      components: [<GlassDkDkStolpBovenlichtVast key="1" x={0} />],
    },
    {
      slug: "dk-vast-bovenlichten-vast-2vaks",
      v: 2,
      types: ["dk", "vast"],
      name: "Draai/kiep - vast bovenlichten",
      components: [<GlassDkVastBovenlichtenVast key="1" x={0} />],
    },
    {
      slug: "dk-bovenlicht-kiep-vast-2vaks",
      v: 2,
      types: ["dk", "kiep"],
      name: "Draai/kiep bovenlicht kiep - vast",
      components: [<GlassDkBovenlichtKiepVast key="1" x={0} />],
    },
    {
      slug: "vast-bovenlicht-kiep-vast-2vaks",
      v: 2,
      types: ["vast", "kiep"],
      name: "Vast bovenlicht kiep - vast",
      components: [<GlassVastBovenlichtKiepVast key="1" x={0} />],
    },
    {
      slug: "dk-bovenlicht-vast-vast-2vaks",
      v: 2,
      types: ["dk", "vast"],
      name: "Draai/kiep bovenlicht vast - vast",
      components: [<GlassDkBovenlichtVastVast key="1" x={0} />],
    },
    {
      slug: "draai-kiep-vast-draai-kiep-kozijn",
      v: 3,
      types: ["dk", "vast", "dk"],
      name: "Draai kiep - Vast - Draai kiep",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassDK key="3" x={200} mirror />,
      ],
    },
    {
      slug: "vast-vast-vast-kozijn",
      v: 3,
      types: ["vast", "vast", "vast"],
      name: "Vast - Vast - Vast",
      components: [
        <GlassVast key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassVast key="3" x={200} />,
      ],
    },
    {
      slug: "vast-draai-kiep-vast-kozijn",
      v: 3,
      types: ["vast", "dk", "vast"],
      name: "Vast - Draai kiep - Vast",
      components: [
        <GlassVast key="1" x={0} />,
        <GlassDK key="2" x={100} />,
        <GlassVast key="3" x={200} />,
      ],
    },
    {
      slug: "draai-kiep-vast-vast-kozijn",
      v: 3,
      types: ["dk", "vast", "vast"],
      name: "Draai/kiep - Vast - Vast",
      components: [<GlassDkVastVastKozijn key="1" x={0} />],
    },
    {
      slug: "draai-kiep-draai-kiep-draai-kiep-kozijn",
      v: 3,
      types: ["dk", "dk", "dk"],
      name: "3x Draai/kiep",
      components: [<GlassDkDkDkKozijn key="1" x={0} />],
    },
    {
      slug: "draai-kiep-vast-dk-bovenlichten-vast",
      v: 3,
      types: ["dk", "vast", "dk"],
      name: "DK - Vast - DK bovenlichten",
      components: [<GlassDkVastDkBovenlichtenVast key="1" x={0} />],
    },
    {
      slug: "vast-dk-vast-bovenlichten-vast",
      v: 3,
      types: ["vast", "dk", "vast"],
      name: "Vast - DK - Vast bovenlichten",
      components: [<GlassVastDkVastBovenlichtenVast key="1" x={0} />],
    },
    {
      slug: "draai-kiep-vast-vast-draai-kiep-kozijn",
      v: 4,
      types: ["dk", "vast", "vast", "dk"],
      name: "DK - Vast - Vast - DK",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassVast key="3" x={200} />,
        <GlassDK key="4" x={300} mirror />,
      ],
    },
    {
      slug: "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn",
      v: 4,
      types: ["dk", "dk", "dk", "dk"],
      name: "4x Draai kiep",
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} />,
        <GlassDK key="3" x={200} />,
        <GlassDK key="4" x={300} />,
      ],
    },
];

const getKozijnData = (slug: string) => KOZIJNEN.find((k) => k.slug === slug) || null;

/** De tekening van een kozijntype, voor het prijsscherm. */
export function kozijnTekening(slug: string) {
  const k = getKozijnData(slug);
  const [b, h] = BEGINMATEN[slug] ?? [1000, 1000];
  return k ? <KozijnTekening kozijn={k} className="h-full max-w-full" breedte={b} hoogte={h} maten={false} /> : null;
}

/**
 * De tekening van een kozijntype. Met breedte en hoogte (mm) krijgt het type de nieuwe technische tekening
 * in de echte verhoudingen; zonder die maten, of voor een type zonder technische tekening, blijft de oude SVG.
 */
function KozijnTekening({
  kozijn,
  className,
  breedte,
  hoogte,
  maten = false,
  aanzicht = "binnen",
}: {
  kozijn: (typeof KOZIJNEN)[number];
  className?: string;
  breedte?: number;
  hoogte?: number;
  maten?: boolean;
  aanzicht?: "binnen" | "buiten";
}) {
  const spec = TECHNISCH[kozijn.slug];
  if (spec && breedte && hoogte) {
    // Kleine kaartjes gaven de oude SVG een vaste lijndikte mee; de nieuwe tekening schaalt zijn lijnen zelf.
    const klasse = className?.replace("**:[vector-effect:non-scaling-stroke]", "").trim();
    return <KozijnTechnisch breedte={breedte} hoogte={hoogte} spec={spec} aanzicht={aanzicht} maten={maten} className={klasse} />;
  }
  return (
    <svg viewBox={`0 0 ${kozijn.v * 100} 100`} className={className} aria-hidden="true">
      <rect
        x="0.4"
        y="0.4"
        width={kozijn.v * 100 - 0.8}
        height="99.2"
        fill="white"
        stroke={FRAME_COLOR}
        strokeWidth="0.8"
      />
      {Array.from({ length: kozijn.v - 1 }).map((_, i) => (
        <line
          key={i}
          x1={kozijn.deling ?? (i + 1) * 100}
          y1="0"
          x2={kozijn.deling ?? (i + 1) * 100}
          y2="100"
          stroke={FRAME_COLOR}
          strokeWidth="0.8"
        />
      ))}
      {kozijn.components}
    </svg>
  );
}


const TYPE_NAMEN: Record<string, string> = { vast: "vast", dk: "draai-kiep", kiep: "kiep" };
const euro = (n: number) =>
  `€ ${n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const nl = (n: number) => n.toLocaleString("nl-NL", { maximumFractionDigits: 2 });
const optieNaam = (k: string) => k.replace(/-/g, " ").replace(/creon /gi, "").trim();

/** Vult de opgeslagen prijzen van het bedrijf aan met de standaardwaarden. */
function maakMatrix(data: any) {
  if (data?.model === "standaard") return data;
  const m: any = { ...DEFAULT_MATRIX, ...(data && Object.keys(data).length ? data : {}) };
  // Zorg dat glasToeslag alleen de sleutels uit DEFAULT_MATRIX bevat (verwijdert oude DB-sleutels)
  m.glasToeslag = Object.fromEntries(
    Object.keys(DEFAULT_MATRIX.glasToeslag).map((k) => [k, data?.glasToeslag?.[k] ?? 0]),
  );
  // Oude data had m2Tarief als los getal; migreer naar per-type tarief.
  m.m2Tarief =
    typeof data?.m2Tarief === "number"
      ? { vast: data.m2Tarief, dk: data.m2Tarief, kiep: data.m2Tarief }
      : { ...DEFAULT_MATRIX.m2Tarief, ...(data?.m2Tarief || {}) };
  return m;
}

/**
 * De calculator van de klant: gevel, aantal ramen, type, kleur, maten en prijs.
 * Met `matrix` rekent hij met prijzen van buiten (het voorbeeld in het dashboard, ook nog niet
 * opgeslagen); zonder haalt hij de opgeslagen prijzen van het bedrijf op.
 */
export function KozijnConfigurator({
  startSlug = "dk-13-vast-23",
  startMatrix,
  matrix: matrixProp,
  voorbeeld = false,
  product = "kunststof",
  urlSync = true,
}: {
  startSlug?: string;
  /** De opgeslagen prijzen van het bedrijf, op de server opgehaald (dan hoeft de browser ze niet meer te halen). */
  startMatrix?: unknown;
  /** Aluminium heeft eigen kozijntypes, keuzes en prijzen. */
  product?: "kunststof" | "aluminium";
  /** Zet het gekozen type in de adresbalk (op de eigen pagina van het type). Uit op het startscherm. */
  urlSync?: boolean;
  matrix?: any;
  /** Voorbeeld in het dashboard: één smalle kolom, zonder offerteknop en winkelmandje. */
  voorbeeld?: boolean;
}) {
  const alu = product === "aluminium";
  const cat = alu ? ALU_CATALOGUS : KOZIJN_CATALOGUS;
  // Aluminium biedt alleen de kozijntypes die er ook echt voor zijn.
  const lijst = alu ? KOZIJNEN.filter((k) => k.slug in ALU_CATALOGUS.typen) : KOZIJNEN;
  const [slug, setSlug] = useState(alu && !(startSlug in ALU_CATALOGUS.typen) ? lijst[0].slug : startSlug);
  const typeRij = useRef<HTMLDivElement>(null);
  const kozijn = getKozijnData(slug);
  // Aluminium: de keuzes per groep (profiel, kleur, lak, glas, ...) in één lijst.
  const [aluKeuzes, setAluKeuzes] = useState<Record<string, string>>({});

  // Een bedrijf zonder opgeslagen prijzen (leeg object, bijv. een nieuwe klant of de demo) rekent met de standaardprijzen.
  const normaliseer = (data: any) =>
    alu
      ? isStandaardModel(data) ? data : nieuwStandaardModel()
      : isStandaardModel(data) ? data : !data || Object.keys(data).length === 0 ? nieuwStandaardModel() : maakMatrix(data);
  const [opgehaald, setOpgehaald] = useState<any>(() => (startMatrix !== undefined ? normaliseer(startMatrix) : null));
  const matrix = matrixProp ?? opgehaald;
  const standaard = alu || isStandaardModel(matrix);
  // Per kozijntype een eigen beginmaat, zoals de markt die gebruikt. Zonder bekende maat: 1000 mm per raam, 1000 hoog.
  const beginmaat = (s: string): [number, number] => (alu ? ALU_BEGINMATEN : BEGINMATEN)[s] ?? [(getKozijnData(s)?.v ?? 1) * 1000, 1000];
  const [breedte, setBreedte] = useState(() => beginmaat(slug)[0]);
  const [hoogte, setHoogte] = useState(() => beginmaat(slug)[1]);
  const [kleur, setKleur] = useState("");
  const [kleurBuitenkant, setKleurBuitenkant] = useState("");
  const [glas, setGlas] = useState("");
  const [profiel, setProfiel] = useState("");
  const [aanslag, setAanslag] = useState("");
  const [afstandshouder, setAfstandshouder] = useState("");
  const [roeden, setRoeden] = useState("");
  const [ventilatieRooster, setVentilatieRooster] = useState("");
  const [voorboren, setVoorboren] = useState("");
  const [aantal, setAantal] = useState(1);
  // Het preview-venster met de foto op een gevel.
  const [previewOpen, setPreviewOpen] = useState(false);
  // Binnen- of buitenaanzicht van de technische tekening.
  // De tekening toont het binnenaanzicht; de foto toont de buitenkant.
  const aanzicht = "binnen" as const;
  // Tekening of foto op een gevel bij het grote kozijn bovenaan.
  const [weergave, setWeergave] = useState<"tekening" | "foto">("tekening");
  const [fotoGevel, setFotoGevel] = useState<FotoGevel>("zand");
  // De gekozen gevel voor de foto; telt niet mee in de prijs.
  const [gevel, setGevel] = useState<GevelId>("rood");
  // Extra maat bij een bovenlicht of borstwering (hoogte in mm).
  const [extraMaat, setExtraMaat] = useState(() => EXTRA_MAAT[slug]?.begin ?? 0);
  // Particulieren zien de prijs inclusief btw, zakelijke klanten exclusief.
  const [klantType, setKlantType] = useState<"particulier" | "zakelijk">("particulier");
  const [modalOpen, setModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Ander type kiezen op hetzelfde scherm: maten en opties blijven staan, de link gaat mee.
  function kiesType(nieuw: string) {
    // Heeft de klant de maat niet zelf aangepast, dan krijgt het nieuwe type zijn eigen beginmaat.
    const [oudB, oudH] = beginmaat(slug);
    if (breedte === oudB && hoogte === oudH) {
      const [nieuwB, nieuwH] = beginmaat(nieuw);
      setBreedte(nieuwB);
      setHoogte(nieuwH);
    }
    setExtraMaat(EXTRA_MAAT[nieuw]?.begin ?? 0);
    setSlug(nieuw);
    if (!voorbeeld && urlSync) {
      window.history.replaceState(null, "", window.location.pathname.replace(/[^/]+$/, nieuw) + window.location.search);
    }
  }

  useEffect(() => {
    if (!previewOpen) return;
    const sluit = (e: KeyboardEvent) => e.key === "Escape" && setPreviewOpen(false);
    document.addEventListener("keydown", sluit);
    return () => document.removeEventListener("keydown", sluit);
  }, [previewOpen]);

  // Houd het gekozen type zichtbaar in de rij die je opzij veegt.
  useEffect(() => {
    const rij = typeRij.current;
    const actief = rij?.querySelector<HTMLElement>('[data-actief="true"]');
    if (rij && actief) rij.scrollLeft = actief.offsetLeft - 16;
  }, [slug, matrix]);

  function handleAdd() {
    addToCart({
      slug,
      product: `${alu ? "Aluminium " : ""}${kozijn?.name ?? "Kozijn"}`,
      prijs: berekendePrijs,
      specs: {
        breedte,
        hoogte,
        ...(extra ? { [extra.label]: extraMaat } : {}),
        ...(alu
          ? Object.fromEntries(cat.keuzes.map((g) => [g.id, keuzeNaam(g.id, aluKeuzes[g.id] ?? "", cat)]))
          : standaard
          ? {
              kleur: keuzeNaam("kleurBinnen", kleur),
              kleurBuitenkant: keuzeNaam("kleurBuiten", kleurBuitenkant),
              glas: keuzeNaam("glas", glas),
              profiel: keuzeNaam("profiel", profiel),
              aanslag: keuzeNaam("aanslag", aanslag),
              afstandshouder: keuzeNaam("afstandshouder", afstandshouder),
              roeden: keuzeNaam("roeden", roeden),
              ventilatieRooster: keuzeNaam("ventilatie", ventilatieRooster),
              voorboren: keuzeNaam("voorboren", voorboren),
            }
          : { kleur, kleurBuitenkant, glas, profiel, aanslag, afstandshouder, roeden, ventilatieRooster, voorboren }),
        aantal,
        ...(standaard
          ? {
              btw: metBtw ? `Prijs inclusief ${btwPct}% btw` : `Prijs exclusief btw (${btwPct}% btw komt erbij)`,
              btwPercentage: btwPct,
              klantType,
            }
          : {}),
      },
    });
    setCartCount(getCart().length);
    setModalOpen(true);
  }

  // Zonder prijzen van buiten: de opgeslagen prijzen van het bedrijf.
  useEffect(() => {
    if (matrixProp || startMatrix !== undefined) return; // prijzen zijn er al (van buiten of van de server)
    getMatrix(alu ? "alu_kozijn_matrix" : "kozijn_matrix").then((data: any) => setOpgehaald(normaliseer(data)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matrixProp, startMatrix, alu]);

  // Zodra er prijzen zijn: de eerste keuze uit elke lijst (één keer).
  const geinit = useRef(false);
  useEffect(() => {
    if (!matrix || geinit.current) return;
    geinit.current = true;
    if (alu) {
      setAluKeuzes(Object.fromEntries(ALU_CATALOGUS.keuzes.map((g) => [g.id, g.keuzes[0].id])));
      return;
    }
    if (isStandaardModel(matrix)) {
      setKleur(eersteKeuze("kleurBinnen"));
      setKleurBuitenkant(KOZIJN_KLEUREN[0].id);
      setGlas(eersteKeuze("glas"));
      setProfiel(eersteKeuze("profiel"));
      setAanslag(eersteKeuze("aanslag"));
      setAfstandshouder(eersteKeuze("afstandshouder"));
      setRoeden(eersteKeuze("roeden"));
      setVentilatieRooster(eersteKeuze("ventilatie"));
      setVoorboren(eersteKeuze("voorboren"));
      return;
    }
    setKleur(Object.keys(matrix.kleurToeslag || {})[0] || "");
    setKleurBuitenkant(KOZIJN_KLEUREN[0].id);
    setGlas(Object.keys(matrix.glasToeslag || {})[0] || "");
    setProfiel(Object.keys(matrix.profielToeslag || {})[0] || "");
    setAanslag(Object.keys(matrix.aanslagToeslag || {})[0] || "");
    setAfstandshouder(Object.keys(matrix.afstandshouderToeslag || {})[0] || "");
    setRoeden(Object.keys(matrix.roedenToeslag || {})[0] || "");
    setVentilatieRooster(Object.keys(matrix.ventilatieRoosterToeslag || {})[0] || "");
    setVoorboren(Object.keys(matrix.voorborenToeslag || {})[0] || "");
  }, [matrix]);

  // Binnenwerkse maten: buitenwerkse - 54mm (27mm aanslag per zijde)
  const binnenwerksBreedte = Math.max(0, breedte - 54);
  const binnenwerkseHoogte = Math.max(0, hoogte - 54);

  // Eén berekening voor de prijs en voor de opbouw die het bedrijf in het voorbeeld ziet.
  const opbouwBasis = useMemo(() => {
    const regels: { label: string; bedrag: number }[] = [];
    if (!matrix || !kozijn || breedte <= 0 || hoogte <= 0) return { regels, totaal: 0 };
    if (alu) {
      return berekenStandaard(
        isStandaardModel(matrix) ? matrix : nieuwStandaardModel(),
        slug,
        breedte,
        hoogte,
        aluKeuzes,
        { vakken: kozijn.v, vleugels: kozijn.types.filter((t: string) => t !== "vast").length },
        aantal,
        ALU_CATALOGUS,
      );
    }
    if (isStandaardModel(matrix)) {
      return berekenStandaard(
        matrix,
        slug,
        breedte,
        hoogte,
        { profiel, aanslag, kleurBinnen: kleur, kleurBuiten: kleurBuitenkant, glas, afstandshouder, roeden, ventilatie: ventilatieRooster, voorboren },
        { vakken: kozijn.v, vleugels: kozijn.types.filter((t: string) => t !== "vast").length },
        aantal,
      );
    }
    const oppervlakte = (breedte / 1000) * (hoogte / 1000);
    // [titel, gekozen optie, toeslagtabel, rekent per m²]
    const toeslagen: [string, string, Record<string, number> | undefined, boolean][] = [
      ["Type glas", glas, matrix.glasToeslag, true],
      ["Kleur binnenkant", kleur, matrix.kleurToeslag, false],
      ["Kleur buitenkant", kleurBuitenkant, matrix.kleurBuitenkantToeslag, false],
      ["Type profiel", profiel, matrix.profielToeslag, false],
      ["Aanslag", aanslag, matrix.aanslagToeslag, false],
      ["Type afstandshouder", afstandshouder, matrix.afstandshouderToeslag, false],
      ["Roeden", roeden, matrix.roedenToeslag, false],
      ["Ventilatie rooster", ventilatieRooster, matrix.ventilatieRoosterToeslag, false],
      ["Voorboren", voorboren, matrix.voorborenToeslag, false],
    ];
    if (matrix.basisPrijs) regels.push({ label: "Basisprijs", bedrag: matrix.basisPrijs });
    kozijn.types.forEach((type: string, i: number) => {
      // De oppervlakte verdeeld over de onderdelen: gelijk, tenzij het type een eigen verdeling heeft.
      const m2 = oppervlakte * (kozijn.aandelen?.[i] ?? 1 / kozijn.types.length);
      const deel = kozijn.types.length > 1 ? `Raam ${i + 1}, ` : "";
      const tarief = matrix.m2Tarief?.[type] ?? 0;
      regels.push({
        label: `${deel}${TYPE_NAMEN[type] ?? type}: ${nl(m2)} m² × ${euro(tarief)}`,
        bedrag: m2 * tarief,
      });
      for (const [titel, gekozen, tabel, perM2] of toeslagen) {
        const t = tabel?.[gekozen] ?? 0;
        if (!t) continue;
        regels.push({
          label: `${deel}${titel}: ${optieNaam(gekozen)}${perM2 ? " (per m²)" : ""}`,
          bedrag: perM2 ? m2 * t : t,
        });
      }
    });
    const totaal = regels.reduce((som, r) => som + r.bedrag, 0);
    return { regels, totaal: parseFloat((totaal * aantal).toFixed(2)) };
  }, [
    breedte,
    hoogte,
    kleur,
    kleurBuitenkant,
    glas,
    profiel,
    aanslag,
    afstandshouder,
    roeden,
    ventilatieRooster,
    voorboren,
    aantal,
    matrix,
    kozijn,
    slug,
    aluKeuzes,
    alu,
  ]);
  // Een hogere of lagere borstwering kost een paar cent per mm; het bovenlicht verandert de prijs niet.
  const extra = EXTRA_MAAT[slug];
  const opbouw = (() => {
    if (!extra?.prijsPerMm || extraMaat === extra.begin || opbouwBasis.totaal === 0) return opbouwBasis;
    const bedrag = (extraMaat - extra.begin) * extra.prijsPerMm;
    return { regels: [...opbouwBasis.regels, { label: `${extra.label} ${nl(extraMaat)} mm`, bedrag }], totaal: Math.round((opbouwBasis.totaal + bedrag * aantal) * 100) / 100 };
  })();
  // Buiten de maten die de fabriek standaard maakt kan niet besteld worden.
  const grenzen = (alu ? MAATGRENZEN_ALU : MAATGRENZEN_KUNSTSTOF)[slug];
  const buitenMaat = !!grenzen && (breedte < grenzen.minB || breedte > grenzen.maxB || hoogte < grenzen.minH || hoogte > grenzen.maxH);
  // De tekening blijft altijd de nieuwe tekening, ook bij een leeg veld of een maat die je nog aan het typen bent:
  // hij tekent dan binnen de toegestane maten van dit type.
  const klem = (v: number, min = 300, max = 6000) => Math.min(max, Math.max(min, v || 0));
  const tekenB = klem(breedte, grenzen?.minB, grenzen?.maxB);
  const tekenH = klem(hoogte, grenzen?.minH, grenzen?.maxH);
  const extraBuiten = !!extra && ((extra.min !== undefined && extraMaat < extra.min) || (extra.max !== undefined && extraMaat > extra.max));
  const btwPct = isStandaardModel(matrix) ? btwPercentage(matrix) : alu ? 21 : 0;
  const metBtw = standaard && klantType === "particulier";
  const berekendePrijs = metBtw ? Math.round(opbouw.totaal * (1 + btwPct / 100) * 100) / 100 : opbouw.totaal;

  if (!matrix)
    return <div className="p-10 text-center">Prijzen ophalen...</div>;
  if (!kozijn)
    return (
      <div className="p-10 text-center text-red-500">Kozijn niet gevonden.</div>
    );

  const sel = (
    label: string,
    value: string,
    setter: (v: string) => void,
    opties: Record<string, number>,
  ) => (
    <div>
      <label className="text-[11px] font-bold text-slate-800 uppercase">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="w-full border p-2.5 rounded-lg text-sm capitalize">
        {Object.keys(opties).map((k) => (
          <option key={k} value={k}>
            {k
              .replace(/-/g, " ")
              .replace(/creon /gi, "")
              .trim()}
          </option>
        ))}
      </select>
    </div>
  );

  const selS = (groepId: string, value: string, setter: (v: string) => void) => {
    const groep = STANDAARD_KEUZES.find((g) => g.id === groepId)!;
    return (
      <div>
        <label className="text-[11px] font-bold text-slate-800 uppercase">{groep.titel}</label>
        <select
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="w-full border p-2.5 rounded-lg text-sm">
          {groep.keuzes.map((k) => (
            <option key={k.id} value={k.id}>
              {k.naam}
            </option>
          ))}
        </select>
      </div>
    );
  };

  // Naam van de gekozen optie, voor de samenvatting naast de stap; bij het oude model de ruwe sleutel.
  const kn = (groep: string, id: string | undefined) => (id ? (standaard ? keuzeNaam(groep, id, cat) : id.replace(/-/g, " ")) : "");

  const selAlu = (groepId: string) => {
    const groep = ALU_CATALOGUS.keuzes.find((g) => g.id === groepId)!;
    return (
      <div key={groep.id}>
        <label className="text-[11px] font-bold text-slate-800 uppercase">{groep.titel}</label>
        <select
          value={aluKeuzes[groep.id] ?? ""}
          onChange={(e) => setAluKeuzes((k) => ({ ...k, [groep.id]: e.target.value }))}
          className="w-full border p-2.5 rounded-lg text-sm">
          {groep.keuzes.map((k) => (
            <option key={k.id} value={k.id}>
              {k.naam}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const prijsTekst = berekendePrijs.toLocaleString("nl-NL", {
    minimumFractionDigits: 2,
  });
  const fotoStap = 0; // de gevelkeuze staat los van de genummerde stappen
  const stap = "mb-1.5 text-xs font-bold text-slate-800";
  const keuze = (actief: boolean) =>
    `rounded-lg border-2 text-xs font-semibold text-slate-800 transition-colors ${
      actief ? "border-brand" : "border-slate-200 hover:border-slate-400"
    }`;

  return (
    <div className={voorbeeld ? "w-full bg-white" : "w-full min-h-screen bg-white pb-24 lg:pb-0"}>
      <div className={voorbeeld ? "p-4" : "max-w-[1200px] mx-auto px-4 sm:px-6 py-4 md:py-10"}>
        {voorbeeld && (
          <div className="sticky top-0 z-20 -mx-4 -mt-4 mb-3 border-b border-slate-100 bg-white/95 px-4 py-2 backdrop-blur">
            <span className="text-[10px] text-slate-600 uppercase tracking-widest">Prijsindicatie{standaard ? (metBtw ? " · incl. btw" : " · excl. btw") : ""}</span>
            <div className="text-2xl font-semibold tabular-nums text-slate-800">€ {prijsTekst}</div>
          </div>
        )}
        <h1 className={`font-black text-slate-800 ${voorbeeld ? "mb-2 text-base" : "mb-3 text-xl sm:text-2xl"}`}>
          {alu ? "Aluminium — " : ""}{kozijn.name}
        </h1>
        <div className={voorbeeld ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12"}>
          <div className={voorbeeld ? "min-w-0 space-y-3" : "lg:col-span-7 min-w-0 space-y-3"}>
            {/* Bovenaan de tekening van het gekozen kozijn; de foto op een gevel komt pas bij het formulier */}
            {/* Het kozijn bovenaan: de technische tekening, of (waar die er is) een foto op een gevel */}
            {(() => {
              // Kunststof: wit/antraciet/zwart uit de kleurkeuze. Aluminium: de kleur uit de aluminium-keuzes, vertaald naar de fotokleur.
              const fotoKleur = alu ? fotoKleurVan(aluKeuzes.kleurBuiten) : KOZIJN_KLEUREN.some((k) => k.id === kleurBuitenkant) ? kleurBuitenkant : null;
              const heeftFoto = !voorbeeld && FOTO_TYPES.has(slug) && !!fotoKleur;
              const toonFoto = heeftFoto && weergave === "foto";
              const knop = (actief: boolean) => `min-w-28 rounded-lg px-6 py-2.5 text-sm font-bold transition-colors ${actief ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`;
              return (
                <>
                  {!voorbeeld && heeftFoto && (
                    <div className="flex flex-wrap items-center gap-2">
                      {heeftFoto && (
                        <div role="group" aria-label="Tekening of foto" className="flex w-fit rounded-xl bg-slate-100 p-1">
                          {(["tekening", "foto"] as const).map((w) => (
                            <button key={w} type="button" aria-pressed={weergave === w} onClick={() => setWeergave(w)} className={knop(weergave === w)}>
                              {w === "tekening" ? "Tekening" : "Foto"}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {toonFoto ? (
                    <div>
                      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={kozijnFotoPad(fotoGevel, slug, fotoKleur!)}
                          alt={`${kozijn.name} in ${fotoKleur} op een gevel van ${FOTO_GEVELS.find((g) => g.id === fotoGevel)?.naam.toLowerCase()}`}
                          fill
                          sizes="(min-width: 1024px) 652px, calc(100vw - 32px)"
                          priority
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1.5 text-center text-xs text-slate-700">Buitenkant</p>
                      {FOTO_GEVELS.length > 1 && (
                      <div role="group" aria-label="Gevel" className="mt-3">
                        <p className="mb-1.5 text-xs font-bold text-slate-800">Kies je gevel</p>
                        <div className="grid grid-cols-3 gap-2">
                          {FOTO_GEVELS.map((g) => (
                            <button
                              key={g.id}
                              type="button"
                              aria-pressed={g.id === fotoGevel}
                              onClick={() => setFotoGevel(g.id)}
                              className={`rounded-lg border-2 p-0.5 text-[10px] leading-tight font-semibold text-slate-800 transition-colors sm:p-1 sm:text-[11px] ${g.id === fotoGevel ? "border-brand" : "border-slate-200 hover:border-slate-400"}`}>
                              <span className="relative mb-1 block aspect-16/9 overflow-hidden rounded-[5px] bg-slate-100">
                                <Image src={kozijnFotoPad(g.id, slug, fotoKleur!)} alt="" fill sizes="(min-width: 1024px) 160px, 22vw" className="object-cover" />
                              </span>
                              {g.naam}
                            </button>
                          ))}
                        </div>
                      </div>
                      )}
                    </div>
                  ) : (
                    // Zelfde vorm (4:3) als de foto, zodat het vlak niet verspringt als je wisselt.
                    <div className={`bg-slate-50 rounded-xl flex items-center justify-center ${voorbeeld ? "h-28 p-3" : "aspect-4/3 p-3 sm:p-5"}`}>
                      <KozijnTekening kozijn={kozijn} className="h-full max-w-full" breedte={tekenB} hoogte={tekenH} maten={!voorbeeld} aanzicht={aanzicht} />
                    </div>
                  )}
                  {!toonFoto && !voorbeeld && TECHNISCH[kozijn.slug] && <p className="-mt-1 text-center text-xs text-slate-700">Binnenaanzicht</p>}
                </>
              );
            })()}

            <div role="group" aria-label="Hoeveel ramen naast elkaar?">
              <p className={stap}>{fotoStap + 1}. Hoeveel ramen naast elkaar?</p>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].filter((n) => lijst.some((k) => k.v === n)).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={kozijn.v === n}
                    onClick={() => {
                      if (kozijn.v === n) return;
                      // Liefst een type met foto, zodat de foto blijft staan.
                      const groep = lijst.filter((k) => k.v === n);
                      kiesType((groep.find((k) => k.populair) ?? groep.find((k) => heeftGevelFoto(k.slug, kleurBuitenkant)) ?? groep[0]).slug);
                    }}
                    className={`${keuze(kozijn.v === n)} h-9 text-sm sm:h-10`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div role="group" aria-label="Type kozijn">
              <p className={stap}>{fotoStap + 2}. Type kozijn</p>
              <div ref={typeRij} className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible">
                {lijst.filter((k) => k.v === kozijn.v).map((k) => (
                  <button
                    key={k.slug}
                    type="button"
                    data-actief={k.slug === slug}
                    aria-pressed={k.slug === slug}
                    onClick={() => kiesType(k.slug)}
                    className={`${keuze(k.slug === slug)} w-24 shrink-0 p-1.5 text-[11px] leading-tight sm:w-28`}>
                    <span className="mb-1 flex h-10 items-center justify-center sm:h-14">
                      <KozijnTekening kozijn={k} className="h-full max-w-full **:[vector-effect:non-scaling-stroke]" breedte={beginmaat(k.slug)[0]} hoogte={beginmaat(k.slug)[1]} />
                    </span>
                    {k.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className={voorbeeld ? "min-w-0" : "min-w-0 lg:col-span-5"}>
            <div className={voorbeeld ? "space-y-3" : "space-y-3 lg:bg-white lg:border lg:border-slate-200 lg:rounded-xl lg:p-6 lg:shadow-sm"}>
              <div className="hidden lg:block">
                <span className="text-[10px] text-slate-600 uppercase tracking-widest">Prijsindicatie{standaard ? (metBtw ? " · incl. btw" : " · excl. btw") : ""}</span>
                <div className="text-3xl text-slate-800">€ {prijsTekst}</div>
              </div>

              {standaard && (
                <div role="group" aria-label="Particulier of zakelijk" className="flex w-fit rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                  {(["particulier", "zakelijk"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={klantType === t}
                      onClick={() => setKlantType(t)}
                      className={`rounded-md px-3 py-1.5 capitalize ${klantType === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-700"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              )}

              {/* Stappen die uitklappen, zoals bij Creon: afmetingen, profiel en aanslag, kleur, vulling, eigenschappen */}
              <div>
                <FormField label="Afmetingen" value={`${breedte} × ${hoogte} mm`} defaultOpen>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-800 uppercase">Breedte (mm)</label>
                      <NumberInput value={breedte} onChange={setBreedte} className="w-full border p-2.5 rounded-lg text-sm" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-800 uppercase">Hoogte (mm)</label>
                      <NumberInput value={hoogte} onChange={setHoogte} className="w-full border p-2.5 rounded-lg text-sm" />
                    </div>
                  </div>
                  {grenzen && (
                    <p className="mt-1.5 text-[11px] text-slate-700">
                      Breedte {nl(grenzen.minB)} tot {nl(grenzen.maxB)} mm, hoogte {nl(grenzen.minH)} tot {nl(grenzen.maxH)} mm.
                    </p>
                  )}
                  {extra && (
                    <div className="mt-2">
                      <label className="text-[11px] font-bold text-slate-800 uppercase">
                        {extra.label} (mm){extra.min !== undefined && extra.max !== undefined ? `, ${extra.min} tot ${extra.max}` : ""}
                      </label>
                      <NumberInput value={extraMaat} onChange={setExtraMaat} className="w-full border p-2.5 rounded-lg text-sm" />
                    </div>
                  )}
                  {(buitenMaat || extraBuiten) && (
                    <p role="alert" className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      {buitenMaat && grenzen
                        ? `Deze maat kan niet standaard besteld worden. Kies een breedte van ${nl(grenzen.minB)} tot ${nl(grenzen.maxB)} mm en een hoogte van ${nl(grenzen.minH)} tot ${nl(grenzen.maxH)} mm, of neem contact met ons op voor maatwerk.`
                        : `${extra?.label} kan niet standaard besteld worden. Kies ${extra?.min} tot ${extra?.max} mm.`}
                    </p>
                  )}
                  <p className="mt-1.5 text-[11px] text-slate-700">
                    Buitenwerks. Binnenwerks: {binnenwerksBreedte} × {binnenwerkseHoogte} mm
                  </p>
                </FormField>

                <FormField
                  label="Profiel en aanslag"
                  value={alu ? kn("aanslag", aluKeuzes.aanslag) : [kn("profiel", profiel), kn("aanslag", aanslag)].filter(Boolean).join(" · ")}>
                  <div className="space-y-3">
                    {alu ? (
                      selAlu("aanslag")
                    ) : standaard ? (
                      <>
                        {selS("profiel", profiel, setProfiel)}
                        {selS("aanslag", aanslag, setAanslag)}
                      </>
                    ) : (
                      <>
                        {sel("Type profiel", profiel, setProfiel, matrix.profielToeslag || {})}
                        {sel("Aanslag", aanslag, setAanslag, matrix.aanslagToeslag || {})}
                      </>
                    )}
                  </div>
                </FormField>

                <FormField
                  label="Kleur"
                  value={alu ? `${kn("kleurBuiten", aluKeuzes.kleurBuiten)} · ${kn("kleurBinnen", aluKeuzes.kleurBinnen)}` : `${KOZIJN_KLEUREN.find((k) => k.id === kleurBuitenkant)?.naam.replace(/ \(RAL.*\)/, "") ?? ""} · ${kn("kleurBinnen", kleur)}`}>
                  <div className="space-y-3">
                    {alu ? (
                      <>
                        {selAlu("lakBuiten")}
                        {selAlu("kleurBuiten")}
                        {selAlu("lakBinnen")}
                        {selAlu("kleurBinnen")}
                      </>
                    ) : (
                      <>
                        <div role="group" aria-label="Kleur buitenkant">
                          <label className="text-[11px] font-bold text-slate-800 uppercase">Kleur buitenkant</label>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {KOZIJN_KLEUREN.map((k) => (
                              <button
                                key={k.id}
                                type="button"
                                aria-pressed={k.id === kleurBuitenkant}
                                onClick={() => setKleurBuitenkant(k.id)}
                                className={`${keuze(k.id === kleurBuitenkant)} flex min-h-9 items-center gap-1.5 px-2.5 sm:min-h-10 sm:px-3`}>
                                <span className="size-4 shrink-0 rounded-full ring-1 ring-black/20 ring-inset" style={{ backgroundColor: k.hex }} />
                                <span className="sm:hidden">{k.naam.replace(/ \(RAL.*\)/, "")}</span>
                                <span className="hidden sm:inline">{k.naam}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        {standaard ? selS("kleurBinnen", kleur, setKleur) : sel("Kleur binnenkant", kleur, setKleur, matrix.kleurToeslag || {})}
                      </>
                    )}
                  </div>
                </FormField>

                <FormField
                  label="Vulling"
                  value={alu ? kn("glas", aluKeuzes.glas) : [kn("glas", glas), kn("roeden", roeden)].filter(Boolean).join(" · ")}>
                  <div className="space-y-3">
                    {alu ? (
                      selAlu("glas")
                    ) : standaard ? (
                      <>
                        {selS("glas", glas, setGlas)}
                        {selS("afstandshouder", afstandshouder, setAfstandshouder)}
                        {selS("roeden", roeden, setRoeden)}
                      </>
                    ) : (
                      <>
                        {sel("Type glas", glas, setGlas, matrix.glasToeslag || {})}
                        {sel("Type afstandshouder", afstandshouder, setAfstandshouder, matrix.afstandshouderToeslag || {})}
                        {sel("Roeden", roeden, setRoeden, matrix.roedenToeslag || {})}
                      </>
                    )}
                  </div>
                </FormField>

                <FormField
                  label="Eigenschappen"
                  value={alu ? `${kn("ventilatie", aluKeuzes.ventilatie)} · ${kn("klemhor", aluKeuzes.klemhor)}` : `${kn("ventilatie", ventilatieRooster)} · ${kn("voorboren", voorboren)}`}>
                  <div className="space-y-3">
                    {alu ? (
                      <>{["ventilatie", "draairichting", "kruk", "voorboren", "klemhor"].map((id) => selAlu(id))}</>
                    ) : standaard ? (
                      <>
                        {selS("ventilatie", ventilatieRooster, setVentilatieRooster)}
                        {selS("voorboren", voorboren, setVoorboren)}
                      </>
                    ) : (
                      <>
                        {sel("Ventilatie rooster", ventilatieRooster, setVentilatieRooster, matrix.ventilatieRoosterToeslag || {})}
                        {sel("Voorboren", voorboren, setVoorboren, matrix.voorborenToeslag || {})}
                      </>
                    )}
                  </div>
                </FormField>

                <FormField label="Aantal" value={`${aantal} stuks`}>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setAantal(Math.max(1, aantal - 1))} className="w-10 h-10 rounded-lg border-2 border-slate-400 text-xl font-bold text-slate-900 hover:bg-slate-100">
                      −
                    </button>
                    <span className="w-8 text-center text-base font-bold text-slate-900">{aantal}</span>
                    <button type="button" onClick={() => setAantal(aantal + 1)} className="w-10 h-10 rounded-lg border-2 border-slate-400 text-xl font-bold text-slate-900 hover:bg-slate-100">
                      +
                    </button>
                  </div>
                </FormField>
              </div>

              {!voorbeeld && !(isStandaardModel(matrix) && matrix.montageApart === true) && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                  <span className="text-xs font-semibold text-green-800">
                    Bij ons is montage in de prijs inbegrepen
                  </span>
                </div>
              )}

              {!voorbeeld && (
                <button
                  onClick={handleAdd}
                  disabled={buitenMaat || extraBuiten}
                  className="hidden lg:block lg:sticky lg:bottom-4 z-20 shadow-xl shadow-black/20 w-full bg-brand text-white py-4 rounded-lg font-bold uppercase text-[11px] tracking-widest hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:hover:bg-brand">
                  Toevoegen aan offerte
                </button>
              )}
              {!voorbeeld && (
                <p className="text-center text-[11px] text-slate-600">
                  Ontvang uw subsidie-indicatie bij de offerte
                </p>
              )}
            </div>
          </div>
        </div>

        {voorbeeld && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-800">Zo is deze prijs opgebouwd</p>
            <dl className="mt-2 space-y-1 text-xs">
              {opbouw.regels.map((r, i) => (
                <div key={i} className="flex justify-between gap-3">
                  <dt className="text-slate-600">{r.label}</dt>
                  <dd className="shrink-0 tabular-nums text-slate-800">{euro(r.bedrag)}</dd>
                </div>
              ))}
              {aantal > 1 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-600">Aantal</dt>
                  <dd className="shrink-0 tabular-nums text-slate-800">× {aantal}</dd>
                </div>
              )}
            </dl>
            {standaard && (
              <p className="mt-2 text-[11px] text-slate-700">
                Bedragen zijn exclusief btw.{metBtw ? ` Met ${btwPct}% btw: ${euro(berekendePrijs)}.` : ""}
              </p>
            )}
          </div>
        )}
      </div>

      {previewOpen && !voorbeeld && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Preview van je kozijn"
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-3 backdrop-blur-[2px] sm:items-center"
          onClick={() => setPreviewOpen(false)}>
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900">{alu ? "Aluminium " : ""}{kozijn.name}</p>
                <p className="text-xs text-slate-700">
                  {breedte} × {hoogte} mm{!alu && KOZIJN_KLEUREN.find((k) => k.id === kleurBuitenkant) ? ` · ${KOZIJN_KLEUREN.find((k) => k.id === kleurBuitenkant)!.naam}` : ""}
                </p>
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} aria-label="Sluiten" className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                Sluiten
              </button>
            </div>
            {!alu ? (
              <GevelFoto slug={slug} kozijnNaam={kozijn.name} kleur={kleurBuitenkant} gevel={gevel}>
                <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-50 p-5">
                  <KozijnTekening kozijn={kozijn} className="h-full max-w-full" breedte={tekenB} hoogte={tekenH} />
                </div>
              </GevelFoto>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-50 p-5">
                <KozijnTekening kozijn={kozijn} className="h-full max-w-full" breedte={tekenB} hoogte={tekenH} />
              </div>
            )}
            {!alu && heeftGevelFoto(slug, kleurBuitenkant) ? (
              <div className="mt-3">
                <GevelKeuze slug={slug} kleur={kleurBuitenkant} gevel={gevel} onGevel={setGevel} />
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-700">Een foto op een gevel is er nog niet voor dit kozijn. Dit is de tekening.</p>
            )}
          </div>
        </div>
      )}

      {!voorbeeld && (
        <>
      {/* Telefoon: prijs en knop altijd in beeld */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div>
          <span className="block text-[10px] text-slate-600 uppercase tracking-widest">Prijsindicatie{standaard ? (metBtw ? " · incl. btw" : " · excl. btw") : ""}</span>
          <span className="text-xl font-semibold text-slate-800 tabular-nums">€ {prijsTekst}</span>
        </div>
        <button
          onClick={handleAdd}
          disabled={buitenMaat || extraBuiten}
          className="bg-brand text-white px-5 py-3 rounded-lg font-bold text-sm hover:bg-brand-dark transition-colors disabled:opacity-40 disabled:hover:bg-brand">
          Toevoegen
        </button>
      </div>

      <CartAddedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={kozijn.name}
        breedte={breedte}
        hoogte={hoogte}
        aantal={aantal}
        prijs={berekendePrijs}
        cartCount={cartCount}
        onAddAnother={() => setModalOpen(false)}
      />
        </>
      )}
    </div>
  );
}
