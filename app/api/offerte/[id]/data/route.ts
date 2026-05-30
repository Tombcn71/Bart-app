import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { offertes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [offerte] = await db.select().from(offertes).where(eq(offertes.id, id));
  if (!offerte) return new NextResponse("Niet gevonden", { status: 404 });
  return NextResponse.json({ data: offerte.data, createdAt: offerte.createdAt });
}
