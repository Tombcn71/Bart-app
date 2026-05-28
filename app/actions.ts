"use server";

import { db } from "@/db";
import { instellingen, offertes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { desc } from "drizzle-orm";
import { cookies } from "next/headers";

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

    // 3. E-mail verzenden
    const { data: emailData, error } = await resend.emails.send({
      from: "Bart Mooi <info@send.offerte-bartmooi.nl>",
      to: [email],
      subject: `Offerte aanvraag: ${data.product || data.kozijnNaam}`,
      // OPLOSSING 1: Voeg platte tekst toe voor spamfilters
      text: `Bedankt voor uw aanvraag, ${data.naam || ""}!\n\nWe hebben uw aanvraag voor de ${data.product || data.kozijnNaam} ontvangen.\n\nSubsidiekans: € ${totaalSubsidie.toLocaleString("nl-NL")} (Indicatie op basis van de ISDE-regeling).\n\nSpecificaties:\n- Breedte: ${data.breedte} mm\n- Hoogte: ${data.hoogte} mm\n- Kleur: ${data.kleur || "-"}\n- Glas: ${data.glas || "-"}\n- Aantal: ${data.aantal}\n\nPrijs: € ${data.prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}\n\nWij nemen zo spoedig mogelijk contact met u op.`,
      // OPLOSSING 2: Subtielere HTML-opmaak
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1066a3; font-size: 22px;">Bedankt voor uw aanvraag, ${data.naam || ""}!</h1>
          <p>We hebben uw aanvraag voor de <strong>${data.product || data.kozijnNaam}</strong> in goede orde ontvangen.</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #1066a3; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #1066a3;">Indicatie subsidiekans:</p>
            <p style="font-size: 24px; font-weight: bold; color: #1066a3; margin: 5px 0;">€ ${totaalSubsidie.toLocaleString("nl-NL")}</p>
            <p style="font-size: 12px; color: #666; margin: 0;"><em>Dit betreft een indicatie op basis van de huidige ISDE-regeling.</em></p>
          </div>

          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #333;">Uw specificaties:</h3>
            <ul style="padding-left: 20px; margin: 10px 0;">
              <li>Breedte: ${data.breedte} mm</li>
              <li>Hoogte: ${data.hoogte} mm</li>
              <li>Kleur: ${data.kleur || "-"}</li>
              <li>Glas: ${data.glas || "-"}</li>
              <li>Aantal: ${data.aantal}</li>
            </ul>
            <p style="font-size: 16px; margin-bottom: 0;"><strong>Prijsindicatie: € ${data.prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</strong></p>
          </div>
          
          <p>Wij nemen zo spoedig mogelijk contact met u op om de offerte door te nemen.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">Deze e-mail is verzonden door Bart Mooi Kozijnen.</p>
        </div>`,
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
