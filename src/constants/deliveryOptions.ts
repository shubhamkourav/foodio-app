import type { DeliveryOption } from '@/types/user';

export const DELIVERY_OPTIONS: Array<{ id: DeliveryOption; label: string }> = [
  { id: 'meet_outside', label: 'Meet outside' },
  { id: 'meet_at_door', label: 'Meet at door' },
  { id: 'leave_at_door', label: 'Leave it at my door' },
];

export const DEFAULT_DELIVERY_OPTION: DeliveryOption = 'leave_at_door';
