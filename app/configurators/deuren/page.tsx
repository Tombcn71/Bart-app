"use client";
import { useState } from "react";
import Link from "next/link";
import { Wrench, ShieldCheck, Zap, Sparkles } from "lucide-react";

function FaqBlok({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Veelgestelde vragen</h3>
      <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
        {items.map((item, i) => (
          <div key={i}>
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-slate-50 transition-colors">
              <span className="text-sm font-semibold text-[#1a1a1a] pr-4">{item.q}</span>
              <span className="text-[#1066a3] font-bold text-lg shrink-0">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed bg-slate-50">{item.a}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
import { InmeetServiceCard } from "@/app/components/InmeetServiceCard";
import {
  SingleDoorBase, DoubleDoorBase,
  AchterdeurBovenlicht, VoordeurBovenlicht,
  AchterdeurBorstwering, AchterdeurBorstweringBovenlicht,
  DeurZijlicht, VoordeurZijlicht, DeurZijlichtBovenlicht,
  VoordeurZijlichtBovenlicht, DeurZijlichtBorstwering, DeurZijlichten,
  DubbeleDeurBovenlicht, DubbeleDeurZijlicht,
  DubbeleDeurZijlichtenBovenlichten, DubbeleDeurBorstweringBovenlicht,
} from "@/lib/deur-svgs";

export default function BartMooiDeurenConfigurator() {
  const [activeType, setActiveType] = useState("Enkele deur");

  const deuren = [
    // ── Enkele deur ───────────────────────────────────────────────────────────
    { id: 1,  category: "Enkele deur",  slug: "voordeur",                            name: "Voordeur",                                    best: true,  v: 1,   comp: <SingleDoorBase type="voordeur" /> },
    { id: 2,  category: "Enkele deur",  slug: "achterdeur",                          name: "Achterdeur",                                  best: true,  v: 1,   comp: <SingleDoorBase type="achterdeur" /> },
    { id: 3,  category: "Enkele deur",  slug: "voordeur-bovenlicht",                 name: "Voordeur met bovenlicht",                     best: true,  v: 1,   comp: <VoordeurBovenlicht /> },
    { id: 4,  category: "Enkele deur",  slug: "achterdeur-bovenlicht",               name: "Achterdeur met bovenlicht",                   best: true,  v: 1,   comp: <AchterdeurBovenlicht /> },
    { id: 5,  category: "Enkele deur",  slug: "achterdeur-borstwering",              name: "Achterdeur met borstwering",                  best: false, v: 1,   comp: <AchterdeurBorstwering /> },
    { id: 6,  category: "Enkele deur",  slug: "achterdeur-borstwering-bovenlicht",   name: "Achterdeur met borstwering en bovenlicht",    best: false, v: 1,   comp: <AchterdeurBorstweringBovenlicht /> },
    { id: 7,  category: "Enkele deur",  slug: "deur-zijlicht",                       name: "Deur met zijlicht",                           best: true,  v: 1.5, comp: <DeurZijlicht /> },
    { id: 8,  category: "Enkele deur",  slug: "voordeur-zijlicht",                   name: "Voordeur met zijlicht",                       best: true,  v: 1.5, comp: <VoordeurZijlicht /> },
    { id: 9,  category: "Enkele deur",  slug: "deur-zijlicht-bovenlicht",            name: "Deur met zijlicht en bovenlicht",             best: false, v: 1.5, comp: <DeurZijlichtBovenlicht /> },
    { id: 10, category: "Enkele deur",  slug: "voordeur-zijlicht-bovenlicht",        name: "Voordeur met zijlicht en bovenlicht",         best: false, v: 1.5, comp: <VoordeurZijlichtBovenlicht /> },
    { id: 11, category: "Enkele deur",  slug: "deur-zijlicht-borstwering",           name: "Deur met zijlicht en borstwering",            best: false, v: 1.5, comp: <DeurZijlichtBorstwering /> },
    { id: 12, category: "Enkele deur",  slug: "deur-zijlichten",                     name: "Deur met twee zijlichten",                    best: false, v: 1.8, comp: <DeurZijlichten /> },
    { id: 13, category: "Dubbele deur", slug: "dubbele-deur",                        name: "Dubbele deur",                                best: true,  v: 1.5, comp: <DoubleDoorBase /> },
    { id: 14, category: "Dubbele deur", slug: "dubbele-deur-zijlichten",             name: "Dubbele deur met zijlichten",                 best: true,  v: 1.8, comp: <DoubleDoorBase hasSideLights /> },
    { id: 15, category: "Dubbele deur", slug: "dubbele-deur-borstwering",            name: "Dubbele deur met borstwering",                best: true,  v: 1.5, comp: <DoubleDoorBase hasPlinth /> },
    { id: 16, category: "Dubbele deur", slug: "dubbele-deur-bovenlicht",             name: "Dubbele deur met bovenlicht",                 best: true,  v: 1.5, comp: <DubbeleDeurBovenlicht /> },
    { id: 17, category: "Dubbele deur", slug: "dubbele-deur-zijlicht",               name: "Dubbele deur met zijlicht",                   best: false, v: 1.8, comp: <DubbeleDeurZijlicht /> },
    { id: 18, category: "Dubbele deur", slug: "dubbele-deur-zijlichten-bovenlichten",name: "Dubbele deur met zijlichten en bovenlichten", best: false, v: 1.8, comp: <DubbeleDeurZijlichtenBovenlichten /> },
    { id: 19, category: "Dubbele deur", slug: "dubbele-deur-borstwering-bovenlicht", name: "Dubbele deur met borstwering en bovenlicht",  best: false, v: 1.5, comp: <DubbeleDeurBorstweringBovenlicht /> },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      {/* Header Section - Nu flexibel voor mobiel */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-[#1066a3] pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3 ">
            Kunststof deuren
          </h1>
          <p className="text-[#1066a3] font-medium text-sm md:text-xl uppercase tracking-tighter">
            Kies uw gewenste indeling{" "}
          </p>
        </div>

        <div className="w-full lg:w-auto">
          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest lg:text-right">
            In welk type deur ben je geïnteresseerd?
          </p>
          <div className="flex bg-[#f4f7f9] p-1 rounded-xl w-full lg:w-auto overflow-hidden">
            {["Enkele deur", "Dubbele deur"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex-1 lg:flex-none px-4 md:px-8 py-2.5 md:py-3 text-[11px] md:text-sm font-bold rounded-lg transition-colors ${
                  activeType === type
                    ? "bg-[#1066a3] text-white shadow-md"
                    : "text-[#666666]"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid - 1 kolom op mobiel, 2 op tablet, 3 op desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {deuren
          .filter((d) => d.category === activeType)
          .map((item) => (
            <Link
              href={`/deurconfigurator/${item.slug}`}
              key={item.id}
              className="group flex flex-col h-full">
              <div className="relative bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden min-h-[220px]">
                {item.best && (
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#1066a3] text-white text-[8px] md:text-[9px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full tracking-widest z-10 uppercase">
                    POPULAIR
                  </div>
                )}
                <div className="w-full flex justify-center">
                  <svg viewBox={`0 0 ${item.v * 100} 160`} className="w-full h-auto" style={{ maxWidth: item.v > 1.4 ? "100%" : "60%" }}>
                    {item.comp}
                  </svg>
                </div>
              </div>

              <div className="mt-4 md:mt-6 text-center">
                <h3 className="font-bold text-[#1a1a1a] text-sm md:text-base uppercase tracking-tight leading-tight">
                  {item.name}
                </h3>
                <div className="mt-1 md:mt-2 text-[10px] font-bold text-[#1066a3] uppercase tracking-widest lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  Stel nu samen →
                </div>
              </div>
            </Link>
          ))}
        <div className="col-span-full border-t border-slate-100 mt-4" />
        <InmeetServiceCard />
      </div>

      {/* ── Info & FAQ ── */}
      <div className="max-w-[1200px] mx-auto px-6 pb-20 mt-16">
        <div className="border-t border-slate-100 pt-14">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4 leading-tight">Kunststof deuren — De ideale balans: Stijl, Veiligheid &amp; Comfort</h2>
            <p className="text-slate-600 leading-relaxed">Een huis dat niet alleen fantastisch oogt, maar ook je maandlasten structureel verlaagt. Investeren in nieuwe kunststof deuren is een keuze waar je elke dag plezier van hebt. Wij ontzorgen je hierin volledig: van inmeten tot de vakkundige montage op locatie.</p>
          </div>
          <div className="mb-14">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">Waarom onze deuren de slimste keuze zijn</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Wrench size={20} />, title: "Vakkundige Montage", text: "Geen gedoe of zorgen over technische details. Onze ervaren monteurs zorgen voor een perfecte installatie, waardoor je verzekerd bent van een naadloos resultaat en optimale isolatie." },
                { icon: <ShieldCheck size={20} />, title: "Maximale Inbraakveiligheid", text: "Je huis is je veilige haven. Daarom zijn onze deuren standaard uitgerust met hoogwaardige meerpuntsluitingen en versterkte profielen, vakkundig geplaatst voor maximale inbraakwering." },
                { icon: <Zap size={20} />, title: "Directe Energiebesparing", text: "Dankzij onze hoogwaardige profielen en de tochtvrije montage blijft de warmte binnen en de kou buiten. Je merkt het direct aan een structureel lagere energierekening." },
                { icon: <Sparkles size={20} />, title: "Onderhoudsvrij Genieten", text: "Zeg vaarwel tegen schuurpapier en verfkwasten. Kunststof is ongevoelig voor vocht, rot niet en behoudt jarenlang zijn kleur. Een doekje erover is alles wat je nodig hebt." },
              ].map((b, i) => (
                <div key={i} className="flex gap-4 bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <div className="text-[#1066a3] shrink-0 mt-0.5">{b.icon}</div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a] text-sm mb-1">{b.title}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <FaqBlok items={[
            { q: "Wat houdt een kunststof deur precies in?", a: "Dit zijn hoogwaardige deuren van duurzaam kunststof. Ze bieden optimale isolatie, veiligheid en een jarenlange levensduur zonder dat er ooit schilderwerk nodig is." },
            { q: "Wat houdt de montage in?", a: "Wij nemen het volledige traject uit handen. Van de eerste inmeting tot de definitieve plaatsing door onze vakkundige monteurs; wij zorgen ervoor dat jouw nieuwe deur perfect functioneert." },
            { q: "Waarom is kunststof de populairste keuze?", a: "Het is de ideale combinatie van gemak en comfort. Ze isoleren uitstekend tegen temperatuur en geluid, zijn weerbestendig en vergen nagenoeg geen onderhoud." },
            { q: "Is glas in mijn nieuwe deur mogelijk?", a: "Zeker. Je kunt kiezen uit diverse soorten isolatieglas. Dit vergroot de lichtinval en verhoogt de energie-efficiëntie van je woning aanzienlijk." },
            { q: "Uit welke kleuren kan ik kiezen?", a: "Naast standaard wit en crème, zijn er vele mogelijkheden met folieafwerkingen, zoals stijlvolle houtnerfstructuren of moderne antracietkleuren." },
            { q: "Hoe veilig zijn de deuren?", a: "Veiligheid staat voorop. Onze deuren worden standaard geleverd met een robuuste 3-puntsluiting en degelijk beslag. Onze vakkundige montage garandeert dat deze inbraakwerendheid optimaal benut wordt." },
            { q: "Is er veel onderhoud nodig?", a: "Integendeel. Een kunststof deur is extreem onderhoudsarm. Een regelmatige poetsbeurt met water en een mild reinigingsmiddel is meestal voldoende om de deur in topconditie te houden." },
            { q: "Hoe verloopt het proces na mijn bestelling?", a: "Zodra je de bestelling bevestigt, wordt de deur op maat geproduceerd. Vervolgens nemen we contact met je op voor het inplannen van de vakkundige montage op jouw locatie." },
          ]} />
        </div>
      </div>
    </div>
  );
}
