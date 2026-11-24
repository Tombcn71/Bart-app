import { getMatrix } from "@/lib/matrix";
import { berekenStandaard, btwPercentage, isStandaardModel, montageVoor, startModelVoor, type Catalogus, type StandaardModel } from "@/lib/prijsmodel";
import type { Maatgrenzen } from "@/lib/maatgrenzen";
import { ROOS_PRODUCTEN } from "@/lib/roos-producten";
import { PUI_KUNSTSTOF_CATALOGUS, PUI_KUNSTSTOF_GRENZEN, PUI_KUNSTSTOF_INFO } from "@/lib/schuifpui";
import { DEUR_KUNSTSTOF_CATALOGUS, DEUR_KUNSTSTOF_GRENZEN, DEUR_KUNSTSTOF_INFO } from "@/lib/deuren-kunststof";
import { HARMONICA_CATALOGUS, HARMONICA_GRENZEN, HARMONICA_INFO } from "@/lib/harmonicadeuren";
import { ROLLUIK_CATALOGUS, ROLLUIK_GRENZEN, ROLLUIK_INFO } from "@/lib/rolluiken";
import { HOR_CATALOGUS_KLEIN, HOR_CATALOGUS_PLISSE, HOR_GRENZEN, HOR_INFO, PLISSE_SLEUTEL } from "@/lib/horren";

type Soort = {
  catalogus: (slug: string) => Catalogus;
  grenzen: Record<string, Maatgrenzen>;
  info: Record<string, { vakken: number; vleugels: number }>;
  sleutel: (slug: string) => string;
};

// Dezelfde catalogi, grenzen en prijssleutels als de calculators op de site (kunststof; harmonicadeuren zijn aluminium).
const SOORTEN: Record<string, Soort> = {
  schuifpui: { catalogus: () => PUI_KUNSTSTOF_CATALOGUS, grenzen: PUI_KUNSTSTOF_GRENZEN, info: PUI_KUNSTSTOF_INFO, sleutel: () => "schuifpui_matrix" },
  deur: { catalogus: () => DEUR_KUNSTSTOF_CATALOGUS, grenzen: DEUR_KUNSTSTOF_GRENZEN, info: DEUR_KUNSTSTOF_INFO, sleutel: () => "deur_matrix" },
  harmonicadeur: { catalogus: () => HARMONICA_CATALOGUS, grenzen: HARMONICA_GRENZEN, info: HARMONICA_INFO, sleutel: () => "alu_harmonicadeur_matrix" },
  rolluik: { catalogus: () => ROLLUIK_CATALOGUS, grenzen: ROLLUIK_GRENZEN, info: ROLLUIK_INFO, sleutel: () => "rolluiken_matrix" },
  hor: {
    catalogus: (s) => (s === "plisse-hordeur" ? HOR_CATALOGUS_PLISSE : HOR_CATALOGUS_KLEIN),
    grenzen: HOR_GRENZEN,
    info: HOR_INFO,
    sleutel: (s) => (s === "plisse-hordeur" ? PLISSE_SLEUTEL : "horren_matrix"),
  },
};

const ALLE_TYPEN = Object.entries(ROOS_PRODUCTEN).flatMap(([p, v]) => Object.entries(v.typen).map(([slug, naam]) => ({ product: p, slug, naam })));

