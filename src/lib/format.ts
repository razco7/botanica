/**
 * Price display — matches the live site's "₪ 50" / "₪ 34.90" style
 * (shekel sign first, no trailing .00 on whole numbers).
 */
export function formatPrice(value: number): string {
  const n = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `₪ ${n}`;
}
