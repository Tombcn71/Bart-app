import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { offertes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { OffertePDF } from "@/app/components/OffertePDF";
import { renderSvgForPdf } from "@/lib/renderSvgForPdf";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [offerte] = await db.select().from(offertes).where(eq(offertes.id, id));
  if (!offerte) {
    return new NextResponse("Niet gevonden", { status: 404 });
  }

  const data = offerte.data as any;
  const datum = new Date(offerte.createdAt!).toLocaleDateString("nl-NL", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
  const offerteNummer = `OF/${new Date(offerte.createdAt!).getFullYear()}/${id.slice(-8).toUpperCase()}`;

  const m2 = (data.breedte / 1000) * (data.hoogte / 1000) * data.aantal;
  const subsidiePerM2 = data.glas === "triple" ? 111 : 25;
  const subsidie = Math.round(m2 * subsidiePerM2);

  const logoBuffer = readFileSync(join(process.cwd(), "public", "bartmooi-logo-1.png"));
  const logoBase64 = logoBuffer.toString("base64");
  const svgDataUri = renderSvgForPdf(data.slug || "") || undefined;

  const pdfBuffer = await renderToBuffer(
    createElement(OffertePDF, {
      data,
      email: offerte.email,
      offerteNummer,
      datum,
      subsidie,
      logoBase64,
      svgDataUri,
    }) as any
  );

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Offerte-${offerteNummer.replace(/\//g, "-")}.pdf"`,
    },
  });
}
