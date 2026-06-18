import type { SelectedCustomization } from './order';

export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedCustomizations: SelectedCustomization[];
}

export function getCartItemTotal(item: CartItem): number {
  const customizationTotal = item.selectedCustomizations.reduce(
    (sum, c) => sum + c.priceModifier,
    0,
  );
  return (item.price + customizationTotal) * item.quantity;
}
