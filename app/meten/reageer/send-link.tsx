"use client";

import { useState } from "react";
import { Check, Copy, Mail, MessageCircle } from "lucide-react";

/** Eén kort bericht met het linkje, te versturen via WhatsApp, mail of kopiëren. */
export function SendLink({ defaultMessage }: { defaultMessage: string }) {
  const [message, setMessage] = useState(defaultMessage);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* klembord niet beschikbaar */
    }
  }

  const knop = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold transition";

  return (
    <div className="space-y-3">
      <textarea
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-xl border border-slate-300 p-3 text-base focus:outline-none focus:ring-2 focus:ring-brand"
      />
      <div className="grid grid-cols-3 gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener"
          className={`${knop} bg-[#25D366] text-white hover:bg-[#1ebe5b]`}>
          <MessageCircle className="size-4" /> WhatsApp
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent("Uw offerte van BartMooi")}&body=${encodeURIComponent(message)}`}
          className={`${knop} bg-brand text-white hover:bg-brand-dark`}>
          <Mail className="size-4" /> Mail
        </a>
        <button type="button" onClick={copy} className={`${knop} border border-slate-300 text-slate-700 hover:bg-slate-50`}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Gekopieerd" : "Kopieer"}
        </button>
      </div>
    </div>
  );
}
