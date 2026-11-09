import { useId } from "react";

/**
 * Technische tekening van een kozijn, gegenereerd uit de opbouw en de maten in mm.
 * Recht en vlak, met maatlijnen, vaknummers, openingslijnen, scharnieren en een greep.
 * Binnen- of buitenaanzicht. Elk kozijntype is een rij kolommen; elke kolom heeft cellen van boven naar onder.
 */

export type TechnischCel = {
  kind: "vast" | "dk" | "kiep" | "schuif" | "deur" | "deurdk" | "paneel" | "hor" | "rolluik" | "skip";
  /** Aandeel van de hoogte van de kolom (alle cellen samen = 1). */
  h: number;
  /** Kant van de scharnieren van een draai-kiepraam, gezien vanaf binnen. */
  scharnier?: "links" | "rechts";
  /** Aantal kolommen dat deze cel overspant (bovenlicht over meerdere kolommen). */
  span?: number;
  /** Richting waarin een schuivend deel schuift, gezien vanaf binnen. */
  richting?: "l" | "r";
  /** Aandeel van de hoogte onderin dat een dicht paneel is (borstwering), met glas erboven. */
  onderpaneel?: number;
  /** Indeling van het glas in de vleugel: een voordeur (paneel met een smalle glasstrook) of drie vakken boven elkaar. */
  ontwerp?: "voordeur" | "drie";
  /** Soort rolluik: opbouw (met kast), inbouw (kast in de muur) of een screen (doek met fijn gaas). */
  rolluik?: "opbouw" | "inbouw" | "screen";
  /** Soort hor: een inzethor of klemhor (frame met gaas) of een plissé hordeur (geplooid gaas). */
  hor?: "inzet" | "klem" | "plisse";
  /** Bij een dubbele deur heeft alleen het eerste deurblad een klink. */
  zonderGreep?: boolean;
};

export type TechnischKolom = { frac: number; cellen: TechnischCel[] };
export type TechnischKozijnSpec = {
  kolommen: TechnischKolom[];
  /** Een zwarte drempel onderaan, zoals bij deuren en schuifpuien. */
  drempel?: boolean;
};

const kol = (frac: number, ...cellen: TechnischCel[]): TechnischKolom => ({ frac, cellen });
const vast = (h = 1, span?: number, onderpaneel?: number): TechnischCel => ({ kind: "vast", h, span, onderpaneel });
const dk = (h = 1, scharnier: "links" | "rechts" = "links"): TechnischCel => ({ kind: "dk", h, scharnier });
const kiep = (h = 1): TechnischCel => ({ kind: "kiep", h });
const schuif = (richting: "l" | "r", h = 1, extra: Partial<TechnischCel> = {}): TechnischCel => ({ kind: "schuif", h, richting, ...extra });
/** Draaideur (voordeur, tuindeur) en draai-kiepdeur (achterdeur), met een deurklink. */
const deur = (h = 1, scharnier: "links" | "rechts" = "links", extra: Partial<TechnischCel> = {}): TechnischCel => ({ kind: "deur", h, scharnier, ...extra });
const paneel = (h: number): TechnischCel => ({ kind: "paneel", h });
const rolluik = (soort: "opbouw" | "inbouw" | "screen"): TechnischCel => ({ kind: "rolluik", h: 1, rolluik: soort });
const hor = (soort: "inzet" | "klem" | "plisse"): TechnischCel => ({ kind: "hor", h: 1, hor: soort });
const skip = (h: number): TechnischCel => ({ kind: "skip", h });
const gelijk = (n: number, maak: (i: number) => TechnischCel[]) =>
  Array.from({ length: n }, (_, i) => kol(1 / n, ...maak(i)));

