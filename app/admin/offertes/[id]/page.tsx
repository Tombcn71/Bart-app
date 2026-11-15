import { db } from "@/db";
import { offertes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { markeerGemonteerd } from "@/app/actions";
import { opbouwRegels, type Opbouw } from "@/lib/opbouw";

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
          className="text-sm text-muted-foreground hover:text-brand-text">
          ← Terug naar overzicht
        </Link>

        <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
          <h1 className="text-2xl font-black text-foreground mb-2">
            Offerte {offerte.id.slice(0, 8)}
          </h1>
          <p className="text-muted-foreground mb-6">Klant: {offerte.email}</p>

          {(() => {
            const d = offerte.data as Record<string, any>;
            const gemonteerd = d.gemonteerdAt ? new Date(d.gemonteerdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : null;
            return (
              <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
                {gemonteerd ? (
                  <p className="text-sm font-semibold text-foreground">Gemonteerd op {gemonteerd}{d.reviewAt ? " · reviewverzoek verstuurd" : ""}</p>
                ) : (
                  <form
                    action={async () => {
                      "use server";
                      await markeerGemonteerd(offerte.id);
                    }}>
                    <button type="submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">
                      Markeer als gemonteerd
                    </button>
                    <p className="mt-2 text-xs text-muted-foreground">Een dag later krijgt de klant een mail met het verzoek om een Google-review achter te laten.</p>
                  </form>
                )}
              </div>
            );
          })()}

          {(() => {
            const opb = (offerte.data as { opbouw?: Opbouw }).opbouw;
            if (!opb) return null;
            const o = opbouwRegels(opb);
            return (
              <div className="mb-6 rounded-xl border border-border p-4">
                <p className="font-bold text-foreground">Wat dit voor jou betekent</p>
                <p className="mb-2 text-xs text-muted-foreground">{o.kop}, exclusief btw. Alleen voor jou, de klant ziet dit niet.</p>
                <dl className="space-y-1 text-sm">
                  {o.regels.map((r) => (
                    <div key={r.naam} className={`flex justify-between gap-3 ${r.winst ? "rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-700 dark:text-emerald-300" : "text-foreground"}`}>
                      <dt>{r.naam}</dt>
                      <dd className="tabular-nums">{r.bedrag}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );
          })()}

          <div className="grid grid-cols-2 gap-6 bg-muted/40 p-6 rounded-xl">
            {Object.entries(offerte.data as Record<string, any>).map(
              ([key, value]) => (
                <div key={key}>
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">
                    {key}
                  </label>
                  <div className="text-sm text-foreground font-medium">
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
