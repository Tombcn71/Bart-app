"use client";
import { ProductPrijzen } from "../_prijzen/product-prijzen";
import { DeurCalculator, DEUR_NAMEN, deurTekening } from "@/app/components/DeurCalculator";
import { DEUR_KUNSTSTOF_CATALOGUS } from "@/lib/deuren-kunststof";
import { DEUR_ALU_CATALOGUS } from "@/lib/deuren-alu";
import { deurStandaardModel } from "@/lib/prijsmodel";

const enkel = (alle: string[]) => alle.filter((s) => !s.includes("dubbele"));
const dubbel = (alle: string[]) => alle.filter((s) => s.includes("dubbele"));
const groepen = (cat: { typen: Record<string, unknown> }) => {
  const alle = Object.keys(cat.typen);
  return [
    { titel: "Enkele deur", slugs: enkel(alle) },
    { titel: "Dubbele deur", slugs: dubbel(alle) },
  ];
};

export default function DeurenPrijzen() {
  return (
    <ProductPrijzen
      titel="Deuren"
      typeTitel="Prijzen per soort deur"
      startModel={deurStandaardModel}
      materialen={{
        kunststof: {
          sleutel: "deur_matrix",
          catalogus: DEUR_KUNSTSTOF_CATALOGUS,
          namen: DEUR_NAMEN.kunststof,
          groepen: groepen(DEUR_KUNSTSTOF_CATALOGUS),
          tekening: deurTekening,
          voorbeeld: (model) => <DeurCalculator materiaal="kunststof" voorbeeld matrix={model} />,
        },
        aluminium: {
          sleutel: "alu_deur_matrix",
          catalogus: DEUR_ALU_CATALOGUS,
          namen: DEUR_NAMEN.aluminium,
          groepen: groepen(DEUR_ALU_CATALOGUS),
          tekening: deurTekening,
          voorbeeld: (model) => <DeurCalculator materiaal="aluminium" voorbeeld matrix={model} />,
        },
      }}
    />
  );
}
