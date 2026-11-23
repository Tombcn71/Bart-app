import { eq } from "drizzle-orm";
import { db } from "@/db";
import { instellingen } from "@/db/schema";

/** Hoeveel gesprekken met Marleen per maand mogen (kosten begrenzen). Na dit aantal verdwijnt de bal tot de volgende maand. */
export const MAX_PER_MAAND = Number(process.env.MARLEEN_MAX_PER_MAAND ?? 65);
/** En per dag maximaal zoveel gesprekken, zodat een gekke dag nooit veel kost. */
export const MAX_PER_DAG = Number(process.env.MARLEEN_MAX_PER_DAG ?? 10);
const SLEUTEL = "marleen_gesprekken";

function vandaag() {
  return new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Amsterdam" }).format(new Date()); // bijv. 2026-11-23
}

function dezeMaand() {
  return new Intl.DateTimeFormat("sv-SE", { year: "numeric", month: "2-digit", timeZone: "Europe/Amsterdam" }).format(new Date()); // bijv. 2026-11
}

type Stand = { maand: string; aantal: number; dag: string; dagAantal: number };

async function lees(): Promise<Stand> {
  const [rij] = await db.select().from(instellingen).where(eq(instellingen.key, SLEUTEL));
  const v = (rij?.value ?? {}) as Partial<Stand>;
  const maandOk = v.maand === dezeMaand();
  const dagOk = v.dag === vandaag();
  return { maand: dezeMaand(), aantal: maandOk ? v.aantal ?? 0 : 0, dag: vandaag(), dagAantal: dagOk ? v.dagAantal ?? 0 : 0 };
}

const vol = (n: Stand) => n.aantal >= MAX_PER_MAAND || n.dagAantal >= MAX_PER_DAG;

/** Mag er nog een gesprek bij (deze maand én vandaag)? */
export async function nogBeschikbaar() {
  return !vol(await lees());
}

/** Telt één gesprek. Geeft false als het maximum van deze maand al bereikt is (dan wordt er niets geteld). */
export async function telGesprek(): Promise<boolean> {
  const nu = await lees();
  if (vol(nu)) return false;
  const value = { ...nu, aantal: nu.aantal + 1, dagAantal: nu.dagAantal + 1 };
  await db
    .insert(instellingen)
    .values({ key: SLEUTEL, value })
    .onConflictDoUpdate({ target: instellingen.key, set: { value, updatedAt: new Date() } });
  return true;
}
