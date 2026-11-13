"use client";
import { useState } from "react";
import Link from "next/link";
import { getCart, clearCart } from "@/lib/cart";
import { saveOffertes } from "@/app/actions";
import { showToast } from "@/app/components/CenterToast";
import { useBron } from "@/lib/use-bron";
import { FileCheck, PiggyBank } from "lucide-react";

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
  const bron = useBron();
  const [naam, setNaam] = useState("");
  const [woonplaats, setWoonplaats] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [bezig, setBezig] = useState(false);
  const [klaar, setKlaar] = useState(false);
  const [offerteId, setOfferteId] = useState<string | null>(null);
  if (!open) return null;

  // Inmeten (Onspot): geen klantformulier hier; de vakman verstuurt alles vanaf de offertepagina.
  if (bron === "onspot") return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
        <p className="text-lg font-bold text-slate-800">Raam toegevoegd</p>
        <p className="text-sm text-slate-500 mt-1">
          {product}{breedte && hoogte ? ` · ${breedte} × ${hoogte} mm` : ""} · {cartCount} {cartCount === 1 ? "raam" : "ramen"} in deze offerte
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button onClick={onClose}
            className="border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Nog een raam
          </button>
          <Link href="/offerte" onClick={onClose}
            className="bg-brand text-white rounded-xl py-3 text-sm font-bold hover:bg-brand-dark">
            Naar offerte
          </Link>
        </div>
      </div>
    </div>
  );

  async function handleSubmit() {
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    const telOk = telefoon.replace(/\D/g, "").length >= 8;
    if (!naam.trim() || !emailOk || !telOk) {
      showToast("Vul a.u.b. uw naam, een geldig e-mailadres en uw telefoonnummer in.", "error");
      return;
    }
    setBezig(true);
    const res = await saveOffertes({ naam, email, woonplaats, telefoon }, getCart(), bron);
    setBezig(false);
    if (res.success) { clearCart(); setOfferteId(("offerteId" in res && res.offerteId) || null); setKlaar(true); }
    else showToast("Er ging iets mis. Probeer opnieuw.", "error");
  }

  // Na het aanvragen: een eigen eindscherm in dezelfde stijl als het beginscherm, met alleen de knop naar de offerte.
  if (klaar) return (
    <div className="fixed inset-0 z-[9999] isolate overflow-y-auto bg-brand-dark">
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-24 -z-10 size-96 rounded-full bg-brand/60 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 -bottom-32 -z-10 size-96 rounded-full bg-brand/50 blur-3xl" />
      <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center px-6 py-10 text-center">
        <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-white text-brand-text shadow-xl shadow-black/20 md:size-20">
          <FileCheck className="size-8 md:size-10" />
        </span>
        <h1 className="text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-5xl">Bekijk uw offerte</h1>
        <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg">
          Bedankt{naam.trim() ? `, ${naam.trim()}` : ""}! Uw offerte staat klaar. Zie uw kozijn als tekening en als foto op een gevel, en deel hem met wie u wilt.
        </p>
        {offerteId && (
          <a href={`/offerte/${offerteId}`} target="_blank" rel="noopener"
            className="mt-9 w-full rounded-full bg-white px-10 py-4 text-base font-bold text-brand-text shadow-xl shadow-black/20 transition hover:scale-[1.02] active:scale-[0.98] sm:w-auto">
            Bekijk nu
          </a>
        )}
        <p className="mt-6 text-xs leading-relaxed text-white/75">
          We sturen hem ook naar <strong className="text-white">{email}</strong>. Niets ontvangen? Kijk in uw map Ongewenst en tik op &lsquo;Geen ongewenste e-mail&rsquo;.
        </p>
        <Link href="/" onClick={onClose} className="mt-6 text-sm font-semibold text-white/90 hover:underline">← Terug naar BartMooi</Link>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-8 mb-8 overflow-hidden">

        {/* Banner */}
        <div className="bg-brand px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white font-bold">
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            Toegevoegd aan uw offerte!
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {(
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
                    className="text-xs font-semibold text-brand-text border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition-colors">
                    + {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Formulier */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-1">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" className="flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-xs font-semibold text-green-800">Bij ons is montage in de prijs inbegrepen</span>
              </div>
              <input value={naam} onChange={e => setNaam(e.target.value)} placeholder="Naam"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <input value={woonplaats} onChange={e => setWoonplaats(e.target.value)} placeholder="Woonplaats"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="tel" value={telefoon} onChange={e => setTelefoon(e.target.value)} placeholder="Telefoonnummer"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />

              <button onClick={handleSubmit} disabled={bezig}
                className="bg-brand hover:bg-brand-dark text-white font-bold text-center py-2.5 rounded-lg transition-colors disabled:opacity-50 mt-1 text-sm">
                {bezig ? "Verzenden..." : `Offerte aanvragen${cartCount > 1 ? ` (${cartCount})` : ""}`}
              </button>
              <p className="text-[11px] text-slate-400 text-center">Vrijblijvend · u ontvangt de offerte per e-mail</p>
            </div>
          </div>
        )}

        {/* Subsidie hook */}
        {true && (
          <div className="bg-green-50 border-t border-green-100 px-6 py-4">
            <p className="text-xs text-green-800 leading-relaxed flex items-start gap-2">
              <PiggyBank size={16} className="shrink-0" />
              <span>Vraag uw offerte aan en ontvang direct uw persoonlijke <strong>ISDE subsidie-indicatie</strong> en complete offerte met technische tekening per e-mail.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
