"use client";
import type { ReactNode } from "react";
import { ProductConfigurator } from "@/app/components/ProductConfigurator";
import { KozijnTechnisch, TECHNISCH } from "@/app/components/KozijnTechnisch";
import { DEUR_KUNSTSTOF_BEGINMATEN as DEUR_KBM } from "@/lib/deuren-kunststof";
import { DEUR_ALU_BEGINMATEN as DEUR_ABM } from "@/lib/deuren-alu";
import {
  SingleDoorBase, DoubleDoorBase, AchterdeurBovenlicht, VoordeurBovenlicht, AchterdeurBorstwering, AchterdeurBorstweringBovenlicht,
  DeurZijlicht, VoordeurZijlicht, DeurZijlichtBovenlicht, VoordeurZijlichtBovenlicht, DeurZijlichtBorstwering, DeurZijlichten,
  DubbeleDeurBovenlicht, DubbeleDeurZijlicht, DubbeleDeurZijlichtenBovenlichten, DubbeleDeurBorstweringBovenlicht,
} from "@/lib/deur-svgs";
import { DEUR_KUNSTSTOF_BEGINMATEN, DEUR_KUNSTSTOF_CATALOGUS, DEUR_KUNSTSTOF_GRENZEN, DEUR_KUNSTSTOF_INFO } from "@/lib/deuren-kunststof";
import { DEUR_ALU_BEGINMATEN, DEUR_ALU_CATALOGUS, DEUR_ALU_GRENZEN, DEUR_ALU_INFO } from "@/lib/deuren-alu";

/** Tekening per deur, met de breedte van de tekening (100 = één deur). */
const TEKENING: Record<string, [number, ReactNode]> = {
  voordeur: [100, <SingleDoorBase key="a" type="voordeur" />],
  achterdeur: [100, <SingleDoorBase key="a" type="achterdeur" />],
  "voordeur-met-bovenlicht": [100, <VoordeurBovenlicht key="a" />],
  "achterdeur-met-bovenlicht": [100, <AchterdeurBovenlicht key="a" />],
  "achterdeur-met-borstwering": [100, <AchterdeurBorstwering key="a" />],
  "achterdeur-met-borstwering-en-bovenlicht": [100, <AchterdeurBorstweringBovenlicht key="a" />],
  "deur-met-zijlicht": [150, <DeurZijlicht key="a" />],
  "voordeur-met-zijlicht": [150, <VoordeurZijlicht key="a" />],
  "deur-met-zijlicht-en-bovenlicht": [150, <DeurZijlichtBovenlicht key="a" />],
  "voordeur-met-zijlicht-en-bovenlicht": [150, <VoordeurZijlichtBovenlicht key="a" />],
  "deur-met-zijlicht-met-borstwering": [150, <DeurZijlichtBorstwering key="a" />],
  "enkele-deur-met-zijlichten": [180, <DeurZijlichten key="a" />],
  "dubbele-deur": [150, <DoubleDoorBase key="a" />],
  "dubbele-deur-met-bovenlicht": [150, <DubbeleDeurBovenlicht key="a" />],
  "dubbele-deur-met-borstwering": [150, <DoubleDoorBase key="a" hasPlinth />],
  "dubbele-deur-met-borstwering-en-bovenlicht": [150, <DubbeleDeurBorstweringBovenlicht key="a" />],
  "dubbele-deur-met-zijlicht": [150, <DubbeleDeurZijlicht key="a" />],
  "dubbele-deur-met-zijlichten": [180, <DoubleDoorBase key="a" hasSideLights />],
  "dubbele-deur-met-zijlichten-en-bovenlichten": [180, <DubbeleDeurZijlichtenBovenlichten key="a" />],
  // Aluminium
  "aluminium-deur": [100, <SingleDoorBase key="a" type="voordeur" />],
  "aluminium-deur-2-vaks": [100, <SingleDoorBase key="a" type="voordeur" />],
  "aluminium-deur-3vaks": [100, <SingleDoorBase key="a" type="voordeur" />],
  "aluminium-deur-met-zijlicht": [150, <DeurZijlicht key="a" />],
  "aluminium-deur-met-zijlicht-met-borstwering": [150, <DeurZijlichtBorstwering key="a" />],
  "aluminium-deur-met-zijlichten": [180, <DeurZijlichten key="a" />],
  "aluminium-dubbele-deur": [150, <DoubleDoorBase key="a" />],
  "aluminium-dubbele-deur-2-vaks": [150, <DoubleDoorBase key="a" />],
  "aluminium-dubbele-deur-met-zijlichten": [180, <DoubleDoorBase key="a" hasSideLights />],
};

