"use client";
import { ProductConfigurator } from "@/app/components/ProductConfigurator";
import { SlidingDoorDetailSVG } from "@/lib/schuifpui-svgs";
import { KozijnTechnisch, TECHNISCH } from "@/app/components/KozijnTechnisch";
import {
  PUI_ALU_BEGINMATEN,
  PUI_ALU_CATALOGUS,
  PUI_ALU_GRENZEN,
  PUI_ALU_INFO,
  PUI_ALU_NAMEN,
  PUI_KUNSTSTOF_BEGINMATEN,
  PUI_KUNSTSTOF_CATALOGUS,
  PUI_KUNSTSTOF_GRENZEN,
  PUI_KUNSTSTOF_INFO,
  PUI_KUNSTSTOF_NAMEN,
} from "@/lib/schuifpui";

const secties = (slug: string) => (slug.includes("4") ? 4 : 2);
export const puiTekening = (slug: string, opties?: { breedte: number; hoogte: number; maten?: boolean }) => {
  // Met een maat de nieuwe technische tekening in de echte verhoudingen; zonder maat het oude plaatje.
  const spec = TECHNISCH[slug];
  // Zonder maat (het prijsscherm in het dashboard) de beginmaat van het type.
  const [b0, h0] = PUI_KUNSTSTOF_BEGINMATEN[slug] ?? PUI_ALU_BEGINMATEN[slug] ?? [2500, 2200];
  const maat = opties ?? { breedte: b0, hoogte: h0 };
  if (spec) {
    return <KozijnTechnisch breedte={maat.breedte} hoogte={maat.hoogte} spec={spec} maten={opties?.maten ?? false} className="h-full max-w-full" />;
  }
  return <SlidingDoorDetailSVG sections={secties(slug)} />;
};

/** De calculator van de klant voor een schuifpui, kunststof of aluminium. */
export function SchuifpuiCalculator({
  materiaal,
  startSlug,
  matrix,
  voorbeeld,
}: {
  materiaal: "kunststof" | "aluminium";
  startSlug?: string;
  matrix?: unknown;
  voorbeeld?: boolean;
}) {
  const alu = materiaal === "aluminium";
  return (
    <ProductConfigurator
      catalogus={alu ? PUI_ALU_CATALOGUS : PUI_KUNSTSTOF_CATALOGUS}
      namen={alu ? PUI_ALU_NAMEN : PUI_KUNSTSTOF_NAMEN}
      beginmaten={alu ? PUI_ALU_BEGINMATEN : PUI_KUNSTSTOF_BEGINMATEN}
      grenzen={alu ? PUI_ALU_GRENZEN : PUI_KUNSTSTOF_GRENZEN}
      info={alu ? PUI_ALU_INFO : PUI_KUNSTSTOF_INFO}
      tekening={puiTekening}
      matrixSleutel={alu ? "alu_schuifpui_matrix" : "schuifpui_matrix"}
      productNaam={alu ? "Aluminium schuifpui" : "Kunststof schuifpui"}
      typeTitel="Verdeling"
      startSlug={startSlug}
      matrix={matrix}
      voorbeeld={voorbeeld}
    />
  );
}
