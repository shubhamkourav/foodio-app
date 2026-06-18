/** Figma menu price filter — dollar amount buckets */
export const MENU_PRICE_OPTIONS = [
  { amount: 10, label: '$10' },
  { amount: 15, label: '$15' },
  { amount: 20, label: '$20' },
  { amount: 25, label: '$25' },
  { amount: 30, label: '$30' },
  { amount: 40, label: '$40' },
] as const;

export const MENU_PRICE_CHIP_LABEL = 'Menu price';

export function formatSelectedPriceAmounts(amounts: number[]): string {
  return [...amounts]
    .sort((a, b) => a - b)
    .map((amount) => `$${amount}`)
    .join(', ');
}
