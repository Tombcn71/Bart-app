"use server";

import { db } from "@/db";
import { instellingen, offertes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { generateOffertePdf } from "@/app/lib/generate-offerte-pdf";

export async function adminLogin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    (await cookies()).set("admin_token", process.env.ADMIN_TOKEN!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return { success: true };
  }
  return { success: false };
}

export async function adminLogout() {
  (await cookies()).delete("admin_token");
}

const resend = new Resend(process.env.RESEND_API_KEY);

// Verwijder een offerte
export async function deleteOfferte(id: string) {
  try {
    await db.delete(offertes).where(eq(offertes.id, id));
    return { success: true };
  } catch {
    return { success: false };
  }
}

// 1. Functie om offertes op te halen voor het Admin Dashboard
export async function getOffertes() {
  try {
    const data = await db
      .select()
      .from(offertes)
      .orderBy(desc(offertes.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Fout bij ophalen offertes:", error);
    return { success: false, data: [] };
  }
}

// 2. Functie voor admin beheer (prijzen instellen)
export async function saveMatrix(key: string, data: any) {
  try {
    await db
      .insert(instellingen)
      .values({ key, value: data })
      .onConflictDoUpdate({
        target: instellingen.key,
        set: { value: data, updatedAt: new Date() },
      });

    revalidatePath("/admin/prijzen");
    return { success: true };
  } catch (error) {
    console.error("Fout bij opslaan matrix:", error);
    return { success: false, error: "Kon niet opslaan" };
  }
}

const INTERN_NOTIFICATIE_ADRES = "info@bartmooi.nl";

function euro(n: number): string {
  return "€ " + Number(n ?? 0).toLocaleString("nl-NL", { minimumFractionDigits: 2 });
}

// Korte samenvatting van een offerte-item voor de interne notificatie
function itemRegel(item: any): string {
  const s = item.specs ?? {};
  const maat = s.breedte && s.hoogte ? ` · ${s.breedte}×${s.hoogte}mm` : "";
  const aantal = s.aantal ? ` · ${s.aantal} stuks` : "";
  return `${item.product ?? "Product"}${maat}${aantal} — ${euro(item.prijs)}`;
}

// Interne notificatie naar BartMooi met korte samenvatting van de offerte.
// Blokkeert de klant-bevestiging niet als deze faalt.
async function stuurInterneNotificatie(opts: {
  klant: { naam?: string; email: string; woonplaats?: string; telefoon?: string };
  items: any[];
  totaalPrijs: number;
  totaalSubsidie: number;
  offerteId: string;
}): Promise<void> {
  const { klant, items, totaalPrijs, totaalSubsidie, offerteId } = opts;
  const regels = items.map(itemRegel);
  try {
    await resend.emails.send({
      from: "Bart Mooi <info@offerte-bartmooi.nl>",
      to: [INTERN_NOTIFICATIE_ADRES],
      replyTo: klant.email,
      subject: `Nieuwe offerte — ${klant.naam || klant.email} (${items.length} product${items.length !== 1 ? "en" : ""}, ${euro(totaalPrijs)})`,
      text:
        `Nieuwe offerte aangevraagd\n\n` +
        `Naam: ${klant.naam || "-"}\n` +
        `E-mail: ${klant.email}\n` +
        `Woonplaats: ${klant.woonplaats || "-"}\n` +
        `Telefoon: ${klant.telefoon || "-"}\n\n` +
        `Producten:\n${regels.map((r) => `  • ${r}`).join("\n")}\n\n` +
        `Totaal: ${euro(totaalPrijs)}\n` +
        `Subsidie-indicatie: ${euro(totaalSubsidie)}\n` +
        `Offerte-ID: ${offerteId}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
          <h2 style="color: #1066a3; margin: 0 0 16px;">Nieuwe offerte aangevraagd</h2>
          <table style="border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr><td style="padding: 2px 12px 2px 0; color: #777;">Naam</td><td><strong>${klant.naam || "-"}</strong></td></tr>
            <tr><td style="padding: 2px 12px 2px 0; color: #777;">E-mail</td><td>${klant.email}</td></tr>
            <tr><td style="padding: 2px 12px 2px 0; color: #777;">Woonplaats</td><td>${klant.woonplaats || "-"}</td></tr>
            <tr><td style="padding: 2px 12px 2px 0; color: #777;">Telefoon</td><td>${klant.telefoon || "-"}</td></tr>
          </table>
          <p style="font-weight: bold; margin: 0 0 6px;">Producten</p>
          <ul style="margin: 0 0 20px; padding-left: 18px; color: #444;">
            ${regels.map((r) => `<li style="margin-bottom: 4px;">${r}</li>`).join("")}
          </ul>
          <p style="margin: 0;"><strong>Totaal:</strong> ${euro(totaalPrijs)}</p>
          <p style="margin: 0 0 16px;"><strong>Subsidie-indicatie:</strong> ${euro(totaalSubsidie)}</p>
          <p style="font-size: 11px; color: #aaa;">Offerte-ID: ${offerteId}</p>
        </div>`,
    });
  } catch (error) {
    console.error("Interne notificatie kon niet worden verzonden:", error);
  }
}

// Subsidie per item: triple glas 111/m², overig 25/m²
function berekenSubsidie(item: any): number {
  const b = Number(item.specs?.breedte ?? 0);
  const h = Number(item.specs?.hoogte ?? 0);
  const aantal = Number(item.specs?.aantal ?? 1);
  const glas = String(item.specs?.glas ?? item.specs?.glasType ?? "");
  const m2 = (b / 1000) * (h / 1000) * aantal;
  const perM2 = /triple/i.test(glas) ? 111 : 25;
  return Math.round(m2 * perM2);
}

// Meerdere producten in één offerte (winkelmand)
export async function saveOffertes(
  klant: { naam: string; email: string; woonplaats?: string; telefoon?: string },
  items: any[]
) {
  try {
    const totaalPrijs = items.reduce((s, i) => s + Number(i.prijs ?? 0), 0);
    const totaalSubsidie = items.reduce((s, i) => s + berekenSubsidie(i), 0);

    const data = {
      naam: klant.naam,
      woonplaats: klant.woonplaats,
      telefoon: klant.telefoon,
      items,
      prijs: totaalPrijs,
      subsidieIndicatie: totaalSubsidie,
      product: items.length === 1 ? items[0].product : `${items.length} producten`,
    };

    const inserted = await db.insert(offertes).values({ email: klant.email, data }).returning({ id: offertes.id });
    const offerteId = inserted[0]?.id ?? "";

    const pdfBuffer = await generateOffertePdf(klant.email, { ...data, offerteId });

    const { error } = await resend.emails.send({
      from: "Bart Mooi <info@offerte-bartmooi.nl>",
      to: [klant.email],
      replyTo: "info@offerte-bartmooi.nl",
      subject: `Uw offerte — BartMooi`,
      text: `Geachte ${klant.naam},\n\nHartelijk dank voor uw aanvraag. In de bijlage vindt u uw offerte met ${items.length} product(en).\n\nMet vriendelijke groet,\nBartMooi`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: white; padding: 32px; border: 1px solid #e8edf2; border-radius: 8px;">
            <p style="font-size: 16px; font-weight: bold; color: #1a1a1a; margin: 0 0 8px;">Geachte ${klant.naam},</p>
            <p style="color: #555; margin: 0 0 20px;">Hartelijk dank voor uw aanvraag. Wij hebben uw aanvraag voor <strong>${items.length} product${items.length !== 1 ? "en" : ""}</strong> in goede orde ontvangen.</p>
            <p style="color: #555; margin: 0 0 32px;">In de <strong>bijlage</strong> vindt u uw persoonlijke offerte met alle specificaties, technische tekeningen, de betalingsvoorwaarden en onze garanties.</p>
            <p style="color: #555; margin: 0 0 32px;">Wij nemen zo spoedig mogelijk contact met u op om de offerte samen door te nemen.</p>
            <p style="color: #333; margin: 0;">Met vriendelijke groet,<br/>
            <strong style="color: #1066a3;">BartMooi B.V.</strong><br/>
            <span style="color: #999; font-size: 12px;">info@offerte-bartmooi.nl · Den Haag</span></p>
          </div>
          <p style="font-size: 10px; color: #bbb; text-align: center; margin-top: 16px;">BARTMOOI B.V. · Burgemeester Hovylaan 157 · 2552 XB Den Haag</p>
        </div>`,
      attachments: [{ filename: `Offerte-BartMooi-${klant.naam?.replace(/\s+/g, "-") || "aanvraag"}.pdf`, content: pdfBuffer }],
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "E-mail kon niet worden verzonden." };
    }

    await stuurInterneNotificatie({
      klant,
      items,
      totaalPrijs,
      totaalSubsidie,
      offerteId,
    });

    revalidatePath("/admin/offertes");
    return { success: true };
  } catch (error) {
    console.error("Server Action error:", error);
    return { success: false, error: "Kon offerte niet verwerken" };
  }
}

// 3. Functie voor offerte aanvragen
export async function saveOfferte(email: string, data: any) {
  try {
    // 1. BEREKEN SUBSIDIE
    // m2 berekening * aantal stuks
    const m2 = (data.breedte / 1000) * (data.hoogte / 1000) * data.aantal;
    // Triple glas = 111 per m2, HR++ / overig = 25 per m2
    const subsidiePerM2 = data.glas === "triple" ? 111 : 25;
    const totaalSubsidie = Math.round(m2 * subsidiePerM2);

    // Voeg subsidie toe aan data object
    const dataMetSubsidie = { ...data, subsidieIndicatie: totaalSubsidie };

    // 2. Opslaan in database + ID ophalen
    const inserted = await db.insert(offertes).values({ email, data: dataMetSubsidie }).returning({ id: offertes.id });
    const offerteId = inserted[0]?.id ?? "";

    // 3. PDF genereren (met ID voor acceptatielink)
    const pdfBuffer = await generateOffertePdf(email, { ...dataMetSubsidie, offerteId });

    // 4. E-mail verzenden
    const { data: emailData, error } = await resend.emails.send({
      from: "Bart Mooi <info@offerte-bartmooi.nl>",
      to: [email],
      replyTo: "info@offerte-bartmooi.nl",
      subject: `Uw offerte voor ${data.product || data.kozijnNaam || data.deurNaam || "uw aanvraag"} — BartMooi`,
      text: `Geachte ${data.naam || ""},\n\nHartelijk dank voor uw aanvraag voor een ${data.product || data.kozijnNaam || data.deurNaam || "product"}.\nIn de bijlage vindt u uw offerte.\n\nMet vriendelijke groet,\nBartMooi`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; max-width: 600px; margin: 0 auto;">

          <div style="background: white; padding: 32px; border: 1px solid #e8edf2; border-radius: 8px;">
            <p style="font-size: 16px; font-weight: bold; color: #1a1a1a; margin: 0 0 8px;">Geachte ${data.naam || ""},</p>
            <p style="color: #555; margin: 0 0 20px;">Hartelijk dank voor uw aanvraag voor een <strong>${data.product || data.kozijnNaam || data.deurNaam || "product"}</strong>. Wij hebben uw aanvraag in goede orde ontvangen.</p>
            <p style="color: #555; margin: 0 0 32px;">In de <strong>bijlage</strong> vindt u uw persoonlijke offerte met alle specificaties, een technische tekening, de betalingsvoorwaarden en onze garanties.</p>

            <p style="color: #555; margin: 0 0 32px;">Wij nemen zo spoedig mogelijk contact met u op om de offerte samen door te nemen.</p>

            <p style="color: #333; margin: 0;">Met vriendelijke groet,<br/>
            <strong style="color: #1066a3;">BartMooi B.V.</strong><br/>
            <span style="color: #999; font-size: 12px;">info@offerte-bartmooi.nl · Den Haag</span></p>
          </div>

          <p style="font-size: 10px; color: #bbb; text-align: center; margin-top: 16px;">BARTMOOI B.V. · Burgemeester Hovylaan 157 · 2552 XB Den Haag</p>
        </div>`,
      attachments: [
        {
          filename: `Offerte-BartMooi-${data.naam?.replace(/\s+/g, "-") || "aanvraag"}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "E-mail kon niet worden verzonden." };
    }

    await stuurInterneNotificatie({
      klant: { naam: data.naam, email, woonplaats: data.woonplaats, telefoon: data.telefoon },
      items: [
        {
          product: data.product || data.kozijnNaam || data.deurNaam || "Product",
          prijs: data.prijs,
          specs: { breedte: data.breedte, hoogte: data.hoogte, aantal: data.aantal, glas: data.glas },
        },
      ],
      totaalPrijs: Number(data.prijs ?? 0),
      totaalSubsidie,
      offerteId,
    });

    revalidatePath("/admin/offertes");
    return { success: true, data: emailData };
  } catch (error) {
    console.error("Server Action error:", error);
    return { success: false, error: "Kon offerte niet verwerken" };
  }
}
