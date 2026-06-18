export function formatPromoTitle(promo: {
  discountType: 'percent' | 'fixed';
  discountValue: number;
}): string {
  return promo.discountType === 'percent'
    ? `${promo.discountValue}% off`
    : `$${promo.discountValue} off`;
}

export function formatPromoHighlight(promo: {
  discountType: 'percent' | 'fixed';
  discountValue: number;
}): string {
  return promo.discountType === 'percent'
    ? `${promo.discountValue}%`
    : `$${promo.discountValue}`;
}
