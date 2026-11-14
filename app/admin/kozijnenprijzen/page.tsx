"use client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { saveMatrix } from "@/app/actions";
import { getMatrix } from "@/lib/matrix";
import { StandaardEditor } from "../_prijzen/standaard-editor";
import { isStandaardModel, KOZIJN_CATALOGUS, kozijnStandaardModel, leegModel, type StandaardModel } from "@/lib/prijsmodel";
import { KozijnConfigurator, kozijnTekening } from "@/app/components/KozijnConfigurator";
import { ALU_CATALOGUS } from "@/lib/aluminium";

type Materiaal = "kunststof" | "aluminium";

const SLEUTEL: Record<Materiaal, string> = { kunststof: "kozijn_matrix", aluminium: "alu_kozijn_matrix" };
const CATALOGUS = { kunststof: KOZIJN_CATALOGUS, aluminium: ALU_CATALOGUS };

// Heeft een bedrijf al echte prijzen ingevuld (een bedrag boven nul)? Zo niet, dan begint het met de standaardprijzen.
function heeftGetallen(x: unknown): boolean {
  if (typeof x === "number") return x > 0;
  if (x && typeof x === "object") return Object.values(x).some(heeftGetallen);
  return false;
}

export default function KozijnenPrijzen() {
  const [materiaal, setMateriaal] = useState<Materiaal>("kunststof");
  const [prijzen, setPrijzen] = useState<Record<Materiaal, StandaardModel | null>>({ kunststof: null, aluminium: null });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  // Eerder opgeslagen prijzen in de oude opzet; die blijven bewaard bij het opslaan.
  const [oud, setOud] = useState<Record<Materiaal, any>>({ kunststof: null, aluminium: null });
  // Het bedrijf heeft nog niets opgeslagen: de standaardprijzen staan in beeld maar gelden nog niet.
  const [nogNietOpgeslagen, setNogNietOpgeslagen] = useState<Record<Materiaal, boolean>>({ kunststof: false, aluminium: false });
  // Wisselen tussen standaardprijzen en zelf invullen verliest niets: elk houdt zijn eigen invulling.
  const [kopie, setKopie] = useState<Record<Materiaal, { standaard?: StandaardModel; zelf?: StandaardModel }>>({ kunststof: {}, aluminium: {} });
  // Op een telefoon is er maar plek voor één van de twee.
  const [weergave, setWeergave] = useState<"prijzen" | "voorbeeld">("prijzen");

  useEffect(() => {
    async function loadData() {
      const [kData, aData] = await Promise.all([getMatrix(SLEUTEL.kunststof), getMatrix(SLEUTEL.aluminium)]);
      const start = (data: any): StandaardModel => (isStandaardModel(data) ? data : kozijnStandaardModel());
      setPrijzen({ kunststof: start(kData), aluminium: start(aData) });
      setNogNietOpgeslagen({ kunststof: !isStandaardModel(kData), aluminium: !isStandaardModel(aData) });
      setOud({
        kunststof: !isStandaardModel(kData) && heeftGetallen(kData) ? kData : null,
        aluminium: !isStandaardModel(aData) && heeftGetallen(aData) ? aData : null,
      });
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    const model = prijzen[materiaal];
    if (!model) return;
    setSaving(true);
    const result = await saveMatrix(SLEUTEL[materiaal], model);
    // De eerdere prijzen in de oude opzet blijven bewaard.
    if (result.success && oud[materiaal]) await saveMatrix(`${SLEUTEL[materiaal]}_oud`, oud[materiaal]);
    setSaving(false);
    if (result.success) setNogNietOpgeslagen((n) => ({ ...n, [materiaal]: false }));
    if (result.success) toast.success(`${materiaal === "kunststof" ? "Kunststof" : "Aluminium"} prijzen opgeslagen!`);
    else toast.error("Fout bij opslaan.");
  };

  if (loading) return <div className="p-6">Prijzen ophalen...</div>;

  const huidig = prijzen[materiaal]!;
  const zelf = huidig.zelf === true;
  const zetModel = (m: StandaardModel) => setPrijzen((p) => ({ ...p, [materiaal]: m }));
  const kies = (naarZelf: boolean) => {
    if (naarZelf === zelf) return;
    // Wat er nu staat bewaren, en de andere invulling terughalen of nieuw beginnen.
    setKopie((k) => ({ ...k, [materiaal]: { ...k[materiaal], [zelf ? "zelf" : "standaard"]: huidig } }));
    const terug = kopie[materiaal][naarZelf ? "zelf" : "standaard"];
    zetModel(terug ?? (naarZelf ? leegModel(CATALOGUS[materiaal]) : kozijnStandaardModel()));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Kozijn & glas</h2>
          <p className="text-sm text-slate-500">
            {zelf
              ? "Vul de prijzen in zoals je ze zelf rekent. Laat een bedrag leeg als je er niets voor rekent."
              : "Alle prijzen staan voor je klaar. Zet de schuif voor goedkoper of duurder, of pas een bedrag aan."}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 rounded-xl bg-brand px-6 py-2 font-bold text-white transition-all hover:bg-brand-dark">
          {saving ? "Opslaan..." : "Opslaan"}
        </button>
      </div>

      <div className="flex w-fit rounded-xl bg-slate-100 p-1">
        {(["kunststof", "aluminium"] as Materiaal[]).map((m) => (
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
          <fieldset className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <legend className="sr-only">Hoe stel je je prijzen in?</legend>
            <p className="text-sm font-bold text-slate-800">Hoe stel je je prijzen in?</p>
            <div className="mt-3 space-y-2">
              {[
                { zelf: false, titel: "Vooringevuld met standaardprijzen", tekst: "Alle kozijnen en keuzes staan klaar. Wil je bijvoorbeeld 30% goedkoper zijn? Zet dan de schuif op 30% goedkoper, zonder verder werk." },
                { zelf: true, titel: "Zelf invullen", tekst: "Dezelfde velden, maar leeg. Je vult alle prijzen zelf in, per kozijn en per keuze." },
              ].map((o) => (
                <label
                  key={o.titel}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 ${o.zelf === zelf ? "border-brand" : "border-slate-200 hover:border-slate-400"}`}>
                  <input type="radio" name={`prijsmodel-${materiaal}`} checked={o.zelf === zelf} onChange={() => kies(o.zelf)} className="mt-1 accent-[var(--color-brand)]" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">{o.titel}</span>
                    <span className="block text-xs text-slate-500">{o.tekst}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

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
            standaardModel={kozijnStandaardModel}
            key={`${materiaal}-${zelf ? "zelf" : "standaard"}`}
            model={huidig}
            onChange={zetModel}
            catalogus={CATALOGUS[materiaal]}
            tekening={kozijnTekening}
          />
        </div>

        <aside className={`lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto ${weergave === "prijzen" ? "hidden lg:block" : ""}`}>
          <div className="overflow-clip rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
              <h2 className="text-sm font-bold text-slate-800">Prijscheck</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Kies een kozijn en een maat. Prijzen die je typt tellen meteen mee, ook als je ze nog niet hebt opgeslagen.
              </p>
            </div>
            <KozijnConfigurator key={`${materiaal}-${zelf ? "zelf" : "standaard"}`} voorbeeld product={materiaal} matrix={huidig} startSlug="dk-13-vast-23" />
          </div>
        </aside>
      </div>
    </div>
  );
}
