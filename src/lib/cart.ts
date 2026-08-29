/**
 * Browser-side shopping cart. Stored in localStorage, no server.
 * A line is identified by product id + variant.
 */

export interface CartLine {
  id: string;
  variant?: string;
  qty: number;
}

const KEY = 'botanica-cart-v1';
type Listener = (lines: CartLine[]) => void;
const listeners = new Set<Listener>();

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((l) => l && l.id && l.qty > 0) : [];
  } catch {
    return [];
  }
}

function write(lines: CartLine[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* private mode / quota — cart just won't persist */
  }
  listeners.forEach((fn) => fn(lines));
}

const sameLine = (l: CartLine, id: string, variant?: string) =>
  l.id === id && (l.variant ?? '') === (variant ?? '');

export function getCart(): CartLine[] {
  return read();
}

export function cartCount(): number {
  return read().reduce((n, l) => n + l.qty, 0);
}

export function addToCart(id: string, variant: string | undefined, qty = 1): void {
  const lines = read();
  const existing = lines.find((l) => sameLine(l, id, variant));
  if (existing) existing.qty += qty;
  else lines.push({ id, variant: variant || undefined, qty });
  write(lines);
}

export function setLineQty(id: string, variant: string | undefined, qty: number): void {
  const lines = read();
  const line = lines.find((l) => sameLine(l, id, variant));
  if (!line) return;
  line.qty = Math.max(1, Math.floor(qty) || 1);
  write(lines);
}

export function removeLine(id: string, variant: string | undefined): void {
  write(read().filter((l) => !sameLine(l, id, variant)));
}

export function clearCart(): void {
  write([]);
}

/** Subscribe to cart changes (fires immediately with the current state). */
export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  fn(read());
  return () => listeners.delete(fn);
}

// keep multiple tabs in sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) listeners.forEach((fn) => fn(read()));
  });
}
