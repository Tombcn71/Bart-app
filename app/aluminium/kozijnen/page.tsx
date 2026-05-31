"use client";
import { useState } from "react";
import Link from "next/link";
import { InmeetServiceCard } from "@/app/components/InmeetServiceCard";
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
import {
  GlassVast, GlassDK, GlassKiep, GlassVastBovenlichtKiep, GlassDkBovenlichtVast,
  GlassDkBovenlichtKiep, GlassDkBorstweringVast, GlassKiepKiep, GlassDkDkStolpBovenlichtVast,
  GlassDkVastBovenlichtenVast, GlassDkBovenlichtKiepVast, GlassVastBovenlichtKiepVast,
  GlassDkBovenlichtVastVast, GlassDkVastVastKozijn, GlassDkDkDkKozijn,
  GlassDkVastDkBovenlichtenVast, GlassVastDkVastBovenlichtenVast,
} from "@/lib/kozijn-svgs";

const kozijnen = [
  { id: 1,  v: 1, slug: "vast-kozijn",                            name: "Vast kozijn",                              best: true,  components: [<GlassVast key="1" x={0} />] },
  { id: 2,  v: 1, slug: "draai-kiep-kozijn",                      name: "Draai kiep kozijn",                        best: true,  components: [<GlassDK key="1" x={0} />] },
  { id: 3,  v: 1, slug: "kiep-kozijn",                            name: "Kiep kozijn",                              best: true,  components: [<GlassKiep key="1" x={0} />] },
  { id: 4,  v: 1, slug: "vast-bovenlicht-kiep",                   name: "Vast met bovenlicht kiep",                 best: false, components: [<GlassVastBovenlichtKiep key="1" x={0} />] },
  { id: 5,  v: 1, slug: "dk-bovenlicht-vast",                     name: "Draai/kiep met bovenlicht vast",           best: false, components: [<GlassDkBovenlichtVast key="1" x={0} />] },
  { id: 6,  v: 1, slug: "dk-bovenlicht-kiep",                     name: "Draai/kiep met bovenlicht kiep",           best: false, components: [<GlassDkBovenlichtKiep key="1" x={0} />] },
  { id: 7,  v: 1, slug: "dk-borstwering-vast",                    name: "Draai/kiep met borstwering",               best: false, components: [<GlassDkBorstweringVast key="1" x={0} />] },
  { id: 8,  v: 2, slug: "draai-kiep-vast-kozijn",                 name: "Draai kiep - Vast",                        best: true,  components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />] },
  { id: 9,  v: 2, slug: "draai-kiep-draai-stolp-kozijn",          name: "Draai kiep - Draai kiep",                 best: true,  components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} mirror />] },
  { id: 10, v: 2, slug: "vast-vast-kozijn",                       name: "Vast - Vast",                              best: true,  components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />] },
  { id: 11, v: 2, slug: "kiep-kiep-kozijn",                       name: "Kiep - Kiep",                              best: false, components: [<GlassKiepKiep key="1" x={0} />] },
  { id: 12, v: 2, slug: "dk-dk-stolp-bovenlicht-vast-2vaks",      name: "Draai/kiep - draai stolp met bovenlicht",  best: false, components: [<GlassDkDkStolpBovenlichtVast key="1" x={0} />] },
  { id: 13, v: 2, slug: "dk-vast-bovenlichten-vast-2vaks",        name: "Draai/kiep - vast met bovenlichten",       best: false, components: [<GlassDkVastBovenlichtenVast key="1" x={0} />] },
  { id: 14, v: 2, slug: "dk-bovenlicht-kiep-vast-2vaks",          name: "Draai/kiep bovenlicht kiep - vast",        best: false, components: [<GlassDkBovenlichtKiepVast key="1" x={0} />] },
  { id: 15, v: 2, slug: "vast-bovenlicht-kiep-vast-2vaks",        name: "Vast bovenlicht kiep - vast",              best: false, components: [<GlassVastBovenlichtKiepVast key="1" x={0} />] },
  { id: 16, v: 2, slug: "dk-bovenlicht-vast-vast-2vaks",          name: "Draai/kiep bovenlicht vast - vast",        best: false, components: [<GlassDkBovenlichtVastVast key="1" x={0} />] },
  { id: 17, v: 3, slug: "draai-kiep-vast-draai-kiep-kozijn",      name: "Draai kiep - Vast - Draai kiep",           best: true,  components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassDK key="3" x={200} mirror />] },
  { id: 18, v: 3, slug: "vast-vast-vast-kozijn",                  name: "Vast - Vast - Vast",                       best: true,  components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />] },
  { id: 19, v: 3, slug: "vast-draai-kiep-vast-kozijn",            name: "Vast - Draai kiep - Vast",                 best: true,  components: [<GlassVast key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassVast key="3" x={200} />] },
  { id: 20, v: 3, slug: "draai-kiep-vast-vast-kozijn",            name: "Draai/kiep - Vast - Vast",                 best: false, components: [<GlassDkVastVastKozijn key="1" x={0} />] },
  { id: 21, v: 3, slug: "draai-kiep-draai-kiep-draai-kiep-kozijn",name: "Draai/kiep - Draai/kiep - Draai/kiep",    best: false, components: [<GlassDkDkDkKozijn key="1" x={0} />] },
  { id: 22, v: 3, slug: "draai-kiep-vast-dk-bovenlichten-vast",   name: "Draai/kiep - Vast - Draai/kiep bovenlicht",best: false, components: [<GlassDkVastDkBovenlichtenVast key="1" x={0} />] },
  { id: 23, v: 3, slug: "vast-dk-vast-bovenlichten-vast",         name: "Vast - Draai/kiep - Vast bovenlichten",    best: false, components: [<GlassVastDkVastBovenlichtenVast key="1" x={0} />] },
  { id: 24, v: 4, slug: "draai-kiep-vast-vast-draai-kiep-kozijn", name: "Draai kiep - Vast - Vast - Draai kiep",    best: true,  components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />, <GlassVast key="3" x={200} />, <GlassDK key="4" x={300} mirror />] },
  { id: 25, v: 4, slug: "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn", name: "4x Draai kiep", best: true, components: [<GlassDK key="1" x={0} />, <GlassDK key="2" x={100} />, <GlassDK key="3" x={200} />, <GlassDK key="4" x={300} />] },
];