export const PRODUCT_TOOL = {
  name: "bereken_product",
  description:
    "Berekent de prijs van een deur, schuifpui, harmonicadeur, rolluik, screen of hor met dezelfde berekening als de prijscalculator op de website. Gebruik dit zodra je het type, de breedte en de hoogte weet. Voor kozijnen gebruik je bereken_prijs.",
  input_schema: {
    type: "object" as const,
    properties: {
      product: { type: "string", enum: Object.keys(SOORTEN), description: "deur, schuifpui, harmonicadeur, rolluik (ook screen en inbouw rolluik) of hor (ook plissé hordeur)" },
      type: { type: "string", enum: ALLE_TYPEN.map((t) => t.slug), description: "Type. " + ALLE_TYPEN.map((t) => `${t.product}: ${t.slug} = ${t.naam}`).join("; ") },
      breedte_mm: { type: "number", description: "Breedte in millimeters" },
      hoogte_mm: { type: "number", description: "Hoogte in millimeters" },
      aantal: { type: "number", description: "Aantal. Standaard 1." },
      toon_link: { type: "boolean", description: "Alleen true nadat de bezoeker heeft gezegd dat hij naar Roos wil voor de offerte. Anders weglaten." },
      andere_producten: { type: "string", description: "Alleen voor het eerste product van een bestelling met meer producten: kort in woorden wat er verder bij komt. Anders leeg." },
    },
    required: ["product", "type", "breedte_mm", "hoogte_mm"],
  },
};

const euro = (n: number) => `€ ${n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function productLink(inv: any): string {
  const pad = ROOS_PRODUCTEN[inv.product]?.pad ?? "/";
  const q = new URLSearchParams({ b: String(Math.round(Number(inv.breedte_mm))), h: String(Math.round(Number(inv.hoogte_mm))), n: String(Math.max(1, Math.round(Number(inv.aantal) || 1))), uitchat: "1" });
  if (typeof inv.andere_producten === "string" && inv.andere_producten.trim()) q.set("meer", inv.andere_producten.trim().slice(0, 200));
  return `${process.env.NODE_ENV === "production" ? "https://offerte.bartmooi.nl" : "http://localhost:3100"}${pad}${inv.type}?${q}`;
}

export async function berekenChatProduct(inv: any): Promise<string> {
  const soort = SOORTEN[String(inv?.product)];
  const slug = String(inv?.type ?? "");
  const hoort = ROOS_PRODUCTEN[String(inv?.product)]?.typen[slug];
  if (!soort || !hoort) return "Onbekend product of type.";
  const b = Math.round(Number(inv.breedte_mm));
  const h = Math.round(Number(inv.hoogte_mm));
  if (!(b > 0) || !(h > 0)) return "Breedte en hoogte ontbreken.";
  const g = soort.grenzen[slug];
  if (g && (b < g.minB || b > g.maxB || h < g.minH || h > g.maxH))
    return `Deze maat kan niet besteld worden bij dit type. Mogelijk: breedte ${g.minB} tot ${g.maxB} mm, hoogte ${g.minH} tot ${g.maxH} mm. Vraag de bezoeker een maat daarbinnen of stel een ander type voor.`;
  const sleutel = soort.sleutel(slug);
  const data = await getMatrix(sleutel);
  const model: StandaardModel = isStandaardModel(data) ? data : startModelVoor(sleutel);
  const catalogus = soort.catalogus(slug);
  const keuzes = Object.fromEntries(catalogus.keuzes.map((k) => [k.id, k.keuzes[0].id]));
  const aantal = Math.min(50, Math.max(1, Math.round(Number(inv.aantal) || 1)));
  const r = berekenStandaard(model, slug, b, h, keuzes, soort.info[slug] ?? { vakken: 1, vleugels: 1 }, aantal, catalogus, { kraan: false });
  if (!r.totaal) return "De prijs kon niet berekend worden.";
  const totaal = Math.round(r.totaal * (1 + btwPercentage(model) / 100) * 100) / 100;
  const montage = montageVoor(model, aantal, { kraan: false }).totaal > 0 ? " inclusief montage en btw" : " inclusief btw";
  const stuk = Math.round((totaal / aantal) * 100) / 100;
  return `${inv.toon_link === true ? `[offerte-link: ${productLink(inv)}] ` : ""}${aantal} × ${hoort}, ${b} × ${h} mm, standaarduitvoering: totaal ${euro(totaal)}${montage}${aantal > 1 ? ` (${euro(stuk)} per stuk)` : ""}.`;
}
