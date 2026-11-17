import { typePrijs, toeslagPrijs, type KozijnInfo, type Toeslag, type TypeRecept } from "./prijsmotor";
import { STANDAARD_TYPEN } from "./standaardprijzen";
import { STANDAARD_KEUZES, type KeuzeGroep } from "./standaardopties";

/**
 * Het prijsmodel van een bedrijf: de standaardprijzen, met een prijsniveau (schuif), montage
 * en eigen aanpassingen per kozijntype en per keuze. Wordt opgeslagen bij de prijzen van het bedrijf.
 */
/**
 * De rekensom achter "Montage per kozijn": wat het kost om één kozijn te plaatsen, plus de winst.
 * De kosten van monteurs en transport worden verdeeld over het aantal kozijnen dat ze op een dag plaatsen.
 */
export type MontageSom = {
  /** Aantal monteurs (standaard 2). */
  monteurs?: number;
  /** Bedrag per monteur per dag, exclusief btw. */
  perMonteur?: number;
  /** Hoeveel kozijnen de monteurs op één dag plaatsen (standaard 1). */
  kozijnenPerDag?: number;
  /** Transportkosten per monteur per dag. */
  transportPerMonteur?: number;
  /** Per kozijn: montagemateriaal, afval wegbrengen, risico (afstelwerk na montage) en de eigen winst. */
  materiaal?: number;
  afval?: number;
  risico?: number;
  winst?: number;
  /** Een eerder ingevuld los bedrag (van vóór het rekenkaartje); blijft meetellen tot het bedrijf het op 0 zet. */
  overig?: number;
  /** Kraan per werkdag, alleen als de monteurs niet via de tuin bij de plek kunnen (schuifpui). Exclusief btw. */
  kraan?: number;
  /** Werk dat je per uur rekent (een hor): `perMonteur` is dan het bedrag per uur en `urenPerStuk` de tijd per stuk; transport is één bedrag per klus. */
  perUur?: boolean;
  urenPerStuk?: number;
  /** Inmeten (horren): een vast bedrag voor de klus tot `inmetenGrens` stuks (standaard 10), daarboven een bedrag per extra stuk. */
  inmeten?: number;
  inmetenGrens?: number;
  inmetenPerExtra?: number;
};

/** Inmeetkosten voor `aantal` stuks, één keer per klus. */
export function inmetenKosten(som: MontageSom, aantal: number): number {
  const grens = Math.max(1, som.inmetenGrens ?? 10);
  const extra = Math.max(0, aantal - grens) * (som.inmetenPerExtra ?? 0);
  return Math.round(((som.inmeten ?? 0) + extra) * 100) / 100;
}

/** Loon en transport voor één werkdag van het team. Blijven apart: loon is geen transport. */
export function montageDag(som: MontageSom): { loon: number; transport: number } {
  // Per uur: loon en transport voor één stuk (transport is één bedrag per klus).
  if (som.perUur) {
    const m = som.monteurs ?? 1;
    return { loon: m * (som.perMonteur ?? 0) * (som.urenPerStuk ?? 1), transport: m * (som.transportPerMonteur ?? 0) };
  }
  const monteurs = som.monteurs ?? 2;
  return { loon: monteurs * (som.perMonteur ?? 0), transport: monteurs * (som.transportPerMonteur ?? 0) };
}

/** Wat per kozijn bijkomt, los van de dag: materiaal, afval, risico, winst. */
export function montagePerKozijn(som: MontageSom): number {
  return (som.materiaal ?? 0) + (som.afval ?? 0) + (som.risico ?? 0) + (som.winst ?? 0) + (som.overig ?? 0);
}

/** Het totaal voor één kozijn, exclusief btw: één kozijn kost het bedrijf een hele werkdag. */
export function montageTotaal(som: MontageSom): number {
  const d = montageDag(som);
  return Math.round((d.loon + d.transport + montagePerKozijn(som) + (som.perUur ? inmetenKosten(som, 1) : 0)) * 100) / 100;
}

/**
 * Montage voor `aantal` kozijnen, exclusief btw. De dagen worden naar boven afgerond (er worden geen halve dagen
 * uitbetaald); materiaal, afval, risico en winst tellen per kozijn.
 */
