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
    const [inserted] = await db.insert(offertes).values({
      email: email,
      data: dataMetSubsidie,
    }).returning({ id: offertes.id });

    // 3. Genereer offerte nummer en datum
    const offerteNummer = `OF/${new Date().getFullYear()}/${inserted.id.slice(-8).toUpperCase()}`;

    // 4. Download link — PDF wordt gegenereerd via API route
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://offerte-bartmooi.nl";
    const pdfUrl = `${baseUrl}/api/offerte/${inserted.id}/pdf`;

    // 5. E-mail verzenden met downloadlink
    const { data: emailData, error } = await resend.emails.send({
      from: "BartMooi <offerte@offerte-bartmooi.nl>",
      to: [email],
      subject: `Uw offerte ${offerteNummer} — ${data.product || data.kozijnNaam}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px;">
          <div style="background: #1066a3; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">BartMooi B.V.</h1>
            <p style="color: #cce5f7; margin: 4px 0 0; font-size: 13px;">deuren · kozijnen · vliesgevel</p>
          </div>
          <div style="border: 1px solid #e2e8f0; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1a1a1a; margin-top: 0;">Bedankt voor uw aanvraag, ${data.naam || ""}!</h2>
            <p style="color: #555;">Uw offerte voor de <strong>${data.product || data.kozijnNaam}</strong> staat klaar.</p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${pdfUrl}" style="background: #1066a3; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 15px; text-decoration: none; display: inline-block;">
                📄 Download uw offerte (PDF)
              </a>
              <p style="font-size: 11px; color: #aaa; margin-top: 8px;">Offerte ${offerteNummer}</p>
            </div>

            <div style="background: #e0f2fe; border: 2px solid #1066a3; padding: 16px 20px; border-radius: 8px; margin: 24px 0;">
              <p style="font-weight: bold; color: #1066a3; margin: 0 0 6px;">Subsidiekans — ISDE Regeling</p>
              <p style="font-size: 28px; font-weight: bold; color: #1066a3; margin: 0;">€ ${totaalSubsidie.toLocaleString("nl-NL")}</p>
              <p style="font-size: 12px; color: #555; margin: 6px 0 0;"><em>Indicatie op basis van de ISDE-regeling (bij 2+ isolatiemaatregelen).</em></p>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="background: #f8fafc;"><td style="padding: 8px 12px; color: #666; width: 40%;">Product</td><td style="padding: 8px 12px; font-weight: bold;">${data.product || data.kozijnNaam}</td></tr>
              <tr><td style="padding: 8px 12px; color: #666;">Afmetingen</td><td style="padding: 8px 12px; font-weight: bold;">${data.breedte} × ${data.hoogte} mm</td></tr>
              <tr style="background: #f8fafc;"><td style="padding: 8px 12px; color: #666;">Aantal</td><td style="padding: 8px 12px; font-weight: bold;">${data.aantal} stuks</td></tr>
              <tr><td style="padding: 8px 12px; color: #666; font-size: 15px; font-weight: bold;">Totaalprijs</td><td style="padding: 8px 12px; font-size: 18px; font-weight: bold; color: #1066a3;">€ ${data.prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</td></tr>
            </table>

            <p style="margin-top: 24px; color: #555; font-size: 13px;">Wij nemen zo spoedig mogelijk contact met u op om de offerte te bespreken.</p>
            <p style="color: #555; font-size: 13px;">Met vriendelijke groet,<br/><strong>Team BartMooi</strong></p>
          </div>
          <p style="font-size: 11px; color: #aaa; text-align: center; margin-top: 16px;">BartMooi B.V. · Burgemeester Hovylaan 157 · 2552 XB 's-Gravenhage</p>
        </div>
      `,
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
