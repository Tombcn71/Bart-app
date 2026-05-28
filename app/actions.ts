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

    // 2. Opslaan in database
    await db.insert(offertes).values({ email, data: dataMetSubsidie });

    // 3. PDF genereren
    const pdfBuffer = await generateOffertePdf(email, dataMetSubsidie);

    // 4. E-mail verzenden
    const { data: emailData, error } = await resend.emails.send({
      from: "Bart Mooi <info@offerte-bartmooi.nl>",
      to: [email],
      replyTo: "info@offerte-bartmooi.nl",
      subject: `Uw offerte aanvraag — ${data.product || data.kozijnNaam}`,
      text: `Geachte ${data.naam || ""},\n\nBedankt voor uw aanvraag. In de bijlage vindt u uw offerte met alle specificaties en voorwaarden.\n\nWij nemen zo spoedig mogelijk contact met u op.\n\nMet vriendelijke groet,\nBart Mooi Kozijnen`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="border-bottom: 3px solid #1066a3; padding-bottom: 16px; margin-bottom: 24px;">
            <h1 style="color: #1066a3; font-size: 20px; margin: 0;">Uw offerte aanvraag</h1>
          </div>

          <p>Geachte ${data.naam || ""},</p>
          <p>Hartelijk dank voor uw interesse in onze kozijnen en deuren. Wij hebben uw aanvraag in goede orde ontvangen.</p>
          <p>In de <strong>bijlage</strong> vindt u uw offerte met alle specificaties, wat er in de prijs inbegrepen is, de betalingsvoorwaarden en onze garanties.</p>

          <div style="background-color: #f0f7ff; border-left: 4px solid #1066a3; padding: 14px 18px; margin: 24px 0; border-radius: 0 6px 6px 0;">
            <p style="margin: 0 0 4px; font-weight: bold; color: #1066a3;">Indicatie subsidiekans (ISDE-regeling)</p>
            <p style="font-size: 22px; font-weight: bold; color: #1066a3; margin: 0;">€ ${totaalSubsidie.toLocaleString("nl-NL")}</p>
            <p style="font-size: 11px; color: #666; margin: 6px 0 0;"><em>Dit is een indicatie. Het exacte bedrag hangt af van uw situatie.</em></p>
          </div>

          <p>Wij nemen zo spoedig mogelijk contact met u op om de offerte door te nemen.</p>

          <p style="margin-top: 32px;">Met vriendelijke groet,<br/><strong>Bart Mooi Kozijnen</strong><br/>
          <span style="color: #999; font-size: 12px;">info@offerte-bartmooi.nl</span></p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 28px 0;" />
          <p style="font-size: 11px; color: #aaa;">BARTMOOI B.V. · Burgemeester Hovylaan 157 · 2552 XB Den Haag</p>
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
