"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { addToCart, getCart } from "@/lib/cart";
import { CartAddedModal } from "@/app/components/CartAddedModal";
import { NumberInput } from "@/app/components/NumberInput";
import { FormField } from "@/app/components/FormField";
import { getMatrix } from "@/lib/matrix";
import type { Maatgrenzen } from "@/lib/maatgrenzen";
import { berekenStandaard, btwPercentage, isStandaardModel, keuzeNaam, nieuwStandaardModel, type Catalogus } from "@/lib/prijsmodel";

// De stappen van het formulier, in de volgorde van Creon; elke keuzegroep hoort bij één stap.
const SECTIES = ["Profiel en aanslag", "Kleur", "Vulling", "Eigenschappen"] as const;
const sectieVan = (id: string): (typeof SECTIES)[number] =>
  /^(profiel|aanslag|onderdorpel)/.test(id) ? "Profiel en aanslag" : /^(kleur|lak)/.test(id) ? "Kleur" : /^(glas|afstandshouder|roeden)/.test(id) ? "Vulling" : "Eigenschappen";

const euro = (n: number) => `€ ${n.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const nl = (n: number) => n.toLocaleString("nl-NL", { maximumFractionDigits: 2 });

export type ProductConfiguratorProps = {
  /** De typen en keuzes van dit product met hun standaardprijzen. */
  catalogus: Catalogus;
  /** Leesbare naam per type (slug). */
  namen: Record<string, string>;
  /** Maat (breedte, hoogte in mm) waarmee het type opent. */
  beginmaten: Record<string, [number, number]>;
  /** Kleinste en grootste maat per type. */
  grenzen?: Record<string, Maatgrenzen>;
  /**
   * De tekening van een type. Met `opties` (maat in mm) kan een product de technische tekening in de echte
   * verhoudingen tonen; zonder opties tekent het zijn eigen standaardplaatje.
   */
  tekening: (slug: string, opties?: { breedte: number; hoogte: number; maten?: boolean }) => ReactNode;
  /** Hoeveel vakken en draaiende delen een type heeft (voor toeslagen per raam of per vleugel). */
  info?: Record<string, { vakken: number; vleugels: number }>;
  /** Waar de prijzen van het bedrijf staan, bijvoorbeeld "schuifpui_matrix". */
  matrixSleutel: string;
  /** Naam in het winkelmandje en op de offerte, bijvoorbeeld "Kunststof schuifpui". */
  productNaam: string;
  /** Titel boven de typekeuze, bijvoorbeeld "Verdeling". */
  typeTitel?: string;
  startSlug?: string;
  /** Prijzen van buiten (het voorbeeld in het dashboard, ook nog niet opgeslagen). */
  matrix?: unknown;
  /** Voorbeeld in het dashboard: één smalle kolom, zonder offerteknop en winkelmandje. */
  voorbeeld?: boolean;
};

/**
 * De calculator van de klant voor alle producten naast kozijnen (schuifpui, deuren, harmonicadeuren,
 * horren): type, maten, keuzes en prijs, met dezelfde prijsberekening als de kozijncalculator.
 */
export function ProductConfigurator({
  catalogus,
  namen,
  beginmaten,
  grenzen,
  tekening,
  info,
  matrixSleutel,
  productNaam,
  typeTitel = "Type",
  startSlug,
  matrix: matrixProp,
  voorbeeld = false,
}: ProductConfiguratorProps) {
  const slugs = Object.keys(catalogus.typen);
  const [slug, setSlug] = useState(startSlug && slugs.includes(startSlug) ? startSlug : slugs[0]);
  const [breedte, setBreedte] = useState(() => (beginmaten[slug] ?? [1000, 1000])[0]);
  const [hoogte, setHoogte] = useState(() => (beginmaten[slug] ?? [1000, 1000])[1]);
  const [keuzes, setKeuzes] = useState<Record<string, string>>(() =>
    Object.fromEntries(catalogus.keuzes.map((g) => [g.id, g.keuzes[0].id])),
  );
  const [aantal, setAantal] = useState(1);
  const [klantType, setKlantType] = useState<"particulier" | "zakelijk">("particulier");
  const [opgehaald, setOpgehaald] = useState<unknown>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Zonder prijzen van buiten: de opgeslagen prijzen van het bedrijf, anders de standaardprijzen.
  useEffect(() => {
    if (matrixProp) return;
    getMatrix(matrixSleutel).then((data: unknown) => setOpgehaald(isStandaardModel(data) ? data : nieuwStandaardModel()));
  }, [matrixProp, matrixSleutel]);

  const matrix = matrixProp ?? opgehaald;
  const model = isStandaardModel(matrix) ? matrix : null;

  function kiesType(nieuw: string) {
    // Heeft de klant de maat niet zelf aangepast, dan krijgt het nieuwe type zijn eigen beginmaat.
    const [oudB, oudH] = beginmaten[slug] ?? [1000, 1000];
    if (breedte === oudB && hoogte === oudH) {
      const [nb, nh] = beginmaten[nieuw] ?? [1000, 1000];
      setBreedte(nb);
      setHoogte(nh);
    }
    setSlug(nieuw);
  }

  const opbouw = useMemo(() => {
    if (!model || breedte <= 0 || hoogte <= 0) return { regels: [] as { label: string; bedrag: number }[], totaal: 0 };
    return berekenStandaard(model, slug, breedte, hoogte, keuzes, info?.[slug] ?? { vakken: 1, vleugels: 1 }, aantal, catalogus);
  }, [model, slug, breedte, hoogte, keuzes, aantal, info, catalogus]);

  const grens = grenzen?.[slug];
  const buitenMaat = !!grens && (breedte < grens.minB || breedte > grens.maxB || hoogte < grens.minH || hoogte > grens.maxH);
  // De tekening blijft altijd de technische tekening, ook bij een leeg veld of een maat die je nog aan het typen bent:
  // hij tekent dan binnen de toegestane maten van dit type.
  const klem = (v: number, min = 300, max = 6000) => Math.min(max, Math.max(min, v || 0));
  const tekenB = klem(breedte, grens?.minB, grens?.maxB);
  const tekenH = klem(hoogte, grens?.minH, grens?.maxH);
  const btwPct = model ? btwPercentage(model) : 21;
  const metBtw = klantType === "particulier";
  const prijs = metBtw ? Math.round(opbouw.totaal * (1 + btwPct / 100) * 100) / 100 : opbouw.totaal;
  const prijsTekst = prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 });

  function handleAdd() {
    addToCart({
      slug,
      product: `${productNaam}${slugs.length > 1 ? ` · ${namen[slug] ?? slug}` : ""}`,
      prijs,
      specs: {
        breedte,
        hoogte,
        ...Object.fromEntries(catalogus.keuzes.filter((g) => !g.typen || g.typen.includes(slug)).map((g) => [g.titel, keuzeNaam(g.id, keuzes[g.id], catalogus)])),
        aantal,
        btw: metBtw ? `Prijs inclusief ${btwPct}% btw` : `Prijs exclusief btw (${btwPct}% btw komt erbij)`,
        btwPercentage: btwPct,
        klantType,
      },
    });
    setCartCount(getCart().length);
    setModalOpen(true);
  }

  if (!matrix) return <div className="p-10 text-center">Prijzen ophalen...</div>;

  const stap = "mb-1.5 text-xs font-bold text-slate-800";
  const kaart = (actief: boolean) =>
    `rounded-lg border-2 text-xs font-semibold text-slate-800 transition-colors ${actief ? "border-brand" : "border-slate-200 hover:border-slate-400"}`;

  return (
    <div className={voorbeeld ? "w-full bg-white" : "w-full min-h-screen bg-white pb-24 lg:pb-0"}>
      <div className={voorbeeld ? "p-4" : "mx-auto max-w-[1200px] px-4 py-4 sm:px-6 md:py-10"}>
        <h1 className={`font-black text-slate-800 ${voorbeeld ? "mb-2 text-base" : "mb-3 text-xl sm:text-2xl"}`}>
          {productNaam} · {namen[slug] ?? slug}
        </h1>
        {voorbeeld && (
          <div className="sticky top-0 z-20 -mx-4 -mt-4 mb-3 border-b border-slate-100 bg-white/95 px-4 py-2 backdrop-blur">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Prijsindicatie · {metBtw ? "incl. btw" : "excl. btw"}</span>
            <div className="text-2xl font-semibold tabular-nums text-slate-800">€ {prijsTekst}</div>
          </div>
        )}
        <div className={voorbeeld ? "grid grid-cols-1 gap-4" : "grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-12"}>
          <div className={voorbeeld ? "min-w-0 space-y-3" : "min-w-0 space-y-3 lg:col-span-7"}>
            <div className={`flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 ${voorbeeld ? "h-48 p-3" : tekenH > tekenB * 1.15 ? "mx-auto aspect-4/5 w-full max-w-[34rem] p-3 sm:p-5" : "h-40 p-3 sm:aspect-video sm:h-auto sm:p-5"}`}>
              {/* De tekeningen zetten zelf width 100% en height auto; dat dwingen we binnen het vak. */}
              <div className="flex h-full max-w-full items-center justify-center [&>svg]:h-full! [&>svg]:max-h-full! [&>svg]:w-auto! [&>svg]:max-w-full!">{tekening(slug, { breedte: tekenB, hoogte: tekenH, maten: !voorbeeld })}</div>
            </div>

            {slugs.length > 1 && (
              <div role="group" aria-label={typeTitel}>
                <p className={stap}>1. {typeTitel}</p>
                <div className="relative -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible">
                  {slugs.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={s === slug}
                      onClick={() => kiesType(s)}
                      className={`${kaart(s === slug)} w-24 shrink-0 p-1.5 text-center text-[11px] leading-tight sm:w-28`}>
                      <span className="mb-1 flex h-10 items-center justify-center sm:h-14 [&>svg]:h-full! [&>svg]:max-h-full! [&>svg]:w-auto! [&>svg]:max-w-full! **:[vector-effect:non-scaling-stroke]">
                        {tekening(s, { breedte: (beginmaten[s] ?? [1000, 1000])[0], hoogte: (beginmaten[s] ?? [1000, 1000])[1] })}
                      </span>
                      {namen[s] ?? s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={voorbeeld ? "min-w-0" : "min-w-0 lg:col-span-5"}>
            <div className={voorbeeld ? "space-y-3" : "space-y-3 lg:rounded-xl lg:border lg:border-slate-200 lg:bg-white lg:p-6 lg:shadow-sm"}>
              <div className="hidden lg:block">
                <span className="text-[10px] tracking-widest text-slate-400 uppercase">Prijsindicatie · {metBtw ? "incl. btw" : "excl. btw"}</span>
                <div className="text-3xl text-slate-800">€ {prijsTekst}</div>
              </div>

              <div role="group" aria-label="Particulier of zakelijk" className="flex w-fit rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                {(["particulier", "zakelijk"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={klantType === t}
                    onClick={() => setKlantType(t)}
                    className={`rounded-md px-3 py-1.5 capitalize ${klantType === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                    {t}
                  </button>
                ))}
              </div>

              {/* Stappen die uitklappen, zoals bij Creon: afmetingen, profiel en aanslag, kleur, vulling, eigenschappen */}
              <div>
                <FormField label="Afmetingen" value={`${breedte} × ${hoogte} mm`} defaultOpen>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Breedte (mm)</label>
                      <NumberInput value={breedte} onChange={setBreedte} className="w-full rounded-lg border p-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Hoogte (mm)</label>
                      <NumberInput value={hoogte} onChange={setHoogte} className="w-full rounded-lg border p-2.5 text-sm" />
                    </div>
                  </div>
                  {grens && (
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      Breedte {nl(grens.minB)} tot {nl(grens.maxB)} mm, hoogte {nl(grens.minH)} tot {nl(grens.maxH)} mm.
                    </p>
                  )}
                  {buitenMaat && grens && (
                    <p role="alert" className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Deze maat kan niet standaard besteld worden. Kies een breedte van {nl(grens.minB)} tot {nl(grens.maxB)} mm en een hoogte van {nl(grens.minH)} tot{" "}
                      {nl(grens.maxH)} mm, of neem contact met ons op voor maatwerk.
                    </p>
                  )}
                </FormField>

                {SECTIES.map((sec) => {
                  const groepen = catalogus.keuzes.filter((g) => sectieVan(g.id) === sec && (!g.typen || g.typen.includes(slug)));
                  if (groepen.length === 0) return null;
                  return (
                    <FormField key={sec} label={sec} value={groepen.map((g) => keuzeNaam(g.id, keuzes[g.id], catalogus)).join(" · ")}>
                      <div className="space-y-3">
                        {groepen.map((g) => (
                          <div key={g.id}>
                            <label className="text-[10px] font-bold text-slate-500 uppercase">{g.titel}</label>
                            <select
                              value={keuzes[g.id] ?? ""}
                              onChange={(e) => setKeuzes((k) => ({ ...k, [g.id]: e.target.value }))}
                              className="w-full rounded-lg border p-2.5 text-sm">
                              {g.keuzes.map((k) => (
                                <option key={k.id} value={k.id}>
                                  {k.naam}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </FormField>
                  );
                })}

                <FormField label="Aantal" value={`${aantal} stuks`}>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setAantal(Math.max(1, aantal - 1))} className="h-9 w-9 rounded-lg border text-lg font-bold text-slate-600 hover:bg-slate-50">
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{aantal}</span>
                    <button type="button" onClick={() => setAantal(aantal + 1)} className="h-9 w-9 rounded-lg border text-lg font-bold text-slate-600 hover:bg-slate-50">
                      +
                    </button>
                  </div>
                </FormField>
              </div>

              {!voorbeeld && !(model?.montageApart === true) && (
                <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-3 py-2">
                  <span className="text-xs font-semibold text-green-800">Bij ons is montage in de prijs inbegrepen</span>
                </div>
              )}

              {!voorbeeld && (
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={buitenMaat}
                  className="hidden w-full rounded-lg bg-brand py-4 text-[11px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-brand-dark disabled:opacity-40 disabled:hover:bg-brand lg:block">
                  Toevoegen aan offerte
                </button>
              )}
              {!voorbeeld && <p className="text-center text-[11px] text-slate-400">Ontvang uw subsidie-indicatie bij de offerte</p>}
            </div>
          </div>
        </div>

        {voorbeeld && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold text-slate-800">Zo is deze prijs opgebouwd</p>
            <dl className="mt-2 space-y-1 text-xs">
              {opbouw.regels.map((r, i) => (
                <div key={i} className="flex justify-between gap-3">
                  <dt className="text-slate-600">{r.label}</dt>
                  <dd className="shrink-0 tabular-nums text-slate-800">{euro(r.bedrag)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-[11px] text-slate-500">
              Bedragen zijn exclusief btw.{metBtw ? ` Met ${btwPct}% btw: ${euro(prijs)}.` : ""}
            </p>
          </div>
        )}
      </div>

      {!voorbeeld && (
        <>
          <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div>
              <span className="block text-[10px] tracking-widest text-slate-400 uppercase">Prijsindicatie · {metBtw ? "incl. btw" : "excl. btw"}</span>
              <span className="text-xl font-semibold text-slate-800 tabular-nums">€ {prijsTekst}</span>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={buitenMaat}
              className="rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-40">
              Toevoegen
            </button>
          </div>
          <CartAddedModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            product={`${productNaam} · ${namen[slug] ?? slug}`}
            breedte={breedte}
            hoogte={hoogte}
            aantal={aantal}
            prijs={prijs}
            cartCount={cartCount}
            onAddAnother={() => setModalOpen(false)}
          />
        </>
      )}
    </div>
  );
}
