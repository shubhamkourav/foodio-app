import type { Address } from './user';

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'preparing'
  | 'picked_up'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'card' | 'upi' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface SelectedCustomization {
  groupName: string;
  optionName: string;
  priceModifier: number;
}

export interface OrderLineItem {
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  selectedCustomizations?: SelectedCustomization[];
  itemTotal: number;
}

export interface Order {
  id: string;
  userId?: string;
  restaurantId: string;
  restaurantName?: string;
  restaurantImage?: string;
  itemCount?: number;
  items?: OrderLineItem[];
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  estimatedDelivery?: string;
  estimatedDeliveryMinutes?: number;
  driverId?: string;
  createdAt?: string;
}

export interface PlaceOrderPayload {
  restaurantId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
    selectedCustomizations?: SelectedCustomization[];
  }>;
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  promoCode?: string;
}

export interface PlaceOrderResponse {
  order: {
    id: string;
    status: OrderStatus;
    total: number;
    estimatedDelivery?: string;
    estimatedDeliveryMinutes?: number;
  };
  clientSecret?: string;
}
