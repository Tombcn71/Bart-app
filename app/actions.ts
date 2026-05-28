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
      from: "Bart Mooi <offerte@send.offerte-bartmooi.nl>",
      to: [email],
      subject: `Offerte aanvraag: ${data.product || data.kozijnNaam}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="color: #1066a3;">Bedankt voor uw aanvraag, ${data.naam || ""}!</h1>
          <p>We hebben uw aanvraag voor de <strong>${data.product || data.kozijnNaam}</strong> ontvangen.</p>
          <div style="background: #e0f2fe; border: 2px solid #1066a3; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #1066a3; margin-top: 0;">Subsidiekans!</h2>
            <p style="font-size: 28px; font-weight: bold; color: #1066a3; margin: 10px 0;">€ ${totaalSubsidie.toLocaleString("nl-NL")}</p>
            <p style="font-size: 13px;"><em>Indicatie op basis van de ISDE-regeling.</em></p>
          </div>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            <ul>
              <li>Breedte: ${data.breedte} mm</li>
              <li>Hoogte: ${data.hoogte} mm</li>
              <li>Kleur: ${data.kleur || "-"}</li>
              <li>Glas: ${data.glas || "-"}</li>
              <li>Aantal: ${data.aantal}</li>
            </ul>
            <p style="font-size: 18px;"><strong>Prijs: € ${data.prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</strong></p>
          </div>
          <p>Wij nemen zo spoedig mogelijk contact met u op.</p>
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
