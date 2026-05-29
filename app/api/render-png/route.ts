import { Resvg } from "@resvg/resvg-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { svg, width } = await request.json();
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width || 500 },
    background: "white",
  });
  const rendered = resvg.render();
  const png = Buffer.from(rendered.asPng());
  return new NextResponse(png as unknown as BodyInit, {
    headers: { "Content-Type": "image/png" },
  });
}
