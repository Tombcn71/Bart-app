"use client";
import { toast } from "sonner";
import { useEffect, useState, type ReactNode } from "react";
import { saveMatrix } from "@/app/actions";
import { getMatrix } from "@/lib/matrix";
import { Bevestig } from "./bevestig";
import { StandaardEditor } from "./standaard-editor";
import { isStandaardModel, leegModel, nieuwStandaardModel, type Catalogus, type StandaardModel } from "@/lib/prijsmodel";

export type Materiaal = "kunststof" | "aluminium";

export type MateriaalInstelling = {
  /** Waar de prijzen van het bedrijf staan, bijvoorbeeld "schuifpui_matrix". */
  sleutel: string;
  catalogus: Catalogus;
  namen: Record<string, string>;
  /** Indeling van de types in groepen (bijvoorbeeld enkele en dubbele deuren); zonder groepen komen ze op één rij. */
  groepen?: { titel: string; slugs: string[] }[];
  /** Kleine tekening per type, naast de naam in het prijsscherm. */
  tekening?: (slug: string) => ReactNode;
  /** Het voorbeeld van de klantcalculator met de prijzen die in beeld staan. */
  voorbeeld: (model: StandaardModel) => ReactNode;
};

// Heeft een bedrijf al echte prijzen ingevuld (een bedrag boven nul)? Zo niet, dan begint het met de standaardprijzen.
function heeftGetallen(x: unknown): boolean {
  if (typeof x === "number") return x > 0;
  if (x && typeof x === "object") return Object.values(x).some(heeftGetallen);
  return false;
}

/**
 * Het prijzenscherm van een product naast kozijnen: standaardprijzen met een schuif of zelf invullen,
 * montage en btw, met een voorbeeld van wat de klant ziet. Zelfde opzet als bij de kozijnen.
 */
