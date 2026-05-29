import { Resvg } from "@resvg/resvg-js";

export function svgToPng(svgString: string, width = 500): Buffer {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: "width", value: width },
    background: "white",
  });
  const rendered = resvg.render();
  return Buffer.from(rendered.asPng());
}
