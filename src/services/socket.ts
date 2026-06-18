import { io, type Socket } from 'socket.io-client';

import { SOCKET_URL } from '@/constants/config';
import type { OrderStatus } from '@/types/order';

let ordersSocket: Socket | null = null;

export function getOrdersSocket(): Socket {
  if (!ordersSocket) {
    ordersSocket = io(`${SOCKET_URL}/orders`, {
      transports: ['websocket'],
      autoConnect: false,
    });
  }
  return ordersSocket;
}

export function connectOrdersSocket(): Socket {
  const socket = getOrdersSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function disconnectOrdersSocket(): void {
  if (ordersSocket?.connected) {
    ordersSocket.disconnect();
  }
}

export function joinOrderRoom(orderId: string): void {
  const socket = connectOrdersSocket();
  socket.emit('join_order', { orderId });
}

export function leaveOrderRoom(orderId: string): void {
  ordersSocket?.emit('leave_order', { orderId });
}

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  timestamp: string;
}

export interface DriverAssignedEvent {
  orderId: string;
  driver: {
    id: string;
    name: string;
    vehicleType?: string;
  };
}

export interface EtaUpdatedEvent {
  orderId: string;
  etaMinutes: number;
}

export function onOrderStatusUpdated(
  handler: (payload: OrderStatusUpdate) => void,
): () => void {
  const socket = connectOrdersSocket();
  socket.on('order:status_updated', handler);
  return () => socket.off('order:status_updated', handler);
}

export function onDriverAssigned(handler: (payload: DriverAssignedEvent) => void): () => void {
  const socket = connectOrdersSocket();
  socket.on('order:driver_assigned', handler);
  return () => socket.off('order:driver_assigned', handler);
}

export function onEtaUpdated(handler: (payload: EtaUpdatedEvent) => void): () => void {
  const socket = connectOrdersSocket();
  socket.on('order:eta_updated', handler);
  return () => socket.off('order:eta_updated', handler);
}
