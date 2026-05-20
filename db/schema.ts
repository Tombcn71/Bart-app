import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const offertes = pgTable("Offerte", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
