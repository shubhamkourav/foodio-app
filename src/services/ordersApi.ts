import { apiRequest, apiRequestPaginated } from './apiClient';
import type { Order, PlaceOrderPayload, PlaceOrderResponse } from '@/types/order';

export const ordersApi = {
  place: (payload: PlaceOrderPayload) =>
    apiRequest<PlaceOrderResponse>('/orders', { method: 'POST', body: payload }),

  list: (page = 1, limit = 10) =>
    apiRequestPaginated<Order[]>(`/orders?page=${page}&limit=${limit}`),

  getById: (id: string) => apiRequest<Order>(`/orders/${id}`),

  cancel: (id: string) =>
    apiRequest<{ id: string; status: string }>(`/orders/${id}/cancel`, {
      method: 'PATCH',
    }),
};
