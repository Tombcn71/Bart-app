import { cookies } from "next/headers";
import { noteer, SOORTEN, type Soort } from "@/lib/bezoek";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  try {
    // Bart zelf (ingelogd in de admin) telt niet mee.
    if (process.env.ADMIN_TOKEN && (await cookies()).get("admin_token")?.value === process.env.ADMIN_TOKEN) return new Response(null, { status: 204, headers: CORS });
    const b = await req.json();
    const soort = b?.soort as Soort;
    if ((SOORTEN as readonly string[]).includes(soort)) {
      await noteer(soort, req.headers, typeof b.bron === "string" ? b.bron.slice(0, 30) : undefined, typeof b.pad === "string" ? b.pad : undefined);
    }
  } catch {}
  return new Response(null, { status: 204, headers: CORS });
}
