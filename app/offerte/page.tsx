"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getCart, removeFromCart, clearCart, type CartItem } from "@/lib/cart";
import { saveOffertes } from "@/app/actions";
import { showToast } from "@/app/components/CenterToast";

function clean(v: unknown) {
  return String(v ?? "").replace(/-/g, " ").replace(/creon /gi, "").trim();
}

export default function OffertePagina() {
  const [items, setItems]   = useState<CartItem[]>([]);
  const [naam, setNaam]     = useState("");
  const [woonplaats, setWoonplaats] = useState("");
  const [telefoon, setTelefoon]     = useState("");
  const [email, setEmail]   = useState("");
  const [bezig, setBezig]   = useState(false);
  const [klaar, setKlaar]   = useState(false);

  useEffect(() => {
    const update = () => setItems(getCart());
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  const totaal = items.reduce((s, i) => s + i.prijs, 0);

  async function handleSubmit() {
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!naam.trim() || !emailOk) {
      showToast("Vul a.u.b. uw naam en een geldig e-mailadres in.", "error");
      return;
    }
    setBezig(true);
    const res = await saveOffertes({ naam, email, woonplaats, telefoon }, items);
    setBezig(false);
    if (res.success) {
      clearCart();
      setKlaar(true);
    } else {
      showToast("Er ging iets mis. Probeer het opnieuw.", "error");
    }
  }

  // ── Bevestiging ──────────────────────────────────────────────────────────────
  if (klaar) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-3">Offerte verstuurd!</h1>
        <p className="text-slate-500 mb-8">Bedankt {naam}, u ontvangt uw offerte op <strong>{email}</strong>.</p>
        <Link href="/" className="text-[#1066a3] font-semibold hover:underline">← Terug naar BartMooi</Link>
      </div>
    </div>
  );

  // ── Lege mand ─────────────────────────────────────────────────────────────────
  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-slate-500 mb-4">Uw offerte is nog leeg.</p>
        <Link href="/kozijnen" className="text-[#1066a3] font-semibold hover:underline">Begin met configureren →</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-1">Uw offerte</h1>
      <p className="text-slate-500 text-sm mb-8">{items.length} product{items.length !== 1 ? "en" : ""} in uw aanvraag</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Producten */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-bold text-slate-800">{item.product}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0" title="Verwijderen">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                  {item.specs.breedte && item.specs.hoogte && (
                    <span>{item.specs.breedte} × {item.specs.hoogte} mm</span>
                  )}
                  {item.specs.glas && <span>{clean(item.specs.glas)}</span>}
                  {item.specs.glasType && <span>{clean(item.specs.glasType)}</span>}
                  {item.specs.kleur && <span>{clean(item.specs.kleur)}</span>}
                  {item.specs.aantal && <span>{item.specs.aantal} stuks</span>}
                </div>
                <p className="text-[#1066a3] font-bold mt-3">
                  € {item.prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}

          <Link href="/kozijnen" className="block text-center text-sm text-[#1066a3] font-semibold hover:underline py-3">
            + Verder winkelen
          </Link>
        </div>

        {/* Samenvatting + formulier */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:sticky lg:top-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Totaal indicatie</span>
              <span className="text-2xl font-bold text-slate-800">€ {totaal.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="space-y-2">
              <input value={naam} onChange={e => setNaam(e.target.value)} placeholder="Naam"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
              <input value={woonplaats} onChange={e => setWoonplaats(e.target.value)} placeholder="Woonplaats"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
              <input type="tel" value={telefoon} onChange={e => setTelefoon(e.target.value)} placeholder="Telefoonnummer"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
            </div>

            <button disabled={bezig} onClick={handleSubmit}
              className="w-full bg-[#1066a3] text-white font-bold py-3.5 rounded-xl hover:bg-[#0d5491] transition-colors disabled:opacity-50">
              {bezig ? "Verzenden..." : "Offerte aanvragen"}
            </button>
            <p className="text-xs text-slate-400 text-center">Vrijblijvend · u ontvangt de offerte per e-mail</p>
          </div>
        </div>
      </div>
    </div>
  );
}
