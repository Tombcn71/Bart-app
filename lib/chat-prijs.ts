import { getMatrix } from "@/lib/matrix";
import { berekenStandaard, btwPercentage, eersteKeuze, isStandaardModel, kozijnStandaardModel, KOZIJN_CATALOGUS } from "@/lib/prijsmodel";
import { MAATGRENZEN_KUNSTSTOF } from "@/lib/maatgrenzen";
import { KOZIJN_VAKKEN } from "@/lib/chat-kozijnen";
import { KOZIJN_TYPEN } from "@/lib/kozijntypen";

export const GLAS_KEUZES = ["dubbel", "triple"] as const;
export const KLEUR_BUITEN = ["wit", "creme-wit", "antraciet", "zwart", "blauw", "groen", "wit-houtmotief", "creme-wit-houtmotief", "basalt-grijs", "kwarts-grijs", "monumenten-blauw", "monumenten-groen"] as const;

export const PRIJS_TOOL = {
  name: "bereken_prijs",
  description:
    "Berekent de prijs van een kunststof kozijn met dezelfde berekening als de prijscalculator op de website. Gebruik dit zodra je het type, de breedte en de hoogte weet. Vraag eerst wat je nog niet weet.",
  input_schema: {
    type: "object" as const,
    properties: {
      type: { type: "string", enum: KOZIJN_TYPEN.map((t) => t.slug), description: "Kozijntype. " + KOZIJN_TYPEN.map((t) => `${t.slug} = ${t.naam}`).join("; ") },
      breedte_mm: { type: "number", description: "Breedte in millimeters (150 cm = 1500)" },
      hoogte_mm: { type: "number", description: "Hoogte in millimeters (120 cm = 1200)" },
      glas: { type: "string", enum: [...GLAS_KEUZES], description: "dubbel (HR++) of triple. Standaard dubbel." },
      kleur_buiten: { type: "string", enum: [...KLEUR_BUITEN], description: "Kleur buitenkant. Standaard wit." },
      aantal: { type: "number", description: "Aantal kozijnen. Standaard 1." },
      toon_link: { type: "boolean", description: "Alleen true nadat de bezoeker heeft gezegd dat hij naar Roos wil voor de offerte. Anders weglaten." },
      andere_producten: { type: "string", description: "Alleen voor het eerste product van een bestelling met meer producten: kort in woorden de andere producten die de bezoeker ook wil, bijvoorbeeld '2 × vast kozijn 100 bij 100 cm triple glas en 1 voordeur'. Anders leeg." },
    },
    required: ["type", "breedte_mm", "hoogte_mm"],
  },
};

