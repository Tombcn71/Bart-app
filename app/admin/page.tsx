import { db } from "@/db";
import { offertes } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function AdminDashboard() {
  const alle = await db.select().from(offertes).orderBy(desc(offertes.createdAt));

  const totaal      = alle.length;
  const geaccepteerd = alle.filter(o => (o.data as any)?.acceptedAt).length;
  const conversie   = totaal > 0 ? Math.round((geaccepteerd / totaal) * 100) : 0;

  return (
    <div className="space-y-8">

      {/* Statistieken */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Verzonden offertes" value={totaal} />
        <StatCard label="Geaccepteerd" value={geaccepteerd} />
        <StatCard label="Conversie" value={`${conversie}%`} />
      </div>

      {/* Recente offertes */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-foreground">Recente offertes</h2>
          <Link href="/admin/offertes" className="text-sm text-brand-text font-semibold hover:underline">
            Alle offertes →
          </Link>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-muted/40">
              <tr className="text-xs font-bold text-muted-foreground uppercase">
                <th className="py-3 px-6">Klant</th>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Datum</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {alle.slice(0, 10).map((o) => {
                const d = o.data as any;
                const naam = d?.naam || "—";
                const product = d?.product || d?.kozijnNaam || d?.deurNaam || "—";
                const datum = o.createdAt
                  ? new Date(o.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" })
                  : "—";
                const isAccepted = !!d?.acceptedAt;

                return (
                  <tr key={o.id} className="hover:bg-muted/50 text-sm">
                    <td className="py-3 px-6 font-medium text-foreground">{naam}</td>
                    <td className="py-3 px-6 text-muted-foreground">{product}</td>
                    <td className="py-3 px-6 text-muted-foreground">{datum}</td>
                    <td className="py-3 px-6">
                      {isAccepted ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                          Geaccepteerd
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-brand-text text-xs font-semibold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
                          Verzonden
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {alle.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 px-6 text-center text-muted-foreground text-sm">
                    Nog geen offertes ontvangen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${accent ? "bg-brand border-brand" : "bg-card border-border"}`}>
      <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${accent ? "text-blue-200" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className={`text-4xl font-black ${accent ? "text-white" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
