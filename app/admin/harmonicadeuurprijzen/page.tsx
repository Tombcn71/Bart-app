"use client";
import { harmonicaStandaardModel } from "@/lib/prijsmodel";
import { ProductPrijzen } from "../_prijzen/product-prijzen";
import { HarmonicaCalculator, HARMONICA_NAMEN, harmonicaTekening } from "@/app/components/HarmonicaCalculator";
import { HARMONICA_CATALOGUS } from "@/lib/harmonicadeuren";

export default function HarmonicadeurPrijzen() {
  return (
    <ProductPrijzen
      titel="Harmonicadeuren (aluminium)"
      typeTitel="Prijzen per verdeling"
      startModel={harmonicaStandaardModel}
      metKraan
      materialen={{
        aluminium: {
          sleutel: "alu_harmonicadeur_matrix",
          catalogus: HARMONICA_CATALOGUS,
          namen: HARMONICA_NAMEN,
          tekening: harmonicaTekening,
          voorbeeld: (model) => <HarmonicaCalculator voorbeeld matrix={model} />,
        },
      }}
    />
  );
}
