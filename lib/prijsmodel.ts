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
};

/** Het totaal van de som: wat in de prijs van één kozijn komt, exclusief btw. */
export function montageTotaal(som: MontageSom): number {
  const monteurs = som.monteurs ?? 2;
  const perDag = Math.max(1, som.kozijnenPerDag ?? 1);
  const dagkosten = monteurs * ((som.perMonteur ?? 0) + (som.transportPerMonteur ?? 0));
  const totaal =
    dagkosten / perDag + (som.materiaal ?? 0) + (som.afval ?? 0) + (som.risico ?? 0) + (som.winst ?? 0) + (som.overig ?? 0);
  return Math.round(totaal * 100) / 100;
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
 * Barts eigen cijfers voor de montage van een kozijn (excl. btw): twee monteurs van €400 en €50 transport per dag,
 * €300 materiaal, €50 afval, €100 risico en €500 winst = €1.850. Staan vooraf ingevuld in zijn kozijnenprijzen;
 * ze gelden pas als hij de prijzen opslaat.
 */
export const BART_KOZIJN_MONTAGE: MontageSom = {
  monteurs: 2,
  perMonteur: 400,
  transportPerMonteur: 50,
  kozijnenPerDag: 1,
  materiaal: 300,
  afval: 50,
  risico: 100,
  winst: 500,
};

/** Het standaardmodel voor kozijnen bij Bart: de standaardprijzen met zijn montage vooraf ingevuld. */
export const kozijnStandaardModel = (): StandaardModel => ({
  model: "standaard",
  factor: 1,
  montage: montageTotaal(BART_KOZIJN_MONTAGE),
  montageSom: { ...BART_KOZIJN_MONTAGE },
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
  const montage = model.montage > 0 ? model.montage : 0;
  if (montage && model.montageApart !== true) {
    // Montage zit in de prijs: geen aparte regel, het kozijn wordt er duurder van.
    regels[0] = { label: `${regels[0].label}, inclusief montage`, bedrag: regels[0].bedrag + montage };
  } else if (montage) regels.push({ label: "Montage", bedrag: montage });
  const totaal = materiaal * factor + montage;
  return { regels, totaal: Math.round(totaal * aantal * 100) / 100 };
}

export { euro as formatEuro };
