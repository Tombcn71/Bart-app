import { db } from "@/db";
import { offertes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { markeerGemonteerd } from "@/app/actions";

export default async function OfferteDetailPagina({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div>Geen ID gevonden in de URL.</div>;
  }

  // Debug: log de ID die we proberen te vinden
  console.log("Zoeken naar offerte met ID:", id);

  try {
    const result = await db.select().from(offertes).where(eq(offertes.id, id)); // Drizzle zorgt hier voor de $1 parameter

    const offerte = result[0];

    if (!offerte) {
      console.log("Geen offerte gevonden voor ID:", id);
      return notFound();
    }

    return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Link
          href="/admin/offertes"
          className="text-sm text-slate-400 hover:text-brand-text">
          ← Terug naar overzicht
        </Link>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h1 className="text-2xl font-black text-slate-800 mb-2">
            Offerte {offerte.id.slice(0, 8)}
          </h1>
          <p className="text-slate-500 mb-6">Klant: {offerte.email}</p>

          {(() => {
            const d = offerte.data as Record<string, any>;
            const gemonteerd = d.gemonteerdAt ? new Date(d.gemonteerdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : null;
            return (
              <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                {gemonteerd ? (
                  <p className="text-sm font-semibold text-slate-700">Gemonteerd op {gemonteerd}{d.reviewAt ? " · reviewverzoek verstuurd" : ""}</p>
                ) : (
                  <form
                    action={async () => {
                      "use server";
                      await markeerGemonteerd(offerte.id);
                    }}>
                    <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
                      Markeer als gemonteerd
                    </button>
                    <p className="mt-2 text-xs text-slate-500">Een dag later krijgt de klant een mail met het verzoek om een Google-review achter te laten.</p>
                  </form>
                )}
              </div>
            );
          })()}

          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl">
            {Object.entries(offerte.data as Record<string, any>).map(
              ([key, value]) => (
                <div key={key}>
                  <label className="text-[10px] uppercase font-bold text-slate-400">
                    {key}
                  </label>
                  <div className="text-sm text-slate-700 font-medium">
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Database fout:", error);
    return (
      <div>
        Er ging iets mis bij het ophalen van de data. Controleer de database
        verbinding.
      </div>
    );
  }
}