const NAMEN_KUNSTSTOF: Record<string, string> = {
  voordeur: "Voordeur",
  achterdeur: "Achterdeur",
  "voordeur-met-bovenlicht": "Voordeur met bovenlicht",
  "achterdeur-met-bovenlicht": "Achterdeur met bovenlicht",
  "achterdeur-met-borstwering": "Achterdeur met borstwering",
  "achterdeur-met-borstwering-en-bovenlicht": "Achterdeur met borstwering en bovenlicht",
  "deur-met-zijlicht": "Deur met zijlicht",
  "voordeur-met-zijlicht": "Voordeur met zijlicht",
  "deur-met-zijlicht-en-bovenlicht": "Deur met zijlicht en bovenlicht",
  "voordeur-met-zijlicht-en-bovenlicht": "Voordeur met zijlicht en bovenlicht",
  "deur-met-zijlicht-met-borstwering": "Deur met zijlicht en borstwering",
  "enkele-deur-met-zijlichten": "Deur met twee zijlichten",
  "dubbele-deur": "Dubbele deur",
  "dubbele-deur-met-bovenlicht": "Dubbele deur met bovenlicht",
  "dubbele-deur-met-borstwering": "Dubbele deur met borstwering",
  "dubbele-deur-met-borstwering-en-bovenlicht": "Dubbele deur met borstwering en bovenlicht",
  "dubbele-deur-met-zijlicht": "Dubbele deur met zijlicht",
  "dubbele-deur-met-zijlichten": "Dubbele deur met zijlichten",
  "dubbele-deur-met-zijlichten-en-bovenlichten": "Dubbele deur met zijlichten en bovenlichten",
};
const NAMEN_ALU: Record<string, string> = {
  "aluminium-deur": "Deur",
  "aluminium-deur-2-vaks": "Deur met borstwering (2 vaks)",
  "aluminium-deur-3vaks": "Deur, 3 vaks",
  "aluminium-deur-met-zijlicht": "Deur met zijlicht",
  "aluminium-deur-met-zijlicht-met-borstwering": "Deur met zijlicht en borstwering",
  "aluminium-deur-met-zijlichten": "Deur met twee zijlichten",
  "aluminium-dubbele-deur": "Dubbele deur",
  "aluminium-dubbele-deur-2-vaks": "Dubbele deur met borstwering (2 vaks)",
  "aluminium-dubbele-deur-met-zijlichten": "Dubbele deur met zijlichten",
};
export const DEUR_NAMEN: Record<"kunststof" | "aluminium", Record<string, string>> = { kunststof: NAMEN_KUNSTSTOF, aluminium: NAMEN_ALU };

// Oude links (voordeur-bovenlicht, deur-zijlichten, ...) wijzen naar de nieuwe typen.
export const OUD: Record<string, string> = {
  "voordeur-bovenlicht": "voordeur-met-bovenlicht",
  "achterdeur-bovenlicht": "achterdeur-met-bovenlicht",
  "achterdeur-borstwering": "achterdeur-met-borstwering",
  "achterdeur-borstwering-bovenlicht": "achterdeur-met-borstwering-en-bovenlicht",
  "deur-zijlicht": "deur-met-zijlicht",
  "voordeur-zijlicht": "voordeur-met-zijlicht",
  "deur-zijlicht-bovenlicht": "deur-met-zijlicht-en-bovenlicht",
  "voordeur-zijlicht-bovenlicht": "voordeur-met-zijlicht-en-bovenlicht",
  "deur-zijlicht-borstwering": "deur-met-zijlicht-met-borstwering",
  "deur-zijlichten": "enkele-deur-met-zijlichten",
  "dubbele-deur-zijlichten": "dubbele-deur-met-zijlichten",
  "dubbele-deur-borstwering": "dubbele-deur-met-borstwering",
  "dubbele-deur-bovenlicht": "dubbele-deur-met-bovenlicht",
  "dubbele-deur-zijlicht": "dubbele-deur-met-zijlicht",
  "dubbele-deur-zijlichten-bovenlichten": "dubbele-deur-met-zijlichten-en-bovenlichten",
  "dubbele-deur-borstwering-bovenlicht": "dubbele-deur-met-borstwering-en-bovenlicht",
};