export function montageVoor(
  model: { montage: number; montageSom?: MontageSom },
  aantal: number,
  opties?: { kraan?: boolean },
): { dagen: number; uren?: number; inmeten?: number; loon: number; transport: number; kraan: number; kozijnen: number; totaal: number } {
  const n = Math.max(1, aantal);
  const som = model.montageSom;
  if (!som) {
    const kozijnen = Math.max(0, model.montage ?? 0) * n;
    return { dagen: 0, loon: 0, transport: 0, kraan: 0, kozijnen, totaal: kozijnen };
  }
  if (som.perUur) {
    const m = som.monteurs ?? 1;
    const uren = n * (som.urenPerStuk ?? 1);
    const loon = uren * m * (som.perMonteur ?? 0);
    const transport = m * (som.transportPerMonteur ?? 0);
    const kozijnen = n * montagePerKozijn(som);
    const inmeten = inmetenKosten(som, n);
    return { dagen: 0, uren, inmeten, loon, transport, kraan: 0, kozijnen, totaal: Math.round((loon + transport + inmeten + kozijnen) * 100) / 100 };
  }
  const dagen = Math.ceil(n / Math.max(1, som.kozijnenPerDag ?? 1));
  const d = montageDag(som);
  const loon = dagen * d.loon;
  const transport = dagen * d.transport;
  const kozijnen = n * montagePerKozijn(som);
  const kraan = opties?.kraan ? dagen * (som.kraan ?? 0) : 0;
  return { dagen, loon, transport, kraan, kozijnen, totaal: Math.round((loon + transport + kraan + kozijnen) * 100) / 100 };
}

export type StandaardModel = {
  model: "standaard";
  /** 1 = precies de standaardprijzen, 0,9 = 10% goedkoper, 1,2 = 20% duurder. */
  factor: number;
  /** Vast bedrag per kozijn voor montage, exclusief btw. De standaardprijzen zijn zonder montage. */
  montage: number;
  /** De rekensom waaruit `montage` volgt (het totaal). Ontbreekt bij prijzen van vóór het rekenkaartje. */
  montageSom?: MontageSom;
  /** Het bedrijf vult alle prijzen zelf in (alle velden begonnen leeg) in plaats van de standaardprijzen te volgen. */
  zelf?: boolean;
  /** Hoe montage getoond wordt: true = apart bovenop, anders (standaard) inbegrepen in de prijs van het kozijn. */
  montageApart?: boolean;
  /** Prijs van één hor (inclusief plaatsing, exclusief btw) die de klant bij een kozijn kan toevoegen; leeg = geen hor-keuze. */
  horPrijs?: number;
  /** Btw-percentage; ontbreekt het, dan 21. Alle prijzen in het model zijn exclusief btw. */
  btw?: number;
  /** Eigen bedragen per kozijntype (slug); wat ontbreekt volgt de standaardprijzen. */
  typen?: Record<string, Partial<TypeRecept>>;
  /** Eigen toeslagen per keuzegroep en keuze; wat ontbreekt volgt de standaardprijzen. */
  keuzes?: Record<string, Record<string, Toeslag>>;
};

/** De standaardprijzen van een product: de kozijntypes (of schuifpui-typen enz.) en hun keuzes. */
export type Catalogus = { typen: Record<string, TypeRecept>; keuzes: KeuzeGroep[] };
export const KOZIJN_CATALOGUS: Catalogus = { typen: STANDAARD_TYPEN, keuzes: STANDAARD_KEUZES };

export const nieuwStandaardModel = (): StandaardModel => ({ model: "standaard", factor: 1, montage: 0 });

/**
 * Startpunt voor de montage van een kozijn (excl. btw), uit de cijfers van een echt kozijnbedrijf: twee monteurs van €400
 * en €50 transport per dag, twee kozijnen per dag, €250 materiaal, €50 afval, €100 risico en €600 winst; één kozijn is €1.900. Staat vooraf ingevuld in het
 * prijsscherm, als voorbeeld dat het bedrijf zelf aanpast; het geldt pas als het bedrijf de prijzen opslaat.
 */
export const KOZIJN_MONTAGE_STARTPUNT: MontageSom = {
  monteurs: 2,
  perMonteur: 400,
  transportPerMonteur: 50,
  kozijnenPerDag: 2,
  materiaal: 250,
  afval: 50,
  risico: 100,
  winst: 600,
};

