export type DeliveryOption = 'meet_outside' | 'meet_at_door' | 'leave_at_door';

export interface Address {
  id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
  deliveryOption?: DeliveryOption;
  deliveryInstructions?: string;
}

export type UserRole = 'user' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  addresses?: Address[];
  isVerified?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
