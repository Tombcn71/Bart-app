import { telGesprek } from "@/lib/marleen-teller";

/** Geeft de browser een tijdelijke sleutel voor één gesprek met de ElevenLabs-agent. De echte sleutel blijft op de server. */
const bezoeken = new Map<string, number[]>();
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
  if (lijst.length >= 20) return false;
  lijst.push(nu);
  bezoeken.set(ip, lijst);
  return true;
}

export async function POST(req: Request) {
  if (!toegestaan(req)) return Response.json({ fout: "Te veel gesprekken. Probeer het later opnieuw." }, { status: 429 });
  const key = process.env.ELEVENLABS_API_KEY;
  const agent = process.env.ELEVENLABS_AGENT_ID;
  if (!key || !agent) return Response.json({ fout: "De ElevenLabs-sleutel of agent ontbreekt." }, { status: 500 });
  // Getekende link voor een websocket-gesprek (werkt een kwartier, alleen voor deze agent).
  // Maximaal aantal gesprekken per maand: daarna geen nieuwe gesprekken meer.
  if (!(await telGesprek())) return Response.json({ fout: "Marleen is nu even niet beschikbaar.", op: true }, { status: 403 });
  const r = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agent)}`, { headers: { "xi-api-key": key } });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.signed_url) return Response.json({ fout: "Geen toegang: " + JSON.stringify(d).slice(0, 200) }, { status: 502 });
  return Response.json({ signedUrl: d.signed_url }, { headers: { "cache-control": "no-store" } });
}
