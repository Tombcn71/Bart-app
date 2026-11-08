"use client";
import { ProductConfigurator } from "@/app/components/ProductConfigurator";
import { InzethorSVG, KlemhorSVG, PlisseHordeurSVG } from "@/lib/hor-svgs";
import { KozijnTechnisch, TECHNISCH } from "@/app/components/KozijnTechnisch";
import { HOR_BEGINMATEN, HOR_CATALOGUS, HOR_GRENZEN, HOR_INFO } from "@/lib/horren";

const NAMEN: Record<string, string> = { inzethor: "Inzethor", klemhor: "Klemhor", "plisse-hordeur": "Plissé hordeur" };

export const horTekening = (slug: string, opties?: { breedte: number; hoogte: number; maten?: boolean }) => {
  // Met een maat de technische tekening in de echte verhoudingen; zonder maat het oude plaatje.
  const spec = TECHNISCH[slug];
  // Zonder maat (het prijsscherm in het dashboard) de beginmaat van het type.
  const [b0, h0] = HOR_BEGINMATEN[slug] ?? [1000, 1000];
  const maat = opties ?? { breedte: b0, hoogte: h0 };
  if (spec) {
    return <KozijnTechnisch breedte={maat.breedte} hoogte={maat.hoogte} spec={spec} maten={opties?.maten ?? false} className="h-full max-w-full" />;
  }
  return slug === "klemhor" ? <KlemhorSVG /> : slug === "plisse-hordeur" ? <PlisseHordeurSVG /> : <InzethorSVG />;
};

/** De calculator van de klant voor een hor: inzethor, klemhor of plissé hordeur. */
export function HorCalculator({ startSlug, matrix, voorbeeld }: { startSlug?: string; matrix?: unknown; voorbeeld?: boolean }) {
  return (
    <ProductConfigurator
      catalogus={HOR_CATALOGUS}
      namen={NAMEN}
      beginmaten={HOR_BEGINMATEN}
      grenzen={HOR_GRENZEN}
      info={HOR_INFO}
      tekening={horTekening}
      matrixSleutel="horren_matrix"
      productNaam="Hor"
      typeTitel="Soort hor"
      startSlug={startSlug}
      matrix={matrix}
      voorbeeld={voorbeeld}
    />
  );
}

export { NAMEN as HOR_NAMEN };
