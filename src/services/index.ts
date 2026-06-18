export { apiRequest, apiRequestPaginated } from './apiClient';
export { authApi } from './authApi';
export type { RegisterPayload } from './authApi';
export { usersApi } from './usersApi';
export { restaurantsApi } from './restaurantsApi';
export { ordersApi } from './ordersApi';
export { paymentsApi, promotionsApi } from './paymentsApi';
export {
  connectOrdersSocket,
  disconnectOrdersSocket,
  getOrdersSocket,
  joinOrderRoom,
  leaveOrderRoom,
  onDriverAssigned,
  onEtaUpdated,
  onOrderStatusUpdated,
} from './socket';
export type { DriverAssignedEvent, EtaUpdatedEvent, OrderStatusUpdate } from './socket';
