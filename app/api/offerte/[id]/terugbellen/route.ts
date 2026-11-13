import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { db } from "@/db";
import { offertes } from "@/db/schema";
import { BEDRIJF, INTERN_ADRES } from "@/lib/bedrijf";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

const WANNEER = ["Zo snel mogelijk", "Vandaag", "Morgen"];
const DAGDEEL = ["ochtend", "middag", "avond"];
const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * De klant vraagt in de herinneringsmail om teruggebeld te worden. We leggen het vast bij de offerte en
 * sturen BartMooi direct een mail met het telefoonnummer en wanneer het de klant uitkomt.
 * Dit gebeurt via een knop op een pagina (POST), niet via de link zelf: mailprogramma's openen links soms automatisch.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("Niet gevonden", { status: 404 });
  const body = (await request.json().catch(() => ({}))) as { wanneer?: string; dagdeel?: string };
  const wanneer = WANNEER.includes(String(body.wanneer)) ? String(body.wanneer) : "Zo snel mogelijk";
  const dagdeel = DAGDEEL.includes(String(body.dagdeel)) ? String(body.dagdeel) : "";
  const wanneerTekst = dagdeel && wanneer !== "Zo snel mogelijk" ? `${wanneer}, ${dagdeel}` : wanneer;

  const [offerte] = await db.select().from(offertes).where(eq(offertes.id, id));
  if (!offerte) return new NextResponse("Niet gevonden", { status: 404 });
  const data = offerte.data as Record<string, any>;

  // Eén keer melden per offerte (dubbel klikken geeft geen tweede mail).
  const alGemeld = !!data.terugbellenAt;
  await db
    .update(offertes)
    .set({ data: { ...data, terugbellenAt: new Date().toISOString(), terugbellenWanneer: wanneerTekst } })
    .where(eq(offertes.id, id));

  if (!alGemeld && process.env.RESEND_API_KEY) {
    const naam = data.naam || offerte.email;
    const tel = String(data.telefoon ?? "");
    const regels = [
      `${naam} heeft gevraagd of u terugbelt over zijn of haar offerte.`,
      `Wanneer het uitkomt: ${wanneerTekst}.`,
      tel ? `Telefoon: ${tel}` : "Er is geen telefoonnummer bekend. Antwoord op deze mail of mail de klant: " + offerte.email,
    ];
    const adminUrl = `${SITE_URL}/admin/offertes/${id}`;
    const html = `<div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; max-width: 600px;">
      <p style="font-size: 16px; font-weight: bold;">${esc(naam)} wil dat u terugbelt</p>
      ${regels.map((r) => `<p style="margin: 0 0 12px;">${esc(r)}</p>`).join("")}
      <p>${tel ? `<a href="tel:${esc(tel.replace(/[^\d+]/g, ""))}" style="background:#1E5079;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin:0 8px 8px 0;">Bel ${esc(tel)}</a>` : ""}<a href="${esc(adminUrl)}" style="background:#1E5079;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin:0 8px 8px 0;">Bekijk de offerte</a></p>
    </div>`;
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: "Bart Mooi <info@offerte.bartmooi.nl>",
      to: [INTERN_ADRES],
      replyTo: offerte.email,
      subject: `${naam} wil dat u terugbelt`,
      html,
      text: `${regels.join("\n")}\n\nBekijk de offerte: ${adminUrl}`,
    });
    if (error) console.error("Resend error (terugbellen):", error);
  }

  return NextResponse.json({ success: true, telefoon: BEDRIJF.telefoon });
}