export function ProductPrijzen({
  titel,
  typeTitel,
  materialen,
  alleenZelf = false,
  veldLabels,
}: {
  titel: string;
  typeTitel: string;
  /** Er zijn geen standaardprijzen: het bedrijf vult alles zelf in en ziet geen schuif. */
  alleenZelf?: boolean;
  /** Andere namen voor de vier prijsvelden per type. */
  veldLabels?: React.ComponentProps<typeof StandaardEditor>["veldLabels"];
  materialen: Partial<Record<Materiaal, MateriaalInstelling>>;
}) {
  const beschikbaar = (Object.keys(materialen) as Materiaal[]).filter((m) => materialen[m]);
  const [materiaal, setMateriaal] = useState<Materiaal>(beschikbaar[0]);
  const [prijzen, setPrijzen] = useState<Partial<Record<Materiaal, StandaardModel>>>({});
  const [oud, setOud] = useState<Partial<Record<Materiaal, unknown>>>({});
  const [nogNietOpgeslagen, setNogNietOpgeslagen] = useState<Partial<Record<Materiaal, boolean>>>({});
  const [kopie, setKopie] = useState<Partial<Record<Materiaal, { standaard?: StandaardModel; zelf?: StandaardModel }>>>({});
  const [weergave, setWeergave] = useState<"prijzen" | "voorbeeld">("prijzen");
  const [saving, setSaving] = useState(false);
  const [saveVraag, setSaveVraag] = useState(false);
  const [opgeslagenFactor, setOpgeslagenFactor] = useState<Partial<Record<Materiaal, number>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function laden() {
      const data = await Promise.all(beschikbaar.map((m) => getMatrix(materialen[m]!.sleutel)));
      const nieuw: Partial<Record<Materiaal, StandaardModel>> = {};
      const nog: Partial<Record<Materiaal, boolean>> = {};
      const oudData: Partial<Record<Materiaal, unknown>> = {};
      beschikbaar.forEach((m, i) => {
        nieuw[m] = isStandaardModel(data[i]) ? data[i] : alleenZelf ? leegModel(materialen[m]!.catalogus) : nieuwStandaardModel();
        nog[m] = !isStandaardModel(data[i]);
        if (!isStandaardModel(data[i]) && heeftGetallen(data[i])) oudData[m] = data[i];
      });
      setOpgeslagenFactor(Object.fromEntries(beschikbaar.map((m, i) => [m, isStandaardModel(data[i]) ? data[i].factor : 1])));
      setPrijzen(nieuw);
      setNogNietOpgeslagen(nog);
      setOud(oudData);
      setLoading(false);
    }
    laden();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || !prijzen[materiaal]) return <div className="p-6">Prijzen ophalen...</div>;

  const inst = materialen[materiaal]!;
  const huidig = prijzen[materiaal]!;
  const zelf = huidig.zelf === true;
  const zetModel = (m: StandaardModel) => setPrijzen((p) => ({ ...p, [materiaal]: m }));
  const kies = (naarZelf: boolean) => {
    if (naarZelf === zelf) return;
    setKopie((k) => ({ ...k, [materiaal]: { ...k[materiaal], [zelf ? "zelf" : "standaard"]: huidig } }));
    const terug = kopie[materiaal]?.[naarZelf ? "zelf" : "standaard"];
    zetModel(terug ?? (naarZelf ? leegModel(inst.catalogus) : nieuwStandaardModel()));
  };

  const klikOpslaan = () => {
    // Een schuifstand die nog niet is opgeslagen verandert al je prijzen: eerst vragen.
    if (huidig.factor !== (opgeslagenFactor[materiaal] ?? 1)) setSaveVraag(true);
    else handleSave();
  };
  const handleSave = async () => {
    setSaving(true);
    const result = await saveMatrix(inst.sleutel, huidig);
    if (result.success && oud[materiaal]) await saveMatrix(`${inst.sleutel}_oud`, oud[materiaal]);
    setSaving(false);
    if (result.success) {
      setNogNietOpgeslagen((n) => ({ ...n, [materiaal]: false }));
      setOpgeslagenFactor((f) => ({ ...f, [materiaal]: huidig.factor }));
      toast.success(`${beschikbaar.length > 1 ? (materiaal === "kunststof" ? "Kunststof" : "Aluminium") : titel} prijzen opgeslagen!`);
    } else toast.error("Fout bij opslaan.");
  };

  const sleutelStatus = `${materiaal}-${zelf ? "zelf" : "standaard"}`;

  const verschilTxt = Math.round((huidig.factor - 1) * 100);
  return (
    <div className="space-y-6">
      {saveVraag && (
        <Bevestig
          titel="Weet je het zeker?"
          tekst={`Al je prijzen worden ${Math.abs(verschilTxt)}% ${verschilTxt < 0 ? "goedkoper" : "duurder"} dan de standaardprijzen, ook die in je calculator. Doorgaan met opslaan?`}
          jaLabel="Ja, opslaan"
          onNee={() => setSaveVraag(false)}
          onJa={() => {
            setSaveVraag(false);
            handleSave();
          }}
        />
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">{titel}</h2>
          <p className="text-sm text-slate-500">
            {zelf
              ? "Vul de prijzen in zoals je ze zelf rekent. Laat een bedrag leeg als je er niets voor rekent."
              : "Alle prijzen staan voor je klaar. Zet de schuif voor goedkoper of duurder, of pas een bedrag aan."}
          </p>
        </div>
        <button
          onClick={klikOpslaan}
          disabled={saving}
          className="shrink-0 rounded-xl bg-brand px-6 py-2 font-bold text-white transition-all hover:bg-brand-dark">
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
      </div>

      {beschikbaar.length > 1 && (
        <div className="flex w-fit rounded-xl bg-slate-100 p-1">
          {beschikbaar.map((m) => (
            <button
              key={m}
              onClick={() => setMateriaal(m)}
              className={`rounded-lg px-6 py-2 text-sm font-bold capitalize transition-colors ${
                materiaal === m ? "bg-brand text-white shadow-md" : "text-slate-500 hover:text-slate-800"
              }`}>
              {m}
            </button>
          ))}
        </div>
      )}

      <div className="flex w-fit rounded-xl bg-slate-100 p-1 lg:hidden">
        {(["prijzen", "voorbeeld"] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWeergave(w)}
            className={`rounded-lg px-5 py-2 text-sm font-bold capitalize transition-colors ${
              weergave === w ? "bg-brand text-white shadow-md" : "text-slate-500 hover:text-slate-800"
            }`}>
            {w}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,38rem)_minmax(0,1fr)] lg:items-start">
        <div className={`space-y-6 ${weergave === "voorbeeld" ? "hidden lg:block" : ""}`}>
          {!alleenZelf && (
          <fieldset className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <legend className="sr-only">Hoe stel je je prijzen in?</legend>
            <p className="text-sm font-bold text-slate-800">Hoe stel je je prijzen in?</p>
            <div className="mt-3 space-y-2">
              {[
                { zelf: false, titel: "Vooringevuld met standaardprijzen", tekst: "Alles staat klaar. Wil je bijvoorbeeld 30% goedkoper zijn? Zet dan de schuif op 30% goedkoper, zonder verder werk." },
                { zelf: true, titel: "Zelf invullen", tekst: "Dezelfde velden, maar leeg. Je vult alle prijzen zelf in, per type en per keuze." },
              ].map((o) => (
                <label
                  key={o.titel}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 ${o.zelf === zelf ? "border-brand" : "border-slate-200 hover:border-slate-400"}`}>
                  <input type="radio" name={`prijsmodel-${titel}-${materiaal}`} checked={o.zelf === zelf} onChange={() => kies(o.zelf)} className="mt-1 accent-[var(--color-brand)]" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">{o.titel}</span>
                    <span className="block text-xs text-slate-500">{o.tekst}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          )}

          {nogNietOpgeslagen[materiaal] && !zelf && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">Dit zijn de standaardprijzen, nog niet opgeslagen.</p>
              <p className="mt-0.5">
                {oud[materiaal]
                  ? "Je eerdere prijzen blijven in je calculator staan tot je op Opslaan klikt. Ze blijven bewaard."
                  : "Pas aan wat je wilt en klik op Opslaan om ze in je calculator te gebruiken."}
              </p>
            </div>
          )}

          <StandaardEditor
            key={sleutelStatus}
            model={huidig}
            onChange={zetModel}
            catalogus={inst.catalogus}
            namen={inst.namen}
            typeTitel={typeTitel}
            groepen={inst.groepen ?? []}
            tekening={inst.tekening}
            veldLabels={veldLabels}
          />
        </div>

        <aside className={`lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto ${weergave === "prijzen" ? "hidden lg:block" : ""}`}>
          <div className="overflow-clip rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-800">Prijscheck</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Kies een type en een maat. Prijzen die je typt tellen meteen mee, ook als je ze nog niet hebt opgeslagen.
              </p>
            </div>
            <div key={sleutelStatus}>{inst.voorbeeld(huidig)}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