/** Het startmodel voor kozijnen in het prijsscherm: de standaardprijzen met het montagestartpunt vooraf ingevuld. */
export const kozijnStandaardModel = (): StandaardModel => ({
  model: "standaard",
  factor: 1,
  montage: montageTotaal(KOZIJN_MONTAGE_STARTPUNT),
  montageSom: { ...KOZIJN_MONTAGE_STARTPUNT },
});
/**
 * Startpunt voor de montage van een deur (excl. btw): twee monteurs van €400 en €50 transport per dag, €250 materiaal, €50 afval,
 * €100 risico en €800 winst, een deur per dag.
 */
export const DEUR_MONTAGE_STARTPUNT: MontageSom = {
  monteurs: 2,
  perMonteur: 400,
  transportPerMonteur: 50,
  kozijnenPerDag: 1,
  materiaal: 250,
  afval: 50,
  risico: 100,
  winst: 800,
};
export const deurStandaardModel = (): StandaardModel => ({
  model: "standaard",
  factor: 1,
  montage: montageTotaal(DEUR_MONTAGE_STARTPUNT),
  montageSom: { ...DEUR_MONTAGE_STARTPUNT },
});
/** Startpunt voor de montage van een schuifpui: zoals een deur, met €1.000 winst en een kraan van €800 per werkdag als er geen tuintoegang is. */
export const SCHUIFPUI_MONTAGE_STARTPUNT: MontageSom = {
  monteurs: 2,
  perMonteur: 400,
  transportPerMonteur: 50,
  kozijnenPerDag: 1,
  materiaal: 250,
  afval: 50,
  risico: 100,
  winst: 1000,
  kraan: 800,
};
export const schuifpuiStandaardModel = (): StandaardModel => ({
  model: "standaard",
  factor: 1,
  montage: montageTotaal(SCHUIFPUI_MONTAGE_STARTPUNT),
  montageSom: { ...SCHUIFPUI_MONTAGE_STARTPUNT },
});
/** Startpunt voor de montage van een harmonicadeur: zoals de schuifpui, met €1.500 winst. Kraan €800 per werkdag zonder tuintoegang. */
export const HARMONICA_MONTAGE_STARTPUNT: MontageSom = { ...SCHUIFPUI_MONTAGE_STARTPUNT, winst: 1500 };
export const harmonicaStandaardModel = (): StandaardModel => ({
  model: "standaard",
  factor: 1,
  montage: montageTotaal(HARMONICA_MONTAGE_STARTPUNT),
  montageSom: { ...HARMONICA_MONTAGE_STARTPUNT },
});
/** Startpunt voor de montage van een rolluik (excl. btw): twee monteurs van €400 en €50 transport per dag, een rolluik per dag, €50 montagemateriaal, €50 afval, €100 risico en €250 winst. */
export const ROLLUIK_MONTAGE_STARTPUNT: MontageSom = {
  monteurs: 2,
  perMonteur: 400,
  transportPerMonteur: 50,
  kozijnenPerDag: 1,
  materiaal: 50,
  afval: 50,
  risico: 100,
  winst: 250,
};
export const rolluikStandaardModel = (): StandaardModel => ({
  model: "standaard",
  factor: 1,
  montage: montageTotaal(ROLLUIK_MONTAGE_STARTPUNT),
  montageSom: { ...ROLLUIK_MONTAGE_STARTPUNT },
});
/**
 * Startpunt voor de montage van een inzethor of klemhor (excl. btw): één monteur van €50 per uur, een half uur per hor,
 * €25 transport per klus, €5 risico en €15 marge. Een hor rekent een bedrijf per uur, niet per werkdag.
 */
