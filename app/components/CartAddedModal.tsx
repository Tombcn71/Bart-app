"use client";
import { useState } from "react";
import Link from "next/link";
import { getCart, clearCart } from "@/lib/cart";
import { saveOffertes } from "@/app/actions";
import { showToast } from "@/app/components/CenterToast";

interface Props {
  open: boolean;
  onClose: () => void;
  product: string;
  breedte?: number;
  hoogte?: number;
  aantal?: number;
  prijs: number;
  onAddAnother: () => void;
  cartCount: number;
}

const CATEGORIEEN = [
  { label: "Kozijnen", href: "/kozijnen" },
  { label: "Deuren", href: "/deuren" },
  { label: "Schuifpui", href: "/schuifpui" },
  { label: "Harmonicadeur", href: "/harmonicadeur" },
  { label: "Horren", href: "/horren" },
  { label: "Rolluiken", href: "/rolluiken" },
];

export function CartAddedModal({ open, onClose, product, breedte, hoogte, aantal = 1, prijs, cartCount }: Props) {
  const [naam, setNaam] = useState("");
  const [woonplaats, setWoonplaats] = useState("");
  const [email, setEmail] = useState("");
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!naam.trim() || !emailOk) {
      showToast("Vul a.u.b. uw naam en een geldig e-mailadres in.", "error");
      return;
    }
    setBezig(true);
    const res = await saveOffertes({ naam, email, woonplaats }, getCart());
    setBezig(false);
    if (res.success) { clearCart(); setKlaar(true); }
    else showToast("Er ging iets mis. Probeer opnieuw.", "error");
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-8 mb-8 overflow-hidden">

        {/* Banner */}
        <div className="bg-[#1066a3] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white font-bold">
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            {klaar ? "Offerte verstuurd!" : "Toegevoegd aan uw offerte!"}
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {klaar ? (
          <div className="p-8 text-center">
            <p className="text-slate-700 mb-2">Bedankt <strong>{naam}</strong>!</p>
            <p className="text-slate-500 text-sm">U ontvangt uw offerte met subsidie-indicatie op <strong>{email}</strong>.</p>
            <Link href="/" onClick={onClose} className="inline-block mt-6 text-[#1066a3] font-semibold hover:underline">← Terug naar BartMooi</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">

            {/* Product (mand) */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{product}</h3>
              {breedte && hoogte && (
                <div className="text-sm text-slate-500 space-y-1 mb-4">
                  <div className="flex justify-between"><span>Buitenwerkse breedte:</span><strong className="text-slate-700">{breedte} mm</strong></div>
                  <div className="flex justify-between"><span>Buitenwerkse hoogte:</span><strong className="text-slate-700">{hoogte} mm</strong></div>
                </div>
              )}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-slate-500">{aantal} stuks{cartCount > 1 ? ` · ${cartCount} in offerte` : ""}</span>
                <span className="text-2xl font-bold text-slate-800">€ {prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
              </div>

              {/* Links naar artikelen */}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Meer artikelen toevoegen</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIEEN.map((c) => (
                  <Link key={c.href} href={c.href} onClick={onClose}
                    className="text-xs font-semibold text-[#1066a3] border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition-colors">
                    + {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Formulier */}
            <div className="flex flex-col gap-2">
              <input value={naam} onChange={e => setNaam(e.target.value)} placeholder="Naam"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
              <input value={woonplaats} onChange={e => setWoonplaats(e.target.value)} placeholder="Woonplaats"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]" />

              <button onClick={handleSubmit} disabled={bezig}
                className="bg-[#16a34a] hover:bg-[#15873f] text-white font-bold text-center py-3.5 rounded-xl transition-colors disabled:opacity-50 mt-1">
                {bezig ? "Verzenden..." : `Offerte aanvragen${cartCount > 1 ? ` (${cartCount})` : ""}`}
              </button>
              <p className="text-[11px] text-slate-400 text-center">Vrijblijvend · u ontvangt de offerte per e-mail</p>
            </div>
          </div>
        )}

        {/* Subsidie hook */}
        {!klaar && (
          <div className="bg-slate-50 border-t border-slate-100 px-6 py-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              💰 Vraag uw offerte aan en ontvang direct uw persoonlijke <strong>ISDE subsidie-indicatie</strong> en complete offerte met technische tekening per e-mail.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
