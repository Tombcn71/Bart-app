"use server";
import { db } from "@/db";
import { instellingen } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getMatrix(key: string) {
  const result = await db.query.instellingen.findFirst({
    where: eq(instellingen.key, key),
  });

  // Geeft de data terug als die bestaat, anders een leeg object
  return result ? result.value : {};
}
