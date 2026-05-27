"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { saveOfferte } from "@/app/actions";
import { getMatrix } from "@/lib/data";
import { HarmonicadeurSVG } from "@/lib/harmonicadeur-svgs";

const opties: Record<string, { sections: 3 | 4 | 5; name: string }> = {
  driedelig: { sections: 3, name: "Driedelige harmonicadeur" },
  vierdelig: { sections: 4, name: "Vierdelige harmonicadeur" },
  vijfdelig: { sections: 5, name: "Vijfdelige harmonicadeur" },
};

export default function HarmonicadeurConfiguratorDetail() {
  const { id } = useParams();
  const slug = typeof id === "string" ? id : "driedelig";
  const deur = opties[slug] ?? opties.driedelig;

  const [matrix, setMatrix] = useState<any>(null);
  const [breedte, setBreedte] = useState(2400);
  const [hoogte, setHoogte] = useState(2100);
  const [kleur, setKleur] = useState("");
  const [glas, setGlas] = useState("");
  const [aantal, setAantal] = useState(1);
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getMatrix("harmonicadeur_matrix").then((data: any) => {
      if (data) {
        setMatrix(data);
        setKleur(Object.keys(data.kleurToeslag || {})[0] || "");
        setGlas(Object.keys(data.glasToeslag || {})[0] || "");
      }
    });
  }, []);

  const berekendePrijs = useMemo(() => {
    if (!matrix) return 0;
    const m2 = (breedte / 1000) * (hoogte / 1000);
    const kToeslag = matrix.kleurToeslag?.[kleur] ?? 0;
    const gToeslag = matrix.glasToeslag?.[glas] ?? 0;
    const sectieFactor = deur.sections;
    return (
      (matrix.basisPrijs + m2 * matrix.m2Tarief + kToeslag + gToeslag + matrix.montageKosten) *
      sectieFactor *
      aantal
    );
  }, [matrix, breedte, hoogte, kleur, glas, aantal, deur.sections]);

  if (!matrix)
    return <div className="p-10 text-center text-slate-400">Configuratie laden...</div>;

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <Link
          href="/harmonicadeur"
          className="text-[11px] uppercase tracking-wider text-slate-400 hover:text-[#1066a3]">
          ← Overzicht
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
          {/* SVG preview */}
          <div className="lg:col-span-7">
            <h1 className="text-2xl font-semibold uppercase text-slate-800 mb-6">
              {deur.name}
            </h1>
            <div className="bg-slate-50 p-10 rounded-xl border flex items-center justify-center">
              <HarmonicadeurSVG sections={deur.sections} />
            </div>
          </div>

          {/* Configuratie form */}
          <div className="lg:col-span-5">
            <div className="bg-white border rounded-xl p-6 space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Prijsindicatie
                </span>
                <div className="text-3xl font-light">
                  € {berekendePrijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Breedte (mm)
                  </label>
                  <input
                    type="number"
                    value={breedte}
                    onChange={(e) => setBreedte(Number(e.target.value))}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Hoogte (mm)
                  </label>
                  <input
                    type="number"
                    value={hoogte}
                    onChange={(e) => setHoogte(Number(e.target.value))}
                    className="w-full border p-2.5 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Kleur
                </label>
                <select
                  value={kleur}
                  onChange={(e) => setKleur(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-sm capitalize">
                  {Object.keys(matrix.kleurToeslag || {}).map((k) => (
                    <option key={k} value={k}>{k.replace(/-/g, " ")}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Glassoort
                </label>
                <select
                  value={glas}
                  onChange={(e) => setGlas(e.target.value)}
                  className="w-full border p-2.5 rounded-lg text-sm capitalize">
                  {Object.keys(matrix.glasToeslag || {}).map((k) => (
                    <option key={k} value={k}>{k.replace(/-/g, " ")}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Aantal
                </label>
                <input
                  type="number"
                  min={1}
                  value={aantal}
                  onChange={(e) => setAantal(Number(e.target.value))}
                  className="w-full border p-2.5 rounded-lg text-sm"
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <h3 className="text-sm font-bold text-slate-800">Check uw subsidie</h3>
                <label className="block text-[10px] mt-2 font-bold text-slate-500 uppercase">
                  Naam
                </label>
                <input
                  type="text"
                  placeholder="Uw naam"
                  value={naam}
                  onChange={(e) => setNaam(e.target.value)}
                  className="w-full p-2 rounded-lg border text-sm"
                />
                <label className="block text-[10px] mt-2 font-bold text-slate-500 uppercase">
                  E-mailadres
                </label>
                <input
                  type="email"
                  placeholder="Uw e-mailadres"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded-lg border text-sm"
                />
              </div>

              <button
                disabled={isSubmitting}
                onClick={async () => {
                  if (!email || !naam) return alert("Vul naam en e-mail in!");
                  setIsSubmitting(true);
                  await saveOfferte(email, {
                    naam,
                    deurNaam: deur.name,
                    slug,
                    breedte,
                    hoogte,
                    kleur,
                    glas,
                    aantal,
                    prijs: berekendePrijs,
                  });
                  alert("Offerte verstuurd!");
                  setIsSubmitting(false);
                }}
                className="w-full bg-[#1066a3] text-white py-4 rounded-lg font-bold uppercase text-[11px] tracking-widest">
                {isSubmitting ? "Bezig..." : "Bereken subsidie & Vraag offerte aan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
