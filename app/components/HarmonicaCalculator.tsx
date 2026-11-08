"use client";
import { ProductConfigurator } from "@/app/components/ProductConfigurator";
import { HarmonicadeurSVG } from "@/lib/harmonicadeur-svgs";
import { KozijnTechnisch, TECHNISCH } from "@/app/components/KozijnTechnisch";
import { HARMONICA_BEGINMATEN, HARMONICA_CATALOGUS, HARMONICA_GRENZEN, HARMONICA_INFO } from "@/lib/harmonicadeuren";

export const HARMONICA_NAMEN: Record<string, string> = {
  "aluminium-harmonicadeur-3delig": "Driedelig",
  "aluminium-harmonicadeur-4delig": "Vierdelig",
  "aluminium-harmonicadeur-5delig": "Vijfdelig",
};
const secties = (slug: string): 3 | 4 | 5 => (slug.includes("5") ? 5 : slug.includes("4") ? 4 : 3);
export const harmonicaTekening = (slug: string, opties?: { breedte: number; hoogte: number; maten?: boolean }) => {
  // Met een maat de technische tekening, zoals Creon de harmonicadeur toont; zonder maat het oude plaatje.
  const spec = TECHNISCH[slug];
  // Zonder maat (het prijsscherm in het dashboard) de beginmaat van het type.
  const [b0, h0] = HARMONICA_BEGINMATEN[slug] ?? [3000, 2250];
  const maat = opties ?? { breedte: b0, hoogte: h0 };
  if (spec) {
    return <KozijnTechnisch breedte={maat.breedte} hoogte={maat.hoogte} spec={spec} maten={opties?.maten ?? false} className="h-full max-w-full" />;
  }
  return <HarmonicadeurSVG sections={secties(slug)} />;
};
// Oude links gebruikten driedelig, vierdelig en vijfdelig.
const naarSlug = (id?: string) =>
  id?.includes("vijf") || id?.includes("5") ? "aluminium-harmonicadeur-5delig" : id?.includes("vier") || id?.includes("4") ? "aluminium-harmonicadeur-4delig" : id ? "aluminium-harmonicadeur-3delig" : undefined;

/** De calculator van de klant voor een aluminium harmonicadeur. */
export function HarmonicaCalculator({ startSlug, matrix, voorbeeld }: { startSlug?: string; matrix?: unknown; voorbeeld?: boolean }) {
  return (
    <ProductConfigurator
      catalogus={HARMONICA_CATALOGUS}
      namen={HARMONICA_NAMEN}
      beginmaten={HARMONICA_BEGINMATEN}
      grenzen={HARMONICA_GRENZEN}
      info={HARMONICA_INFO}
      tekening={harmonicaTekening}
      matrixSleutel="alu_harmonicadeur_matrix"
      productNaam="Aluminium harmonicadeur"
      typeTitel="Verdeling"
      startSlug={naarSlug(startSlug)}
      matrix={matrix}
      voorbeeld={voorbeeld}
    />
  );
}
