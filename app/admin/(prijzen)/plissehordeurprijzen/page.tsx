"use client";
import { ProductPrijzen } from "../_prijzen/product-prijzen";
import { HorCalculator, HOR_NAMEN, horTekening } from "@/app/components/HorCalculator";
import { HOR_CATALOGUS_PLISSE, PLISSE_SLEUTEL } from "@/lib/horren";

export default function PlisseHordeurPrijzen() {
  return (
    <ProductPrijzen
      titel="Plissé hordeur"
      typeTitel="Prijzen per soort"
      materialen={{
        kunststof: {
          sleutel: PLISSE_SLEUTEL,
          catalogus: HOR_CATALOGUS_PLISSE,
          namen: HOR_NAMEN,
          tekening: horTekening,
          voorbeeld: (model) => <HorCalculator voorbeeld plisse matrix={model} />,
        },
      }}
    />
  );
}
