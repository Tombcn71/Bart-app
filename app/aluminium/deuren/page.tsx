"use client";
import { useState } from "react";
import Link from "next/link";
import { InmeetServiceCard } from "@/app/components/InmeetServiceCard";
import { Wrench, Recycle, Building2, Sparkles } from "lucide-react";

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
import {
  SingleDoorBase, DoubleDoorBase, AchterdeurBovenlicht, VoordeurBovenlicht,
  AchterdeurBorstwering, AchterdeurBorstweringBovenlicht, DeurZijlicht,
  VoordeurZijlicht, DeurZijlichtBovenlicht, VoordeurZijlichtBovenlicht,
  DeurZijlichtBorstwering, DeurZijlichten, DubbeleDeurBovenlicht,
  DubbeleDeurZijlicht, DubbeleDeurZijlichtenBovenlichten, DubbeleDeurBorstweringBovenlicht,
} from "@/lib/deur-svgs";

const deuren = [
  { id: 1,  category: "Enkele deur",  slug: "voordeur",                          name: "Voordeur",                                    best: true,  v: 1,   components: <SingleDoorBase type="voordeur" /> },
  { id: 2,  category: "Enkele deur",  slug: "achterdeur",                        name: "Achterdeur",                                  best: true,  v: 1,   components: <SingleDoorBase type="achterdeur" /> },
  { id: 3,  category: "Enkele deur",  slug: "voordeur-bovenlicht",               name: "Voordeur met bovenlicht",                     best: true,  v: 1,   components: <VoordeurBovenlicht /> },
  { id: 4,  category: "Enkele deur",  slug: "achterdeur-bovenlicht",             name: "Achterdeur met bovenlicht",                   best: true,  v: 1,   components: <AchterdeurBovenlicht /> },
  { id: 5,  category: "Enkele deur",  slug: "achterdeur-borstwering",            name: "Achterdeur met borstwering",                  best: false, v: 1,   components: <AchterdeurBorstwering /> },
  { id: 6,  category: "Enkele deur",  slug: "achterdeur-borstwering-bovenlicht", name: "Achterdeur met borstwering en bovenlicht",    best: false, v: 1,   components: <AchterdeurBorstweringBovenlicht /> },
  { id: 7,  category: "Enkele deur",  slug: "deur-zijlicht",                     name: "Deur met zijlicht",                           best: true,  v: 1.5, components: <DeurZijlicht /> },
  { id: 8,  category: "Enkele deur",  slug: "voordeur-zijlicht",                 name: "Voordeur met zijlicht",                       best: true,  v: 1.5, components: <VoordeurZijlicht /> },
  { id: 9,  category: "Enkele deur",  slug: "deur-zijlicht-bovenlicht",          name: "Deur met zijlicht en bovenlicht",             best: false, v: 1.5, components: <DeurZijlichtBovenlicht /> },
  { id: 10, category: "Enkele deur",  slug: "voordeur-zijlicht-bovenlicht",      name: "Voordeur met zijlicht en bovenlicht",         best: false, v: 1.5, components: <VoordeurZijlichtBovenlicht /> },
  { id: 11, category: "Enkele deur",  slug: "deur-zijlicht-borstwering",         name: "Deur met zijlicht en borstwering",            best: false, v: 1.5, components: <DeurZijlichtBorstwering /> },
  { id: 12, category: "Enkele deur",  slug: "deur-zijlichten",                   name: "Deur met twee zijlichten",                    best: false, v: 1.8, components: <DeurZijlichten /> },
  { id: 13, category: "Dubbele deur", slug: "dubbele-deur",                      name: "Dubbele deur",                                best: true,  v: 1,   components: <DoubleDoorBase /> },
  { id: 14, category: "Dubbele deur", slug: "dubbele-deur-zijlichten",           name: "Dubbele deur met zijlichten",                 best: true,  v: 1.8, components: <DoubleDoorBase hasSideLights /> },
  { id: 15, category: "Dubbele deur", slug: "dubbele-deur-borstwering",          name: "Dubbele deur met borstwering",                best: true,  v: 1,   components: <DoubleDoorBase hasPlinth /> },
  { id: 16, category: "Dubbele deur", slug: "dubbele-deur-bovenlicht",           name: "Dubbele deur met bovenlicht",                 best: true,  v: 1,   components: <DubbeleDeurBovenlicht /> },
  { id: 17, category: "Dubbele deur", slug: "dubbele-deur-zijlicht",             name: "Dubbele deur met zijlicht",                   best: false, v: 1.5, components: <DubbeleDeurZijlicht /> },
  { id: 18, category: "Dubbele deur", slug: "dubbele-deur-zijlichten-bovenlichten", name: "Dubbele deur met zijlichten en bovenlichten", best: false, v: 1.8, components: <DubbeleDeurZijlichtenBovenlichten /> },
  { id: 19, category: "Dubbele deur", slug: "dubbele-deur-borstwering-bovenlicht",  name: "Dubbele deur met borstwering en bovenlicht",  best: false, v: 1,   components: <DubbeleDeurBorstweringBovenlicht /> },
];

