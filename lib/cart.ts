// Cart utility — opgeslagen in localStorage

export interface CartItem {
  id: string;
  slug: string;
  product: string;
  specs: Record<string, string | number>;
  prijs: number;
}

const KEY = "bartmooi_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function addToCart(item: Omit<CartItem, "id">): void {
  const cart = getCart();
  cart.push({ ...item, id: crypto.randomUUID() });
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function removeFromCart(id: string): void {
  const cart = getCart().filter(i => i.id !== id);
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function clearCart(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("cart-updated"));
}
