"use client";
import { useState, useEffect } from "react";
import { getOffertes, deleteOfferte } from "@/app/actions";
import Link from "next/link";

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
      <div>
        <h1 className="text-2xl font-black text-slate-800">Verstuurd</h1>
        <p className="text-sm text-slate-500">{offertes.length} offerte{offertes.length !== 1 ? "s" : ""} verzonden.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Laden...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                <th className="py-4 px-6">Klant</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Bedrag</th>
                <th className="py-4 px-6">Datum</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offertes.map((o) => {
                const d = o.data;
                const isAccepted = !!d?.acceptedAt;
                return (
                  <tr key={o.id} className="hover:bg-slate-50/50 text-sm">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-slate-800">{d?.naam || "—"}</p>
                      <p className="text-xs text-slate-400">{o.email}</p>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{d?.product || d?.kozijnNaam || d?.deurNaam || "—"}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {d?.prijs ? `€ ${Number(d.prijs).toLocaleString("nl-NL", { minimumFractionDigits: 2 })}` : "—"}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString("nl-NL") : "—"}
                    </td>
                    <td className="py-4 px-6">
                      {isAccepted ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                          Geaccepteerd
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1066a3] text-xs font-semibold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1066a3] inline-block" />
                          Verzonden
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/offertes/${o.id}`} className="text-[#1066a3] text-sm font-semibold hover:underline">
                          Bekijken
                        </Link>
                        <button
                          onClick={() => handleDelete(o.id)}
                          disabled={deleting === o.id}
                          className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-40"
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
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">Nog geen offertes.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