// Een aluminium deur met dezelfde indeling als een kunststof deur uit een oude link.
const ALU_VAN_KUNSTSTOF: Record<string, string> = {
  voordeur: "aluminium-deur",
  achterdeur: "aluminium-deur",
  "deur-met-zijlicht": "aluminium-deur-met-zijlicht",
  "voordeur-met-zijlicht": "aluminium-deur-met-zijlicht",
  "deur-met-zijlicht-met-borstwering": "aluminium-deur-met-zijlicht-met-borstwering",
  "enkele-deur-met-zijlichten": "aluminium-deur-met-zijlichten",
  "dubbele-deur": "aluminium-dubbele-deur",
  "dubbele-deur-met-zijlichten": "aluminium-dubbele-deur-met-zijlichten",
};

/** De tekening van een deur, voor de calculator en het prijsscherm. */
export function deurTekening(slug: string, opties?: { breedte: number; hoogte: number; maten?: boolean }) {
  // Met een maat de technische tekening, zoals Creon de deur toont; zonder maat het oude plaatje.
  const spec = TECHNISCH[slug];
  // Zonder maat (het prijsscherm in het dashboard) de beginmaat van het type.
  const [b0, h0] = DEUR_KBM[slug] ?? DEUR_ABM[slug] ?? [1000, 2200];
  const maat = opties ?? { breedte: b0, hoogte: h0 };
  if (spec) {
    return <KozijnTechnisch breedte={maat.breedte} hoogte={maat.hoogte} spec={spec} maten={opties?.maten ?? false} className="h-full max-w-full" />;
  }
  const [breed, deel] = TEKENING[slug] ?? [100, <SingleDoorBase key="a" type="voordeur" />];
  return (
    <svg viewBox={`0 0 ${breed} 160`} className="h-full max-w-full">
      {deel}
    </svg>
  );
}

/** De calculator van de klant voor deuren, in kunststof of aluminium. */
export function DeurCalculator({ materiaal, startSlug, matrix, voorbeeld }: { materiaal: "kunststof" | "aluminium"; startSlug?: string; matrix?: unknown; voorbeeld?: boolean }) {
  const alu = materiaal === "aluminium";
  const nieuw = startSlug ? OUD[startSlug] ?? startSlug : undefined;
  const start = alu && nieuw ? ALU_VAN_KUNSTSTOF[nieuw] ?? nieuw : nieuw;
  return (
    <ProductConfigurator
      catalogus={alu ? DEUR_ALU_CATALOGUS : DEUR_KUNSTSTOF_CATALOGUS}
      namen={DEUR_NAMEN[materiaal]}
      beginmaten={alu ? DEUR_ALU_BEGINMATEN : DEUR_KUNSTSTOF_BEGINMATEN}
      grenzen={alu ? DEUR_ALU_GRENZEN : DEUR_KUNSTSTOF_GRENZEN}
      info={alu ? DEUR_ALU_INFO : DEUR_KUNSTSTOF_INFO}
      tekening={deurTekening}
      matrixSleutel={alu ? "alu_deur_matrix" : "deur_matrix"}
      productNaam={alu ? "Aluminium deur" : "Kunststof deur"}
      typeTitel="Soort deur"
      startSlug={start}
      matrix={matrix}
      voorbeeld={voorbeeld}
    />
  );
}
