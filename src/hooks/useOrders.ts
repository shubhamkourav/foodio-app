import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ordersApi } from '@/services/ordersApi';
import { useAuthStore } from '@/stores/authStore';
import type { PlaceOrderPayload } from '@/types/order';

export function useOrders(page = 1, limit = 10) {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['orders', userId, page, limit],
    queryFn: () => ordersApi.list(page, limit),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => ordersApi.getById(orderId),
    enabled: !!orderId,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) => ordersApi.place(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.cancel(orderId),
    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
    },
  });
}
