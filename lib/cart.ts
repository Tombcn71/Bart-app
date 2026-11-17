import { BART_SLUG, isInmeten } from "@/lib/inmeten";
// Cart utility — opgeslagen in localStorage

export interface CartItem {
  id: string;
  slug: string;
  product: string;
  specs: Record<string, string | number>;
  prijs: number;
  /** Inmeten (Onspot): notitie van de vakman bij dit raam. */
  notitie?: string;
  /** Loon en transport (in dezelfde eenheid als prijs) die in de prijs zitten, voor het verrekenen van de dagen in het mandje. */
  dag?: {
    loon: number;
    transport: number;
    perDag: number;
    aantal: number;
    dagen: number;
    /** Soort werk: kozijnen en deuren hebben elk hun eigen werkdagen. Zonder: kozijn. */
    groep?: string;
    /** Kraan (zelfde eenheid als prijs): wat in deze prijs zit, en het tarief per werkdag. Alleen bij geen tuintoegang. */
    kraan?: number;
    kraanPerDag?: number;
    /** Factor waarmee btw erin zit (1 = exclusief btw). */
    btw: number;
    /** Per uur gerekend (een hor): het loon staat per stuk in de prijs, het transport telt één keer per klus. */
    uur?: boolean;
    /** De montagesom van het bedrijf, exclusief btw, voor het overzicht "wat dit voor jou betekent". */
    som: { monteurs: number; perMonteur: number; transportPerMonteur: number; materiaal: number; afval: number; risico: number; winst: number; overig: number; kraan?: number; perUur?: boolean; urenPerStuk?: number };
  };
}

/**
 * Verrekent de monteurdagen over het hele mandje: alle kozijns samen vormen werkdagen, naar boven afgerond.
 * Loon en transport worden eerlijk over de kozijns verdeeld; de rest van de prijs blijft zoals berekend.
 */
export function verrekenDagen<T extends { prijs: number; dag?: CartItem["dag"] }>(items: T[]): T[] {
  const groepen = [...new Set(items.filter((i) => i.dag).map((i) => i.dag!.groep ?? "kozijn"))];
  let uit = items;
  for (const groep of groepen) uit = verrekenGroep(uit, groep);
  return uit;
}

function verrekenGroep<T extends { prijs: number; dag?: CartItem["dag"] }>(items: T[], groep: string): T[] {
  const doet = (i: T) => !!i.dag && (i.dag.groep ?? "kozijn") === groep;
  const met = items.filter(doet);
  if (met[0].dag!.uur) {
    // Per uur: het loon zit al per stuk in de prijs; het transport telt één keer voor alle stuks samen.
    const stuks = met.reduce((s, i) => s + i.dag!.aantal, 0);
    const transport = met[0].dag!.transport;
    let klaar = 0;
    let volgnr = 0;
    return items.map((i) => {
      if (!doet(i)) return i;
      volgnr++;
      const deel = volgnr === met.length ? Math.round((transport - klaar) * 100) / 100 : Math.round(((transport * i.dag!.aantal) / stuks) * 100) / 100;
      klaar += deel;
      return { ...i, prijs: Math.round((i.prijs - i.dag!.transport + deel) * 100) / 100 };
    });
  }
  const perDag = met[0].dag!.perDag;
  const aantal = met.reduce((s, i) => s + i.dag!.aantal, 0);
  const dagen = Math.ceil(aantal / perDag);
  // Loon + transport voor één dag (uit het eerste kozijn: dat is bij 1 dag precies de dagprijs).
  const eerste = met[0].dag!;
  const dagPrijs = (eerste.loon + eerste.transport) / Math.max(1, eerste.dagen);
  // Eén kraan per werkplek: heeft één van de producten hem nodig, dan staat hij alle dagen van dit soort werk.
  const kraanDag = met.some((i) => (i.dag!.kraan ?? 0) > 0) ? Math.max(...met.map((i) => i.dag!.kraanPerDag ?? 0)) : 0;
  const totaal = Math.round(dagen * (dagPrijs + kraanDag) * 100) / 100;
  let verdeeld = 0;
  let nr = 0;
  return items.map((i) => {
    if (!doet(i)) return i;
    nr++;
    const aandeel = nr === met.length ? Math.round((totaal - verdeeld) * 100) / 100 : Math.round(((totaal * i.dag!.aantal) / aantal) * 100) / 100;
    verdeeld += aandeel;
    const zonderDag = Math.round((i.prijs - i.dag!.loon - i.dag!.transport - (i.dag!.kraan ?? 0)) * 100) / 100;
    return { ...i, prijs: Math.round((zonderDag + aandeel) * 100) / 100 };
  });
}

// Eén winkelmand; bij inmeten een aparte, zodat die van een klant er niet doorheen loopt
const key = () => `bartmooi_cart${isInmeten(BART_SLUG) ? "_inmeten" : ""}`;

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key()) || "[]"); } catch { return []; }
}

export function addToCart(item: Omit<CartItem, "id">): void {
  const cart = getCart();
  cart.push({ ...item, id: crypto.randomUUID() });
  localStorage.setItem(key(), JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function removeFromCart(id: string): void {
  const cart = getCart().filter(i => i.id !== id);
  localStorage.setItem(key(), JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function clearCart(): void {
  localStorage.removeItem(key());
  window.dispatchEvent(new Event("cart-updated"));
}

export function updateCartItem(id: string, patch: Partial<Omit<CartItem, "id">>): void {
  const cart = getCart().map(i => (i.id === id ? { ...i, ...patch } : i));
  localStorage.setItem(key(), JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}