const euro = (n: number) => `€ ${n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Standaardwaarden van de calculator, zodat de chat precies zo rekent als het prijsscherm op de site.
const DEFAULT_MATRIX: any = {
  basisPrijs: 0,
  m2Tarief: { vast: 0, dk: 0, kiep: 0 },
  kleurToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "ral-kleur": 0 },
  kleurBuitenkantToeslag: { wit: 0, "creme-wit": 0, antraciet: 0, "basalt-grijs": 0, "kwarts-grijs": 0, zwart: 0 },
  glasToeslag: { "hr-plus-plus": 0, "triple-glas": 0 },
  profielToeslag: { "vlak-82": 0, "creon-82": 0, "creon-verdiept-120": 0, "creon-verdiept-120-hvl": 0 },
  aanslagToeslag: { ja: 0, nee: 0 },
  afstandshouderToeslag: { aluminium: 0, zwart: 0 },
  roedenToeslag: { geen: 0, "6-vaks-18mm": 0, "8-vaks-18mm": 0, "6-vaks-26mm": 0, "8-vaks-26mm": 0 },
  ventilatieRoosterToeslag: { nee: 0, ja: 0 },
  voorborenToeslag: { "niet-voorboren": 0, voorboren: 0 },
};

function maakMatrix(data: any) {
  const m: any = { ...DEFAULT_MATRIX, ...(data && Object.keys(data).length ? data : {}) };
  m.glasToeslag = Object.fromEntries(Object.keys(DEFAULT_MATRIX.glasToeslag).map((k) => [k, data?.glasToeslag?.[k] ?? 0]));
  m.m2Tarief = typeof data?.m2Tarief === "number" ? { vast: data.m2Tarief, dk: data.m2Tarief, kiep: data.m2Tarief } : { ...DEFAULT_MATRIX.m2Tarief, ...(data?.m2Tarief || {}) };
  return m;
}

const eerste = (t: any) => Object.keys(t || {})[0] || "";

/** Link naar de calculator met dit kozijn al ingevuld, zodat Roos en de bezoeker er direct mee verder kunnen. */
export function offerteLink(inv: any): string {
  const q = new URLSearchParams({ b: String(Math.round(Number(inv.breedte_mm))), h: String(Math.round(Number(inv.hoogte_mm))), glas: inv.glas === "triple" ? "triple" : "dubbel", n: String(Math.max(1, Math.round(Number(inv.aantal) || 1))), uitchat: "1" });
  if ((KLEUR_BUITEN as readonly string[]).includes(inv.kleur_buiten)) q.set("kleur", inv.kleur_buiten);
  if (typeof inv.andere_producten === "string" && inv.andere_producten.trim()) q.set("meer", inv.andere_producten.trim().slice(0, 200));
  return `${process.env.NODE_ENV === "production" ? "https://offerte.bartmooi.nl" : "http://localhost:3100"}/kozijnconfigurator/${inv.type}?${q}`;
}

export async function berekenChatPrijs(inv: any): Promise<string> {
  const slug = String(inv?.type ?? "");
  const vak = KOZIJN_VAKKEN[slug];
  if (!vak) return "Onbekend kozijntype.";
  const b = Math.round(Number(inv.breedte_mm));
  const h = Math.round(Number(inv.hoogte_mm));
  if (!(b > 0) || !(h > 0)) return "Breedte en hoogte ontbreken.";
  const g = MAATGRENZEN_KUNSTSTOF[slug];
  if (g && (b < g.minB || b > g.maxB || h < g.minH || h > g.maxH))
    return `Deze maat kan niet besteld worden bij dit type. Mogelijk: breedte ${g.minB} tot ${g.maxB} mm, hoogte ${g.minH} tot ${g.maxH} mm. Vraag de bezoeker een maat daarbinnen of stel een ander type voor.`;
  const data: any = await getMatrix("kozijn_matrix");
  const aantal = Math.min(50, Math.max(1, Math.round(Number(inv.aantal) || 1)));
  const glasKeuze = inv.glas === "triple" ? "triple" : "dubbel";
  const kleurBuiten = (KLEUR_BUITEN as readonly string[]).includes(inv.kleur_buiten) ? inv.kleur_buiten : "wit";
  const naam = KOZIJN_TYPEN.find((t) => t.slug === slug)?.naam ?? slug;
  let totaal: number;
  let toelichting = "";

  if (isStandaardModel(data)) {
    // Nieuw prijsmodel (recept per type, met montage en btw).
    const gekozen = {
      profiel: eersteKeuze("profiel"), aanslag: eersteKeuze("aanslag"), kleurBinnen: eersteKeuze("kleurBinnen"), kleurBuiten,
      glas: glasKeuze, afstandshouder: eersteKeuze("afstandshouder"), roeden: eersteKeuze("roeden"), ventilatie: eersteKeuze("ventilatie"), voorboren: eersteKeuze("voorboren"),
    };
    const r = berekenStandaard(data, slug, b, h, gekozen, { vakken: vak.vakken, vleugels: vak.types.filter((t) => t !== "vast").length }, aantal, KOZIJN_CATALOGUS);
    if (!r.totaal) return "De prijs kon niet berekend worden.";
    totaal = Math.round(r.totaal * (1 + btwPercentage(data) / 100) * 100) / 100;
    toelichting = " inclusief montage en btw";
  } else {
    // De prijzen die op de site staan: basisprijs plus een tarief per m² per onderdeel, met toeslagen.
    const m = maakMatrix(data);
    const glas = glasKeuze === "triple" ? "triple-glas" : "hr-plus-plus";
    const keuzes: [string, Record<string, number> | undefined, boolean][] = [
      [glas, m.glasToeslag, true],
      [eerste(m.kleurToeslag), m.kleurToeslag, false],
      [kleurBuiten, m.kleurBuitenkantToeslag, false],
      [eerste(m.profielToeslag), m.profielToeslag, false],
      [eerste(m.aanslagToeslag), m.aanslagToeslag, false],
      [eerste(m.afstandshouderToeslag), m.afstandshouderToeslag, false],
      [eerste(m.roedenToeslag), m.roedenToeslag, false],
      [eerste(m.ventilatieRoosterToeslag), m.ventilatieRoosterToeslag, false],
      [eerste(m.voorborenToeslag), m.voorborenToeslag, false],
    ];
    const opp = (b / 1000) * (h / 1000);
    let som = m.basisPrijs || 0;
    vak.types.forEach((type, i) => {
      const m2 = opp * (vak.aandelen?.[i] ?? 1 / vak.types.length);
      som += m2 * (m.m2Tarief?.[type] ?? 0);
      for (const [sleutel, tabel, perM2] of keuzes) {
        const t = tabel?.[sleutel] ?? 0;
        if (t) som += perM2 ? m2 * t : t;
      }
    });
    totaal = parseFloat((som * aantal).toFixed(2));
    if (!totaal) return "De prijs kon niet berekend worden.";
  }
  const stuk = Math.round((totaal / aantal) * 100) / 100;
  return `${inv.toon_link === true ? `[offerte-link: ${offerteLink(inv)}] ` : ""}${aantal} × ${naam}, ${b} × ${h} mm, ${glasKeuze === "triple" ? "triple glas" : "dubbel glas (HR++)"}, kleur buiten ${kleurBuiten}: totaal ${euro(totaal)}${toelichting}${aantal > 1 ? ` (${euro(stuk)} per stuk)` : ""}.`;
}
