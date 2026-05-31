import { Resvg } from "@resvg/resvg-js";
import path from "path";

const fontPath = path.join(process.cwd(), "public/fonts/Inter-Regular.ttf");

export async function svgToPng(svgString: string, width = 500): Promise<Buffer> {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: "width", value: width },
    background: "white",
    font: {
      fontFiles: [fontPath],
      loadSystemFonts: false,
      defaultFontFamily: "Arial",
    },
  });
  const rendered = resvg.render();
  return Buffer.from(rendered.asPng());
}