export const HOR_MONTAGE_STARTPUNT: MontageSom = {
  perUur: true,
  monteurs: 1,
  perMonteur: 50,
  urenPerStuk: 0.5,
  inmeten: 150,
  inmetenGrens: 10,
  inmetenPerExtra: 15,
  transportPerMonteur: 25,
  materiaal: 0,
  afval: 0,
  risico: 5,
  winst: 15,
};
export const horStandaardModel = (): StandaardModel => ({
  model: "standaard",
  factor: 1,
  montage: montageTotaal(HOR_MONTAGE_STARTPUNT),
  montageSom: { ...HOR_MONTAGE_STARTPUNT },
});
/** Startpunt voor een plissé hordeur: zoals een hor, met anderhalf uur per stuk en €40 marge. */
export const PLISSE_MONTAGE_STARTPUNT: MontageSom = { ...HOR_MONTAGE_STARTPUNT, urenPerStuk: 1.5, risico: 10, winst: 40 };
export const plisseStandaardModel = (): StandaardModel => ({
  model: "standaard",
  factor: 1,
  montage: montageTotaal(PLISSE_MONTAGE_STARTPUNT),
  montageSom: { ...PLISSE_MONTAGE_STARTPUNT },
});
/** Een model waarin alle bedragen leeg zijn, om alles zelf in te vullen. De calculator blijft dezelfde. */
export function leegModel(cat: Catalogus = KOZIJN_CATALOGUS): StandaardModel {
  const typen: Record<string, Partial<TypeRecept>> = {};
  for (const slug of Object.keys(cat.typen)) {
    typen[slug] = { basis: 0, perMBreedte: 0, perMHoogte: 0, perM2: 0, correctie: undefined, toeslagExtra: undefined, toeslagVervang: undefined, aanpassing: undefined };
  }
  const keuzes: Record<string, Record<string, Toeslag>> = {};
  for (const g of cat.keuzes) {
    keuzes[g.id] = {};
    for (const k of g.keuzes) {
      // Dezelfde onderdelen als de standaard, maar op nul: zo ziet het bedrijf welke het kan invullen.
      keuzes[g.id][k.id] = Object.fromEntries(Object.entries(k.toeslag).map(([sleutel, w]) => [sleutel, typeof w === "number" ? 0 : w])) as Toeslag;
    }
  }
  return { model: "standaard", zelf: true, factor: 1, montage: 0, typen, keuzes };
}

export const isStandaardModel = (m: unknown): m is StandaardModel => (m as StandaardModel | null)?.model === "standaard";

export function typeRecept(model: StandaardModel, slug: string, cat: Catalogus = KOZIJN_CATALOGUS): TypeRecept | undefined {
  const basis = cat.typen[slug];
  return basis ? { ...basis, ...model.typen?.[slug] } : undefined;
}

export function keuzeToeslag(model: StandaardModel, groep: string, id: string, cat: Catalogus = KOZIJN_CATALOGUS): Toeslag {
  const eigen = model.keuzes?.[groep]?.[id];
  if (eigen) return eigen;
  return cat.keuzes.find((g) => g.id === groep)?.keuzes.find((k) => k.id === id)?.toeslag ?? {};
}

export const btwPercentage = (m: StandaardModel) => (m.btw && m.btw > 0 ? m.btw : 21);

export const eersteKeuze = (groep: string, cat: Catalogus = KOZIJN_CATALOGUS) => cat.keuzes.find((g) => g.id === groep)!.keuzes[0].id;
export const keuzeNaam = (groep: string, id: string, cat: Catalogus = KOZIJN_CATALOGUS) =>
  cat.keuzes.find((g) => g.id === groep)?.keuzes.find((k) => k.id === id)?.naam ?? id;

/** Vast extra bedrag van dit kozijntype bij een keuze; kleuren met hetzelfde percentage delen het bedrag. */
export function toeslagExtra(recept: TypeRecept, groep: string, id: string, cat: Catalogus = KOZIJN_CATALOGUS): number {
  const extra = recept.toeslagExtra;
  if (!extra) return 0;
  if (extra[`${groep}:${id}`] !== undefined) return extra[`${groep}:${id}`];
  const g = cat.keuzes.find((x) => x.id === groep);
  const procent = g?.keuzes.find((k) => k.id === id)?.toeslag.procent;
  if (!g || !procent || !/^kleur/.test(groep)) return 0;
  for (const [sleutel, waarde] of Object.entries(extra)) {
    if (!sleutel.startsWith(`${groep}:`)) continue;
    if (g.keuzes.find((k) => k.id === sleutel.slice(groep.length + 1))?.toeslag.procent === procent) return waarde;
  }
  return 0;
}

export type PrijsRegel = { label: string; bedrag: number };

