"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { ArrowLeft, FileText, Ruler } from "lucide-react";
import Link from "next/link";
import { useBron } from "@/lib/use-bron";
import { getCart } from "@/lib/cart";
import { BART_SLUG, setInmeten } from "@/lib/inmeten";

/** Balk bovenin de calculator in inmeetmodus (Onspot): ramen tellen, naar de offerte, stoppen. */
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
    <div className="bg-slate-900 text-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-2 flex items-center gap-3 text-sm">
        <NextLink href="/meten" className="flex items-center gap-1 text-white/70 hover:text-white">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Terug</span>
        </NextLink>
        <span className="flex items-center gap-1.5 font-semibold">
          <Ruler size={16} /> Inmeten · {aantal} {aantal === 1 ? "raam" : "ramen"}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/offerte" className="flex items-center gap-1.5 bg-white text-slate-900 font-semibold rounded-lg px-3 py-1.5">
            <FileText size={15} /> Naar offerte
          </Link>
          <button
            type="button"
            onClick={() => setInmeten(BART_SLUG, false)}
            className="text-white/70 hover:text-white px-2 py-1.5">
            Stoppen
          </button>
        </div>
      </div>
    </div>
  );
}
