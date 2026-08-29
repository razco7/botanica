/**
 * Price display — matches the live site exactly ("₪ 50.00", "₪ 350.00").
 * Webflow renders the shekel sign, a space, then the amount with 2 decimals.
 */
export function formatPrice(value: number): string {
  return `₪ ${value.toFixed(2)}`;
}
