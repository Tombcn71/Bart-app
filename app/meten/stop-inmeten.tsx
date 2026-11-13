"use client";
import { useEffect } from "react";
import { BART_SLUG, setInmeten } from "@/lib/inmeten";

/** Op het startscherm van de app (waar de drie knoppen staan) is de inmeetmodus altijd uit. */
export function StopInmeten() {
  useEffect(() => {
    setInmeten(BART_SLUG, false);
  }, []);
  return null;
}
