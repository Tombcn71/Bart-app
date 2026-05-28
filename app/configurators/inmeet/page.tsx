"use client";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function InmeetPage() {
  const [postcode, setPostcode] = useState("");
  const [datum, setDatum] = useState("");
  const [naam, setNaam] = useState("");
  const [adres, setAdres] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [email, setEmail] = useState("");
  const [akkoord, setAkkoord] = useState(false);
  const [verzonden, setVerzonden] = useState(false);

  const handleVerzenden = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setVerzonden(true);
  };

  if (verzonden) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
          <CheckCircle2 size={56} className="text-[#1066a3] mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-800 mb-2">Aanvraag ontvangen!</h2>
          <p className="text-slate-500 text-sm">
            We nemen zo spoedig mogelijk contact met u op om de afspraak te bevestigen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">

        {/* Mobile: form boven, tekst onder — Desktop: tekst links, form rechts */}
        <div className="flex flex-col md:flex-row md:gap-12 md:items-start">

          {/* LINKS: tekst — op mobile ONDERAAN via order */}
          <div className="order-2 md:order-1 md:w-2/5 mt-10 md:mt-0 md:sticky md:top-8">
            <div className="mb-6 border-l-4 border-[#1066a3] pl-5">
              <h1 className="text-3xl font-black text-slate-800 mb-2">Inmeet service</h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                Plan een inmeetafspraak en onze vakman zorgt voor de exacte maten van al uw kozijnen.
              </p>
            </div>

            <div className="bg-[#e0f2fe] border-2 border-[#1066a3] rounded-xl p-4 mb-6">
              <p className="text-[#1066a3] font-bold text-sm flex items-start gap-2">
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                Vakkundige inmeting aan huis — slechts <strong>€ 49,99</strong> incl. BTW, ongeacht het aantal kozijnen
              </p>
            </div>

            <div className="space-y-3">
              {[
                { n: 1, title: "Afspraak inplannen", desc: "Vul uw postcode in en kies een datum. U ontvangt tijdig bericht wanneer onze medewerker onderweg is." },
                { n: 2, title: "Inmeting aan huis", desc: "Onze vakman meet alle kozijnen zorgvuldig in. Wees zelf aanwezig samen met de plaatser." },
                { n: 3, title: "Resultaat binnen 2–3 dagen", desc: "U ontvangt de resultaten van de meting per e-mail." },
              ].map((s) => (
                <div key={s.n} className="bg-white rounded-xl border border-slate-100 p-4 flex gap-3 shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-[#1066a3] text-white flex items-center justify-center font-black text-xs shrink-0">{s.n}</div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm mb-0.5">{s.title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECHTS: form — op mobile BOVENAAN via order */}
          <div className="order-1 md:order-2 md:w-3/5">
            <form onSubmit={handleVerzenden} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-5">
              <h2 className="text-xl font-black text-slate-800">Uw gegevens</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Naam *</label>
                  <input required value={naam} onChange={e => setNaam(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#1066a3]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Telefoon *</label>
                  <input required value={telefoon} onChange={e => setTelefoon(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#1066a3]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">E-mail *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#1066a3]" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Postcode *</label>
                  <input required value={postcode} onChange={e => setPostcode(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#1066a3]" placeholder="1234 AB" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Adres *</label>
                  <input required value={adres} onChange={e => setAdres(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#1066a3]" placeholder="Straat + huisnummer" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-800 mb-3">Gewenste datum</h2>
                <input
                  required
                  type="date"
                  value={datum}
                  onChange={e => setDatum(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-[#1066a3]"
                />
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-2xl font-black text-slate-800 mb-3">
                  € 49,99 <span className="text-sm font-normal text-slate-400">incl. BTW</span>
                </p>
                <label className="flex items-start gap-2 mb-5 cursor-pointer">
                  <input type="checkbox" required checked={akkoord} onChange={e => setAkkoord(e.target.checked)} className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-500">Ik ga akkoord met de voorwaarden van de inmeet service</span>
                </label>
                <button
                  type="submit"
                  className="w-full bg-[#1066a3] hover:bg-[#0d5282] text-white font-black py-3.5 rounded-xl text-sm uppercase tracking-widest transition-colors">
                  Plan afspraak
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
