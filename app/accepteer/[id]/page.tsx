"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function AccepteerOfferte() {
  const { id } = useParams();
  const [status, setStatus] = useState<"loading" | "ready" | "accepted" | "error">("loading");
  const [naam, setNaam] = useState("");

  useEffect(() => {
    // Controleer of het offerte-ID geldig is
    fetch(`/api/offerte/${id}/pdf`)
      .then(r => r.ok ? setStatus("ready") : setStatus("error"))
      .catch(() => setStatus("error"));
  }, [id]);

  async function handleAccept() {
    const res = await fetch(`/api/offerte/${id}/accepteer`, { method: "POST", body: JSON.stringify({ naam }), headers: { "Content-Type": "application/json" } });
    if (res.ok) setStatus("accepted");
    else setStatus("error");
  }

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-400">Offerte ophalen...</p>
    </div>
  );

  if (status === "accepted") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3">Offerte geaccepteerd</h1>
        <p className="text-slate-500">Hartelijk dank! BartMooi neemt zo spoedig mogelijk contact met u op om de aanbetaling en planning te bespreken.</p>
      </div>
    </div>
  );

  if (status === "error") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-500">Deze offerte-link is niet meer geldig.</p>
        <a href="/" className="text-[#1066a3] font-semibold mt-4 inline-block hover:underline">← Terug naar BartMooi</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <img src="/bartmooi-logo-1.png" alt="BartMooi" className="h-8 w-auto object-contain" />
        </div>
        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">Offerte accepteren</h1>
        <p className="text-sm text-slate-500 mb-6">
          Door op akkoord te klikken gaat u akkoord met de offerte van BartMooi B.V., inclusief de specificaties, prijs en betalingsvoorwaarden.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Uw naam (ter bevestiging)</label>
          <input
            value={naam}
            onChange={e => setNaam(e.target.value)}
            placeholder="Voor- en achternaam"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]"
          />
        </div>
        <button
          disabled={!naam.trim()}
          onClick={handleAccept}
          className="w-full bg-[#1066a3] text-white font-bold py-3 rounded-xl hover:bg-[#0d5491] transition-colors disabled:opacity-40">
          Ik ga akkoord met deze offerte
        </button>
        <p className="text-xs text-slate-400 mt-4 text-center">
          BartMooi B.V. · Burgemeester Hovylaan 157 · Den Haag
        </p>
      </div>
    </div>
  );
}
