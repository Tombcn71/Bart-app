export type OfferteStatus = "verzonden" | "akkoord" | "gemonteerd";

export const STATUSSEN: { key: "" | OfferteStatus; label: string; filterLabel: string }[] = [
  { key: "", label: "Alles", filterLabel: "Alle aanvragen" },
  { key: "verzonden", label: "Verzonden", filterLabel: "Verzonden" },
  { key: "akkoord", label: "Akkoord", filterLabel: "Akkoord" },
  { key: "gemonteerd", label: "Gemonteerd", filterLabel: "Gemonteerd" },
];

/** De status volgt uit wat er met de offerte is gebeurd: gemonteerd gaat voor akkoord, akkoord gaat voor verzonden. */
export function offerteStatus(data: any): OfferteStatus {
  if (data?.gemonteerdAt) return "gemonteerd";
  if (data?.acceptedAt) return "akkoord";
  return "verzonden";
}

export const STATUS_STIJL: Record<OfferteStatus, { label: string; badge: string; punt: string }> = {
  verzonden: { label: "Verzonden", badge: "bg-blue-50 text-brand-text", punt: "bg-brand" },
  akkoord: { label: "Akkoord", badge: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400", punt: "bg-green-500" },
  gemonteerd: { label: "Gemonteerd", badge: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300", punt: "bg-slate-500" },
};
