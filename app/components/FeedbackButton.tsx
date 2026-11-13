"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bug, CheckCircle, Euro, Heart, Lightbulb, Loader2, Send, X, type LucideIcon } from "lucide-react";

// De vragen in het tekstvak sturen naar bruikbare feedback van een kozijnbedrijf.
const CATEGORIEEN: { value: string; label: string; vraag: string; Icon: LucideIcon }[] = [
  {
    value: "prijs",
    label: "Prijs klopt niet",
    vraag: "Welke offerte? Wat had de prijs moeten zijn, en waarom? (bijv. toeslag, maat of kleur)",
    Icon: Euro,
  },
  {
    value: "bug",
    label: "Iets werkt niet",
    vraag: "Wat deed je en wat ging er mis? (bijv. 'de mail kwam niet aan', 'de foto laadt niet')",
    Icon: Bug,
  },
  {
    value: "idee",
    label: "Idee of wens",
    vraag: "Wat zou je werk makkelijker maken? (bijv. een extra knop, een andere tekst in de mail)",
    Icon: Lightbulb,
  },
  { value: "compliment", label: "Compliment", vraag: "Wat bevalt je aan de app?", Icon: Heart },
];

/** Het tabje "Feedback" aan de rechterkant: Bart stuurt zijn feedback direct naar Tom. */
export function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [categorie, setCategorie] = useState("idee");
  const [bericht, setBericht] = useState("");
  const [magReageren, setMagReageren] = useState(true);
  const [loading, setLoading] = useState(false);
  const [verstuurd, setVerstuurd] = useState(false);

  const gekozen = CATEGORIEEN.find((c) => c.value === categorie) ?? CATEGORIEEN[2];

  const verstuur = async () => {
    if (!bericht.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categorie, bericht, magReageren, pagina: pathname }),
      });
      if (!response.ok) throw new Error("Feedback versturen mislukt");
      setVerstuurd(true);
      setBericht("");
      setTimeout(() => {
        setVerstuurd(false);
        setOpen(false);
      }, 2500);
    } catch {
      alert("Versturen mislukt, probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const formHeader = (
    <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">Feedback over je app</p>
        <p className="mt-0.5 text-xs text-slate-500">Gaat direct naar Tom.</p>
      </div>
      <button
        type="button"
        aria-label="Feedbackformulier sluiten"
        onClick={() => setOpen(false)}
        className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all hover:bg-red-100 hover:text-red-500">
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );

  const formInhoud = verstuurd ? (
    <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center text-brand-text">
      <CheckCircle size={32} />
      <p className="text-sm font-semibold">Bedankt!</p>
      <p className="text-xs text-slate-500">
        {magReageren ? "Ik kijk ernaar en neem contact met je op als ik een vraag heb." : "Ik kijk ernaar."}
      </p>
    </div>
  ) : (
    <div className="space-y-4 p-5">
      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">Waar gaat het over?</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIEEN.map((c) => (
            <button
              type="button"
              key={c.value}
              onClick={() => setCategorie(c.value)}
              aria-pressed={categorie === c.value}
              className={`rounded-full border-2 px-2 py-2 text-xs font-medium transition-all ${
                categorie === c.value ? "border-brand bg-slate-50 text-slate-900" : "border-slate-200 text-slate-500 hover:border-slate-300"
              }`}>
              <span className="inline-flex items-center gap-1.5">
                <c.Icon className="size-3.5" />
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={bericht}
        onChange={(e) => setBericht(e.target.value)}
        placeholder={gekozen.vraag}
        aria-label="Je feedback"
        rows={5}
        // 16px: anders zoomt een iPhone in op het tekstvak
        className="w-full resize-none rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 text-base outline-none transition-all placeholder:text-slate-400 focus:border-brand focus:bg-white sm:text-sm"
      />
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={magReageren}
          onChange={(e) => setMagReageren(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[#1E5079]"
        />
        <span className="text-xs leading-tight text-slate-500">Tom mag me hierover mailen of bellen</span>
      </label>

      <button
        type="button"
        onClick={verstuur}
        disabled={!bericht.trim() || loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-semibold text-white transition-all hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40">
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        {loading ? "Versturen..." : "Versturen"}
      </button>
    </div>
  );

  const tabKnop = (onClick: () => void) => (
    <button
      type="button"
      aria-expanded={open}
      onClick={onClick}
      className="flex shrink-0 items-center justify-center rounded-l-xl bg-brand text-white transition-all hover:bg-brand-dark"
      style={{ width: "42px", height: "110px" }}>
      <span className="text-xs font-semibold tracking-wide whitespace-nowrap" style={{ transform: "rotate(-90deg)" }}>
        Feedback
      </span>
    </button>
  );

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-white/70 backdrop-blur-md sm:hidden" onClick={() => setOpen(false)} />}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:hidden">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white shadow-2xl">
            {formHeader}
            {formInhoud}
          </div>
        </div>
      )}

      <div className="fixed top-2/3 right-0 z-50 hidden -translate-y-1/2 items-center sm:flex">
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "w-80 opacity-100" : "w-0 opacity-0"}`}>
          <div className="w-80 rounded-l-3xl border border-slate-200 bg-white shadow-xl">
            {formHeader}
            {formInhoud}
          </div>
        </div>
        {tabKnop(() => setOpen((v) => !v))}
      </div>

      {!open && <div className="fixed top-2/3 right-0 z-50 -translate-y-1/2 sm:hidden">{tabKnop(() => setOpen(true))}</div>}
    </>
  );
}
