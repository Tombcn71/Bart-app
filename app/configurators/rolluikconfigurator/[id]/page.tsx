"use client";
import { CartAddedModal } from "@/app/components/CartAddedModal";
import { NumberInput } from "@/app/components/NumberInput";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { addToCart, getCart } from "@/lib/cart";
import { getMatrix } from "@/lib/data";
import { RolluikSVG, InbouwRolluikSVG, ScreenSVG } from "@/lib/rolluik-svgs";

const ROLLUIK_INFO: Record<
  string,
  { name: string; matrixKey: string; component: React.ReactNode }
> = {
  rolluik: {
    name: "Rolluik",
    matrixKey: "rolluik_matrix",
    component: <RolluikSVG />,
  },
  "inbouw-rolluik": {
    name: "Inbouw rolluik",
    matrixKey: "inbouw_rolluik_matrix",
    component: <InbouwRolluikSVG />,
  },
  screen: {
    name: "Screen",
    matrixKey: "screen_matrix",
    component: <ScreenSVG />,
  },
};

const DEFAULTS = {
  basisPrijs: 0,
  m2Tarief: 0,
  montageKosten: 0,
  kleurToeslag: { wit: 0, antraciet: 0, "creme-wit": 0, "ral-kleur": 0 },
  bedieningToeslag: { handmatig: 0, elektrisch: 0 },
};

const KLEUREN = ["wit", "antraciet", "creme-wit", "ral-kleur"];
const BEDIENINGEN = ["handmatig", "elektrisch"];

export default function RolluikConfigurator() {
  const { id } = useParams();
  const slug = typeof id === "string" && id in ROLLUIK_INFO ? id : "rolluik";
  const info = ROLLUIK_INFO[slug];

  const [matrix, setMatrix] = useState<any>(null);
  const [breedte, setBreedte] = useState(1000);
  const [hoogte, setHoogte] = useState(1200);
  const [kleur, setKleur] = useState("wit");
  const [bediening, setBediening] = useState("handmatig");
  const [aantal, setAantal] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    getMatrix(info.matrixKey).then((m) =>
      setMatrix({ ...DEFAULTS, ...(m ?? {}) }),
    );
  }, [info.matrixKey]);

  const m2 = (breedte / 1000) * (hoogte / 1000);
  const prijs = matrix && breedte > 0 && hoogte > 0
    ? Math.round(
        ((matrix.basisPrijs ?? 0) +
          m2 * (matrix.m2Tarief ?? 0) +
          (matrix.kleurToeslag?.[kleur] ?? 0) +
          (matrix.bedieningToeslag?.[bediening] ?? 0) +
          (matrix.montageKosten ?? 0)) *
          aantal *
          100,
      ) / 100
    : 0;

  function handleAdd() {
    addToCart({
      slug,
      product: info.name,
      prijs,
      specs: { breedte, hoogte, kleur, bediening, aantal },
    });
    setCartCount(getCart().length);
    setModalOpen(true);
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-12 lg:p-16 font-sans bg-white min-h-screen">
      <Link
        href="/rolluiken"
        className="text-sm text-slate-400 hover:text-[#1066a3] mb-8 inline-block">
        ← Terug naar rolluiken
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-6">
        <div className="lg:col-span-7">
          <h1 className="text-2xl font-semibold mb-6">{info.name}</h1>
          <div className="bg-slate-50 p-10 rounded-xl border flex items-center justify-center">
            <div style={{ width: "50%", maxWidth: 220 }}>{info.component}</div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white border p-6 rounded-xl shadow-sm space-y-5">
            <div>
              {" "}
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-1">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-xs font-semibold text-green-800">
                  Bij ons is montage in de prijs inbegrepen
                </span>
              </div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Breedte (mm)
              </label>
              <NumberInput
                min={400}
                max={4000}
                value={breedte}
                onChange={setBreedte}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Hoogte (mm)
              </label>
              <NumberInput
                min={400}
                max={3000}
                value={hoogte}
                onChange={setHoogte}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Kleur
              </label>
              <div className="flex gap-2 flex-wrap">
                {KLEUREN.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKleur(k)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                      kleur === k
                        ? "bg-[#1066a3] text-white border-[#1066a3]"
                        : "border-slate-200 text-slate-600"
                    }`}>
                    {k.replace(/-/g, " ")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Bediening
              </label>
              <div className="flex gap-2">
                {BEDIENINGEN.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBediening(b)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                      bediening === b
                        ? "bg-[#1066a3] text-white border-[#1066a3]"
                        : "border-slate-200 text-slate-600"
                    }`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Aantal
              </label>
              <NumberInput
                min={1}
                max={50}
                value={aantal}
                onChange={setAantal}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1066a3]"
              />
            </div>
            <div className="bg-[#f4f7f9] rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Prijsindicatie</span>
                <span className="text-xl font-bold text-[#1066a3]">
                  €{" "}
                  {prijs.toLocaleString("nl-NL", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Excl. btw · indicatie
              </p>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="w-full bg-[#1066a3] text-white font-bold py-3 rounded-xl hover:bg-[#0d5491] transition-colors uppercase text-[11px] tracking-widest">
              Toevoegen aan offerte
            </button>
            <p className="text-center text-[11px] text-slate-400">
              Ontvang uw subsidie-indicatie bij de offerte
            </p>
          </div>
        </div>
      </div>

      <CartAddedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={info.name}
        breedte={breedte}
        hoogte={hoogte}
        aantal={aantal}
        prijs={prijs}
        cartCount={cartCount}
        onAddAnother={() => setModalOpen(false)}
      />
    </div>
  );
}
