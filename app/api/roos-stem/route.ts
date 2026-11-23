import { GoogleGenAI } from "@google/genai";
import { OPENING_PCM_BASE64, OPENING_TEKST } from "@/lib/roos-opening";

/**
 * De stem van Roos: Gemini's voorleesstem (gemini-3.8-flash-tts, stem Kore), de stem die Tom koos ("nummer 5").
 * De browser stuurt één zin; wij sturen het geluid (24 kHz, 16-bit PCM) terug zodra het binnenkomt.
 */
// Geen stijlinstructie: Tom koos versie B (Kore, gewoon voorgelezen) op 22 nov 2026.
const STIJL = "";

// Bescherming tegen misbruik: alleen vanaf de eigen site en maximaal 400 zinnen per uur per bezoeker.
const bezoeken = new Map<string, number[]>();
// Zinnen die al eens gemaakt zijn, onthouden: dan klinken ze meteen (en precies hetzelfde).
const onthouden = new Map<string, Uint8Array>();
function toegestaan(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return false;
    } catch {
      return false;
    }
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  const nu = Date.now();
  const lijst = (bezoeken.get(ip) ?? []).filter((t) => nu - t < 3_600_000);
  if (lijst.length >= 400) return false;
  lijst.push(nu);
  bezoeken.set(ip, lijst);
  return true;
}

// Stilte aan begin en eind van een zin wegknippen, zodat er geen pauzes tussen de zinnen vallen.
const DREMPEL = 700; // ongeveer -33 dB
const HOUD = 1200; // 50 ms ademruimte laten staan (24 kHz)
function eersteGeluid(b: Uint8Array) {
  const v = new Int16Array(b.buffer, b.byteOffset, b.length >> 1);
  for (let i = 0; i < v.length; i++) if (Math.abs(v[i]) > DREMPEL) return i;
  return -1;
}
function laatsteGeluid(b: Uint8Array) {
  const v = new Int16Array(b.buffer, b.byteOffset, b.length >> 1);
  for (let i = v.length - 1; i >= 0; i--) if (Math.abs(v[i]) > DREMPEL) return i;
  return -1;
}
function knip(b: Uint8Array) {
  const a = eersteGeluid(b);
  if (a < 0) return new Uint8Array(0);
  const z = laatsteGeluid(b);
  const van = Math.max(0, a - HOUD) * 2;
  const tot = Math.min(b.length >> 1, z + HOUD) * 2;
  return b.slice(van, tot);
}

export async function POST(req: Request) {
  if (!toegestaan(req)) return new Response("Te veel", { status: 429 });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return new Response("Sleutel ontbreekt", { status: 500 });
  const { tekst } = (await req.json().catch(() => ({}))) as { tekst?: string };
  const zin = String(tekst ?? "").trim().slice(0, 600);
  if (!zin) return new Response("Geen tekst", { status: 400 });

  // De openingszin: altijd precies opname B.
  const gewoon = (t: string) => t.toLowerCase().replace(/[^a-z]/g, "");
  if (gewoon(zin) === gewoon(OPENING_TEKST)) {
    return new Response(knip(new Uint8Array(Buffer.from(OPENING_PCM_BASE64, "base64"))), {
      headers: { "content-type": "application/octet-stream", "cache-control": "no-store" },
    });
  }

  const sleutel = gewoon(zin);
  const bekend = onthouden.get(sleutel);
  if (bekend) return new Response(new Uint8Array(bekend), { headers: { "content-type": "application/octet-stream", "cache-control": "no-store" } });

  const ai = new GoogleGenAI({ apiKey: key, httpOptions: { apiVersion: "v1alpha" } });
  const stroom = await ai.models.generateContentStream({
    model: "gemini-3.8-flash-tts",
    contents: [{ parts: [{ text: STIJL + zin }] }],
    config: {
      responseModalities: ["AUDIO"],
      // Vaste seed en temperatuur 0: elke zin in bijna dezelfde stem. Seed 3 koos Tom (22 nov 2026).
      seed: 3,
      temperature: 0,
      speechConfig: { languageCode: "nl-NL", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
    },
  });

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const verstuurd: Uint8Array[] = [];
        let begonnen = false;
        let wacht = new Uint8Array(0); // nog niet verstuurd: mogelijk stilte aan het eind
        const stuur = (b: Uint8Array) => {
          if (!b.length) return;
          verstuurd.push(b);
          controller.enqueue(b);
        };
        for await (const c of stroom) {
          const d = c.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
          if (!d) continue;
          let stuk: Uint8Array = new Uint8Array(Buffer.concat([wacht, Buffer.from(d, "base64")]));
          wacht = new Uint8Array(0);
          if (!begonnen) {
            const a = eersteGeluid(stuk);
            if (a < 0) continue; // nog alleen stilte
            stuk = stuk.slice(Math.max(0, a - HOUD) * 2);
            begonnen = true;
          }
          // Alles tot het laatste geluid versturen; wat erna komt houden we vast (kan eindstilte zijn).
          const z = laatsteGeluid(stuk);
          const grens = z < 0 ? 0 : Math.min(stuk.length, (z + 1) * 2);
          stuur(stuk.slice(0, grens));
          wacht = stuk.slice(grens);
        }
        // Eind: maximaal 50 ms van de stilte laten staan.
        stuur(wacht.slice(0, Math.min(wacht.length, HOUD * 2)));
        if (verstuurd.length && zin.length < 200 && onthouden.size < 500) onthouden.set(sleutel, Buffer.concat(verstuurd));
      } catch {}
      controller.close();
    },
  });
  return new Response(body, { headers: { "content-type": "application/octet-stream", "cache-control": "no-store" } });
}
