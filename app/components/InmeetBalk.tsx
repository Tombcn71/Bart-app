"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { ArrowLeft, FileText, X } from "lucide-react";
import Link from "next/link";
import { useBron } from "@/lib/use-bron";
import { getCart } from "@/lib/cart";
import { MonteurOnderbalk } from "./MonteurOnderbalk";
import { BART_SLUG, setInmeten } from "@/lib/inmeten";

/** Balk bovenin de calculator bij Offerte maken (Onspot): naar de offerte met het aantal producten, stoppen. */
export function InmeetBalk() {
  const bron = useBron();
  const [aantal, setAantal] = useState(0);

  useEffect(() => {
    const update = () => setAantal(getCart().length);
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, [bron]);

  if (bron !== "onspot") return null;

  return (
    <>
    <MonteurOnderbalk actief="maken" />
    <div className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-[1400px] items-center gap-2 px-3 py-2 text-sm md:px-6">
        <NextLink href="/meten" aria-label="Terug naar het startscherm" className="grid size-9 shrink-0 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white">
          <ArrowLeft size={18} />
        </NextLink>
        <span className="min-w-0 truncate font-semibold">Offerte maken</span>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <Link href="/offerte" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3.5 font-semibold text-slate-900">
            <FileText size={16} />
            Offerte
            {aantal > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white">{aantal}</span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setInmeten(BART_SLUG, false)}
            aria-label="Stoppen met offerte maken"
            className="inline-flex h-9 items-center gap-1 rounded-full px-2.5 text-white/80 hover:bg-white/10 hover:text-white">
            <X size={18} />
            <span className="hidden sm:inline">Stoppen</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