export default function AluDeurenOverzicht() {
  const [activeType, setActiveType] = useState("Enkele deur");

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 border-l-4 border-[#1066a3] pl-4 md:pl-6">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1a1a1a] mb-1 md:mb-3">
            Aluminium deuren
          </h1>
          <p className="text-[#1066a3] font-medium text-sm md:text-xl uppercase tracking-tighter">
            Kies uw gewenste indeling
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
                  activeType === type ? "bg-[#1066a3] text-white shadow-md" : "text-[#666666]"
                }`}>
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {deuren.filter((d) => d.category === activeType).map((item) => (
          <Link href={`/aluminium/deurconfigurator/${item.slug}`} key={item.id} className="group flex flex-col h-full">
            <div className="relative bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden min-h-[220px]">
              {item.best && (
                <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#1066a3] text-white text-[8px] md:text-[9px] font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full tracking-widest z-10 uppercase">
                  POPULAIR
                </div>
              )}
              <div className="w-full flex items-center justify-center">
                <div style={{ width: item.v > 1.4 ? "100%" : "55%" }}>
                  <svg viewBox={`0 0 ${item.v * 100} 160`} className="w-full h-auto">
                    {item.components}
                  </svg>
                </div>
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

      <div className="max-w-[1200px] mx-auto px-6 pb-20 mt-16">
        <div className="border-t border-slate-100 pt-14">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4 leading-tight">Aluminium deuren — De perfecte combinatie van design en duurzaamheid</h2>
            <p className="text-slate-600 leading-relaxed">Aluminium deuren zijn de ideale keuze voor wie op zoek is naar een strakke, moderne uitstraling gecombineerd met ongekende onderhoudsvriendelijkheid. Of je nu in een moderne nieuwbouwwoning woont of een klassiek pand bezit; aluminium geeft elke woning een karaktervolle en tijdloze look.</p>
          </div>
          <div className="mb-14">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">Waarom kiezen voor onze aluminium deuren</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Recycle size={20} />, title: "Duurzaam & Milieubewust", text: "Aluminium is een 100% recyclebaar materiaal. Mocht je in de toekomst je deur willen vervangen, dan kan het materiaal gemakkelijk opnieuw worden gebruikt, wat het een verantwoorde keuze maakt." },
                { icon: <Wrench size={20} />, title: "Stijlvol Maatwerk", text: "Aluminium deuren zijn verkrijgbaar in uiteenlopende kleuren en stijlen. Hierdoor stem je de deur moeiteloos af op de architectuur van je woning, of dit nu gaat om een voordeur, achterdeur of tuindeur." },
                { icon: <Building2 size={20} />, title: "Modern & Industrieel Design", text: "Dankzij de strakke profielen hebben deze deuren een moderne uitstraling die perfect past bij nieuwbouw, maar ook een prachtig industrieel contrast biedt bij klassieke of landelijke woningen." },
                { icon: <Sparkles size={20} />, title: "Minimaal Onderhoud", text: "Aluminium deuren hoeven niet te worden geverfd. Omdat het materiaal nauwelijks vuil aantrekt, volstaat een vochtige doek om de deur weer te laten stralen." },
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
            { q: "Wat maakt een aluminium deur zo duurzaam?", a: "Aluminium is volledig recyclebaar, waardoor het materiaal eindeloos kan worden hergebruikt zonder kwaliteitsverlies." },
            { q: "Waar kan ik een aluminium deur plaatsen?", a: "Vanwege de veelzijdigheid in stijlen en kleuren is een aluminium deur geschikt voor elk type opening, zoals je voordeur of achterdeur." },
            { q: "Past een moderne aluminium deur wel bij mijn klassieke huis?", a: "Absoluut. De strakke profielen zorgen voor een stijlvol contrast dat een uniek en modern industrieel effect geeft aan zowel klassieke als landelijke woningen." },
            { q: "Hoe onderhoud ik een aluminium deur?", a: "Onderhoud is nauwelijks nodig. Je hoeft de deur niet te verven en voor een schone uitstraling is afnemen met een vochtige doek voldoende." },
            { q: "Zijn er veel kleurkeuzes mogelijk?", a: "Ja, de aluminium profielen zijn beschikbaar in een breed scala aan kleuren, zodat je altijd een uitstraling creëert die naadloos aansluit bij jouw specifieke woonstijl." },
            { q: "Is een aluminium deur bestand tegen weersinvloeden?", a: "Zeker, aluminium is uitermate goed bestand tegen vocht en vuil, waardoor de deur in uitstekende conditie blijft." },
            { q: "Is een aluminium deur ook geschikt voor nieuwbouw?", a: "Dankzij de moderne en strakke uitstraling vormen aluminium deuren een uitstekende match met de architectuur van moderne nieuwbouwwoningen." },
            { q: "Waarom is aluminium onderhoudsvriendelijker dan hout?", a: "In tegenstelling tot hout, waarbij regelmatig schilderwerk vereist is, is aluminium kleurvast en trekt het vrijwel geen vuil aan, waardoor intensief onderhoud verleden tijd is." },
          ]} />
        </div>
      </div>
    </div>
  );
}
