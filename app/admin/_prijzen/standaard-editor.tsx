"use client";
import { useState } from "react";
import { KOZIJN_GROEPEN, KOZIJN_NAMEN } from "@/lib/kozijn-namen";
import { KOZIJN_CATALOGUS, keuzeToeslag, leegModel, montageTotaal, nieuwStandaardModel, typeRecept, type Catalogus, type MontageSom, type StandaardModel } from "@/lib/prijsmodel";
import type { Toeslag, TypeRecept } from "@/lib/prijsmotor";
import { Kaart, PrijsVeld, Rij } from "./prijs-veld";

type ToeslagSleutel = Exclude<keyof Toeslag, "metGlas">;

// Onderdelen van een toeslag, met de eenheid waarin het bedrijf ze invult.
const TOESLAG_VELDEN: { sleutel: ToeslagSleutel; label: string; eenheid: "€" | "%"; schaal: number }[] = [
  { sleutel: "procent", label: "% van het kozijn", eenheid: "%", schaal: 100 },
  { sleutel: "perM2", label: "per m²", eenheid: "€", schaal: 1 },
  { sleutel: "perRaam", label: "per raam", eenheid: "€", schaal: 1 },
  { sleutel: "perVleugel", label: "per draai/kiep-raam", eenheid: "€", schaal: 1 },
  { sleutel: "perMBreedte", label: "per meter breedte", eenheid: "€", schaal: 1 },
  { sleutel: "vast", label: "vast bedrag", eenheid: "€", schaal: 1 },
];

const TYPE_VELDEN: { sleutel: "basis" | "perMBreedte" | "perMHoogte" | "perM2"; label: string; kort: string }[] = [
  { sleutel: "basis", label: "Vast bedrag per kozijn", kort: "Vast bedrag" },
  { sleutel: "perMBreedte", label: "Per meter breedte", kort: "Per m breedte" },
  { sleutel: "perMHoogte", label: "Per meter hoogte", kort: "Per m hoogte" },
  { sleutel: "perM2", label: "Per m² glas", kort: "Per m² glas" },
];

const afronden = (n: number) => Math.round(n * 100) / 100;

/** Klein veld voor een aantal (monteurs, kozijnen per dag). */
function AantalVeld({ label, waarde, onChange }: { label: string; waarde: number; onChange: (n: number) => void }) {
  return (
    <label className="block w-32 shrink-0">
      <span className="sr-only">{label}</span>
      <input
        type="number"
        min={1}
        max={20}
        inputMode="numeric"
        value={waarde}
        onChange={(e) => onChange(Math.min(20, Math.max(1, Math.round(Number(e.target.value)) || 1)))}
        className="w-full rounded-lg border border-slate-200 py-1.5 pr-3 pl-3 text-right text-sm tabular-nums"
      />
    </label>
  );
}

/**
 * Prijzen instellen met de standaardprijzen als basis: een prijsniveau (schuif), montage, en
 * waar het bedrijf wil afwijken per kozijntype of per keuze.
 */
