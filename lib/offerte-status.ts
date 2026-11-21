export type OfferteStatus = "nieuw" | "verzonden" | "akkoord" | "gemonteerd";

export const STATUSSEN: { key: "" | OfferteStatus; label: string; filterLabel: string }[] = [
  { key: "", label: "Alles", filterLabel: "Alle aanvragen" },
  { key: "nieuw", label: "Nieuw", filterLabel: "Nieuw" },
  { key: "verzonden", label: "Verzonden", filterLabel: "Verzonden" },
  { key: "akkoord", label: "Akkoord", filterLabel: "Akkoord" },
  { key: "gemonteerd", label: "Gemonteerd", filterLabel: "Gemonteerd" },
];

/** De status volgt uit wat er met de offerte is gebeurd: gemonteerd gaat voor akkoord, akkoord gaat voor verzonden. */
export function offerteStatus(data: any): OfferteStatus {
  if (data?.gemonteerdAt) return "gemonteerd";
  if (data?.acceptedAt) return "akkoord";
  // Nieuw: de klant vroeg het zelf aan via de link en Bart heeft de aanvraag nog niet geopend.
  if (data?.bron === "onlink" && !data?.gezienAt) return "nieuw";
  return "verzonden";
}

export const STATUS_STIJL: Record<OfferteStatus, { label: string; badge: string; punt: string }> = {
  nieuw: { label: "Nieuw", badge: "bg-amber-100 text-amber-900", punt: "bg-amber-500" },
  verzonden: { label: "Verzonden", badge: "bg-blue-50 text-brand-text", punt: "bg-brand" },
  akkoord: { label: "Akkoord", badge: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400", punt: "bg-green-500" },
  gemonteerd: { label: "Gemonteerd", badge: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300", punt: "bg-slate-500" },
};
