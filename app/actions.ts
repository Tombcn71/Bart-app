"use server";

import { db } from "@/db";
import { offertes } from "@/db/schema";

// Deze ene functie is alles wat je nodig hebt voor al je formulieren
export async function saveOfferte(
  type: "deur" | "kozijn" | "schuifpui",
  data: any,
) {
  return await db.insert(offertes).values({
    email: "klant@test.nl", // Dit kan later dynamisch worden
    data: {
      type,
      ...data,
      timestamp: new Date().toISOString(),
    },
  });
}
