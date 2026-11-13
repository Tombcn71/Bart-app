// De gegevens van BartMooi voor het briefhoofd van de offerte (zoals in de pdf en de mails).
export const BEDRIJF = {
  naam: "BartMooi B.V.",
  email: "info@bartmooi.nl",
  telefoon: "06 14 11 23 24" as string | null,
  website: "bartmooi.nl" as string | null,
  adres: "Burgemeester Hovylaan 157" as string | null,
  postcode: "2552 XB" as string | null,
  plaats: "Den Haag" as string | null,
  kvk: "98506560" as string | null,
};

/** Hierheen gaan de meldingen: nieuwe offerte en akkoord. */
export const INTERN_ADRES = "info@bartmooi.nl";

/** Link naar de Google-reviewpagina van BartMooi (Vercel-instelling GOOGLE_REVIEW_URL). Zonder link gaat er geen reviewverzoek uit. */
export const GOOGLE_REVIEW_URL: string | null = process.env.GOOGLE_REVIEW_URL?.trim() || null;
