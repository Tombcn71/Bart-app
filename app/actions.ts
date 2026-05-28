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
    const [inserted] = await db
      .insert(offertes)
      .values({
        email: email,
        data: dataMetSubsidie,
      })
      .returning({ id: offertes.id });


    // 4. PDF download link
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://offerte-bartmooi.nl";
    const pdfUrl = `${baseUrl}/api/offerte/${inserted.id}/pdf`;

    // 5. E-mail verzenden — simpele HTML, geen bijlage
    const { data: emailData, error } = await resend.emails.send({
      from: "BartMooi <info@offerte-bartmooi.nl>",
      to: [email],
      subject: `Offerte aanvraag: ${data.product || data.kozijnNaam}`,
      html: `<div style="font-family: Arial, sans-serif; color: #333; max-width: 560px; margin: 0 auto;">
<h2 style="color: #1066a3;">Bedankt voor uw aanvraag, ${data.naam || ""}!</h2>
<p>We hebben uw aanvraag voor de <strong>${data.product || data.kozijnNaam}</strong> ontvangen.</p>
<p><strong>Uw offerte:</strong> <a href="${pdfUrl}">${pdfUrl}</a></p>
<p><strong>Configuratie:</strong></p>
<ul>
<li>Breedte: ${data.breedte} mm</li>
<li>Hoogte: ${data.hoogte} mm</li>
<li>Kleur: ${data.kleur || "-"}</li>
<li>Glas: ${data.glas || "-"}</li>
<li>Aantal: ${data.aantal}</li>
<li>Prijs: € ${data.prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</li>
</ul>
<p>Subsidie indicatie (ISDE): € ${totaalSubsidie.toLocaleString("nl-NL")}</p>
<p>Wij nemen zo spoedig mogelijk contact met u op.</p>
<p>Met vriendelijke groet,<br>Team BartMooi</p>
<p style="color: #999; font-size: 11px;">BartMooi B.V. - Burgemeester Hovylaan 157 - 2552 XB Den Haag</p>
</div>`,
      j,
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
