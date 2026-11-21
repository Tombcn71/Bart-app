"use client";
import { useState, useEffect } from "react";
import { getOffertes, deleteOfferte } from "@/app/actions";
import Link from "next/link";
import { FilterKeuze } from "./filter-keuze";

export default function OffertesPagina() {
  const [offertes, setOffertes] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    const res = await getOffertes();
    if (res.success) setOffertes(res.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    if (!confirm("Weet je zeker dat je deze offerte wilt verwijderen?")) return;
    setDeleting(id);
    await deleteOfferte(id);
    setOffertes(prev => prev.filter(o => o.id !== id));
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <h1 className="text-2xl font-black text-foreground">Verstuurd</h1>
        <p className="text-sm text-muted-foreground">{offertes.length} offerte{offertes.length !== 1 ? "s" : ""} verzonden.</p>
      </div>

      {/* Telefoon: keuzemenu met aantallen en de offertes als compacte kaarten. */}
      <div className="space-y-2 md:hidden">
        <FilterKeuze
          actief="/admin/offertes"
          opties={[
            { href: "/admin/offertes", label: "Alle offertes", aantal: offertes.length },
            { href: "/admin/offertes/geaccepteerd", label: "Geaccepteerd", aantal: offertes.filter((o) => o.data?.acceptedAt).length },
          ]}
        />
        {loading ? (
          <p className="p-6 text-center text-muted-foreground">Laden...</p>
        ) : offertes.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Nog geen offertes.</p>
        ) : (
          offertes.map((o) => {
            const d = o.data;
            const isAccepted = !!d?.acceptedAt;
            return (
              <Link key={o.id} href={`/admin/offertes/${o.id}`} className="block rounded-xl border border-border bg-card p-3 active:bg-muted">
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 truncate font-semibold text-foreground">{d?.naam || o.email}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-foreground">
                    {d?.prijs ? `€ ${Number(d.prijs).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}` : "—"}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-xs text-muted-foreground">
                    {o.createdAt ? new Date(o.createdAt).toLocaleDateString("nl-NL", { day: "numeric", month: "short" }) : ""} · {d?.product || d?.kozijnNaam || d?.deurNaam || "—"}
                  </span>
                  {isAccepted ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                      Geaccepteerd
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-brand-text">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                      Verzonden
                    </span>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Laden...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-xs font-bold text-muted-foreground uppercase">
                <th className="py-4 px-6">Klant</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Bedrag</th>
                <th className="py-4 px-6">Datum</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {offertes.map((o) => {
                const d = o.data;
                const isAccepted = !!d?.acceptedAt;
                return (
                  <tr key={o.id} className="hover:bg-muted/50 text-sm">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-foreground">{d?.naam || "—"}</p>
                      <p className="text-xs text-muted-foreground">{o.email}</p>
                      {d?.telefoon && <a href={`tel:${d.telefoon}`} className="text-xs text-brand-text hover:underline">{d.telefoon}</a>}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{d?.product || d?.kozijnNaam || d?.deurNaam || "—"}</td>
                    <td className="py-4 px-6 font-semibold text-foreground">
                      {d?.prijs ? `€ ${Number(d.prijs).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}` : "—"}
                    </td>
                    <td className="py-4 px-6 text-xs text-muted-foreground">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString("nl-NL") : "—"}
                    </td>
                    <td className="py-4 px-6">
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
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/offertes/${o.id}`} className="text-brand-text text-sm font-semibold hover:underline">
                          Bekijken
                        </Link>
                        <button
                          onClick={() => handleDelete(o.id)}
                          disabled={deleting === o.id}
                          className="text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-40"
                          title="Verwijderen">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {offertes.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground text-sm">Nog geen offertes.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
