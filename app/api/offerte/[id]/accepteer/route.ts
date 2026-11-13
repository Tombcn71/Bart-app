import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { offertes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";
import { INTERN_ADRES } from "@/lib/bedrijf";

const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { naam } = await request.json();

  const [offerte] = await db.select().from(offertes).where(eq(offertes.id, id));
  if (!offerte) return new NextResponse("Niet gevonden", { status: 404 });

  const data = offerte.data as any;
  const alAkkoord = !!data.acceptedAt;
  const nu = new Date();

  await db.update(offertes)
    .set({ data: { ...data, acceptedAt: nu.toISOString(), acceptedByNaam: naam } })
    .where(eq(offertes.id, id));

  // Melding aan Bart, één keer per offerte (dubbel klikken geeft geen tweede mail).
  if (!alAkkoord && process.env.RESEND_API_KEY) {
    try {
      const klant = data.naam || offerte.email || "De klant";
      const tijd = nu.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" });
      const telefoon = String(data.telefoon ?? "");
      const tel = telefoon.replace(/[^\d+]/g, "");
      const product = Array.isArray(data.items) && data.items.length > 1 ? `${data.items.length} producten` : String(data.items?.[0]?.product ?? data.product ?? "Product");
      const totaal = data.prijs != null ? `€ ${Number(data.prijs).toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "";
      const adminUrl = `${SITE_URL}/admin/offertes/${id}`;
      const zin = `Om ${tijd} uur is ${klant} akkoord gegaan met de offerte. Bel zo snel mogelijk terug om de inmeting te plannen.`;
      const knop = (href: string, label: string) =>
        `<a href="${esc(href)}" style="background: #1E5079; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin: 0 8px 8px 0;">${esc(label)}</a>`;
      await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: "Bart Mooi <info@offerte.bartmooi.nl>",
        to: [INTERN_ADRES],
        replyTo: offerte.email ?? undefined,
        subject: `${klant} is akkoord, bel zo snel mogelijk terug`,
        text:
          `${zin}\n\nTelefoon: ${telefoon || "niet opgegeven"}\nWoonplaats: ${data.woonplaats || "-"}\nProduct: ${product}\n` +
          (totaal ? `Totaal: ${totaal}\n` : "") +
          `\nBekijk in de admin: ${adminUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
            <h2 style="color: #10649E; margin: 0 0 12px;">${esc(klant)} is akkoord</h2>
            <p style="margin: 0 0 20px;">${esc(zin)}</p>
            <table style="border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
              <tr><td style="padding: 2px 12px 2px 0; color: #777;">Telefoon</td><td><strong>${esc(telefoon) || "niet opgegeven"}</strong></td></tr>
              <tr><td style="padding: 2px 12px 2px 0; color: #777;">Woonplaats</td><td>${esc(data.woonplaats) || "-"}</td></tr>
              <tr><td style="padding: 2px 12px 2px 0; color: #777;">Product</td><td>${esc(product)}</td></tr>
              ${totaal ? `<tr><td style="padding: 2px 12px 2px 0; color: #777;">Totaal</td><td>${esc(totaal)}</td></tr>` : ""}
            </table>
            <p style="margin: 0;">${tel ? knop(`tel:${tel}`, `Bel ${telefoon}`) : ""}${knop(adminUrl, "Bekijk de offerte")}</p>
          </div>`,
      });
    } catch (error) {
      console.error("Akkoordmelding kon niet worden verzonden:", error);
    }
  }

  return NextResponse.json({ success: true });
}
