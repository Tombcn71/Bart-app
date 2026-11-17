"use client";
import { schuifpuiStandaardModel } from "@/lib/prijsmodel";
import { ProductPrijzen } from "../_prijzen/product-prijzen";
import { SchuifpuiCalculator, puiTekening } from "@/app/components/SchuifpuiCalculator";
import { PUI_ALU_CATALOGUS, PUI_ALU_NAMEN, PUI_KUNSTSTOF_CATALOGUS, PUI_KUNSTSTOF_NAMEN } from "@/lib/schuifpui";

export default function SchuifpuiPrijzen() {
  return (
    <ProductPrijzen
      titel="Schuifpui"
      typeTitel="Prijzen per verdeling"
      startModel={schuifpuiStandaardModel}
      metKraan
      materialen={{
        kunststof: {
          sleutel: "schuifpui_matrix",
          catalogus: PUI_KUNSTSTOF_CATALOGUS,
          namen: PUI_KUNSTSTOF_NAMEN,
          tekening: puiTekening,
          voorbeeld: (model) => <SchuifpuiCalculator materiaal="kunststof" voorbeeld matrix={model} />,
        },
        aluminium: {
          sleutel: "alu_schuifpui_matrix",
          catalogus: PUI_ALU_CATALOGUS,
          namen: PUI_ALU_NAMEN,
          tekening: puiTekening,
          voorbeeld: (model) => <SchuifpuiCalculator materiaal="aluminium" voorbeeld matrix={model} />,
        },
      }}
    />
  );
}
