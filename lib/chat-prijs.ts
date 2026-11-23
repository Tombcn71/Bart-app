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
    "Berekent de prijs van een kunststof kozijn inclusief montage en btw, met dezelfde berekening als de prijscalculator op de website. Gebruik dit zodra je het type, de breedte en de hoogte weet. Vraag eerst wat je nog niet weet.",
  input_schema: {
    type: "object" as const,
    properties: {
      type: { type: "string", enum: KOZIJN_TYPEN.map((t) => t.slug), description: "Kozijntype. " + KOZIJN_TYPEN.map((t) => `${t.slug} = ${t.naam}`).join("; ") },
      breedte_mm: { type: "number", description: "Breedte in millimeters (150 cm = 1500)" },
      hoogte_mm: { type: "number", description: "Hoogte in millimeters (120 cm = 1200)" },
      glas: { type: "string", enum: [...GLAS_KEUZES], description: "dubbel (HR++) of triple. Standaard dubbel." },
      kleur_buiten: { type: "string", enum: [...KLEUR_BUITEN], description: "Kleur buitenkant. Standaard wit." },
      aantal: { type: "number", description: "Aantal kozijnen. Standaard 1." },
    },
    required: ["type", "breedte_mm", "hoogte_mm"],
  },
};

const euro = (n: number) => `€ ${n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
  const data = await getMatrix("kozijn_matrix");
  const model = isStandaardModel(data) ? data : kozijnStandaardModel();
  const aantal = Math.min(50, Math.max(1, Math.round(Number(inv.aantal) || 1)));
  const glas = (GLAS_KEUZES as readonly string[]).includes(inv.glas) ? inv.glas : "dubbel";
  const kleurBuiten = (KLEUR_BUITEN as readonly string[]).includes(inv.kleur_buiten) ? inv.kleur_buiten : "wit";
  const gekozen = {
    profiel: eersteKeuze("profiel"), aanslag: eersteKeuze("aanslag"), kleurBinnen: eersteKeuze("kleurBinnen"), kleurBuiten,
    glas, afstandshouder: eersteKeuze("afstandshouder"), roeden: eersteKeuze("roeden"), ventilatie: eersteKeuze("ventilatie"), voorboren: eersteKeuze("voorboren"),
  };
  const r = berekenStandaard(model, slug, b, h, gekozen, vak, aantal, KOZIJN_CATALOGUS);
  if (!r.totaal) return "De prijs kon niet berekend worden.";
  const totaal = Math.round(r.totaal * (1 + btwPercentage(model) / 100) * 100) / 100;
  const stuk = Math.round((totaal / aantal) * 100) / 100;
  const naam = KOZIJN_TYPEN.find((t) => t.slug === slug)?.naam ?? slug;
  return `${aantal} × ${naam}, ${b} × ${h} mm, ${glas === "triple" ? "triple glas" : "dubbel glas (HR++)"}, kleur buiten ${kleurBuiten}: totaal ${euro(totaal)} inclusief montage en btw${aantal > 1 ? ` (${euro(stuk)} per stuk)` : ""}.`;
}
