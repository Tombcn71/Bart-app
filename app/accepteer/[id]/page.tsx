"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function AccepteerOfferte() {
  const { id } = useParams();
  const offerteId = typeof id === "string" ? id : "";
  const [naam, setNaam] = useState("");
  const [status, setStatus] = useState<"idle" | "bezig" | "accepted" | "error">("idle");

  async function handleAccept() {
    if (!naam.trim() || !offerteId) return;
    setStatus("bezig");
    try {
      const res = await fetch(`/api/offerte/${offerteId}/accepteer`, {
        method: "POST",
        body: JSON.stringify({ naam }),
        headers: { "Content-Type": "application/json" },
      });
      setStatus(res.ok ? "accepted" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "accepted") return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3">Offerte geaccepteerd</h1>
        <p className="text-slate-500 mb-2">Hartelijk dank, <strong>{naam}</strong>!</p>
        <p className="text-slate-500 text-sm">BartMooi neemt zo spoedig mogelijk contact met u op om de aanbetaling en planning te bespreken.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">

        <div className="mb-6">
          <img src="/bartmooi-logo-1.png" alt="BartMooi" className="h-8 w-auto object-contain" />
        </div>

        <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">Offerte accepteren</h1>
        <p className="text-sm text-slate-500 mb-6">
          Door op akkoord te klikken bevestigt u dat u instemt met de offerte van BartMooi B.V., inclusief de specificaties, prijs en betalingsvoorwaarden.
        </p>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Uw naam</label>
          <input
            value={naam}
            onChange={e => setNaam(e.target.value)}
            placeholder="Voor- en achternaam"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-500 mb-4">Er is iets misgegaan. Probeer opnieuw of neem contact op met BartMooi.</p>
        )}

        <button
          disabled={!naam.trim() || status === "bezig"}
          onClick={handleAccept}
          className="w-full bg-[#1066a3] text-white font-bold py-3 rounded-xl hover:bg-[#0d5491] transition-colors disabled:opacity-40">
          {status === "bezig" ? "Verwerken..." : "Ik ga akkoord met deze offerte"}
        </button>

        <p className="text-xs text-slate-400 mt-5 text-center">
          BartMooi B.V. · Burgemeester Hovylaan 157 · 2552 XB Den Haag
        </p>
      </div>
    </div>
  );
}
