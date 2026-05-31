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
// 🛠️ Alle benodigde SVG componenten centraal importeren uit je lib:
import {
  GlassVast,
  GlassDK,
  GlassKiep,
  GlassVastBovenlichtKiep,
  GlassDkBovenlichtVast,
  GlassDkBovenlichtKiep,
  GlassDkBorstweringVast,
  // Nieuwe 2-vaks SVG's:
  GlassKiepKiep,
  GlassDkDkStolpBovenlichtVast,
  GlassDkVastBovenlichtenVast,
  GlassDkBovenlichtKiepVast,
  GlassVastBovenlichtKiepVast,
  GlassDkBovenlichtVastVast,
  // Nieuwe 3-vaks SVG's:
  GlassDkVastVastKozijn,
  GlassDkDkDkKozijn,
  GlassDkVastDkBovenlichtenVast,
  GlassVastDkVastBovenlichtenVast,
} from "@/lib/kozijn-svgs";

// --- BARTMOOI KLEURENPALET & STYLING ---
const COLORS = {
  primary: "#1066a3",
  textDark: "#2d3748",
  textLight: "#666666",
  bgLight: "#f4f7f9",
};

export default function KozijnConfigurator() {
  const [activeTab, setActiveTab] = useState(1);

  const kozijnen = [
    // ==========================================
    // 1 VAK MODELLEN
    // ==========================================
    {
      id: 1,
      slug: "vast-kozijn",
      v: 1,
      name: "Vast kozijn",
      best: true,
      components: [<GlassVast key="1" x={0} />],
    },
    {
      id: 2,
      slug: "draai-kiep-kozijn",
      v: 1,
      name: "Draai kiep kozijn",
      best: true,
      components: [<GlassDK key="1" x={0} />],
    },
    {
      id: 3,
      slug: "kiep-kozijn",
      v: 1,
      name: "Kiep kozijn",
      best: true,
      components: [<GlassKiep key="1" x={0} />],
    },
    {
      id: 12,
      slug: "vast-bovenlicht-kiep",
      v: 1,
      name: "Vast raam met bovenlicht (kiep) kozijn",
      best: false,
      components: [<GlassVastBovenlichtKiep key="1" x={0} />],
    },
    {
      id: 13,
      slug: "dk-bovenlicht-vast",
      v: 1,
      name: "Draai / kiep met bovenlicht (vast) kozijn",
      best: false,
      components: [<GlassDkBovenlichtVast key="1" x={0} />],
    },
    {
      id: 14,
      slug: "dk-bovenlicht-kiep",
      v: 1,
      name: "Draai / kiep met bovenlicht (kiep) kozijn",
      best: false,
      components: [<GlassDkBovenlichtKiep key="1" x={0} />],
    },
    {
      id: 15,
      slug: "dk-borstwering-vast",
      v: 1,
      name: "Draai / kiep met borstwering(vast) kozijn",
      best: false,
      components: [<GlassDkBorstweringVast key="1" x={0} />],
    },

    // ==========================================
    // 2 VAKKEN MODELLEN
    // ==========================================
    {
      id: 4,
      slug: "draai-kiep-vast-kozijn",
      v: 2,
      name: "Draai kiep - vast",
      best: true,
      components: [<GlassDK key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      id: 5,
      slug: "draai-kiep-draai-stolp-kozijn",
      v: 2,
      name: "Draai kiep - Draai kiep",
      best: true,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} mirror />,
      ],
    },
    {
      id: 6,
      slug: "vast-vast-kozijn",
      v: 2,
      name: "Vast - Vast",
      best: true,
      components: [<GlassVast key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      id: 16,
      slug: "dk-dk-gelijk",
      v: 2,
      name: "Draai kiep - Draai kiep gelijk kozijn",
      best: false,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} mirror />,
      ],
    },
    {
      id: 17,
      slug: "dk-13-vast-23",
      v: 2,
      name: "Draai / kiep 1/3 - vast 2/3 kozijn",
      best: false,
      components: [
        <g key="1" transform="scale(0.66, 1)">
          <GlassDK x={0} />
        </g>,
        <g key="2" transform="translate(33, 0) scale(1.33, 1)">
          <GlassVast x={50} />
        </g>,
      ],
    },
    {
      id: 18,
      slug: "vast-vast-horizontaal",
      v: 2,
      name: "Vast - Vast kozijn (horizontaal)",
      best: false,
      components: [
        <g key="1">
          <rect
            x="6"
            y="6"
            width="188"
            height="44"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.4"
          />
          <line
            x1="98"
            y1="28"
            x2="102"
            y2="28"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />
          <line
            x1="100"
            y1="26"
            x2="100"
            y2="30"
            stroke="#cbd5e1"
            strokeWidth="0.8"
          />
          <line
            x1="0"
            y1="53"
            x2="200"
            y2="53"
            stroke={COLORS.textDark}
            strokeWidth="1"
          />
          <rect
            x="6"
            y="59"
            width="188"
            height="35"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="0.4"
          />
        </g>,
      ],
    },
    {
      id: 19,
      slug: "kiep-vast-liggend",
      v: 2,
      name: "Kiep - vast kozijn",
      best: false,
      components: [<GlassKiep key="1" x={0} />, <GlassVast key="2" x={100} />],
    },
    {
      id: 20,
      slug: "kiep-kiep-kozijn",
      v: 2,
      name: "Kiep - kiep kozijn",
      best: false,
      components: [<GlassKiepKiep key="1" x={0} />],
    },
    {
      id: 21,
      slug: "dk-dk-stolp-bovenlicht-vast-2vaks",
      v: 2,
      name: "Draai/kiep - draai stolp kozijn met bovenlicht (vast)",
      best: false,
      components: [<GlassDkDkStolpBovenlichtVast key="1" x={0} />],
    },
    {
      id: 22,
      slug: "dk-vast-bovenlichten-vast-2vaks",
      v: 2,
      name: "Draai / kiep - vast kozijn met bovenlichten (vast)",
      best: false,
      components: [<GlassDkVastBovenlichtenVast key="1" x={0} />],
    },
    {
      id: 23,
      slug: "dk-bovenlicht-kiep-vast-2vaks",
      v: 2,
      name: "Draai / kiep (met bovenlicht kiep) - vast kozijn",
      best: false,
      components: [<GlassDkBovenlichtKiepVast key="1" x={0} />],
    },
    {
      id: 24,
      slug: "vast-bovenlicht-kiep-vast-2vaks",
      v: 2,
      name: "Vast (met bovenlicht kiep) - vast kozijn",
      best: false,
      components: [<GlassVastBovenlichtKiepVast key="1" x={0} />],
    },
    {
      id: 25,
      slug: "dk-bovenlicht-vast-vast-2vaks",
      v: 2,
      name: "Draai / kiep (met bovenlicht vast) - vast kozijn",
      best: false,
      components: [<GlassDkBovenlichtVastVast key="1" x={0} />],
    },

    // ==========================================
    // 3 VAKKEN MODELLEN (SCREENSHOT 3)
    // ==========================================
    {
      id: 7,
      slug: "draai-kiep-vast-draai-kiep-kozijn",
      v: 3,
      name: "Draai kiep - vast - Draai kiep",
      best: true,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassDK key="3" x={200} mirror />,
      ],
    },
    {
      id: 8,
      slug: "vast-vast-vast-kozijn",
      v: 3,
      name: "Vast - Vast - Vast",
      best: true,
      components: [
        <GlassVast key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassVast key="3" x={200} />,
      ],
    },
    {
      id: 9,
      slug: "vast-draai-kiep-vast-kozijn",
      v: 3,
      name: "Vast - Draai kiep - Vast",
      best: true,
      components: [
        <GlassVast key="1" x={0} />,
        <GlassDK key="2" x={100} />,
        <GlassVast key="3" x={200} />,
      ],
    },
    {
      id: 26,
      slug: "draai-kiep-vast-vast-kozijn",
      v: 3,
      name: "Draai / kiep - vast - vast kozijn",
      best: false,
      components: [<GlassDkVastVastKozijn key="1" x={0} />],
    },
    {
      id: 27,
      slug: "draai-kiep-draai-kiep-draai-kiep-kozijn",
      v: 3,
      name: "Draai/kiep - Draai/kiep - Draai/kiep kozijn",
      best: false,
      components: [<GlassDkDkDkKozijn key="1" x={0} />],
    },
    {
      id: 28,
      slug: "draai-kiep-vast-dk-bovenlichten-vast",
      v: 3,
      name: "Draai / kiep - vast - draai / kiep kozijn met bovenlichten (vast)",
      best: false,
      components: [<GlassDkVastDkBovenlichtenVast key="1" x={0} />],
    },
    {
      id: 29,
      slug: "vast-dk-vast-bovenlichten-vast",
      v: 3,
      name: "Vast - draai / kiep - vast kozijn met bovenlichten (vast)",
      best: false,
      components: [<GlassVastDkVastBovenlichtenVast key="1" x={0} />],
    },

    // ==========================================
    // 4 VAKKEN MODELLEN
    // ==========================================
    {
      id: 10,
      slug: "draai-kiep-vast-vast-draai-kiep-kozijn",
      v: 4,
      name: "Draai kiep - Vast - Vast - Draai kiep",
      best: true,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassVast key="2" x={100} />,
        <GlassVast key="3" x={200} />,
        <GlassDK key="4" x={300} mirror />,
      ],
    },
    {
      id: 11,
      slug: "draai-kiep-draai-kiep-draai-kiep-draai-kiep-kozijn",
      v: 4,
      name: "4x Draai kiep kozijn",
      best: true,
      components: [
        <GlassDK key="1" x={0} />,
        <GlassDK key="2" x={100} />,
        <GlassDK key="3" x={200} />,
        <GlassDK key="4" x={300} />,
      ],
    },
  ];

  return (
    <div className="max-w-[1200px] mx-auto p-8 md:p-16 font-sans bg-white min-h-screen">
      <div className="mb-12 border-l-4 border-[#1066a3] pl-6">
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-3 tracking-tight">
          Kunststof kozijnen
        </h1>
        <p className="text-[#1066a3] font-medium text-xl uppercase tracking-tighter">
          Kies uw gewenste indeling{" "}
        </p>
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
        {kozijnen
          .filter((k) => k.v === activeTab)
          .map((item) => (
            <Link
              href={`/kozijnconfigurator/${item.slug}`}
              key={item.id}
              className="group">
              <div className="relative h-[280px] bg-white border border-slate-100 rounded-2xl flex items-center justify-center p-8 shadow-sm">
                {item.best && (
                  <div className="absolute top-4 left-4 bg-[#1066a3] text-white text-[9px] font-black px-3 py-1.5 rounded-full tracking-widest z-10 uppercase">
                    POPULAIR
                  </div>
                )}
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    style={{ width: `${item.v * 20 + 20}%`, maxWidth: "100%" }}>
                    <svg
                      viewBox={`0 0 ${item.v * 100} 100`}
                      className="w-full h-auto">
                      <rect
                        x="0.5"
                        y="0.5"
                        width={item.v * 100 - 1}
                        height="99"
                        fill="none"
                        stroke={COLORS.textDark}
                        strokeWidth="1"
                      />
                      {Array.from({ length: item.v - 1 }).map((_, i) => (
                        <line
                          key={i}
                          x1={(i + 1) * 100}
                          y1="0"
                          x2={(i + 1) * 100}
                          y2="100"
                          stroke={COLORS.textDark}
                          strokeWidth="1"
                        />
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
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4 leading-tight">Kunststof kozijnen — Investeren in wooncomfort en energiebesparing</h2>
            <p className="text-slate-600 leading-relaxed">Een huis dat niet alleen fantastisch oogt, maar ook je maandlasten structureel verlaagt. Investeren in nieuwe kunststof kozijnen is een keuze waar je elke dag plezier van hebt. Wij ontzorgen je hierin volledig: van inmeten tot de vakkundige montage op locatie.</p>
          </div>
          <div className="mb-14">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-5">Waarom onze kunststof kozijnen de slimste keuze zijn</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <Wrench size={20} />, title: "Vakkundige Montage", text: "Geen gedoe of zorgen over technische details. Onze ervaren monteurs zorgen voor een perfecte installatie, waardoor je verzekerd bent van een naadloos resultaat en optimale isolatie." },
                { icon: <ShieldCheck size={20} />, title: "Maximale Inbraakveiligheid", text: "Je huis is je veilige haven. Daarom zijn onze kozijnen standaard uitgerust met hoogwaardige meerpuntsluitingen en sterk, duurzaam materiaal voor maximale inbraakwering." },
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
            { q: "Wat zijn kunststof kozijnen precies?", a: "Dit zijn kozijnen vervaardigd uit duurzaam hoogwaardig kunststof. Ze bieden uitstekende isolatie, vragen minimaal onderhoud en hebben een zeer lange levensduur zonder dat schilderwerk nodig is." },
            { q: "Wat houdt de montage in?", a: "Wij nemen het volledige traject uit handen. Van de eerste inmeting tot de definitieve plaatsing door onze vakkundige monteurs; wij zorgen ervoor dat jouw nieuwe kozijnen perfect functioneren." },
            { q: "Waarom kiezen voor kunststof in plaats van hout of aluminium?", a: "Kunststof is vaak prijstechnisch aantrekkelijker, volledig recyclebaar en combineert een moderne uitstraling met uitmuntende isolatiewaarden." },
            { q: "Is glas in mijn nieuwe kozijnen mogelijk?", a: "Zeker. Je kunt kiezen uit diverse soorten isolatieglas. Dit vergroot de lichtinval en verhoogt de energie-efficiëntie van je woning aanzienlijk." },
            { q: "Uit welke kleuren en stijlen kan ik kiezen?", a: "Naast standaard wit en crème, zijn er vele mogelijkheden met folieafwerkingen, zoals stijlvolle houtnerfstructuren of moderne antracietkleuren die aansluiten bij jouw interieur." },
            { q: "Wat is het verschil tussen een profiel met of zonder aanslag?", a: "Een profiel met aanslag heeft een extra rand, waardoor de binnen- en buitenmaat verschillen. Bij een profiel zonder aanslag zijn de binnen- en buitenmaten gelijk." },
            { q: "Welke profieltypes zijn er beschikbaar?", a: "Je hebt de keuze uit een verdiept profiel met een robuuste uitstraling (eventueel met HVL-verbinding) of een vlak profiel met een slank, modern uiterlijk." },
            { q: "Hoe verloopt het proces na mijn bestelling?", a: "Zodra je de bestelling bevestigt, worden de kozijnen op maat geproduceerd. Vervolgens nemen we contact met je op voor het inplannen van de vakkundige montage op jouw locatie." },
          ]} />
        </div>
      </div>
    </div>
  );
}
