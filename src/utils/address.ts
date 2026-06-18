import type { Address } from '@/types/user';

export function isSameAddress(a?: Address | null, b?: Address | null): boolean {
  if (!a || !b) return false;
  if (a.id && b.id) return a.id === b.id;
  return a.street === b.street && a.zipCode === b.zipCode;
}

export function formatAddressLine(address: Address): string {
  return `${address.street}, ${address.city}`;
}

export function formatAddressSubtitle(address: Address): string {
  const parts = [address.state, address.zipCode].filter(Boolean);
  return parts.join(' ');
}
