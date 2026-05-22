"use client";
import React, { useState, useEffect } from "react";
import { getOffertes } from "@/app/actions";
import Link from "next/link"; // Belangrijk: Link moet geïmporteerd worden

export default function OffertesPagina() {
  const [offertes, setOffertes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getOffertes();
      if (res.success) {
        setOffertes(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Offertes</h1>
          <p className="text-sm text-slate-500">
            Beheer al je klantoffertes op één plek.
          </p>
        </div>
        <button className="bg-[#1066a3] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#0d5485] transition-colors">
          + Nieuwe Offerte
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Laden...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Klant</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Bedrag</th>
                <th className="py-4 px-6">Datum</th>
                <th className="py-4 px-6">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offertes.map((offerte) => (
                <tr key={offerte.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-6 font-bold text-slate-800">
                    {offerte.id.slice(0, 8)}...
                  </td>
                  <td className="py-4 px-6">{offerte.email}</td>
                  <td className="py-4 px-6">
                    {offerte.data.product ||
                      offerte.data.kozijnNaam ||
                      "Product"}
                  </td>
                  <td className="py-4 px-6">
                    € {offerte.data.prijs || "0,00"}
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    {offerte.createdAt
                      ? new Date(offerte.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  {/* Hier is de Link die zorgt dat je naar de detailpagina gaat */}
                  <td className="py-4 px-6">
                    <Link
                      href={`/admin/offertes/${offerte.id}`}
                      className="text-[#1066a3] font-bold hover:underline">
                      Bekijken
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
