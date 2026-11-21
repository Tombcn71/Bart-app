import { db } from "@/db";
import { offertes } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { FilterKeuze } from "../filter-keuze";

export default async function GeaccepteerdeOffertes() {
  const alle = await db.select().from(offertes).orderBy(desc(offertes.createdAt));
  const geaccepteerd = alle.filter(o => (o.data as any)?.acceptedAt);

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <h1 className="text-2xl font-black text-foreground">Geaccepteerde offertes</h1>
        <p className="text-sm text-muted-foreground">{geaccepteerd.length} offerte{geaccepteerd.length !== 1 ? "s" : ""} geaccepteerd.</p>
      </div>

      {/* Telefoon: keuzemenu met aantallen en de offertes als compacte kaarten. */}
      <div className="space-y-2 md:hidden">
        <FilterKeuze
          actief="/admin/offertes/geaccepteerd"
          opties={[
            { href: "/admin/offertes", label: "Alle offertes", aantal: alle.length },
            { href: "/admin/offertes/geaccepteerd", label: "Geaccepteerd", aantal: geaccepteerd.length },
          ]}
        />
        {geaccepteerd.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Nog geen geaccepteerde offertes.</p>
        ) : (
          geaccepteerd.map((o) => {
            const d = o.data as any;
            return (
              <Link key={o.id} href={`/admin/offertes/${o.id}`} className="block rounded-xl border border-border bg-card p-3 active:bg-muted">
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold text-foreground">{d.naam || o.email}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-brand-text">
                    {d.prijs ? `€ ${Number(d.prijs).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}` : "—"}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-xs text-muted-foreground">{d.product || d.kozijnNaam || d.deurNaam || "—"}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                    {d.acceptedAt ? new Date(d.acceptedAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) : "—"}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground uppercase">
              <th className="py-4 px-6">Klant</th>
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">Bedrag</th>
              <th className="py-4 px-6">Verzonden</th>
              <th className="py-4 px-6">Geaccepteerd op</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {geaccepteerd.map((o) => {
              const d = o.data as any;
              const acceptDatum = d.acceptedAt
                ? new Date(d.acceptedAt).toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short" })
                : "—";
              return (
                <tr key={o.id} className="hover:bg-muted/50 text-sm">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-foreground">{d.naam || "—"}</p>
                    <p className="text-xs text-muted-foreground">{o.email}</p>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">{d.product || d.kozijnNaam || d.deurNaam || "—"}</td>
                  <td className="py-4 px-6 font-semibold text-brand-text">
                    {d.prijs ? `€ ${Number(d.prijs).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}` : "—"}
                  </td>
                  <td className="py-4 px-6 text-xs text-muted-foreground">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString("nl-NL") : "—"}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      {acceptDatum}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Link href={`/admin/offertes/${o.id}`} className="text-brand-text text-sm font-semibold hover:underline">
                      Bekijken
                    </Link>
                  </td>
                </tr>
              );
            })}
            {geaccepteerd.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-muted-foreground text-sm">
                  Nog geen geaccepteerde offertes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
