import { createHash } from "crypto";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const SOORTEN = ["wp_bezoek", "wp_klik", "site_bezoek", "calc", "offerte", "roos"] as const;
export type Soort = (typeof SOORTEN)[number];

let klaar: Promise<unknown> | null = null;
function tabel() {
  klaar ??= db.execute(sql`CREATE TABLE IF NOT EXISTS "Bezoek" (
    id bigserial PRIMARY KEY, dag date NOT NULL, sid text NOT NULL, soort text NOT NULL,
    bron text, pad text, created_at timestamp DEFAULT now())`);
  return klaar;
}

/** Anoniem bezoekers-id zonder cookie: hash van ip + browser + dag. Wisselt elke dag, is niet terug te rekenen. */
export function sidVan(h: Headers) {
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  const dag = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${h.get("user-agent") ?? ""}|${dag}|${process.env.ADMIN_TOKEN ?? ""}`).digest("hex").slice(0, 16);
}

export async function noteer(soort: Soort, h?: Headers, bron?: string, pad?: string) {
  try {
    const kop = h ?? (await headers());
    if (/bot|crawl|spider|preview|scan/i.test(kop.get("user-agent") ?? "")) return;
    await tabel();
    const dag = new Date().toISOString().slice(0, 10);
    await db.execute(sql`INSERT INTO "Bezoek" (dag, sid, soort, bron, pad) VALUES (${dag}, ${sidVan(kop)}, ${soort}, ${bron ?? null}, ${(pad ?? "").slice(0, 120) || null})`);
  } catch (e) {
    console.error("bezoek noteren mislukt", e);
  }
}

export async function funnel(dagen: number) {
  await tabel();
  const rows = (await db.execute(sql`SELECT soort, COUNT(DISTINCT sid)::int AS n FROM "Bezoek" WHERE dag >= CURRENT_DATE - ${dagen - 1}::int GROUP BY soort`)) as unknown as { soort: string; n: number }[];
  const uit: Record<string, number> = {};
  for (const r of rows) uit[r.soort] = r.n;
  const bronnen = (await db.execute(sql`SELECT COALESCE(bron,'direct') AS bron, COUNT(DISTINCT sid)::int AS n FROM "Bezoek" WHERE soort='site_bezoek' AND dag >= CURRENT_DATE - ${dagen - 1}::int GROUP BY 1 ORDER BY 2 DESC`)) as unknown as { bron: string; n: number }[];
  const wpBronnen = (await db.execute(sql`SELECT COALESCE(bron,'direct') AS bron, COUNT(DISTINCT sid)::int AS n FROM "Bezoek" WHERE soort='wp_bezoek' AND dag >= CURRENT_DATE - ${dagen - 1}::int GROUP BY 1 ORDER BY 2 DESC`)) as unknown as { bron: string; n: number }[];
  return { n: uit, bronnen, wpBronnen };
}

/** Maakt van de site waar iemand vandaan kwam een leesbare naam. */
export function bronVan(ref?: string) {
  const h = (ref ?? "").toLowerCase().replace(/^www\./, "").replace(/^(m|l|lm)\./, "");
  if (!h || h.endsWith("bartmooi.nl")) return "direct";
  const namen: [RegExp, string][] = [
    [/chatgpt|openai/, "ChatGPT"], [/perplexity/, "Perplexity"], [/gemini\.google|bard\.google/, "Gemini"],
    [/claude\.ai|anthropic/, "Claude"], [/copilot|bing\.com\/chat/, "Copilot"],
    [/google\./, "Google"], [/bing\.com/, "Bing"], [/duckduckgo|ecosia|yahoo/, "Andere zoekmachine"],
    [/facebook\.com|fb\.com|fb\.me/, "Facebook"], [/whatsapp/, "WhatsApp"],
    [/linkedin|lnkd\.in/, "LinkedIn"], [/t\.co$|twitter|x\.com/, "X"],
    [/pinterest/, "Pinterest"],   ];
  for (const [re, naam] of namen) if (re.test(h)) return naam;
  return h.slice(0, 40);
}
