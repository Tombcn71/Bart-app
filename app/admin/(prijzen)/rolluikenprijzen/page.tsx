"use client";
import { rolluikStandaardModel } from "@/lib/prijsmodel";
import { ProductPrijzen } from "../_prijzen/product-prijzen";
import { RolluikCalculator, rolluikTekening } from "@/app/components/RolluikCalculator";
import { ROLLUIK_CATALOGUS, ROLLUIK_NAMEN, ROLLUIK_VELDEN } from "@/lib/rolluiken";

export default function RolluikenPrijzen() {
  return (
    <ProductPrijzen
      titel="Rolluiken en screens"
      typeTitel="Prijzen per soort"
      startModel={rolluikStandaardModel}
      veldLabels={ROLLUIK_VELDEN}
      materialen={{
        kunststof: {
          sleutel: "rolluiken_matrix",
          catalogus: ROLLUIK_CATALOGUS,
          namen: ROLLUIK_NAMEN,
          tekening: rolluikTekening,
          voorbeeld: (model) => <RolluikCalculator voorbeeld matrix={model} />,
        },
      }}
    />
  );
}
