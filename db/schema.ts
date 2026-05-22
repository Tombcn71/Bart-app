import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";

// Je bestaande Offertes tabel
export const offertes = pgTable("Offerte", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// De nieuwe tabel voor Bart's prijzen
export const instellingen = pgTable("Instellingen", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(), // Bijv: "kozijn_matrix"
  value: jsonb("value").notNull(), // Hier komt alle prijsdata in
  updatedAt: timestamp("updated_at").defaultNow(),
});
