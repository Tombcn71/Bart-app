import { Fragment } from "react";
import Link from "next/link";
import { funnel } from "@/lib/bezoek";

export const dynamic = "force-dynamic";

const HERKOMST = ["Google", "ChatGPT", "Gemini", "Perplexity", "Claude", "Copilot", "Facebook", "Instagram", "WhatsApp", "LinkedIn", "YouTube", "Bing", "Via bartmooi.nl", "Direct", "Andere sites"];
const BEKEND: Record<string, string> = { direct: "Direct", wordpress: "Via bartmooi.nl" };
const bekend = (b: string) => BEKEND[b] ?? (HERKOMST.includes(b) ? b : "Andere sites");
const tel = (lijst: { bron: string; n: number }[], naam: string) => lijst.filter((r) => bekend(r.bron) === naam).reduce((t, r) => t + r.n, 0);

export default async function Bezoekers({ searchParams }: { searchParams: Promise<{ dagen?: string }> }) {
  const dagen = [1, 7, 30].includes(Number((await searchParams).dagen)) ? Number((await searchParams).dagen) : 7;
  const { n, bronnen, wpBronnen } = await funnel(dagen);
  const stappen = [
    { label: "Bezoekers op bartmooi.nl", w: n.wp_bezoek ?? 0 },
    { label: "Klikten naar de offerte-site", w: n.wp_klik ?? 0 },
    { label: "Bezoekers op offerte.bartmooi.nl", w: n.site_bezoek ?? 0 },
    { label: "Calculator geopend", w: n.calc ?? 0 },
    { label: "Offerte aangevraagd", w: n.offerte ?? 0 },
  ];
  const top = Math.max(20, ...stappen.map((s) => s.w));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-foreground">Bezoekers</h1>
        <div className="flex gap-1 text-sm">
          {[[1, "Vandaag"], [7, "7 dagen"], [30, "30 dagen"]].map(([d, t]) => (
            <Link key={d} href={`/admin/bezoekers?dagen=${d}`} className={`rounded-lg px-3 py-1.5 font-bold ${dagen === d ? "bg-[#1E5079] text-white" : "bg-white text-[#1E5079] border border-[#1E5079]/20"}`}>{t}</Link>
          ))}
        </div>
      </div>
      <div className="space-y-3 rounded-2xl border border-black/10 bg-white p-5">
        {stappen.map((s, i) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm font-bold text-foreground">
              <span>{s.label}</span>
              <span>{s.w}{i > 0 && stappen[i - 1].w > 0 ? <span className="ml-2 font-normal text-black/50">{Math.round((s.w / stappen[i - 1].w) * 100)}%</span> : null}</span>
            </div>
            <div className="mt-1 h-3 rounded-full bg-[#1E5079]/10">
              <div className="h-3 rounded-full bg-[#1E5079]" style={{ width: `${(s.w / top) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-1">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-sm text-black/60">Gesprekken met Roos</p>
          <p className="text-3xl font-black text-[#1E5079]">{n.roos ?? 0}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <p className="mb-3 text-sm font-bold text-foreground">Waar bezoekers vandaan komen</p>
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-2 text-sm">
          <span />
          <span className="text-right text-xs text-black/50">bartmooi.nl</span>
          <span className="text-right text-xs text-black/50">offerte-site</span>
          {HERKOMST.map((naam) => (
            <Fragment key={naam}>
              <span className="font-bold text-foreground">{naam}</span>
              <span className={`text-right font-bold ${tel(wpBronnen, naam) ? "text-[#1E5079]" : "text-black/30"}`}>{tel(wpBronnen, naam)}</span>
              <span className={`text-right font-bold ${tel(bronnen, naam) ? "text-[#1E5079]" : "text-black/30"}`}>{tel(bronnen, naam)}</span>
            </Fragment>
          ))}
        </div>
      </div>
      <p className="text-xs text-black/50">Tellingen zijn per uniek bezoek, zonder cookies. Dezelfde persoon op dezelfde dag telt één keer.</p>
    </div>
  );
}