const COLORS = { primary: "#1066a3", textDark: "#2d3748" };

export default function AluKozijnenOverzicht() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="max-w-[1200px] mx-auto p-8 md:p-16 font-sans bg-white min-h-screen">
      <div className="mb-12 border-l-4 border-[#1066a3] pl-6">
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">Aluminium kozijnen</h1>
        <p className="text-[#1066a3] font-medium text-xl uppercase tracking-tighter">Kies uw gewenste indeling</p>
      </div>

      <div className="flex justify-start mb-12">
        <div className="flex bg-[#f4f7f9] p-1.5 rounded-xl">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setActiveTab(n)}
              className={`px-8 py-3 text-sm font-bold rounded-lg transition-colors ${activeTab === n ? "bg-[#1066a3] text-white shadow-md" : "text-[#666666] hover:text-[#1066a3]"}`}>
              {n} {n === 1 ? "vak" : "vakken"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {kozijnen.filter((k) => k.v === activeTab).map((item) => (
          <Link href={`/aluminium/kozijnconfigurator/${item.slug}`} key={item.id} className="group">
            <div className="relative h-[280px] bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-8 shadow-sm">
              {item.best && (
                <div className="absolute top-4 left-4 bg-[#1066a3] text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest z-10 uppercase">
                  POPULAIR
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center">
                <div style={{ width: `${item.v * 20 + 20}%`, maxWidth: "100%" }}>
                  <svg viewBox={`0 0 ${item.v * 100} 100`} className="w-full h-auto">
                    <rect x="0.5" y="0.5" width={item.v * 100 - 1} height="99" fill="none" stroke={COLORS.textDark} strokeWidth="1" />
                    {Array.from({ length: item.v - 1 }).map((_, i) => (
                      <line key={i} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="100" stroke={COLORS.textDark} strokeWidth="1" />
                    ))}
                    {item.components}
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="mt-6 text-center font-bold text-[#1a1a1a] text-base group-hover:text-[#1066a3] transition-colors uppercase tracking-tight">
              {item.name}
            </h3>
            <div className="mt-2 text-center text-[10px] font-bold text-[#1066a3] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
              Bekijk configurator →
            </div>
          </Link>
        ))}
        <div className="col-span-full border-t border-slate-100 mt-4" />
        <InmeetServiceCard />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pb-20 mt-16">
        <div className="border-t border-slate-100 pt-14">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4 leading-tight">Aluminium kozijnen — De ideale combinatie van design en duurzaamheid</h2>
            <p className="text-slate-600 leading-relaxed">Een woning die niet alleen een luxe uitstraling heeft, maar ook uitstekend geïsoleerd is. Investeren in nieuwe aluminium kozijnen is een keuze waar je elke dag van geniet. Wij regelen alles voor je: van nauwkeurig inmeten tot de vakkundige montage op locatie.</p>
          </div>
          <div className="mb-14">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">Waarom onze aluminium kozijnen de slimste keuze zijn</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Wrench size={20} />, title: "Vakkundige Montage", text: "Geen gedoe met technische details. Onze ervaren monteurs zorgen voor een perfecte installatie, waardoor je verzekerd bent van een strak resultaat en optimale isolatie." },
                { icon: <ShieldCheck size={20} />, title: "Maximale Inbraakveiligheid", text: "Aluminium is van nature extreem sterk. Onze kozijnen zijn standaard voorzien van inbraakwerende meerpuntsluitingen en vakkundig geplaatst voor een optimaal veiligheidsniveau." },
                { icon: <Zap size={20} />, title: "Duurzame Energiebesparing", text: "Aluminium kozijnen zijn uitstekend bestand tegen wisselende weersomstandigheden en bieden een hoge isolatiewaarde. Dit houdt je woning comfortabel en helpt je direct te besparen op je energierekening." },
                { icon: <Sparkles size={20} />, title: "Onderhoudsvriendelijk & Stijlvol", text: "Aluminium oogt modern en strak. Het materiaal is kleurvast, rot niet en trekt geen vuil aan. Even afnemen met een vochtige doek is voldoende om de kozijnen in topconditie te houden." },
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
            { q: "Wat maakt aluminium kozijnen zo duurzaam?", a: "Aluminium is een zeer sterk, vormvast materiaal dat tientallen jaren meegaat. Bovendien is het 100% recyclebaar, wat het een verantwoorde keuze maakt voor de toekomst." },
            { q: "Wat houdt de montage in?", a: "Wij nemen het volledige traject uit handen. Van de eerste inmeting tot de definitieve plaatsing door onze vakkundige monteurs; wij zorgen ervoor dat alles naadloos aansluit." },
            { q: "Waarom kiezen voor aluminium in plaats van andere materialen?", a: "Aluminium biedt een unieke combinatie van een slank, modern design en enorme structurele kracht. Het is onderhoudsarm, weerbestendig en geeft je woning direct een industriële, luxe uitstraling." },
            { q: "Is glas in mijn nieuwe aluminium kozijnen mogelijk?", a: "Zeker. Je kunt kiezen uit diverse soorten isolatieglas. Dit vergroot de lichtinval en verhoogt de energie-efficiëntie en het wooncomfort aanzienlijk." },
            { q: "Uit welke kleuren en stijlen kan ik kiezen?", a: "Aluminium is beschikbaar in talloze kleuren en afwerkingen. Of je nu kiest voor een matte structuurcoating of een glanzende afwerking, wij stemmen de look perfect af op jouw woning." },
            { q: "Hoe veilig zijn deze kozijnen?", a: "Veiligheid is bij aluminium de standaard. Het materiaal is van zichzelf al zeer robuust, en in combinatie met hoogwaardige meerpuntsluitingen en vakkundige montage ben je optimaal beschermd." },
            { q: "Is er veel onderhoud nodig?", a: "Nee, aluminium is een van de meest onderhoudsvriendelijke materialen. In tegenstelling tot hout hoef je het niet te schilderen. Regelmatig reinigen met water en een mild schoonmaakmiddel volstaat." },
            { q: "Hoe verloopt het proces na mijn bestelling?", a: "Zodra je de bestelling bevestigt, worden de kozijnen specifiek voor jouw woning op maat gemaakt. Vervolgens nemen we contact met je op om de vakkundige montage op locatie in te plannen." },
          ]} />
        </div>
      </div>
    </div>
  );
}
