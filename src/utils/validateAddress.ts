import type { Address } from '@/types/user';

export function validateAddress(address: Partial<Address>): string[] {
  const errors: string[] = [];

  if (!address.label?.trim()) errors.push('Label is required');
  if (!address.street?.trim()) errors.push('Street is required');
  if (!address.city?.trim()) errors.push('City is required');
  if (!address.state?.trim()) errors.push('State is required');
  if (!address.zipCode?.trim()) errors.push('Zip code is required');

  if (address.lat === undefined || Number.isNaN(address.lat)) {
    errors.push('Latitude is required');
  } else if (address.lat < -90 || address.lat > 90) {
    errors.push('Latitude must be between -90 and 90');
  }

  if (address.lng === undefined || Number.isNaN(address.lng)) {
    errors.push('Longitude is required');
  } else if (address.lng < -180 || address.lng > 180) {
    errors.push('Longitude must be between -180 and 180');
  }

  return errors;
}
