"use server";

import { db } from "@/db";
import { instellingen, offertes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { desc } from "drizzle-orm";
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

          <div style="background: #1066a3; padding: 28px 32px; border-radius: 8px 8px 0 0;">
            <p style="color: white; font-size: 22px; font-weight: bold; margin: 0;">BartMooi</p>
            <p style="color: rgba(255,255,255,0.75); font-size: 12px; margin: 4px 0 0;">Uw offerte is klaar</p>
          </div>

          <div style="background: white; padding: 32px; border: 1px solid #e8edf2; border-top: 0; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; font-weight: bold; color: #1a1a1a; margin: 0 0 8px;">Geachte ${data.naam || ""},</p>
            <p style="color: #555; margin: 0 0 20px;">Hartelijk dank voor uw aanvraag voor een <strong>${data.product || data.kozijnNaam || data.deurNaam || "product"}</strong>. Wij hebben uw aanvraag in goede orde ontvangen.</p>
            <p style="color: #555; margin: 0 0 24px;">In de <strong>bijlage</strong> vindt u uw persoonlijke offerte met alle specificaties, een technische tekening, de betalingsvoorwaarden en onze garanties.</p>

            <div style="background: #f0f7ff; border-left: 4px solid #1066a3; padding: 16px 20px; margin: 0 0 24px; border-radius: 0 6px 6px 0;">
              <p style="margin: 0 0 4px; font-weight: bold; color: #1066a3; font-size: 13px;">Uw ISDE subsidie-indicatie</p>
              <p style="font-size: 28px; font-weight: bold; color: #1066a3; margin: 4px 0;">€ ${totaalSubsidie.toLocaleString("nl-NL")}</p>
              <p style="font-size: 11px; color: #888; margin: 4px 0 0;"><em>Indicatie op basis van uw maten en glastype. Exacte bedrag afhankelijk van uw situatie.</em></p>
            </div>

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

    revalidatePath("/admin/offertes");
    return { success: true, data: emailData };
  } catch (error) {
    console.error("Server Action error:", error);
    return { success: false, error: "Kon offerte niet verwerken" };
  }
}
