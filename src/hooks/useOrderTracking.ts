import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  joinOrderRoom,
  onDriverAssigned,
  onEtaUpdated,
  onOrderStatusUpdated,
  type DriverAssignedEvent,
  type EtaUpdatedEvent,
  type OrderStatusUpdate,
} from '@/services/socket';
import type { OrderStatus } from '@/types/order';

interface OrderTrackingState {
  status: OrderStatus | null;
  etaMinutes: number | null;
  driver: DriverAssignedEvent['driver'] | null;
  lastUpdated: string | null;
}

export function useOrderTracking(orderId: string) {
  const queryClient = useQueryClient();
  const [tracking, setTracking] = useState<OrderTrackingState>({
    status: null,
    etaMinutes: null,
    driver: null,
    lastUpdated: null,
  });

  useEffect(() => {
    if (!orderId) return;

    joinOrderRoom(orderId);

    const unsubStatus = onOrderStatusUpdated((payload: OrderStatusUpdate) => {
      if (payload.orderId !== orderId) return;

      setTracking((prev) => ({
        ...prev,
        status: payload.status,
        lastUpdated: payload.timestamp,
      }));

      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    });

    const unsubDriver = onDriverAssigned((payload: DriverAssignedEvent) => {
      if (payload.orderId !== orderId) return;
      setTracking((prev) => ({ ...prev, driver: payload.driver }));
    });

    const unsubEta = onEtaUpdated((payload: EtaUpdatedEvent) => {
      if (payload.orderId !== orderId) return;
      setTracking((prev) => ({ ...prev, etaMinutes: payload.etaMinutes }));
    });

    return () => {
      unsubStatus();
      unsubDriver();
      unsubEta();
    };
  }, [orderId, queryClient]);

  return tracking;
}
