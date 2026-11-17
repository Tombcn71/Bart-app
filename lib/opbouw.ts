import { inmetenKosten } from "./prijsmodel";
/**
 * "Wat dit voor jou betekent": voor het bedrijf zelf (nooit voor de klant) hoe een offerte is opgebouwd en wat
 * het bedrijf eraan verdient. Wordt bij het maken van de offerte uitgerekend en in de offerte bewaard, zodat een
 * latere prijswijziging oude offertes niet verandert. Alle bedragen exclusief btw.
 */
/** Hoe een product in het prijsscherm en in de mail heet: per kozijn, per deur, per schuifpui enz. */
export type Eenheid = { een: string; meer: string; /** "het kozijn", "de deur" */ art: "het" | "de" };
export function eenheidVoor(sleutel?: string): Eenheid {
  const s = sleutel ?? "";
  if (s.includes("harmonica")) return { een: "harmonicadeur", meer: "harmonicadeuren", art: "de" };
  if (s.includes("schuifpui")) return { een: "schuifpui", meer: "schuifpuien", art: "de" };
  if (s.includes("deur")) return { een: "deur", meer: "deuren", art: "de" };
  if (s.includes("rolluik")) return { een: "rolluik", meer: "rolluiken", art: "het" };
  if (s.includes("hor")) return { een: "hor", meer: "horren", art: "de" };
  return { een: "kozijn", meer: "kozijnen", art: "het" };
}

export type Opbouw = {
  /** Inmeetkosten (horren). */
  inmeten?: number;
  /** Uren loon, voor werk dat per uur wordt gerekend (horren). */
  uren?: number;
  /** Soorten werk in deze offerte (sleutels van eenheidVoor); ontbreekt bij oudere offertes: kozijnen. */
  soorten?: string[];
  kozijnen: number;
  dagen: number;
  loon: number;
  transport: number;
  /** Kraan, alleen als de klant geen tuintoegang heeft. */
  kraan?: number;
  materiaal: number;
  afval: number;
  risico: number;
  winst: number;
  overig: number;
  /** Totaal van de montage (loon t/m winst). */
  montage: number;
};

type ItemMetDag = { dag?: { groep?: string; kraan?: number; perDag: number; aantal: number; som?: { monteurs: number; perMonteur: number; transportPerMonteur: number; materiaal: number; afval: number; risico: number; winst: number; overig: number; kraan?: number; perUur?: boolean; urenPerStuk?: number; inmeten?: number; inmetenGrens?: number; inmetenPerExtra?: number } } };

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Rekent de montage van alle kozijnen in een offerte samen: dagen over alle kozijnen, naar boven afgerond. */
export function bedrijfsOpbouw(items: ItemMetDag[]): Opbouw | null {
  const groepen = [...new Set(items.filter((i) => i.dag?.som).map((i) => i.dag!.groep ?? "kozijn"))];
  if (groepen.length === 0) return null;
  const totaal: Opbouw = { soorten: [], kozijnen: 0, dagen: 0, loon: 0, transport: 0, kraan: 0, materiaal: 0, afval: 0, risico: 0, winst: 0, overig: 0, montage: 0 };
  for (const groep of groepen) {
    const met = items.filter((i) => i.dag?.som && (i.dag.groep ?? "kozijn") === groep);
    const som = met[0].dag!.som!;
    const n = met.reduce((s, i) => s + Math.max(1, i.dag!.aantal), 0);
    totaal.kozijnen += n;
    totaal.soorten = [...new Set([...(totaal.soorten ?? []), groep])];
    if (som.perUur) {
      // Per uur (een hor): loon voor alle uren, transport één keer per klus, geen werkdagen.
      const uren = n * (som.urenPerStuk ?? 1);
      totaal.uren = (totaal.uren ?? 0) + uren;
      totaal.loon += uren * som.monteurs * som.perMonteur;
      totaal.transport += som.monteurs * som.transportPerMonteur;
      totaal.inmeten = (totaal.inmeten ?? 0) + inmetenKosten(som, n);
    } else {
      const dagen = Math.ceil(n / Math.max(1, met[0].dag!.perDag));
      totaal.dagen += dagen;
      totaal.loon += dagen * som.monteurs * som.perMonteur;
      totaal.transport += dagen * som.monteurs * som.transportPerMonteur;
      if (met.some((i) => (i.dag!.kraan ?? 0) > 0)) totaal.kraan = (totaal.kraan ?? 0) + dagen * (som.kraan ?? 0);
    }
    totaal.materiaal += n * som.materiaal;
    totaal.afval += n * som.afval;
    totaal.risico += n * som.risico;
    totaal.winst += n * som.winst;
    totaal.overig += n * som.overig;
  }
  for (const k of ["loon", "transport", "inmeten", "kraan", "materiaal", "afval", "risico", "winst", "overig"] as const) totaal[k] = r2(totaal[k] ?? 0);
  totaal.montage = r2(totaal.loon + totaal.transport + (totaal.inmeten ?? 0) + (totaal.kraan ?? 0) + totaal.materiaal + totaal.afval + totaal.risico + totaal.winst + totaal.overig);
  return totaal;
}

const eur = (n: number) => `€ ${n.toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`;

/** Korte tekstregels voor mail en scherm. */
export function opbouwRegels(o: Opbouw): { kop: string; regels: { naam: string; bedrag: string; winst?: boolean }[] } {
  return {
    kop: `${o.kozijnen} ${(() => { const e = [...new Set((o.soorten ?? ["kozijn"]).map((x) => eenheidVoor(x).een))]; return e.length === 1 ? (o.kozijnen === 1 ? eenheidVoor((o.soorten ?? ["kozijn"])[0]).een : eenheidVoor((o.soorten ?? ["kozijn"])[0]).meer) : (o.kozijnen === 1 ? "stuk" : "stuks"); })()}${o.dagen > 0 ? ` · ${o.dagen} werkdag${o.dagen === 1 ? "" : "en"}` : ""}${(o.uren ?? 0) > 0 ? ` · ${String(o.uren).replace(".", ",")} uur` : ""}`,
    regels: [
      { naam: "Loon", bedrag: eur(o.loon) },
      { naam: "Transport", bedrag: eur(o.transport) },
      ...((o.inmeten ?? 0) > 0 ? [{ naam: "Inmeten", bedrag: eur(o.inmeten ?? 0) }] : []),
      ...((o.kraan ?? 0) > 0 ? [{ naam: "Kraan (geen tuintoegang)", bedrag: eur(o.kraan ?? 0) }] : []),
      { naam: "Montagemateriaal", bedrag: eur(o.materiaal) },
      { naam: "Afval wegbrengen", bedrag: eur(o.afval) },
      { naam: "Risico (afstelwerk)", bedrag: eur(o.risico) },
      ...(o.overig > 0 ? [{ naam: "Eerder ingevuld bedrag", bedrag: eur(o.overig) }] : []),
      { naam: "Jouw marge", bedrag: eur(o.winst), winst: true },
    ],
  };
}
