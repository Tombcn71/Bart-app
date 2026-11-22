import { GoogleGenAI } from "@google/genai";
import { MODELLEN, STEMMEN, marleenConfig } from "@/lib/marleen-live";

/**
 * Geeft de browser een tijdelijke toegangssleutel voor één gesprek. De echte sleutel blijft op de server,
 * en de tijdelijke sleutel werkt maar één keer en kort, alleen voor Marleen.
 */
// Eenvoudige bescherming tegen misbruik: alleen vanaf de eigen site en maximaal 20 gesprekken per uur per bezoeker.
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
  const gevraagd = new URL(req.url).searchParams.get("stem") ?? "";
  const gevraagdModel = new URL(req.url).searchParams.get("model") ?? "";
  const model = (MODELLEN as readonly string[]).includes(gevraagdModel) ? gevraagdModel : MODELLEN[0];
  const stem = (STEMMEN as readonly string[]).includes(gevraagd) ? gevraagd : STEMMEN[0];
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ fout: "De sleutel ontbreekt." }, { status: 500 });
  try {
    const ai = new GoogleGenAI({ apiKey: key, httpOptions: { apiVersion: "v1alpha" } });
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(Date.now() + 60 * 1000).toISOString(),
        liveConnectConstraints: { model, config: marleenConfig(stem, model) },
        httpOptions: { apiVersion: "v1alpha" },
      },
    });
    return Response.json({ token: token.name, model });
  } catch (e) {
    return Response.json({ fout: e instanceof Error ? e.message : "Mislukt" }, { status: 500 });
  }
}
