"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BART_SLUG, setInmeten } from "@/lib/inmeten";

/** Zet de modus Offerte maken aan en gaat meteen naar het overzicht met producten (geen tussenscherm). */
export function StartInmeten() {
  const router = useRouter();
  useEffect(() => {
    setInmeten(BART_SLUG, true);
    router.replace("/producten");
  }, [router]);
  return <div className="min-h-dvh" />;
}
