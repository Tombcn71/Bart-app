"use server";

import { db } from "@/db";
import { offertes } from "@/db/schema";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function saveOfferte(email: string, data: any) {
  try {
    // 1. Opslaan in de database
    await db.insert(offertes).values({
      email: email,
      data: data,
    });

    // 2. E-mail verzenden volgens officiële Resend-standaard
    const { data: emailData, error } = await resend.emails.send({
      from: "JouwBedrijf <jouw-geverifieerde-email@jouwdomein.nl>",
      to: [email],
      subject: `Offerte aanvraag: ${data.product}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>Bedankt voor uw aanvraag!</h1>
          <p>We hebben uw aanvraag voor de <strong>${data.product}</strong> ontvangen.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            <p><strong>Configuratie:</strong></p>
            <ul>
              <li>Breedte: ${data.breedte} mm</li>
              <li>Hoogte: ${data.hoogte} mm</li>
              <li>Kleur: ${data.kleur}</li>
              <li>Glas: ${data.glas}</li>
              <li>Aantal: ${data.aantal}</li>
            </ul>
            <p style="font-size: 18px;"><strong>Prijs: € ${data.prijs}</strong></p>
          </div>
          <p>Wij nemen zo spoedig mogelijk contact met u op.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "E-mail kon niet worden verzonden." };
    }

    return { success: true, data: emailData };
  } catch (error) {
    console.error("Server Action error:", error);
    return { success: false, error: "Kon offerte niet verwerken" };
  }
}
