import { nogBeschikbaar } from "@/lib/roos-teller";

/** Of Roos deze maand nog gesprekken over heeft (anders verdwijnt de bal). */
export async function GET() {
  try {
    return Response.json({ beschikbaar: await nogBeschikbaar() }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ beschikbaar: false }, { headers: { "cache-control": "no-store" } });
  }
}
