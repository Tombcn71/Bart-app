import { db } from "@/db";
import { offertes } from "@/db/schema";

export async function saveOfferte(
  email: string,
  type: string,
  data: Record<string, any>,
) {
  return await db.insert(offertes).values({
    email,
    data: {
      type,
      configuratie: data,
      createdAt: new Date().toISOString(),
    },
  });
}
