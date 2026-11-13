"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BART_SLUG, setInmeten } from "@/lib/inmeten";

/** Zet de inmeetmodus aan en opent het startscherm van de calculator. */
export function StartInmeten() {
  const router = useRouter();
  useEffect(() => {
    setInmeten(BART_SLUG, true);
    router.replace("/");
  }, [router]);
  return <div className="min-h-dvh" />;
}