const euro = (n: number) => `€ ${n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const nl = (n: number) => n.toLocaleString("nl-NL", { maximumFractionDigits: 2 });

/** Prijs van een kozijn met de gekozen opties (groep -> keuze), exclusief btw, met de opbouw per regel. */
export function berekenStandaard(
  model: StandaardModel,
  slug: string,
  breedteMm: number,
  hoogteMm: number,
  gekozen: Record<string, string>,
  kozijn: KozijnInfo,
  aantal: number,
  cat: Catalogus = KOZIJN_CATALOGUS,
  opties?: { kraan?: boolean },
): { regels: PrijsRegel[]; totaal: number } {
  const recept = typeRecept(model, slug, cat);
  if (!recept || breedteMm <= 0 || hoogteMm <= 0) return { regels: [], totaal: 0 };
  const regels: PrijsRegel[] = [];
  const kozijnBedrag = typePrijs(recept, breedteMm, hoogteMm);
  regels.push({ label: `Kozijn ${nl(breedteMm)} × ${nl(hoogteMm)} mm`, bedrag: kozijnBedrag });
  let materiaal = kozijnBedrag;
  for (const groep of cat.keuzes) {
    if (groep.typen && !groep.typen.includes(slug)) continue;
    const id = gekozen[groep.id];
    if (!id) continue;
    // Bij een verdiept profiel is er geen T-profiel om weg te laten: de korting voor "zonder T-profiel" vervalt.
    if (groep.id === "aanslag" && /^verdiept/.test(gekozen.profiel ?? "")) continue;
    // Aluminium: lak of kleur aan beide kanten (blank geanodiseerd, een eigen RAL-kleur) telt maar één keer.
    const alu = cat.keuzes.some((g) => g.id === "lakBuiten");
    const kost = (g: string, k: string | undefined) => !!k && Object.values(keuzeToeslag(model, g, k, cat)).some((w) => typeof w === "number" && w !== 0);
    if (alu && groep.id === "lakBinnen" && id === gekozen.lakBuiten && kost("lakBinnen", id)) continue;
    if (alu && groep.id === "kleurBinnen" && kost("kleurBuiten", gekozen.kleurBuiten) && kost("kleurBinnen", id)) continue;
    let toeslag = keuzeToeslag(model, groep.id, id, cat);
    // Bij sommige kozijnen prijst een groep anders (andere kleuren per meter, of gratis).
    const vervang = recept.toeslagVervang?.[groep.id];
    if (vervang && Object.values(toeslag).some((w) => typeof w === "number" && w !== 0)) toeslag = vervang;
    const bedrag = toeslagPrijs(recept, toeslag, breedteMm, hoogteMm, kozijn) + toeslagExtra(recept, groep.id, id, cat);
    if (Math.abs(bedrag) < 0.005) continue;
    regels.push({ label: `${groep.titel}: ${keuzeNaam(groep.id, id, cat)}`, bedrag });
    materiaal += bedrag;
  }
  const factor = Number.isFinite(model.factor) && model.factor > 0 ? model.factor : 1;
  if (Math.abs(factor - 1) > 0.00005) {
    const verschil = Math.round((factor - 1) * 1000) / 10;
    regels.push({
      label: `${nl(Math.abs(verschil))}% ${verschil < 0 ? "goedkoper" : "duurder"} dan de standaardprijzen`,
      bedrag: materiaal * (factor - 1),
    });
  }
  const mv = montageVoor(model, aantal, opties);
  const montage = mv.totaal / Math.max(1, aantal);
  // Horren met inmeetkosten: de klant ziet in de tekst dat inmeten erin zit (zonder apart bedrag).
  const metInmeten = !!model.montageSom?.perUur && (mv.inmeten ?? 0) > 0;
  if (montage > 0 && model.montageApart !== true) {
    // Montage zit in de prijs: geen aparte regel, het kozijn wordt er duurder van.
    regels[0] = { label: `${regels[0].label}, inclusief montage${metInmeten ? " en inmeten" : ""}`, bedrag: regels[0].bedrag + montage };
  } else if (montage > 0) regels.push({ label: metInmeten ? "Montage en inmeten" : "Montage", bedrag: montage });
  const totaal = materiaal * factor * aantal + mv.totaal;
  return { regels, totaal: Math.round(totaal * 100) / 100 };
}

export { euro as formatEuro };

/** Het startmodel voor een prijssleutel: zo rekent een calculator zolang er nog niets is opgeslagen. */
export function startModelVoor(sleutel: string): StandaardModel {
  if (sleutel === "kozijn_matrix" || sleutel === "alu_kozijn_matrix") return kozijnStandaardModel();
  if (sleutel === "deur_matrix" || sleutel === "alu_deur_matrix") return deurStandaardModel();
  if (sleutel === "schuifpui_matrix" || sleutel === "alu_schuifpui_matrix") return schuifpuiStandaardModel();
  if (sleutel === "alu_harmonicadeur_matrix") return harmonicaStandaardModel();
  if (sleutel === "rolluiken_matrix") return rolluikStandaardModel();
  if (sleutel === "horren_matrix") return horStandaardModel();
  if (sleutel === "plisse_hor_matrix") return plisseStandaardModel();
  return nieuwStandaardModel();
}
