"use server";

import { db } from "@/db";
import { instellingen, offertes } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function saveOfferte(email: string, data: any) {
  try {
    // 1. Opslaan in de database
    await db.insert(offertes).values({
      email: email,
      data: data,
    });

    // 2. E-mail sturen naar de klant
    await resend.emails.send({
      from: "offertes@jouwdomein.nl", // Pas dit aan naar je eigen e-mailadres
      to: email,
      subject: "Uw offerte aanvraag",
      html: `
        <h1>Bedankt voor uw aanvraag!</h1>
        <p>Wij hebben uw offerte succesvol ontvangen.</p>
        <p>We nemen zo spoedig mogelijk contact met u op.</p>
        <hr />
        <p><strong>Configuratie details:</strong></p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Fout bij opslaan offerte of versturen e-mail:", error);
    return { success: false, error: "Kon offerte niet verwerken" };
  }
}
