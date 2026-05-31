"use client";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  product: string;
  breedte?: number;
  hoogte?: number;
  aantal?: number;
  prijs: number;
  /** "Nog een ... toevoegen" sluit de modal en blijft op de configurator */
  onAddAnother: () => void;
  /** Aantal items in de mand (voor knoptekst) */
  cartCount: number;
}

export function CartAddedModal({
  open, onClose, product, breedte, hoogte, aantal = 1, prijs, onAddAnother, cartCount,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mt-10 mb-10 overflow-hidden">

        {/* Banner */}
        <div className="bg-[#1066a3] px-6 py-4 flex items-center justify-between">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">

          {/* Product info */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{product}</h3>
            {breedte && hoogte && (
              <div className="text-sm text-slate-500 space-y-1 mb-4">
                <div className="flex justify-between"><span>Buitenwerkse breedte:</span><strong className="text-slate-700">{breedte} mm</strong></div>
                <div className="flex justify-between"><span>Buitenwerkse hoogte:</span><strong className="text-slate-700">{hoogte} mm</strong></div>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">{aantal} stuks</span>
              <span className="text-2xl font-bold text-slate-800">€ {prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Acties */}
          <div className="flex flex-col gap-3">
            <Link href="/offerte"
              className="bg-[#16a34a] hover:bg-[#15873f] text-white font-bold text-center py-4 rounded-xl transition-colors">
              Offerte aanvragen{cartCount > 1 ? ` (${cartCount})` : ""}
            </Link>
            <button onClick={onAddAnother}
              className="border border-slate-200 text-slate-700 font-semibold text-center py-3.5 rounded-xl hover:bg-slate-50 transition-colors text-sm">
              Nog een {product.length > 22 ? product.slice(0, 22) + "…" : product} toevoegen
            </button>
            <Link href="/" onClick={onClose}
              className="text-center text-sm text-slate-500 hover:text-[#1066a3] underline py-1">
              Verder winkelen
            </Link>
          </div>
        </div>

        {/* Subsidie hook */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div>
              <p className="font-bold text-slate-800 text-sm">Verlies uw subsidieberekening niet</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Vraag uw offerte aan en ontvang direct uw persoonlijke <strong>ISDE subsidie-indicatie</strong> en complete offerte met technische tekening per e-mail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
