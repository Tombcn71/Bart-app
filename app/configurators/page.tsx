"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { WelkomScherm } from "@/app/components/WelkomScherm";
import { useBron } from "@/lib/use-bron";

/** Het startscherm van de offerte-app: een kort verhaal en de knop naar het overzicht met producten. In inmeetmodus: het scherm voor Bart. */
export default function StartPagina() {
  const router = useRouter();
  const bron = useBron();
  const offerteMaken = bron === "onspot";
  // Offerte maken (Bart zelf): geen welkomscherm, meteen naar de producten.
  useEffect(() => {
    if (offerteMaken) router.replace("/producten");
  }, [offerteMaken, router]);
  if (offerteMaken) return <div className="h-40" aria-busy="true" />;
  return <WelkomScherm onStart={() => router.push("/producten")} />;
}
