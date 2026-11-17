"use client";
import { ProductPrijzen } from "../_prijzen/product-prijzen";
import { HorCalculator, HOR_NAMEN, horTekening } from "@/app/components/HorCalculator";
import { HOR_CATALOGUS_KLEIN } from "@/lib/horren";

export default function HorPrijzen() {
  return (
    <ProductPrijzen
      titel="Inzethor en klemhor"
      typeTitel="Prijzen per soort hor"
      materialen={{
        kunststof: {
          sleutel: "horren_matrix",
          catalogus: HOR_CATALOGUS_KLEIN,
          namen: HOR_NAMEN,
          tekening: horTekening,
          voorbeeld: (model) => <HorCalculator voorbeeld plisse={false} matrix={model} />,
        },
      }}
    />
  );
}
