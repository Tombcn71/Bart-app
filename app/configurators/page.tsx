"use client";
import { useRouter } from "next/navigation";
import { WelkomScherm } from "@/app/components/WelkomScherm";

/** Het startscherm van de offerte-app: een kort verhaal en de knop naar het overzicht met producten. */
export default function StartPagina() {
  const router = useRouter();
  return <WelkomScherm onStart={() => router.push("/producten")} />;
}
