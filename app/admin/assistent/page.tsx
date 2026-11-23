import { roosStand } from "@/lib/roos-teller";
import { funnel } from "@/lib/bezoek";

export const dynamic = "force-dynamic";

export default async function Assistent() {
  const roos = await roosStand().catch(() => null);
  const { n } = await funnel(30).catch(() => ({
    n: {} as Record<string, number>,
  }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-foreground">AI-assistent</h1>
      <p className="text-sm text-black/60">
        Roos is de stemassistent op de offerte-site. Zij helpt klanten met de
        prijscalculator en de aanvraag.
      </p>
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <p className="text-sm font-bold text-foreground">Gesprekken met Roos</p>
        {roos ? (
          <div className="mt-3 grid grid-cols-2 gap-4">
            {[
              ["Deze maand", roos.maand, roos.maxMaand],
              ["Vandaag", roos.dag, roos.maxDag],
            ].map(([t, a, m]) => (
              <div key={t as string}>
                <p className="text-xs text-black/50">{t}</p>
                <p className="text-3xl font-black text-[#1E5079]">
                  {a}
                  <span className="text-base font-bold text-black/40">
                    {" "}
                    van {m}
                  </span>
                </p>
                <div className="mt-1 h-2 rounded-full bg-[#1E5079]/10">
                  <div
                    className="h-2 rounded-full bg-[#1E5079]"
                    style={{
                      width: `${Math.min(100, ((a as number) / (m as number)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm">Stand niet beschikbaar.</p>
        )}
        <p className="mt-3 text-xs text-black/50">
          Zodra het maximum bereikt is, verdwijnt Roos tot de volgende dag of
          maand.
        </p>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-5">
        <p className="text-sm text-black/60">
          Bezoekers die Roos de afgelopen 30 dagen startten
        </p>
        <p className="text-3xl font-black text-[#1E5079]">{n.roos ?? 0}</p>
      </div>
    </div>
  );
}
