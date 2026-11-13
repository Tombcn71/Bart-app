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
