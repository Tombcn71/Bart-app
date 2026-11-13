import { NextResponse } from "next/server";

export const runtime = "nodejs";

const FEEDBACK_URL = process.env.FEEDBACK_URL ?? "https://www.kozijnsoftware.nl/api/feedback";

/**
 * Feedback van Bart uit zijn app. Gaat via de server door naar kozijnsoftware.nl (met een gedeeld geheim),
 * zodat Tom het ziet in zijn admin. Het geheim komt nooit in de browser.
 */
export async function POST(req: Request) {
  const geheim = process.env.FEEDBACK_SECRET;
  if (!geheim) return NextResponse.json({ error: "Feedback is niet ingesteld." }, { status: 503 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const bericht = typeof body.bericht === "string" ? body.bericht.trim().slice(0, 5000) : "";
  if (!bericht) return NextResponse.json({ error: "Bericht is leeg." }, { status: 400 });

  try {
    const res = await fetch(FEEDBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-feedback-secret": geheim },
      body: JSON.stringify({
        bron: "BartMooi",
        naam: "Bart",
        email: "info@bartmooi.nl",
        categorie: body.categorie,
        bericht,
        magReageren: !!body.magReageren,
        pagina: typeof body.pagina === "string" ? body.pagina.slice(0, 200) : null,
      }),
    });
    if (!res.ok) return NextResponse.json({ error: "Doorsturen mislukt." }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "Doorsturen mislukt." }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
