"use client";
import { ProductConfigurator } from "@/app/components/ProductConfigurator";
import { InbouwRolluikSVG, RolluikSVG, ScreenSVG } from "@/lib/rolluik-svgs";
import { KozijnTechnisch, TECHNISCH } from "@/app/components/KozijnTechnisch";
import { ROLLUIK_BEGINMATEN, ROLLUIK_CATALOGUS, ROLLUIK_GRENZEN, ROLLUIK_INFO, ROLLUIK_NAMEN } from "@/lib/rolluiken";

export const rolluikTekening = (slug: string, opties?: { breedte: number; hoogte: number; maten?: boolean }) => {
  // Met een maat de technische tekening in de echte verhoudingen; zonder maat het oude plaatje.
  const spec = TECHNISCH[slug];
  // Zonder maat (het prijsscherm in het dashboard) de beginmaat van het type.
  const [b0, h0] = ROLLUIK_BEGINMATEN[slug] ?? [2000, 1700];
  const maat = opties ?? { breedte: b0, hoogte: h0 };
  if (spec) {
    return <KozijnTechnisch breedte={maat.breedte} hoogte={maat.hoogte} spec={spec} maten={opties?.maten ?? false} className="h-full max-w-full" />;
  }
  return slug === "inbouw-rolluik" ? <InbouwRolluikSVG /> : slug === "screen" ? <ScreenSVG /> : <RolluikSVG />;
};

/** De calculator van de klant voor rolluiken, inbouwrolluiken en screens. */
export function RolluikCalculator({ startSlug, matrix, voorbeeld }: { startSlug?: string; matrix?: unknown; voorbeeld?: boolean }) {
  return (
    <ProductConfigurator
      catalogus={ROLLUIK_CATALOGUS}
      namen={ROLLUIK_NAMEN}
      beginmaten={ROLLUIK_BEGINMATEN}
      grenzen={ROLLUIK_GRENZEN}
      info={ROLLUIK_INFO}
      tekening={rolluikTekening}
      matrixSleutel="rolluiken_matrix"
      productNaam="Rolluiken"
      typeTitel="Soort"
      startSlug={startSlug}
      matrix={matrix}
      voorbeeld={voorbeeld}
    />
  );
}
