/** Wat de assistent in de calculator mag doen. De calculator zet deze functies neer zodra hij open is. */
export type AssistentBrug = {
  typen: () => { slug: string; naam: string }[];
  staat: () => unknown;
  zet: (patch: Record<string, unknown>) => void;
  verstuur: (klant: { naam: string; woonplaats: string; telefoon: string; email: string }) => Promise<{ ok: boolean; offerteId?: string | null; fout?: string }>;
  /** Zet het kozijn op de offerte en toont het formulier (de pop-up) waar de klant zijn gegevens invult. */
  toonFormulier: () => void;
  /** Zet het huidige product op de offerte zonder het formulier te openen (voor een 2e of 3e product). */
  voegToeAanOfferte?: () => void;
  /** Van welke calculator deze koppeling is, zodat een vertrekkende pagina niet de koppeling van de nieuwe pagina wist. */
  eigenaar?: object;
};

/** Het scherm waar de assistent op kan werken. De kozijncalculator zet hier zijn functies neer zodra hij open is. */
export const brugRef: { current: AssistentBrug | null } = { current: null };

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") (window as unknown as { __brugRef?: unknown }).__brugRef = brugRef;
