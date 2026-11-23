import { NextRequest, NextResponse } from "next/server";
import { systeem, TOOLS } from "@/lib/assistent-prompt";

export const runtime = "nodejs";

const MODEL = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2.1";
const STEM = process.env.OPENAI_REALTIME_VOICE || "marin";
const STEMMEN = ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"];
const MAX_PER_UUR = 12; // gesprekken per bezoeker per uur (per server-instantie)

const teller = new Map<string, { n: number; tot: number }>();
function mag(ip: string) {
  const nu = Date.now();
  const r = teller.get(ip);
  if (!r || r.tot < nu) { teller.set(ip, { n: 1, tot: nu + 3600_000 }); return true; }
  r.n += 1;
  return r.n <= MAX_PER_UUR;
}

/** Geeft de browser een kortlevende sleutel om rechtstreeks met de stem van OpenAI te praten. De echte sleutel blijft hier. */
export async function POST(req: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return NextResponse.json({ fout: "geen-sleutel" }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  if (!mag(ip)) return NextResponse.json({ fout: "te-veel" }, { status: 429 });

  let body: any = {};
  try { body = await req.json(); } catch { /* leeg mag */ }
  const typen = (Array.isArray(body?.typen) ? body.typen : []).slice(0, 60).map((t: any) => ({ slug: String(t.slug).slice(0, 80), naam: String(t.naam).slice(0, 80) }));

  const instructies =
    systeem(typen, body?.staat ?? {}) +
    `

Je praat nu hardop met de klant, via een stem. Klink als een gewone, vriendelijke Nederlandse medewerker aan de telefoon, niet als een computer of een folder.

Zo praat je:
- Warm, vriendelijk en menselijk, met "je", zoals een aardige medewerker die graag meedenkt. Geen "u". Niet haastig, niet kortaf en niet nonchalant. Volledige, goed lopende zinnen.
- Doe één ding tegelijk. Maak geen meerdere stappen in één keer: zeg wat je doet, stel één vraag en wacht dan op het antwoord. Jaag nooit door het gesprek heen. Geef de klant steeds de ruimte om te reageren.
- Zet je iets op het scherm (zoals de foto op een gevel), vraag dan wat de klant ervan vindt ("Wat vind je ervan?") en wacht op zijn reactie voor je verdergaat.
- Leg dingen uit. Bij elke keuze waar mensen over twijfelen leg je rustig in gewone woorden uit wat het verschil is en waarom mensen het kiezen, en vraag dan wat de klant het fijnst vindt.
- Reageer eerst kort en met warmte op wat de klant zei. Wissel af en gebruik nooit twee keer hetzelfde woord achter elkaar: bijvoorbeeld "Dank je wel, dat is duidelijk." "Fijn om te horen." "Dat snap ik." "Goed om te weten." "Een mooie keuze." Soms hoeft er helemaal geen tussenwoordje: ga dan gewoon met een vriendelijke vraag verder.
- Gebruik nooit "top", "prima" of "mooi" als losse reactie, en ook geen "doe ik" of "kom". Zeg niet "even kijken...".
- Maten zeg je zoals mensen ze zeggen: "een meter bij een meter twintig", "honderdtachtig bij honderdveertig". Niet "1000 bij 1000 millimeter".
- Zeg niet dat iets "klaarstaat" of "is ingevuld". Zeg wat de klant ziet: "Rechts zie je nu de prijs."
- Prijzen zeg je rond en gewoon: "Dat komt op ongeveer elfhonderdveertig euro, inclusief montage."
- Voor je een hulpmiddel gebruikt zeg je iets vriendelijks, zoals "Ik zet dat meteen voor je in de calculator." Daarna hoort de klant je door terwijl het scherm verandert.
- Gaat de klant praten terwijl jij praat, stop dan meteen en luister.`;

  const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      session: {
        type: "realtime",
        model: MODEL,
        instructions: instructies,
        audio: {
          input: {
            transcription: { model: "gpt-4o-mini-transcribe", language: "nl" },
            turn_detection: { type: "semantic_vad", eagerness: "high" },
          },
          output: { voice: STEMMEN.includes(body?.stem) ? body.stem : STEM },
        },
        tools: TOOLS.map((t) => ({ type: "function", name: t.name, description: t.description, parameters: t.input_schema })),
        tool_choice: "auto",
      },
    }),
  });
  if (!res.ok) {
    console.error("realtime-token:", res.status, (await res.text()).slice(0, 400));
    return NextResponse.json({ fout: "model" }, { status: 502 });
  }
  const data = await res.json();
  return NextResponse.json({ sleutel: data.value, model: MODEL }, { headers: { "Cache-Control": "no-store" } });
}
