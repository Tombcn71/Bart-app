"use client";
import { useSyncExternalStore } from "react";
import { BART_SLUG, isInmeten, onInmetenChange } from "@/lib/inmeten";

/** Via welke manier de offerte wordt gemaakt: onspot = Bart meet in bij de klant, onlink = de klant zelf. */
export function useBron(): "onspot" | "onlink" {
  const inmeten = useSyncExternalStore(onInmetenChange, () => isInmeten(BART_SLUG), () => false);
  return inmeten ? "onspot" : "onlink";
}