/** Alle kozijntypes van de configurator. De sleutel is de slug van het type. */
export const TECHNISCH: Record<string, TechnischKozijnSpec> = {
  // 1 vak
  "vast-kozijn": { kolommen: [kol(1, vast())] },
  "draai-kiep-kozijn": { kolommen: [kol(1, dk())] },
  "kiep-kozijn": { kolommen: [kol(1, kiep())] },
  "vast-bovenlicht-kiep": { kolommen: [kol(1, kiep(0.3), vast(0.7))] },
  "dk-bovenlicht-vast": { kolommen: [kol(1, vast(0.28), dk(0.72))] },
  "dk-bovenlicht-kiep": { kolommen: [kol(1, kiep(0.3), dk(0.7))] },
  "dk-borstwering-vast": { kolommen: [kol(1, dk(0.64), paneel(0.36))] },
  // 2 vakken
  "dk-13-vast-23": { kolommen: [kol(1 / 3, dk()), kol(2 / 3, vast())] },
  "draai-kiep-vast-kozijn": { kolommen: [kol(0.5, dk()), kol(0.5, vast())] },
  "draai-kiep-draai-stolp-kozijn": { kolommen: [kol(0.5, dk()), kol(0.5, dk(1, "rechts"))] },
  "vast-vast-kozijn": { kolommen: [kol(0.5, vast()), kol(0.5, vast())] },
  "dk-dk-gelijk": { kolommen: [kol(0.5, dk()), kol(0.5, dk(1, "rechts"))] },
  "kiep-vast-liggend": { kolommen: [kol(0.5, kiep()), kol(0.5, vast())] },
  "kiep-kiep-kozijn": { kolommen: [kol(0.5, kiep()), kol(0.5, kiep())] },
  "dk-dk-stolp-bovenlicht-vast-2vaks": {
    kolommen: [kol(0.5, vast(0.24, 2), dk(0.76)), kol(0.5, skip(0.24), dk(0.76, "rechts"))],
  },
  "dk-vast-bovenlichten-vast-2vaks": {
    kolommen: [kol(0.5, vast(0.24), dk(0.76)), kol(0.5, vast(0.24), vast(0.76))],
  },
  "dk-bovenlicht-kiep-vast-2vaks": { kolommen: [kol(0.5, kiep(0.28), dk(0.72)), kol(0.5, vast())] },
  "vast-bovenlicht-kiep-vast-2vaks": { kolommen: [kol(0.5, kiep(0.28), vast(0.72)), kol(0.5, vast())] },
  "dk-bovenlicht-vast-vast-2vaks": { kolommen: [kol(0.5, vast(0.19), dk(0.81)), kol(0.5, vast())] },
  // 3 vakken
  "draai-kiep-vast-draai-kiep-kozijn": { kolommen: [kol(1 / 3, dk()), kol(1 / 3, vast()), kol(1 / 3, dk(1, "rechts"))] },
  "vast-vast-vast-kozijn": { kolommen: gelijk(3, () => [vast()]) },
  "vast-draai-kiep-vast-kozijn": { kolommen: [kol(1 / 3, vast()), kol(1 / 3, dk()), kol(1 / 3, vast())] },
  "draai-kiep-vast-vast-kozijn": { kolommen: [kol(1 / 3, dk()), kol(1 / 3, vast()), kol(1 / 3, vast())] },
  "draai-kiep-draai-kiep-draai-kiep-kozijn": { kolommen: [kol(1 / 3, dk()), kol(1 / 3, dk()), kol(1 / 3, dk(1, "rechts"))] },
  "draai-kiep-vast-dk-bovenlichten-vast": {
    kolommen: [kol(1 / 3, vast(0.24), dk(0.76)), kol(1 / 3, vast(0.24), vast(0.76)), kol(1 / 3, vast(0.24), dk(0.76, "rechts"))],
  },
  "vast-dk-vast-bovenlichten-vast": {
    kolommen: [kol(1 / 3, vast(0.24), vast(0.76)), kol(1 / 3, vast(0.24), dk(0.76)), kol(1 / 3, vast(0.24), vast(0.76))],
  },
  // 4 vakken
  "draai-kiep-vast-vast-draai-kiep-kozijn": {
    kolommen: [kol(0.25, dk()), kol(0.25, vast()), kol(0.25, vast()), kol(0.25, dk(1, "rechts"))],
  },
  "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn": { kolommen: gelijk(4, () => [dk()]) },
  // Schuifpuien: kunststof (2- en 4-vaks) en aluminium
  "schuifpui-2-vaks": { kolommen: [kol(0.5, schuif("r")), kol(0.5, vast())] },
  "schuifpui-4-vaks": { kolommen: [kol(0.25, vast()), kol(0.25, schuif("l")), kol(0.25, schuif("r")), kol(0.25, vast())] },
  schuifpui: { kolommen: [kol(0.5, schuif("r")), kol(0.5, vast())] },
  // Deuren, overgenomen van de tekeningen bij Creon (zijlicht links, bovenlicht alleen boven de deur).
  // Kunststof
  voordeur: { kolommen: [kol(1, deur(1, "links", { ontwerp: "voordeur" }))] },
  achterdeur: { kolommen: [kol(1, deur())] },
  "voordeur-met-bovenlicht": { kolommen: [kol(1, vast(0.17), deur(0.83, "links", { ontwerp: "voordeur" }))] },
  "achterdeur-met-bovenlicht": { kolommen: [kol(1, vast(0.17), deur(0.83))] },
  "achterdeur-met-borstwering": { kolommen: [kol(1, deur(1, "links", { onderpaneel: 0.42 }))] },
  "achterdeur-met-borstwering-en-bovenlicht": { kolommen: [kol(1, vast(0.17), deur(0.83, "links", { onderpaneel: 0.32 }))] },
  "deur-met-zijlicht": { kolommen: [kol(0.27, vast()), kol(0.73, deur())] },
  "voordeur-met-zijlicht": { kolommen: [kol(0.27, vast()), kol(0.73, deur(1, "links", { ontwerp: "voordeur" }))] },
  "deur-met-zijlicht-en-bovenlicht": { kolommen: [kol(0.27, vast()), kol(0.73, vast(0.14), deur(0.86))] },
  "voordeur-met-zijlicht-en-bovenlicht": {
    kolommen: [kol(0.27, vast()), kol(0.73, vast(0.14), deur(0.86, "links", { ontwerp: "voordeur" }))],
  },
  "deur-met-zijlicht-met-borstwering": {
    kolommen: [kol(0.27, vast(1, undefined, 0.42)), kol(0.73, deur(1, "links", { onderpaneel: 0.42 }))],
  },
  "enkele-deur-met-zijlichten": { kolommen: [kol(0.22, vast()), kol(0.56, deur()), kol(0.22, vast())] },
  "dubbele-deur": { kolommen: [kol(0.5, deur()), kol(0.5, deur(1, "rechts", { zonderGreep: true }))] },
  "dubbele-deur-met-bovenlicht": { kolommen: [kol(0.5, vast(0.14, 2), deur(0.86)), kol(0.5, skip(0.14), deur(0.86, "rechts", { zonderGreep: true }))] },
  "dubbele-deur-met-borstwering": {
    kolommen: [kol(0.5, deur(1, "links", { onderpaneel: 0.42 })), kol(0.5, deur(1, "rechts", { onderpaneel: 0.42, zonderGreep: true }))],
  },
  "dubbele-deur-met-borstwering-en-bovenlicht": {
    kolommen: [
      kol(0.5, vast(0.14, 2), deur(0.86, "links", { onderpaneel: 0.4 })),
      kol(0.5, skip(0.14), deur(0.86, "rechts", { onderpaneel: 0.4, zonderGreep: true })),
    ],
  },
  "dubbele-deur-met-zijlicht": { kolommen: [kol(0.22, vast()), kol(0.39, deur()), kol(0.39, deur(1, "rechts", { zonderGreep: true }))] },
  "dubbele-deur-met-zijlichten": { kolommen: [kol(0.17, vast()), kol(0.33, deur()), kol(0.33, deur(1, "rechts", { zonderGreep: true })), kol(0.17, vast())] },
  "dubbele-deur-met-zijlichten-en-bovenlichten": {
    kolommen: [
      kol(0.17, vast(0.12), vast(0.88)),
      kol(0.33, vast(0.12, 2), deur(0.88)),
      kol(0.33, skip(0.12), deur(0.88, "rechts", { zonderGreep: true })),
      kol(0.17, vast(0.12), vast(0.88)),
    ],
  },
  // Rolluiken en screens
  rolluik: { kolommen: [kol(1, rolluik("opbouw"))] },
  "inbouw-rolluik": { kolommen: [kol(1, rolluik("inbouw"))] },
  screen: { kolommen: [kol(1, rolluik("screen"))] },
  // Horren
  inzethor: { kolommen: [kol(1, hor("inzet"))] },
  klemhor: { kolommen: [kol(1, hor("klem"))] },
  "plisse-hordeur": { kolommen: [kol(1, hor("plisse"))] },
  // Harmonicadeuren (aluminium): draaiende panelen links, de rest vouwt weg in de pijlrichting
  "aluminium-harmonicadeur-3delig": {
    kolommen: [kol(1 / 3, deur()), kol(1 / 3, schuif("r", 1, { zonderGreep: true })), kol(1 / 3, schuif("r", 1, { zonderGreep: true }))],
  },
  "aluminium-harmonicadeur-4delig": {
    kolommen: [
      kol(0.25, deur()),
      kol(0.25, deur(1, "rechts", { zonderGreep: true })),
      kol(0.25, schuif("r", 1, { zonderGreep: true })),
      kol(0.25, schuif("r", 1, { zonderGreep: true })),
    ],
  },
  "aluminium-harmonicadeur-5delig": {
    kolommen: [
      kol(0.2, deur()),
      kol(0.2, schuif("r", 1, { zonderGreep: true })),
      kol(0.2, schuif("r", 1, { zonderGreep: true })),
      kol(0.2, schuif("r", 1, { zonderGreep: true })),
      kol(0.2, schuif("r", 1, { zonderGreep: true })),
    ],
  },
  // Aluminium
  "aluminium-deur": { kolommen: [kol(1, deur())] },
  "aluminium-deur-2-vaks": { kolommen: [kol(1, deur(1, "links", { onderpaneel: 0.4 }))] },
  "aluminium-deur-3vaks": { kolommen: [kol(1, deur(1, "links", { ontwerp: "drie" }))] },
  "aluminium-deur-met-zijlicht": { kolommen: [kol(0.27, vast()), kol(0.73, deur())] },
  "aluminium-deur-met-zijlicht-met-borstwering": {
    kolommen: [kol(0.27, vast(1, undefined, 0.3)), kol(0.73, deur(1, "rechts", { onderpaneel: 0.3 }))],
  },
  "aluminium-deur-met-zijlichten": { kolommen: [kol(0.22, vast()), kol(0.56, deur()), kol(0.22, vast())] },
  "aluminium-dubbele-deur": { kolommen: [kol(0.5, deur()), kol(0.5, deur(1, "rechts", { zonderGreep: true }))] },
  "aluminium-dubbele-deur-2-vaks": {
    kolommen: [kol(0.5, deur(1, "links", { onderpaneel: 0.4 })), kol(0.5, deur(1, "rechts", { onderpaneel: 0.4, zonderGreep: true }))],
  },
  "aluminium-dubbele-deur-met-zijlichten": {
    kolommen: [kol(0.17, vast()), kol(0.33, deur()), kol(0.33, deur(1, "rechts", { zonderGreep: true })), kol(0.17, vast())],
  },
};

