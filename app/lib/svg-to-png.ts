import { Resvg } from "@resvg/resvg-js";

export async function svgToPng(svgString: string, width = 500): Promise<Buffer> {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: "width", value: width },
    background: "white",
  });
  const rendered = resvg.render();
  return Buffer.from(rendered.asPng());
}
