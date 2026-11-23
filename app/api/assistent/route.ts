import { NextRequest, NextResponse } from "next/server";
import { systeem, TOOLS } from "@/lib/assistent-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = process.env.ASSISTENT_MODEL || "claude-haiku-5-5";
const MAX_BERICHTEN = 40;
const MAX_PER_UUR = 60; // aanvragen per bezoeker per uur (per server-instantie)

const teller = new Map<string, { n: number; tot: number }>();
function mag(ip: string) {
  const nu = Date.now();
  const r = teller.get(ip);
  if (!r || r.tot < nu) { teller.set(ip, { n: 1, tot: nu + 3600_000 }); return true; }
  r.n += 1;
  return r.n <= MAX_PER_UUR;
}

export async function POST(req: NextRequest) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ fout: "geen-sleutel" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  if (!mag(ip)) return NextResponse.json({ fout: "te-veel" }, { status: 429 });

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ fout: "ongeldig" }, { status: 400 }); }
  const berichten = Array.isArray(body?.berichten) ? body.berichten.slice(-MAX_BERICHTEN) : [];
  if (berichten.length === 0) return NextResponse.json({ fout: "leeg" }, { status: 400 });
  const typen = (Array.isArray(body?.typen) ? body.typen : []).slice(0, 60).map((t: any) => ({ slug: String(t.slug).slice(0, 80), naam: String(t.naam).slice(0, 80) }));

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      thinking: { type: "disabled" },
      system: systeem(typen, body?.staat ?? {}),
      tools: TOOLS,
      messages: berichten,
    }),
  });
  if (!res.ok) {
    console.error("assistent:", res.status, (await res.text()).slice(0, 300));
    return NextResponse.json({ fout: "model" }, { status: 502 });
  }
  const data = await res.json();
  return NextResponse.json({ content: data.content, stop_reason: data.stop_reason });
}