const PROFIEL = 70; // zichtbare breedte kozijnprofiel (mm)
const STIJL = 78; // breedte middenstijl (mm)
const TRAVERSE = 70; // dikte van een tussenregel tussen boven- en onderraam (mm)
const VLEUGEL = 58; // zichtbare breedte vleugelprofiel (mm)
const LAT = 24; // glaslat van een vast vak (mm)
const DREMPEL = 40; // hoogte van de zwarte drempel (mm)

type Plaats = {
  cel: TechnischCel;
  x0: number;
  w: number;
  y: number;
  ch: number;
  kant?: "links" | "rechts";
  nr: string;
  kol: number;
  rij: number;
};

export type KozijnTechnischProps = {
  breedte: number;
  hoogte: number;
  spec: TechnischKozijnSpec;
  aanzicht?: "binnen" | "buiten";
  /** Maatlijnen en vaknummers tonen; uit voor kleine kaartjes. */
  maten?: boolean;
  /** Duidelijke versie (standaard): donkere lijnen en lichtblauw glas. Met false de oude, vage versie. */
  scherp?: boolean;
  className?: string;
};

export function KozijnTechnisch(props: KozijnTechnischProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return technischSvg(props, uid);
}

/** De tekening zelf, zonder hooks: ook te gebruiken buiten de browser (de offerte-pdf). */
export function technischSvg(
  { breedte, hoogte, spec, aanzicht = "binnen", maten = true, scherp = true, className }: KozijnTechnischProps,
  uid: string,
) {
  const B = breedte;
  const H = hoogte;
  const groot = Math.max(B, H);
  const fs = groot * 0.034; // lettergrootte voor maten
  const lijn = groot * (scherp ? 0.0022 : 0.0016); // standaard lijndikte
  const buiten = aanzicht === "buiten";

  // Kolommen van links naar rechts zoals ze op het scherm staan (buitenaanzicht = gespiegeld).
  const kolommen = buiten ? [...spec.kolommen].reverse() : spec.kolommen;
  const n = kolommen.length;
  const cellenPerKolom: TechnischCel[][] = kolommen.map((k) => k.cellen.map((c) => ({ ...c })));
  if (buiten) {
    // Een cel die meerdere kolommen overspant stond links; na het spiegelen begint hij in de meest linkse van zijn kolommen.
    const rijen = Math.max(...spec.kolommen.map((k) => k.cellen.length));
    for (let r = 0; r < rijen; r++) {
      const start = spec.kolommen.findIndex((k) => (k.cellen[r]?.span ?? 1) > 1);
      if (start < 0) continue;
      const cel = spec.kolommen[start].cellen[r];
      const span = cel.span as number;
      const nieuw = n - start - span;
      for (let j = 0; j < n; j++) {
        if (j === nieuw) cellenPerKolom[j][r] = { ...cel };
        else if (j > nieuw && j < nieuw + span) cellenPerKolom[j][r] = { kind: "skip", h: cel.h };
        else if (cellenPerKolom[j][r]?.kind === "skip") cellenPerKolom[j][r] = { ...spec.kolommen[start === j ? 0 : j].cellen[r] };
      }
    }
  }

  // De delingen (midden van de middenstijlen) liggen op het aandeel van de totale breedte.
  const grens: number[] = [0];
  kolommen.forEach((k, i) => grens.push(i === n - 1 ? B : grens[i] + B * k.frac));
  const kx = kolommen.map((_, i) => ({
    x0: i === 0 ? PROFIEL : grens[i] + STIJL / 2,
    x1: i === n - 1 ? B - PROFIEL : grens[i + 1] - STIJL / 2,
  }));

  const y0 = PROFIEL;
  const bodem = spec.drempel ? DREMPEL : PROFIEL;
  const hi = H - PROFIEL - bodem;

  /** Bovenkant (y) van cel `ri` in kolom `ci`. */
  const celY = (ci: number, ri: number) => {
    const cellen = cellenPerKolom[ci];
    const beschikbaar = hi - (cellen.length - 1) * TRAVERSE;
    let y = y0;
    for (let i = 0; i < ri; i++) y += beschikbaar * cellen[i].h + TRAVERSE;
    return y;
  };
  const celH = (ci: number, ri: number) => {
    const cellen = cellenPerKolom[ci];
    return (hi - (cellen.length - 1) * TRAVERSE) * cellen[ri].h;
  };

  const plaatsen: Plaats[] = [];
  let teller = 0;
  cellenPerKolom.forEach((cellen, ci) => {
    cellen.forEach((cel, ri) => {
      if (cel.kind === "skip") return;
      const span = cel.span ?? 1;
      const x1 = kx[Math.min(n - 1, ci + span - 1)].x1;
      const kant = cel.scharnier ? (buiten ? (cel.scharnier === "links" ? "rechts" : "links") : cel.scharnier) : undefined;
      if (cel.kind !== "paneel") teller += 1;
      plaatsen.push({
        cel,
        x0: kx[ci].x0,
        w: x1 - kx[ci].x0,
        y: celY(ci, ri),
        ch: celH(ci, ri),
        kant,
        nr: cel.kind === "paneel" ? "" : `${teller}.01`,
        kol: ci,
        rij: ri,
      });
    });
  });

  // Middenstijlen: per grens en per rij, behalve waar een cel erover heen loopt.
  const stijlen: { x: number; y: number; h: number }[] = [];
  for (let b = 0; b < n - 1; b++) {
    cellenPerKolom[b].forEach((_, ri) => {
      const overspannen = cellenPerKolom.some((cs, ci) => (cs[ri]?.span ?? 1) > 1 && ci <= b && ci + (cs[ri].span as number) - 1 > b);
      if (!overspannen) stijlen.push({ x: kx[b].x1, y: celY(b, ri), h: celH(b, ri) });
    });
  }
  // Tussenregels tussen boven- en onderraam, per kolom (een overspannen bovenlicht krijgt ze doorlopend).
  const regels: { x: number; w: number; y: number }[] = [];
  cellenPerKolom.forEach((cellen, ci) => {
    cellen.forEach((_, ri) => {
      if (ri < cellen.length - 1) regels.push({ x: kx[ci].x0, w: kx[ci].x1 - kx[ci].x0, y: celY(ci, ri) + celH(ci, ri) });
    });
  });

  const m = maten ? fs * 1.4 : groot * 0.01;
  const top = maten ? fs * 3.4 : groot * 0.01;
  const rechts = maten ? fs * 6.8 : groot * 0.01;
  const onder = maten ? fs * 3.4 : groot * 0.01;
  const vb = `${-m} ${-top} ${B + m + rechts} ${H + top + onder}`;

  const glasKleur = `url(#${uid}g)`;
  const stroke = "#3a3f44";
  const kader = scherp ? "#2b3036" : "#c2c3bf";
  const binnenRand = scherp ? "#4a5259" : "#dedfdb";
  const vleugelRand = scherp ? "#3a4148" : "#cfd0cc";
  const stippelKleur = scherp ? "#59636b" : "#a7adb2";
  const glasRand = scherp ? "#2b3036" : "#8b9399";
  const profielVul = "#ffffff";

  const pijl = (x: number, y: number, richting: "l" | "r" | "o" | "b") => {
    const l = fs * 0.7;
    const b = fs * 0.2;
    const d =
      richting === "l" ? `M${x} ${y} l${l} ${-b} v${2 * b}Z`
      : richting === "r" ? `M${x} ${y} l${-l} ${-b} v${2 * b}Z`
      : richting === "o" ? `M${x} ${y} l${-b} ${l} h${2 * b}Z`
      : `M${x} ${y} l${-b} ${-l} h${2 * b}Z`;
    return <path d={d} fill={stroke} />;
  };

  /** Horizontale maatlijn met pijlen, hulplijnen en getal erboven. */
  const maatH = (xa: number, xb: number, y: number, label: string, vanY: number, groter = false) => (
    <g>
      <line x1={xa} y1={vanY} x2={xa} y2={y + (y < vanY ? -fs * 0.4 : fs * 0.4)} stroke="#b9bdc2" strokeWidth={lijn} strokeDasharray={`${fs * 0.15} ${fs * 0.25}`} />
      <line x1={xb} y1={vanY} x2={xb} y2={y + (y < vanY ? -fs * 0.4 : fs * 0.4)} stroke="#b9bdc2" strokeWidth={lijn} strokeDasharray={`${fs * 0.15} ${fs * 0.25}`} />
      <line x1={xa} y1={y} x2={xb} y2={y} stroke={stroke} strokeWidth={lijn} />
      {pijl(xa, y, "l")}
      {pijl(xb, y, "r")}
      <text x={(xa + xb) / 2} y={y - fs * 0.45} textAnchor="middle" fontSize={fs * (groter ? 1.15 : 1)} fontWeight={groter ? 700 : 600} fill="#1f2328" fontFamily="system-ui, sans-serif">{label}</text>
    </g>
  );

  const maatV = (ya: number, yb: number, x: number, label: string, vanX: number) => (
    <g>
      <line x1={vanX} y1={ya} x2={x + fs * 0.4} y2={ya} stroke="#b9bdc2" strokeWidth={lijn} strokeDasharray={`${fs * 0.15} ${fs * 0.25}`} />
      <line x1={vanX} y1={yb} x2={x + fs * 0.4} y2={yb} stroke="#b9bdc2" strokeWidth={lijn} strokeDasharray={`${fs * 0.15} ${fs * 0.25}`} />
      <line x1={x} y1={ya} x2={x} y2={yb} stroke={stroke} strokeWidth={lijn} />
      {pijl(x, ya, "o")}
      {pijl(x, yb, "b")}
      <text x={x + fs * 0.7} y={(ya + yb) / 2 + fs * 0.4} fontSize={fs * 1.15} fontWeight={700} fill="#1f2328" fontFamily="system-ui, sans-serif">{label}</text>
    </g>
  );

  return (
    <svg viewBox={vb} className={`${uid} ${className ?? ""}`.trim()} role="img" aria-label={`Technische tekening ${B} bij ${H} mm, ${buiten ? "buitenaanzicht" : "binnenaanzicht"}`}>
      <style>{`.${uid} * { vector-effect: none !important; }`}</style>
      <defs>
        <pattern id={`${uid}m`} width={groot * 0.012} height={groot * 0.012} patternUnits="userSpaceOnUse">
          <path d={`M0 0H${groot * 0.012}M0 0V${groot * 0.012}`} stroke="#7f8890" strokeWidth={lijn * 0.75} fill="none" />
        </pattern>
        <linearGradient id={`${uid}g`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor={scherp ? "#dbedf9" : "#e2eef4"} />
          <stop offset="1" stopColor={scherp ? "#eaf5fc" : "#fcfdfe"} />
        </linearGradient>
        <filter id={`${uid}sh`} x="-10%" y="-10%" width="125%" height="125%">
          <feGaussianBlur stdDeviation={groot * 0.0018} />
        </filter>
      </defs>

      {/* kozijn: recht en vlak, met een dun randje */}
      <rect x={0} y={0} width={B} height={H} fill={profielVul} stroke={kader} strokeWidth={lijn * 1.3} />
      <rect x={PROFIEL * 0.3} y={PROFIEL * 0.3} width={B - PROFIEL * 0.6} height={H - PROFIEL * 0.6} fill="none" stroke={binnenRand} strokeWidth={lijn} />
      <rect x={PROFIEL} y={PROFIEL} width={B - 2 * PROFIEL} height={hi} fill={profielVul} stroke={kader} strokeWidth={lijn} />
      {spec.drempel && <rect x={0} y={H - DREMPEL} width={B} height={DREMPEL} fill="#1f2327" />}

      {/* middenstijlen en tussenregels */}
      {stijlen.map((s, i) => (
        <rect key={`st${i}`} x={s.x} y={s.y} width={STIJL} height={s.h} fill={profielVul} stroke={kader} strokeWidth={lijn} />
      ))}
      {regels.map((rg, i) => (
        <rect key={`rg${i}`} x={rg.x} y={rg.y} width={rg.w} height={TRAVERSE} fill={profielVul} stroke={kader} strokeWidth={lijn} />
      ))}

      {/* cellen */}
      {plaatsen.map(({ cel, x0, w, y, ch, kant, nr, kol: ci, rij }) => {
        const isDeur = cel.kind === "deur" || cel.kind === "deurdk";
        const open = cel.kind === "dk" || cel.kind === "kiep" || cel.kind === "schuif" || isDeur;
        const richting = cel.richting ? (buiten ? (cel.richting === "l" ? "r" : "l") : cel.richting) : undefined;
        const rand = open ? VLEUGEL : LAT;
        const gx = x0 + rand;
        const gy = y + rand;
        const gw = w - 2 * rand;
        const gh = ch - 2 * rand;
        const links = kant === "links";
        const stippel = `${fs * 0.4} ${fs * 0.3}`;
        const sleutel = `c${ci}-${rij}`;
        // De vakken binnen deze cel: één ruit, of glas met een paneel eronder, of de indeling van een voordeur of 3-vaks deur.
        const velden: { x: number; y: number; w: number; h: number; soort: "glas" | "paneel" }[] = [];
        const RAIL = 56;
        if (cel.ontwerp === "voordeur") {
          const strook = gw * 0.22;
          const balk = gw * 0.04;
          // het paneel zit aan de scharnierkant, de smalle glasstrook aan de klinkkant
          if (links) {
            velden.push({ x: gx, y: gy, w: gw - strook - balk, h: gh, soort: "paneel" });
            velden.push({ x: gx + gw - strook, y: gy, w: strook, h: gh, soort: "glas" });
          } else {
            velden.push({ x: gx, y: gy, w: strook, h: gh, soort: "glas" });
            velden.push({ x: gx + strook + balk, y: gy, w: gw - strook - balk, h: gh, soort: "paneel" });
          }
        } else if (cel.ontwerp === "drie") {
          const hh = (gh - 2 * RAIL) / 3;
          for (let i = 0; i < 3; i++) velden.push({ x: gx, y: gy + i * (hh + RAIL), w: gw, h: hh, soort: "glas" });
        } else if (cel.onderpaneel) {
          const glasH = gh * (1 - cel.onderpaneel) - RAIL / 2;
          velden.push({ x: gx, y: gy, w: gw, h: glasH, soort: "glas" });
          velden.push({ x: gx, y: gy + glasH + RAIL, w: gw, h: gh - glasH - RAIL, soort: "paneel" });
        } else {
          velden.push({ x: gx, y: gy, w: gw, h: gh, soort: "glas" });
        }
        // De klink zit bij een deur met paneel onderin op de grens tussen glas en paneel.
        const greepY = cel.onderpaneel && isDeur ? gy + gh * (1 - cel.onderpaneel) : y + ch / 2;
        if (cel.kind === "paneel") {
          return (
            <g key={sleutel}>
              <rect x={x0} y={y} width={w} height={ch} fill={profielVul} stroke={kader} strokeWidth={lijn * 1.1} />
              <rect x={x0 + LAT} y={y + LAT} width={w - 2 * LAT} height={ch - 2 * LAT} fill={profielVul} stroke={vleugelRand} strokeWidth={lijn} />
            </g>
          );
        }
        if (cel.kind === "rolluik") {
          const soort = cel.rolluik;
          const geleider = 46;
          const kastH = soort === "inbouw" ? 0 : Math.min(240, ch * 0.15);
          const px = x0 + geleider, pw = w - 2 * geleider;
          const py = y + kastH, ph = ch - kastH - 36;
          const stap = soort === "screen" ? 0 : 56;
          return (
            <g key={sleutel}>
              <rect x={x0} y={y} width={w} height={ch} fill={profielVul} stroke="#7d868d" strokeWidth={lijn * 1.1} />
              {/* geleiders links en rechts */}
              <rect x={x0} y={py} width={geleider} height={ch - kastH} fill={profielVul} stroke="#7d868d" strokeWidth={lijn} />
              <rect x={x0 + w - geleider} y={py} width={geleider} height={ch - kastH} fill={profielVul} stroke="#7d868d" strokeWidth={lijn} />
              {/* het doek: lamellen of fijn gaas */}
              <rect x={px} y={py} width={pw} height={ph} fill="#eef0f2" stroke="#5f686f" strokeWidth={lijn * 1.2} />
              {soort === "screen" ? (
                <rect x={px} y={py} width={pw} height={ph} fill={`url(#${uid}m)`} />
              ) : (
                Array.from({ length: Math.max(0, Math.floor(ph / stap) - 1) }).map((_, k) => (
                  <line key={k} x1={px} y1={py + (k + 1) * stap} x2={px + pw} y2={py + (k + 1) * stap} stroke="#6c757d" strokeWidth={lijn * 1.4} />
                ))
              )}
              {/* onderlat */}
              <rect x={px} y={y + ch - 36} width={pw} height={36} fill={profielVul} stroke="#7d868d" strokeWidth={lijn * 1.1} />
              {/* kast bovenaan */}
              {kastH > 0 && (
                <g>
                  <rect x={x0} y={y} width={w} height={kastH} fill={profielVul} stroke="#7d868d" strokeWidth={lijn * 1.3} />
                  <rect x={x0 + 14} y={y + 14} width={w - 28} height={kastH - 28} fill="none" stroke="#b4bbc1" strokeWidth={lijn} />
                </g>
              )}
            </g>
          );
        }
        if (cel.kind === "hor") {
          const soort = cel.hor;
          const f = soort === "plisse" ? 30 : 26; // breedte van het frame
          const mx = x0 + f, my = y + f, mw = w - 2 * f, mh = ch - 2 * f;
          return (
            <g key={sleutel}>
              <rect x={x0} y={y} width={w} height={ch} fill={profielVul} stroke="#7d868d" strokeWidth={lijn * 1.1} />
              <rect x={x0 + f * 0.4} y={y + f * 0.4} width={w - f * 0.8} height={ch - f * 0.8} fill="none" stroke="#b4bbc1" strokeWidth={lijn} />
              <rect x={mx} y={my} width={mw} height={mh} fill="#eef0f2" stroke="#5f686f" strokeWidth={lijn * 1.2} />
              <rect x={mx} y={my} width={mw} height={mh} fill={`url(#${uid}m)`} />
              {soort === "klem" && (
                <g>
                  {[0.3, 0.7].map((t, k) => (
                    <rect key={k} x={x0 + w - 4} y={y + ch * t - 40} width={22} height={80} rx={4} fill="#f3f3f1" stroke={stroke} strokeWidth={lijn * 0.8} />
                  ))}
                </g>
              )}
              {soort === "plisse" && (
                <g>
                  {/* geplooid gaas: verticale plooien */}
                  {Array.from({ length: Math.max(4, Math.round(mw / 52)) - 1 }).map((_, k, arr) => {
                    const px = mx + ((k + 1) * mw) / (arr.length + 1);
                    return <line key={k} x1={px} y1={my} x2={px} y2={my + mh} stroke="#59626a" strokeWidth={lijn * 1.3} />;
                  })}
                  {/* greepprofiel rechts met een greep, en een rail onderaan */}
                  <rect x={x0 + w - f - 36} y={my} width={36} height={mh} fill={profielVul} stroke="#7d868d" strokeWidth={lijn} />
                  <rect x={x0 + w - f - 22} y={y + ch / 2 - 60} width={8} height={120} rx={4} fill="#e4e6e8" stroke="#6f757a" strokeWidth={lijn * 0.8} />
                  <rect x={x0} y={y + ch - f * 0.6} width={w} height={f * 0.6} fill="#e9eaeb" stroke="#7d868d" strokeWidth={lijn} />
                </g>
              )}
            </g>
          );
        }
        const greepSchaal = Math.min(1.75, ch / 320);
        const greepX = cel.kind === "dk" ? (links ? x0 + w - rand / 2 : x0 + rand / 2) : x0 + w - rand / 2;
        return (
          <g key={sleutel}>
            {/* vleugel of glaslat: vlak, met een dunne binnenlijn */}
            <rect x={x0} y={y} width={w} height={ch} fill={profielVul} stroke={kader} strokeWidth={lijn * 1.1} />
            <rect x={x0 + rand * 0.45} y={y + rand * 0.45} width={w - rand * 0.9} height={ch - rand * 0.9} fill="none" stroke={binnenRand} strokeWidth={lijn} />
            {/* glas en dichte panelen, met een dun zwart lijntje boven en links bij het glas */}
            {velden.map((v, vi) =>
              v.soort === "paneel" ? (
                <rect key={`v${vi}`} x={v.x} y={v.y} width={v.w} height={v.h} fill={profielVul} stroke={vleugelRand} strokeWidth={lijn} />
              ) : (
                <g key={`v${vi}`}>
                  <rect x={v.x} y={v.y} width={v.w} height={v.h} fill={glasKleur} stroke={glasRand} strokeWidth={lijn * 0.8} />
                  <g strokeLinecap="square">
                    <line x1={v.x} y1={v.y} x2={v.x + v.w} y2={v.y} stroke="#1f2327" strokeWidth={lijn * 1.8} />
                    <line x1={v.x} y1={v.y} x2={v.x} y2={v.y + v.h} stroke="#1f2327" strokeWidth={lijn * 1.8} />
                    <line x1={v.x + v.w} y1={v.y} x2={v.x + v.w} y2={v.y + v.h} stroke="#c3c6c9" strokeWidth={lijn} />
                    <line x1={v.x} y1={v.y + v.h} x2={v.x + v.w} y2={v.y + v.h} stroke="#c3c6c9" strokeWidth={lijn} />
                  </g>
                </g>
              ),
            )}
            {/* openingslijnen */}
            {(cel.kind === "dk" || isDeur) && (
              <g fill="none" stroke={stippelKleur} strokeWidth={lijn * 0.8} strokeDasharray={stippel}>
                <path d={links ? `M${gx} ${gy} L${gx + gw} ${gy + gh / 2} L${gx} ${gy + gh}` : `M${gx + gw} ${gy} L${gx} ${gy + gh / 2} L${gx + gw} ${gy + gh}`} />
                {cel.kind !== "deur" && <path d={`M${gx} ${gy + gh} L${gx + gw / 2} ${gy} L${gx + gw} ${gy + gh}`} />}
              </g>
            )}
            {cel.kind === "kiep" && (
              <path d={`M${gx} ${gy + gh} L${gx + gw / 2} ${gy} L${gx + gw} ${gy + gh}`} fill="none" stroke={stippelKleur} strokeWidth={lijn * 0.8} strokeDasharray={stippel} />
            )}
            {/* scharnieren: bij draai-kiep aan de zijkant, bij kiep onderaan */}
            {(cel.kind === "dk" || isDeur) && kant && (
              <g>
                {[0.14, 0.5, 0.86].map((t, k) => (
                  <rect key={k} x={links ? x0 - 6 : x0 + w - 8} y={y + ch * t - 18} width={14} height={36} rx={3} fill="#f3f3f1" stroke={stroke} strokeWidth={lijn * 0.8} />
                ))}
              </g>
            )}
            {cel.kind === "kiep" && (
              <g>
                {[0.2, 0.8].map((t, k) => (
                  <rect key={k} x={x0 + w * t - 18} y={y + ch - 8} width={36} height={14} rx={3} fill="#f3f3f1" stroke={stroke} strokeWidth={lijn * 0.8} />
                ))}
              </g>
            )}
            {/* greep, alleen in het binnenaanzicht */}
            {(cel.kind === "dk" || cel.kind === "kiep") && !buiten && (
              <g transform={`translate(${greepX}, ${y + ch / 2}) scale(${greepSchaal})`}>
                <rect x={-15} y={-48} width={30} height={96} rx={13} fill="#000" opacity={0.18} transform="translate(2.5 3.5)" filter={`url(#${uid}sh)`} />
                <rect x={-15} y={-48} width={30} height={96} rx={13} fill="#f6f7f7" stroke="#7d8287" strokeWidth={(lijn * 0.6) / greepSchaal} />
                <circle cx={0} cy={-36} r={3.2} fill="#c3c6c9" stroke="#6f757a" strokeWidth={(lijn * 0.4) / greepSchaal} />
                <circle cx={0} cy={36} r={3.2} fill="#c3c6c9" stroke="#6f757a" strokeWidth={(lijn * 0.4) / greepSchaal} />
                <rect x={-8} y={-10} width={17} height={104} rx={8.5} fill="#000" opacity={0.22} transform="translate(2.5 3.5)" filter={`url(#${uid}sh)`} />
                <rect x={-9} y={-12} width={18} height={104} rx={9} fill="#e4e6e8" stroke="#6f757a" strokeWidth={(lijn * 0.6) / greepSchaal} />
                <rect x={-9} y={-12} width={8} height={104} rx={4} fill={profielVul} />
                <circle cx={0} cy={0} r={12} fill="#f1f2f3" stroke="#6f757a" strokeWidth={(lijn * 0.6) / greepSchaal} />
                <circle cx={0} cy={0} r={4.5} fill="#9ca1a6" />
              </g>
            )}
            {/* deurklink: ovale plaat met een rozet en een hendel die naar de scharnierkant wijst */}
            {isDeur && kant && !buiten && !cel.zonderGreep && (
              <g transform={`translate(${links ? x0 + w - rand / 2 : x0 + rand / 2}, ${greepY}) scale(${greepSchaal * 1.1})`}>
                <rect x={-17} y={-80} width={34} height={160} rx={15} fill="#000" opacity={0.18} transform="translate(2.5 3.5)" filter={`url(#${uid}sh)`} />
                <rect x={-17} y={-80} width={34} height={160} rx={15} fill="#f6f7f7" stroke="#7d8287" strokeWidth={(lijn * 0.6) / (greepSchaal * 1.1)} />
                <circle cx={0} cy={-62} r={3.4} fill="#c3c6c9" stroke="#6f757a" strokeWidth={(lijn * 0.4) / (greepSchaal * 1.1)} />
                <circle cx={0} cy={62} r={3.4} fill="#c3c6c9" stroke="#6f757a" strokeWidth={(lijn * 0.4) / (greepSchaal * 1.1)} />
                <rect x={links ? -112 : -6} y={-9} width={118} height={18} rx={9} fill="#000" opacity={0.2} transform="translate(2.5 3.5)" filter={`url(#${uid}sh)`} />
                <rect x={links ? -112 : -6} y={-9} width={118} height={18} rx={9} fill="#e4e6e8" stroke="#6f757a" strokeWidth={(lijn * 0.6) / (greepSchaal * 1.1)} />
                <rect x={links ? -112 : -6} y={-9} width={118} height={7} rx={3.5} fill={profielVul} />
                <circle cx={0} cy={0} r={13} fill="#f1f2f3" stroke="#6f757a" strokeWidth={(lijn * 0.6) / (greepSchaal * 1.1)} />
                <circle cx={0} cy={0} r={4.5} fill="#9ca1a6" />
              </g>
            )}
            {cel.kind === "schuif" && richting && (
              <g>
                {/* pijl in de schuifrichting */}
                <line x1={x0 + w / 2 - Math.min(w * 0.2, 260)} y1={y + ch / 2} x2={x0 + w / 2 + Math.min(w * 0.2, 260)} y2={y + ch / 2} stroke="#3a3f44" strokeWidth={lijn * 1.6} />
                <path
                  d={richting === "r"
                    ? `M${x0 + w / 2 + Math.min(w * 0.2, 260)} ${y + ch / 2} l${-fs * 0.9} ${-fs * 0.36} v${fs * 0.72}Z`
                    : `M${x0 + w / 2 - Math.min(w * 0.2, 260)} ${y + ch / 2} l${fs * 0.9} ${-fs * 0.36} v${fs * 0.72}Z`}
                  fill="#3a3f44"
                />
                {/* platte schuifgreep aan de kant waar het deel vandaan schuift */}
                {!cel.zonderGreep && <g transform={`translate(${richting === "r" ? x0 + rand / 2 : x0 + w - rand / 2}, ${y + ch / 2})`}>
                  <rect x={-9} y={-80} width={20} height={160} rx={7} fill="#000" opacity={0.18} transform="translate(2.5 3.5)" filter={`url(#${uid}sh)`} />
                  <rect x={-10} y={-80} width={20} height={160} rx={7} fill="#e4e6e8" stroke="#6f757a" strokeWidth={lijn * 0.8} />
                  <rect x={-10} y={-80} width={8} height={160} rx={4} fill={profielVul} />
                </g>}
              </g>
            )}
          </g>
        );
      })}

      {/* maatlijnen */}
      {maten && (
        <g>
          {maatH(0, B, -fs * 1.7, String(Math.round(B)), 0, true)}
          {maatV(0, H, B + fs * 2.2, String(Math.round(H)), B)}
          {grens.slice(0, -1).map((d, i) => (
            <g key={`maat${i}`}>{maatH(d, grens[i + 1], H + fs * 2.2, String(Math.round(grens[i + 1] - d)), H)}</g>
          ))}
        </g>
      )}
    </svg>
  );
}
