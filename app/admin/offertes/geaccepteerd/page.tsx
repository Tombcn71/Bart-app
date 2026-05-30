import { db } from "@/db";
import { offertes } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function GeaccepteerdeOffertes() {
  const alle = await db.select().from(offertes).orderBy(desc(offertes.createdAt));
  const geaccepteerd = alle.filter(o => (o.data as any)?.acceptedAt);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Geaccepteerde offertes</h1>
        <p className="text-sm text-slate-500">{geaccepteerd.length} offerte{geaccepteerd.length !== 1 ? "s" : ""} geaccepteerd.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
              <th className="py-4 px-6">Klant</th>
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">Bedrag</th>
              <th className="py-4 px-6">Verzonden</th>
              <th className="py-4 px-6">Geaccepteerd op</th>
              <th className="py-4 px-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {geaccepteerd.map((o) => {
              const d = o.data as any;
              const acceptDatum = d.acceptedAt
                ? new Date(d.acceptedAt).toLocaleString("nl-NL", { dateStyle: "medium", timeStyle: "short" })
                : "—";
              return (
                <tr key={o.id} className="hover:bg-slate-50/50 text-sm">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-800">{d.naam || "—"}</p>
                    <p className="text-xs text-slate-400">{o.email}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{d.product || d.kozijnNaam || d.deurNaam || "—"}</td>
                  <td className="py-4 px-6 font-semibold text-[#1066a3]">
                    {d.prijs ? `€ ${Number(d.prijs).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}` : "—"}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString("nl-NL") : "—"}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      {acceptDatum}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Link href={`/admin/offertes/${o.id}`} className="text-[#1066a3] text-sm font-semibold hover:underline">
                      Bekijken
                    </Link>
                  </td>
                </tr>
              );
            })}
            {geaccepteerd.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">
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
