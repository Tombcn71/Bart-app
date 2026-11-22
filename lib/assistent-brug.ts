/** Wat de assistent in de calculator mag doen. De calculator zet deze functies neer zodra hij open is. */
export type AssistentBrug = {
  typen: () => { slug: string; naam: string }[];
  staat: () => unknown;
  zet: (patch: Record<string, unknown>) => void;
  verstuur: (klant: { naam: string; woonplaats: string; telefoon: string; email: string }) => Promise<{ ok: boolean; offerteId?: string | null; fout?: string }>;
  /** Zet het kozijn op de offerte en toont het formulier (de pop-up) waar de klant zijn gegevens invult. */
  toonFormulier: () => void;
};

/** Het scherm waar de assistent op kan werken. De kozijncalculator zet hier zijn functies neer zodra hij open is. */
export const brugRef: { current: AssistentBrug | null } = { current: null };
