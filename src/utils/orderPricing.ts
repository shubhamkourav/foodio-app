/** Shared order pricing helpers for cart + checkout */
export const DEFAULT_DELIVERY_FEE = 2.99;

export function estimateTax(subtotal: number): number {
  return Math.round(subtotal * 0.04 * 100) / 100;
}

export function calculateOrderTotal(
  subtotal: number,
  deliveryFee = DEFAULT_DELIVERY_FEE,
  estimatedTax?: number,
  tip = 0,
  discount = 0,
): number {
  const tax = estimatedTax ?? estimateTax(subtotal);
  return subtotal + deliveryFee + tax + tip - discount;
}
