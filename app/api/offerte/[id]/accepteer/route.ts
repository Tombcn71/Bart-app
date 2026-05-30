import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { offertes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { naam } = await request.json();

  const [offerte] = await db.select().from(offertes).where(eq(offertes.id, id));
  if (!offerte) return new NextResponse("Niet gevonden", { status: 404 });

  await db.update(offertes)
    .set({ data: { ...(offerte.data as object), acceptedAt: new Date().toISOString(), acceptedByNaam: naam } })
    .where(eq(offertes.id, id));

  return NextResponse.json({ success: true });
}
