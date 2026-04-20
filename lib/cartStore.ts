// Cart storage utility — persists to localStorage

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  sku?: string;
}

const KEY = 'sezapro_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function addToCart(item: Omit<CartItem, 'quantity'>, qty = 1): void {
  const cart = getCart();
  const idx = cart.findIndex(c => c.id === item.id);
  if (idx > -1) {
    cart[idx].quantity += qty;
  } else {
    cart.push({ ...item, quantity: qty });
  }
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function removeFromCart(id: number): void {
  const cart = getCart().filter(c => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function updateQty(id: number, qty: number): void {
  if (qty < 1) { removeFromCart(id); return; }
  const cart = getCart().map(c => c.id === id ? { ...c, quantity: qty } : c);
  localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
}

export function clearCart(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('cart-updated'));
}

export function getCartCount(): number {
  return getCart().reduce((sum, c) => sum + c.quantity, 0);
}

export function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
}

export function getCartTotal(): number {
  return getCart().reduce((sum, c) => sum + parsePrice(c.price) * c.quantity, 0);
}
