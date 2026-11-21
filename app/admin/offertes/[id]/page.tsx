import { db } from "@/db";
import { offertes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, PartyPopper } from "lucide-react";
import { markeerGemonteerd } from "@/app/actions";
import { opbouwRegels, type Opbouw } from "@/lib/opbouw";
import { STATUS_STIJL, offerteStatus } from "@/lib/offerte-status";

export const dynamic = "force-dynamic";

const euro = (n: number) => "€ " + n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const datumTijd = (d: Date | string | null | undefined) =>
  d ? new Date(d).toLocaleString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

// Maten staan als eerste, de rest in leesbare woorden zonder interne velden.
const VOLGORDE = ["breedte", "hoogte", "aantal"];
const LABEL: Record<string, string> = { kleurBuitenkant: "kleur buitenkant", afstandshouder: "afstandshouder", ventilatieRooster: "ventilatierooster", glasType: "glas" };
function specRegels(specs: Record<string, any>): [string, string][] {
  const regels = Object.entries(specs)
    .filter(([, v]) => v !== "" && v !== null && v !== undefined && typeof v !== "object")
    .map(([k, v]) => {
      const naam = LABEL[k] ?? k.replace(/([A-Z])/g, " $1").toLowerCase();
      const ruw = ["breedte", "hoogte"].includes(k) ? `${v} mm` : String(v).replace(/-/g, " ");
      const waarde = ruw.charAt(0).toUpperCase() + ruw.slice(1);
      return [k, naam, waarde] as [string, string, string];
    });
  const rang = (k: string) => (VOLGORDE.indexOf(k) === -1 ? 99 : VOLGORDE.indexOf(k));
  return regels.sort((a, b) => rang(a[0]) - rang(b[0])).map(([, n, w]) => [n, w]);
}

function Kaart({ titel, sub, children }: { titel: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
      <h2 className="text-base font-bold text-foreground">{titel}</h2>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function OfferteDetailPagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [offerte] = await db.select().from(offertes).where(eq(offertes.id, id));
  if (!offerte) return notFound();

  const d = (offerte.data ?? {}) as Record<string, any>;
  const items: any[] = Array.isArray(d.items) ? d.items : [];
  const status = offerteStatus(d);
  const stijl = STATUS_STIJL[status];
  const klant = d.naam?.trim() || offerte.email;
  const opb = (d as { opbouw?: Opbouw }).opbouw;
  const o = opb ? opbouwRegels(opb) : null;
  const tel = String(d.telefoon ?? "");

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Link href="/admin/offertes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Alle aanvragen
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black text-foreground">{klant}</h1>
          <p className="text-sm text-muted-foreground">Aangevraagd op {datumTijd(offerte.createdAt)}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${stijl.badge}`}>
          <span className={`inline-block h-2 w-2 rounded-full ${stijl.punt}`} />
          {stijl.label}
        </span>
      </div>

      {d.acceptedAt && (
        <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          <PartyPopper className="size-4 shrink-0" />
          Akkoord gegeven{d.acceptedByNaam ? ` door ${d.acceptedByNaam}` : ""} op {datumTijd(d.acceptedAt)}.
        </div>
      )}

      {d.gemonteerdAt ? (
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm font-semibold text-foreground">
          Gemonteerd op {datumTijd(d.gemonteerdAt)}
          {d.reviewAt ? " · reviewverzoek verstuurd" : ""}
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await markeerGemonteerd(offerte.id);
          }}
          className="rounded-xl border border-border bg-muted/40 p-4">
          <button type="submit" className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-dark sm:w-auto">
            Markeer als gemonteerd
          </button>
          <p className="mt-2 text-xs text-muted-foreground">Een dag later krijgt de klant een mail met het verzoek om een Google-review achter te laten.</p>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Kaart titel={items.length === 1 ? "Product" : `${items.length} producten`} sub={d.prijs ? `Totaal ${euro(Number(d.prijs))}` : undefined}>
            <div className="space-y-5">
              {items.map((item, i) => (
                <div key={item.id ?? i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between gap-3 font-semibold text-foreground">
                    <span>{items.length > 1 ? `${i + 1}. ` : ""}{item.product}</span>
                    <span className="shrink-0 tabular-nums">{euro(Number(item.prijs ?? 0))}</span>
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
                    {specRegels(item.specs ?? {}).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-muted-foreground capitalize">{k}</dt>
                        <dd className="text-foreground">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
              {items.length === 0 && <p className="text-sm text-muted-foreground">{d.product ?? "Geen producten."}</p>}
            </div>
          </Kaart>
        </div>

        <div className="space-y-4">
          <Kaart titel="Klant">
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-foreground">{klant}</p>
              <p><a href={`mailto:${offerte.email}`} className="text-brand-text hover:underline">{offerte.email}</a></p>
              {tel && <p><a href={`tel:${tel.replace(/[^\d+]/g, "")}`} className="text-brand-text hover:underline">{tel}</a></p>}
              {d.woonplaats && <p className="text-muted-foreground">{String(d.woonplaats).toLowerCase().replace(/(^|[\s'-])\S/g, (m: string) => m.toUpperCase())}</p>}
            </div>
          </Kaart>

          {o && (
            <Kaart titel="Wat dit voor jou betekent" sub={`${o.kop}, exclusief btw. Alleen voor jou, de klant ziet dit niet.`}>
              <dl className="space-y-1 text-sm">
                {o.regels.map((r) => (
                  <div key={r.naam} className={`flex justify-between gap-3 ${r.winst ? "rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-700 dark:text-emerald-300" : "text-foreground"}`}>
                    <dt>{r.naam}</dt>
                    <dd className="tabular-nums">{r.bedrag}</dd>
                  </div>
                ))}
              </dl>
            </Kaart>
          )}

          <div className="flex flex-col gap-2">
            <a href={`/api/offerte/${offerte.id}/pdf`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted">
              <Download className="size-4" /> Pdf downloaden
            </a>
            <a href={`/offerte/${offerte.id}`} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted">
              <ExternalLink className="size-4" /> Offerte bekijken
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
