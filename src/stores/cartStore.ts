import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CartItem } from '@/types/cart';
import { getCartItemTotal } from '@/types/cart';

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  setPromoCode: (code: string | null) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  getRestaurantId: () => string | null;
}

function buildItemKey(item: Omit<CartItem, 'id'>): string {
  const customizationKey = item.selectedCustomizations
    .map((c) => `${c.groupName}:${c.optionName}`)
    .sort()
    .join('|');
  return `${item.menuItemId}:${customizationKey}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,

      addItem: (item) => {
        const currentRestaurantId = get().getRestaurantId();
        if (currentRestaurantId && currentRestaurantId !== item.restaurantId) {
          set({ items: [], promoCode: null });
        }

        const key = buildItemKey(item);
        const existing = get().items.find((i) => buildItemKey(i) === key);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i,
            ),
          });
          return;
        }

        set({
          items: [...get().items, { ...item, id: `${key}-${Date.now()}` }],
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      setPromoCode: (code) => set({ promoCode: code }),

      clearCart: () => set({ items: [], promoCode: null }),

      getSubtotal: () => get().items.reduce((sum, item) => sum + getCartItemTotal(item), 0),

      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      getRestaurantId: () => {
        const items = get().items;
        return items.length > 0 ? items[0].restaurantId : null;
      },
    }),
    {
      name: 'foodio-cart',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode }),
    },
  ),
);
