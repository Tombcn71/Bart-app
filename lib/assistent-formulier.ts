/** Het offerteformulier (de pop-up na "Toevoegen") zet hier zijn functies neer, zodat de assistent het zichtbaar kan invullen. */
export type FormulierWaarden = { naam: string; woonplaats: string; telefoon: string; email: string };

export const formulier: {
  open: boolean;
  waarden: FormulierWaarden;
  vul: ((p: Partial<FormulierWaarden>) => void) | null;
  verstuur: (() => Promise<{ ok: boolean; offerteId?: string | null; fout?: string }>) | null;
} = { open: false, waarden: { naam: "", woonplaats: "", telefoon: "", email: "" }, vul: null, verstuur: null };
