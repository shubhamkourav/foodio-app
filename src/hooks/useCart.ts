import { useCartStore } from '@/stores/cartStore';
import { getCartItemTotal } from '@/types/cart';

export function useCart() {
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const setPromoCode = useCartStore((s) => s.setPromoCode);
  const clearCart = useCartStore((s) => s.clearCart);
  const getRestaurantId = useCartStore((s) => s.getRestaurantId);

  const subtotal = items.reduce((sum, item) => sum + getCartItemTotal(item), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    promoCode,
    addItem,
    updateQuantity,
    removeItem,
    setPromoCode,
    clearCart,
    subtotal,
    itemCount,
    restaurantId: getRestaurantId(),
    isEmpty: items.length === 0,
  };
}
