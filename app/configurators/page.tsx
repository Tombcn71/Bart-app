"use client";
import { useRouter } from "next/navigation";
import { WelkomScherm } from "@/app/components/WelkomScherm";
import { useBron } from "@/lib/use-bron";

/** Het startscherm van de offerte-app: een kort verhaal en de knop naar het overzicht met producten. In inmeetmodus: het scherm voor Bart. */
export default function StartPagina() {
  const router = useRouter();
  const bron = useBron();
  return <WelkomScherm inmeten={bron === "onspot"} onStart={() => router.push("/producten")} />;
}
