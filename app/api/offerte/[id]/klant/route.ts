import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { offertes } from "@/db/schema";
import { generateOffertePdf } from "@/app/lib/generate-offerte-pdf";

export const runtime = "nodejs";

/**
 * De offerte voor de klant zelf, vanaf de online offerte (zonder inloggen).
 * Net als /accepteer/[id] is de offerte-id (een lange willekeurige code) de toegang.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("Niet gevonden", { status: 404 });

  const [offerte] = await db.select().from(offertes).where(eq(offertes.id, id));
  if (!offerte) return new NextResponse("Niet gevonden", { status: 404 });

  const pdf = await generateOffertePdf(offerte.email ?? "", { ...(offerte.data as any), offerteId: offerte.id });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${request.nextUrl.searchParams.has("download") ? "attachment" : "inline"}; filename="Offerte-BartMooi.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
