/**
 * "Wat dit voor jou betekent": voor het bedrijf zelf (nooit voor de klant) hoe een offerte is opgebouwd en wat
 * het bedrijf eraan verdient. Wordt bij het maken van de offerte uitgerekend en in de offerte bewaard, zodat een
 * latere prijswijziging oude offertes niet verandert. Alle bedragen exclusief btw.
 */
export type Opbouw = {
  kozijnen: number;
  dagen: number;
  loon: number;
  transport: number;
  materiaal: number;
  afval: number;
  risico: number;
  winst: number;
  overig: number;
  /** Totaal van de montage (loon t/m winst). */
  montage: number;
};

type ItemMetDag = { dag?: { perDag: number; aantal: number; som?: { monteurs: number; perMonteur: number; transportPerMonteur: number; materiaal: number; afval: number; risico: number; winst: number; overig: number } } };

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Rekent de montage van alle kozijnen in een offerte samen: dagen over alle kozijnen, naar boven afgerond. */
export function bedrijfsOpbouw(items: ItemMetDag[]): Opbouw | null {
  const met = items.filter((i) => i.dag?.som);
  if (met.length === 0) return null;
  const som = met[0].dag!.som!;
  const kozijnen = met.reduce((s, i) => s + Math.max(1, i.dag!.aantal), 0);
  const dagen = Math.ceil(kozijnen / Math.max(1, met[0].dag!.perDag));
  const loon = r2(dagen * som.monteurs * som.perMonteur);
  const transport = r2(dagen * som.monteurs * som.transportPerMonteur);
  const materiaal = r2(kozijnen * som.materiaal);
  const afval = r2(kozijnen * som.afval);
  const risico = r2(kozijnen * som.risico);
  const winst = r2(kozijnen * som.winst);
  const overig = r2(kozijnen * som.overig);
  return { kozijnen, dagen, loon, transport, materiaal, afval, risico, winst, overig, montage: r2(loon + transport + materiaal + afval + risico + winst + overig) };
}

const eur = (n: number) => `€ ${n.toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`;

/** Korte tekstregels voor mail en scherm. */
export function opbouwRegels(o: Opbouw): { kop: string; regels: { naam: string; bedrag: string; winst?: boolean }[] } {
  return {
    kop: `${o.kozijnen} kozijn${o.kozijnen === 1 ? "" : "en"} · ${o.dagen} werkdag${o.dagen === 1 ? "" : "en"}`,
    regels: [
      { naam: "Loon", bedrag: eur(o.loon) },
      { naam: "Transport", bedrag: eur(o.transport) },
      { naam: "Montagemateriaal", bedrag: eur(o.materiaal) },
      { naam: "Afval wegbrengen", bedrag: eur(o.afval) },
      { naam: "Risico (afstelwerk)", bedrag: eur(o.risico) },
      ...(o.overig > 0 ? [{ naam: "Eerder ingevuld bedrag", bedrag: eur(o.overig) }] : []),
      { naam: "Jouw winst", bedrag: eur(o.winst), winst: true },
    ],
  };
}
