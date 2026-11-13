"use client";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import Link from "next/link";
import { getCart, removeFromCart, clearCart, updateCartItem, type CartItem } from "@/lib/cart";
import { saveOffertes } from "@/app/actions";
import { useBron } from "@/lib/use-bron";
import { showToast } from "@/app/components/CenterToast";

function clean(v: unknown) {
  return String(v ?? "").replace(/-/g, " ").replace(/creon /gi, "").trim();
}

export default function OffertePagina() {
  const bron = useBron();
  // Inmeten (Onspot): de vakman vult bij de klant de gegevens in en mailt de offerte ter plekke.
  const inmeten = bron === "onspot";
  const [items, setItems]   = useState<CartItem[]>([]);
  const [adres, setAdres]   = useState("");
  const [naam, setNaam]     = useState("");
  const [woonplaats, setWoonplaats] = useState("");
  const [telefoon, setTelefoon]     = useState("");
  const [email, setEmail]   = useState("");
  const [bedrijfsnaam, setBedrijfsnaam] = useState("");
  const [bezig, setBezig]   = useState(false);
  const [klaar, setKlaar]   = useState(false);

  useEffect(() => {
    const update = () => setItems(getCart());
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, [bron]);

  const totaal = items.reduce((s, i) => s + i.prijs, 0);
  // Zakelijke klanten zien de prijs exclusief btw, met de btw apart.
  const zakelijk = items.some((i) => i.specs.klantType === "zakelijk");
  const particulier = items.some((i) => i.specs.klantType === "particulier");
  const btwPct = Number(items.find((i) => i.specs.btwPercentage)?.specs.btwPercentage ?? 0);
  const btwBedrag = Math.round(totaal * btwPct) / 100;
  const eur = (n: number) => `€ ${n.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}`;

  async function handleSubmit() {
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    if (!naam.trim() || !emailOk) {
      showToast(inmeten ? "Vul de naam en een geldig e-mailadres van de klant in." : "Vul a.u.b. uw naam en een geldig e-mailadres in.", "error");
      return;
    }
    setBezig(true);
    const klantNaam = zakelijk && bedrijfsnaam.trim() ? `${naam.trim()} (${bedrijfsnaam.trim()})` : naam;
    const res = await saveOffertes({ naam: klantNaam, email, woonplaats, telefoon, adres }, items, bron);
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
        {inmeten ? (
          <>
            <p className="text-slate-500 mb-8">De offerte staat in de mailbox van {naam} (<strong>{email}</strong>), met de akkoordknop.</p>
            <NextLink href="/meten" className="inline-block bg-brand text-white font-bold px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors">Terug naar de app</NextLink>
          </>
        ) : (
          <>
            <p className="text-slate-500 mb-8">Bedankt {naam}, u ontvangt uw offerte op <strong>{email}</strong>.</p>
            <Link href="/" className="text-brand-text font-semibold hover:underline">← Terug naar BartMooi</Link>
          </>
        )}
      </div>
    </div>
  );

  // ── Lege mand ─────────────────────────────────────────────────────────────────
  if (items.length === 0) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-slate-500 mb-4">{inmeten ? "Nog geen ramen ingevoerd." : "Uw offerte is nog leeg."}</p>
        <Link href="/kozijnen" className="text-brand-text font-semibold hover:underline">Begin met configureren →</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8 md:py-12 pb-32 lg:pb-12">
      <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-1">{inmeten ? "Offerte bij de klant" : "Uw offerte"}</h1>
      <p className="text-slate-500 text-sm mb-8">
        {items.length} {inmeten ? (items.length === 1 ? "raam" : "ramen") : `product${items.length !== 1 ? "en" : ""}`} in {inmeten ? "deze offerte" : "uw aanvraag"}
      </p>

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
                <p className="text-brand-text font-bold mt-3">
                  € {item.prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </p>
                {inmeten && (
                  <textarea
                    value={item.notitie ?? ""}
                    onChange={e => updateCartItem(item.id, { notitie: e.target.value.slice(0, 500) })}
                    placeholder="Notitie bij dit raam, bijv. keuken, draairichting links"
                    rows={2}
                    className="mt-3 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
                )}
              </div>
            </div>
          ))}

          <Link href="/kozijnen" className="block text-center text-sm text-brand-text font-semibold hover:underline py-3">
            {inmeten ? "+ Nog een raam" : "+ Verder winkelen"}
          </Link>
        </div>

        {/* Samenvatting + formulier */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm lg:sticky lg:top-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Totaal indicatie{zakelijk ? " excl. btw" : particulier ? " incl. btw" : ""}</span>
              <span className="text-2xl font-bold text-slate-800">€ {totaal.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}</span>
            </div>
            {zakelijk && btwPct > 0 && (
              <p className="text-right text-xs text-slate-500">
                + {btwPct}% btw {eur(btwBedrag)} = {eur(totaal + btwBedrag)} incl. btw
              </p>
            )}

            <div className="space-y-2">
              {inmeten && <p className="text-sm font-semibold text-slate-700">Gegevens van de klant</p>}
              <input value={naam} onChange={e => setNaam(e.target.value)} placeholder="Naam"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              {zakelijk && (
                <input value={bedrijfsnaam} onChange={e => setBedrijfsnaam(e.target.value)} placeholder="Bedrijfsnaam"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              )}
              {inmeten && (
                <input value={adres} onChange={e => setAdres(e.target.value)} placeholder="Straat en huisnummer"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              )}
              <input value={woonplaats} onChange={e => setWoonplaats(e.target.value)} placeholder="Woonplaats"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="tel" value={telefoon} onChange={e => setTelefoon(e.target.value)} placeholder="Telefoonnummer"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mailadres"
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand" />
            </div>

            {/* Op de telefoon zweeft de knop onderaan, zodat de klant niet denkt dat hij klaar is bij het zien van de prijs. */}
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              {!email.trim() && (
                <p className="mb-1.5 text-center text-xs font-semibold text-slate-700 lg:hidden">Vul uw e-mailadres in om de offerte te ontvangen</p>
              )}
              <button disabled={bezig} onClick={handleSubmit}
                className="w-full bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50">
                {bezig ? "Verzenden..." : inmeten ? "Offerte mailen met akkoordknop" : "Offerte aanvragen"}
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center">
              {inmeten ? "De klant krijgt de offerte direct en kan meteen digitaal akkoord geven" : "Vrijblijvend · u ontvangt de offerte per e-mail"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
