import { and, sql } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "@/db";
import { offertes } from "@/db/schema";
import { SITE_URL } from "@/lib/site";
import { GOOGLE_REVIEW_URL } from "@/lib/bedrijf";
import { eq } from "drizzle-orm";

/**
 * Automatische mails aan klanten van BartMooi, één keer per dag via /api/cron/offerte-mails:
 * 1. Opvolging: 2 tot 7 dagen na de offerte nog geen akkoord → één herinnering met de knoppen Bekijk uw offerte en Bel mij terug.
 * 2. Review: 1 tot 7 dagen nadat de offerte als gemonteerd is gemarkeerd → één reviewverzoek (alleen met een Google-reviewlink).
 * Elke mail hooguit één keer per offerte. Alle tijdstippen staan in het veld `data` van de offerte.
 */

const KLEUR = "#1E5079";
const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Offerte = typeof offertes.$inferSelect;
type Verzenden = { dryRun: boolean };

/** Eenvoudige mail in de huisstijl van BartMooi, met één grote knop en eventueel een tweede. */
function mailHtml(opts: { aanhef: string; regels: string[]; knop: string; url: string; knop2?: { label: string; url: string } }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background: white; padding: 32px; border: 1px solid #e8edf2; border-radius: 8px;">
        <p style="font-size: 16px; font-weight: bold; color: #1a1a1a; margin: 0 0 12px;">${esc(opts.aanhef)}</p>
        ${opts.regels.map((r) => `<p style="color: #555; margin: 0 0 16px;">${esc(r)}</p>`).join("")}
        <p style="margin: 24px 0;"><a href="${esc(opts.url)}" style="background: ${KLEUR}; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">${esc(opts.knop)}</a></p>
        ${opts.knop2 ? `<p style="margin: 0 0 24px;"><a href="${esc(opts.knop2.url)}" style="border: 2px solid ${KLEUR}; color: ${KLEUR}; padding: 10px 22px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">${esc(opts.knop2.label)}</a></p>` : ""}
        <p style="color: #333; margin: 0;">Met vriendelijke groet,<br/><strong style="color: #10649E;">BartMooi B.V.</strong></p>
      </div>
    </div>`;
}

async function stuur(o: Offerte, onderwerp: string, html: string, tekst: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false;
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: "Bart Mooi <info@offerte.bartmooi.nl>",
    to: [o.email],
    replyTo: "info@bartmooi.nl",
    subject: onderwerp,
    html,
    text: tekst,
  });
  if (error) console.error("Resend error (offerte-mails):", error);
  return !error;
}

const bewaar = (o: Offerte, extra: Record<string, unknown>) =>
  db.update(offertes).set({ data: { ...(o.data as object), ...extra } }).where(eq(offertes.id, o.id));

export async function sendDueFollowUps({ dryRun }: Verzenden): Promise<number> {
  const rijen = await db
    .select()
    .from(offertes)
    .where(
      and(
        sql`${offertes.data}->>'acceptedAt' IS NULL`,
        sql`${offertes.data}->>'herinneringAt' IS NULL`,
        sql`${offertes.createdAt} <= now() - interval '2 days'`,
        sql`${offertes.createdAt} > now() - interval '7 days'`,
      ),
    );

  let aantal = 0;
  for (const o of rijen) {
    if (!o.email) continue;
    if (dryRun) {
      aantal++;
      continue;
    }
    const naam = String((o.data as { naam?: string })?.naam ?? "").trim();
    const url = `${SITE_URL}/offerte/${o.id}`;
    const terugbelUrl = `${SITE_URL}/terugbellen/${o.id}`;
    const aanhef = `Geachte ${naam}`.trim() + ",";
    const regels = [
      "Een paar dagen geleden ontving u een offerte van BartMooi. Heeft u nog vragen, of wilt u akkoord geven?",
      "Akkoord geven kan met één klik op de offerte. Liever eerst even praten? Dan bellen wij u terug.",
    ];
    const ok = await stuur(
      o,
      "Uw offerte van BartMooi",
      mailHtml({ aanhef, regels, knop: "Bekijk uw offerte", url, knop2: { label: "Bel mij terug", url: terugbelUrl } }),
      `${aanhef}\n\n${regels.join("\n")}\nBekijk uw offerte: ${url}\nBel mij terug: ${terugbelUrl}\n\nMet vriendelijke groet,\nBartMooi B.V.`,
    );
    if (!ok) continue;
    await bewaar(o, { herinneringAt: new Date().toISOString() });
    aantal++;
  }
  return aantal;
}

export async function sendDueReviewRequests({ dryRun }: Verzenden): Promise<number> {
  const reviewUrl = GOOGLE_REVIEW_URL;
  if (!reviewUrl) return 0;
  const rijen = await db
    .select()
    .from(offertes)
    .where(
      and(
        sql`${offertes.data}->>'gemonteerdAt' IS NOT NULL`,
        sql`${offertes.data}->>'reviewAt' IS NULL`,
        sql`(${offertes.data}->>'gemonteerdAt')::timestamptz <= now() - interval '1 day'`,
        sql`(${offertes.data}->>'gemonteerdAt')::timestamptz > now() - interval '7 days'`,
      ),
    );

  let aantal = 0;
  for (const o of rijen) {
    if (!o.email) continue;
    if (dryRun) {
      aantal++;
      continue;
    }
    const naam = String((o.data as { naam?: string })?.naam ?? "").trim();
    const aanhef = `Geachte ${naam}`.trim() + ",";
    const regels = [
      "Uw nieuwe kozijnen zijn geplaatst. Hartelijk dank dat u voor BartMooi koos.",
      "Wilt u ons helpen met een korte review op Google? Het kost een minuut en het helpt andere klanten enorm.",
    ];
    const ok = await stuur(
      o,
      "Hoe was uw ervaring met BartMooi?",
      mailHtml({ aanhef, regels, knop: "Review achterlaten", url: reviewUrl }),
      `${aanhef}\n\n${regels.join("\n")}\n${reviewUrl}\n\nMet vriendelijke groet,\nBartMooi B.V.`,
    );
    if (!ok) continue;
    await bewaar(o, { reviewAt: new Date().toISOString() });
    aantal++;
  }
  return aantal;
}
