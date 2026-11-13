// Inmeetmodus (Onspot): Bart gebruikt de calculator bij de klant. Alleen een vlag in dit tabblad (of deze app-sessie):
// een nieuw tabblad, een link of een klant op een ander toestel ziet dus altijd de gewone calculator.
// De server controleert bij het versturen of hij is ingelogd (app/actions.ts).
export const BART_SLUG = "bartmooi";

const EVENT = "inmeten-updated";
const sleutel = (slug: string) => `inmeten_${slug}`;

export function isInmeten(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(sleutel(slug)) === "1";
  } catch {
    return false;
  }
}

export function setInmeten(slug: string, aan: boolean): void {
  try {
    if (aan) sessionStorage.setItem(sleutel(slug), "1");
    else sessionStorage.removeItem(sleutel(slug));
    // De oude vlag (bleef altijd aan) wordt opgeruimd.
    localStorage.removeItem(sleutel(slug));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  // De winkelmand wisselt mee (aparte mand bij inmeten).
  window.dispatchEvent(new Event("cart-updated"));
}

export function onInmetenChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