export function StandaardEditor({
  model,
  onChange,
  catalogus = KOZIJN_CATALOGUS,
  namen = KOZIJN_NAMEN,
  typeTitel = "Prijzen per kozijntype",
  groepen = KOZIJN_GROEPEN,
  tekening,
  veldLabels,
  standaardModel = nieuwStandaardModel,
}: {
  model: StandaardModel;
  onChange: (m: StandaardModel) => void;
  /** Types en keuzes van het product; standaard die van kozijnen. */
  catalogus?: Catalogus;
  namen?: Record<string, string>;
  typeTitel?: string;
  /** Indeling van de types in groepen; standaard die van kozijnen. Types die er niet in staan komen onderaan. */
  groepen?: { titel: string; slugs: string[] }[];
  /** Een kleine tekening naast de naam van elk type, zodat te zien is om welk type het gaat. */
  tekening?: (slug: string) => React.ReactNode;
  /** Andere namen voor de vier prijsvelden per type, voor producten die niet per kozijn geprijsd worden. */
  veldLabels?: Partial<Record<"basis" | "perMBreedte" | "perMHoogte" | "perM2", { label: string; kort: string }>>;
  /** Het model waar "Reset" naar terugkeert en waarmee wordt vergeleken; standaard de kale standaardprijzen. */
  standaardModel?: () => StandaardModel;
}) {
  const [reset, setReset] = useState(0);
  // Hoeveel goedkoper (min) of duurder (plus) dan de standaardprijzen, in procenten.
  const verschil = Math.round((model.factor - 1) * 100);
  const aangepast = Object.keys(model.typen ?? {}).length + Object.values(model.keuzes ?? {}).reduce((n, g) => n + Object.keys(g).length, 0);

  const zetType = (slug: string, sleutel: keyof TypeRecept, waarde: number) =>
    onChange({ ...model, typen: { ...model.typen, [slug]: { ...model.typen?.[slug], [sleutel]: waarde } } });

  const zetToeslag = (groep: string, id: string, sleutel: ToeslagSleutel, waarde: number) =>
    onChange({
      ...model,
      keuzes: { ...model.keuzes, [groep]: { ...model.keuzes?.[groep], [id]: { ...keuzeToeslag(model, groep, id, catalogus), [sleutel]: waarde } } },
    });

  const resetAlles = () => {
    onChange(model.zelf ? leegModel(catalogus) : standaardModel());
    setReset((r) => r + 1);
  };
  // Groepen met alleen de types die dit product heeft; wat nergens in staat komt in een laatste groep.
  const alleSlugs = Object.keys(catalogus.typen);
  const ingedeeld = new Set(groepen.flatMap((g) => g.slugs));
  const typeGroepen = [
    ...groepen.map((g) => ({ ...g, slugs: g.slugs.filter((s) => alleSlugs.includes(s)) })),
    { titel: groepen.length ? "Overige" : typeTitel, slugs: alleSlugs.filter((s) => !ingedeeld.has(s)) },
  ].filter((g) => g.slugs.length > 0);

  const wijkt = model.factor !== 1 || (model.montage ?? 0) !== (standaardModel().montage ?? 0) || (model.btw !== undefined && model.btw !== 21) || model.montageApart === true || aangepast > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{model.zelf ? "Dit zijn je eigen prijzen." : wijkt ? "Je prijzen wijken af van de standaardprijzen." : "Dit zijn de standaardprijzen."}</p>
        <button
          type="button"
          disabled={!wijkt}
          onClick={resetAlles}
          className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent">
          {model.zelf ? "Alles leegmaken" : "Reset standaardprijzen"}
        </button>
      </div>

      {!model.zelf && (
        <Kaart
          titel="Goedkoper of duurder dan de standaardprijzen"
          uitleg="Zet de schuif en al je prijzen gaan in één keer mee, zonder verder werk. Wil je 30% goedkoper zijn, zet hem dan op 30% goedkoper.">
          <div className="space-y-3 px-4 py-4">
            <p className="text-3xl font-bold text-slate-900">
              {verschil === 0 ? "Standaardprijzen" : verschil < 0 ? `${-verschil}% goedkoper` : `${verschil}% duurder`}
            </p>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={Math.min(50, Math.max(-50, verschil))}
              aria-label="Goedkoper of duurder dan de standaardprijzen, in procenten"
              onChange={(e) => onChange({ ...model, factor: 1 + Number(e.target.value) / 100 })}
              className="w-full accent-[var(--color-brand)]"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>50% goedkoper</span>
              <span>standaard</span>
              <span>50% duurder</span>
            </div>
            <button
              type="button"
              disabled={!wijkt}
              onClick={resetAlles}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent">
              Reset standaardprijzen
            </button>
          </div>
        </Kaart>
      )}

      {(() => {
        // Het rekenkaartje: elke regel is een invulveld; het totaal komt vanzelf in de prijs van het kozijn.
        const heeftSom = !!model.montageSom;
        const som: MontageSom = model.montageSom ?? (model.montage > 0 ? { overig: model.montage } : {});
        const zet = (patch: Partial<MontageSom>) => {
          const nieuw = { ...som, ...patch };
          onChange({ ...model, montageSom: nieuw, montage: montageTotaal(nieuw) });
        };
        const totaal = montageTotaal(som);
        const bedrag = (key: keyof MontageSom, label: string) => (
          <PrijsVeld key={`${key}-${reset}`} label={label} waarde={(som[key] as number | undefined) ?? 0} onChange={(n) => zet({ [key]: n })} />
        );
        return (
          <Kaart
            titel="Montage per kozijn"
            uitleg="Wat kost het jou om één kozijn te plaatsen? Vul in wat voor jou klopt, de som komt vanzelf in de prijs van het kozijn. Alle bedragen zijn exclusief btw. De standaardprijzen zijn zonder montage.">
            <Rij naam="Aantal monteurs">
              <AantalVeld key={`monteurs-${reset}`} label="Aantal monteurs" waarde={som.monteurs ?? 2} onChange={(n) => zet({ monteurs: n })} />
            </Rij>
            <Rij naam="Bedrag per monteur, per dag">{bedrag("perMonteur", "Bedrag per monteur per dag")}</Rij>
            <Rij naam="Transport per monteur, per dag">{bedrag("transportPerMonteur", "Transport per monteur per dag")}</Rij>
            <Rij naam="Kozijnen die ze op één dag plaatsen">
              <AantalVeld key={`perdag-${reset}`} label="Kozijnen per dag" waarde={som.kozijnenPerDag ?? 1} onChange={(n) => zet({ kozijnenPerDag: n })} />
            </Rij>
            <p className="px-4 pb-2 text-[11px] text-slate-500">
              De kosten van de monteurs en het transport worden verdeeld over het aantal kozijnen dat ze op een dag plaatsen.
            </p>
            <Rij naam="Montagemateriaal, per kozijn">{bedrag("materiaal", "Montagemateriaal per kozijn")}</Rij>
            <Rij naam="Afval wegbrengen, per kozijn">{bedrag("afval", "Afval wegbrengen per kozijn")}</Rij>
            <Rij naam="Risico, per kozijn (klein afstelwerk na montage)">{bedrag("risico", "Risico per kozijn")}</Rij>
            <Rij naam="Jouw winst, per kozijn">{bedrag("winst", "Jouw winst per kozijn")}</Rij>
            {som.overig !== undefined && som.overig > 0 && heeftSom && <Rij naam="Eerder ingevuld bedrag">{bedrag("overig", "Eerder ingevuld bedrag")}</Rij>}
            {!heeftSom && som.overig !== undefined && (
              <Rij naam="Eerder ingevuld bedrag">{bedrag("overig", "Eerder ingevuld bedrag")}</Rij>
            )}
            <div className="flex items-center justify-between gap-4 bg-slate-50 px-4 py-3">
              <span className="text-sm font-bold text-slate-800">Montage per kozijn</span>
              <span className="text-lg font-bold tabular-nums text-slate-900">
                € {totaal.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
        <fieldset className="space-y-2 px-4 py-3">
          <legend className="sr-only">Hoe laat je de montage zien?</legend>
          {[
            { apart: false, titel: "Montage inbegrepen in de prijs", tekst: "De montage zit in de prijs van het kozijn. De offerte zegt: inclusief montage." },
            { apart: true, titel: "Montage apart vermelden", tekst: "De klant ziet de montage als aparte regel bovenop het kozijn." },
          ].map((o) => (
            <label key={o.titel} className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="montage-tonen"
                checked={(model.montageApart ?? false) === o.apart}
                onChange={() => onChange({ ...model, montageApart: o.apart })}
                className="mt-1 accent-[var(--color-brand)]"
              />
              <span>
                <span className="block text-sm text-slate-800">{o.titel}</span>
                <span className="block text-xs text-slate-500">{o.tekst}</span>
              </span>
            </label>
          ))}
        </fieldset>
          </Kaart>
        );
      })()}

      <Kaart titel="Btw" uitleg="Alle prijzen hier zijn exclusief btw. Particulieren zien de prijs inclusief btw, zakelijke klanten exclusief, met de btw apart op de offerte.">
        <Rij naam="Btw-percentage">
          <PrijsVeld key={`btw-${reset}`} label="Btw-percentage" eenheid="%" standaard={21} waarde={model.btw ?? 21} onChange={(n) => onChange({ ...model, btw: n })} />
        </Rij>
      </Kaart>

      {typeGroepen.map((gr, i) => (
        <Kaart key={gr.titel} titel={gr.titel} uitleg={i === 0 ? "De standaardprijzen, exclusief btw. Staat er bij vast bedrag \"inbegrepen\", dan zit het al in de prijs per meter. Reken je zelf een vast bedrag, vul het dan in en zet de prijs per meter lager." : undefined}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="px-4 py-2">Kozijn</th>
                  {TYPE_VELDEN.map((v) => (
                    <th key={v.sleutel} className="px-2 py-2 text-right">
                      {veldLabels?.[v.sleutel]?.kort ?? v.kort}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gr.slugs.map((slug) => {
                  const recept = typeRecept(model, slug, catalogus)!;
                  const eigen = TYPE_VELDEN.some((v) => Math.abs(recept[v.sleutel] - catalogus.typen[slug][v.sleutel]) > 0.004);
                  return (
                    <tr key={`${slug}-${reset}`}>
                      <td className="px-4 py-1.5 text-xs text-slate-800">
                        <span className="flex min-w-[11.5rem] items-center gap-2.5">
                          {tekening && (
                            <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-md bg-slate-50 p-1 [&>svg]:h-full! [&>svg]:max-h-full! [&>svg]:w-auto! [&>svg]:max-w-full!">
                              {tekening(slug)}
                            </span>
                          )}
                          <span>
                            {namen[slug] ?? slug}
                            {eigen && !model.zelf && <span className="ml-1 text-[10px] font-semibold text-brand-text">aangepast</span>}
                          </span>
                        </span>
                      </td>
                      {TYPE_VELDEN.map((v) => (
                        <td key={v.sleutel} className="px-2 py-1.5">
                          <PrijsVeld
                            breedte="w-[7.5rem]"
                            standaard={model.zelf ? undefined : afronden(catalogus.typen[slug][v.sleutel])}
                            leeg={!model.zelf && v.sleutel === "basis" && afronden(catalogus.typen[slug].basis) === 0 ? "inbegrepen" : undefined}
                            label={`${namen[slug] ?? slug}: ${veldLabels?.[v.sleutel]?.label ?? v.label}`}
                            waarde={afronden(recept[v.sleutel])}
                            onChange={(n) => zetType(slug, v.sleutel, n)}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Kaart>
      ))}

      {catalogus.keuzes.map((groep) => (
        <Kaart key={groep.id} titel={groep.titel} uitleg={`Wat deze keuze erbij kost. Laat een bedrag op € 0 als je er niets voor rekent.${groep.typen ? ` Geldt alleen voor: ${groep.typen.map((s) => namen?.[s] ?? s).join(", ")}.` : ""}`}>
          {groep.keuzes.map((k) => {
            const t = keuzeToeslag(model, groep.id, k.id, catalogus);
            const velden = TOESLAG_VELDEN.filter((v) => t[v.sleutel] !== undefined);
            return (
              <div key={`${k.id}-${reset}`} className="px-4 py-2.5">
                <p className="text-sm text-slate-800">{k.naam}</p>
                {velden.length === 0 ? (
                  <p className="text-xs text-slate-400">Geen toeslag</p>
                ) : (
                  <div className="mt-1.5 space-y-1.5">
                    {velden.map((v) => (
                      <div key={v.sleutel} className="flex items-center justify-between gap-4">
                        <span className="text-xs text-slate-500">{v.label}</span>
                        <PrijsVeld
                          label={`${k.naam}: ${v.label}`}
                          eenheid={v.eenheid}
                          standaard={model.zelf ? undefined : afronden((k.toeslag[v.sleutel] ?? 0) * v.schaal)}
                          waarde={afronden((t[v.sleutel] ?? 0) * v.schaal)}
                          onChange={(n) => zetToeslag(groep.id, k.id, v.sleutel, n / v.schaal)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </Kaart>
      ))}
    </div>
  );
}
