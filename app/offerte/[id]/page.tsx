import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { offertes } from "@/db/schema";
import { BEDRIJF } from "@/lib/bedrijf";
import { FOTO_GEVELS, FOTO_TYPES, fotoKleurVan, kozijnFotoPad } from "@/lib/kozijnfotos";
import { getSvgString } from "@/lib/renderSvgForPdf";
import { btwTekst, buildItemSpecs } from "@/app/lib/generate-offerte-pdf";
import { OfferteWeergave, type OfferteItemWeergave } from "./offerte-weergave";

export const metadata: Metadata = { title: "Uw offerte", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Item = { slug?: string; product?: string; prijs?: number; specs?: Record<string, string | number> };

export default async function OffertePagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [offerte] = await db.select().from(offertes).where(eq(offertes.id, id));
  if (!offerte) notFound();

  const data = offerte.data as any;
  const items: Item[] =
    Array.isArray(data.items) && data.items.length > 0
      ? data.items
      : [{ slug: data.slug, product: data.product ?? data.kozijnNaam ?? data.deurNaam ?? "Product", prijs: data.prijs, specs: data }];

  const weergave: OfferteItemWeergave[] = items.map((item) => {
    const specs = (item.specs ?? {}) as Record<string, string | number>;
    const slug = item.slug ?? "";
    const svg = slug
      ? getSvgString(
          slug,
          Number(specs.breedte) || undefined,
          Number(specs.hoogte) || undefined,
          String(specs.glas ?? specs.glasType ?? "") || undefined,
          String(specs.materiaal ?? "") || undefined,
        )
      : null;
    // Zelfde regel als de calculator: de buitenkleur (of lamellen/kleur); zonder kleurkeuze telt wit.
    const sleutels = Object.keys(specs);
    const norm = (k: string) => k.replace(/\s+/g, " ").trim();
    const kleurSleutel =
      sleutels.find((k) => /^kleur(\s+profiel)?\s*\(?\s*buiten|^kleur\s+lamellen$/i.test(norm(k))) ??
      sleutels.find((k) => /^kleur$/i.test(norm(k)) && !("kleurBuitenkant" in specs));
    const fotoKleur = kleurSleutel ? fotoKleurVan(String(specs[kleurSleutel])) : "wit";
    const foto = slug && FOTO_TYPES.has(slug) && fotoKleur ? kozijnFotoPad(FOTO_GEVELS[0].id, slug, fotoKleur) : null;
    return {
      product: item.product ?? "Product",
      prijs: Number(item.prijs ?? 0),
      btw: btwTekst(specs),
      specs: buildItemSpecs(specs),
      svg,
      foto,
      staand: Number(specs.hoogte) > Number(specs.breedte) * 1.15,
    };
  });

  const totaal = weergave.reduce((s, i) => s + i.prijs, 0);
  const intro = "Hartelijk dank voor uw aanvraag. Hieronder vindt u uw offerte.";

  const aanvraag = offerte.createdAt ?? new Date();
  const fmt = (d: Date) => d.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Amsterdam" });
  const akkoordOp = data.acceptedAt ? new Date(data.acceptedAt) : null;

  return (
    <div className="min-h-screen bg-[#f1f5f9] pb-28">
      <OfferteWeergave
        offerteId={offerte.id}
        bedrijf={BEDRIJF}
        datum={fmt(aanvraag)}
        geldigTot={fmt(new Date(aanvraag.getTime() + 30 * 86_400_000))}
        referentie={offerte.id.slice(0, 8).toUpperCase()}
        klantPlaats={data.woonplaats ?? ""}
        klantNaam={data.naam ?? ""}
        intro={intro}
        items={weergave}
        totaal={totaal}
        btw={weergave[0]?.btw ?? "incl. btw"}
        geaccepteerd={
          akkoordOp
            ? {
                door: data.acceptedByNaam ?? data.naam ?? "",
                op: akkoordOp.toLocaleString("nl-NL", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Amsterdam" }),
              }
            : null
        }
      />
    </div>
  );
}
