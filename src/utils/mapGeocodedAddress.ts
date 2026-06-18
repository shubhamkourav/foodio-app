import type { LocationGeocodedAddress } from 'expo-location';

import type { Address } from '@/types/user';

function joinParts(...parts: Array<string | null | undefined>): string {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join(' ');
}

export function mapExpoGeocodedAddress(
  geo: LocationGeocodedAddress,
  lat: number,
  lng: number,
  label = 'Current location',
): Address {
  const street = joinParts(geo.streetNumber, geo.street) || geo.name || geo.district || 'Unknown street';
  const city = geo.city || geo.subregion || geo.district || 'Unknown city';
  const state = geo.region || geo.subregion || '—';
  const zipCode = geo.postalCode || '00000';

  return {
    label,
    street,
    city,
    state,
    zipCode,
    lat,
    lng,
  };
}

interface GoogleGeocodeResult {
  results?: Array<{
    formatted_address?: string;
    address_components?: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
  }>;
  status?: string;
}

export function mapGoogleGeocodeResult(
  result: GoogleGeocodeResult,
  lat: number,
  lng: number,
  label = 'Current location',
): Address {
  const top = result.results?.[0];
  if (!top?.address_components) {
    throw new Error('No address found for this location');
  }

  const get = (...types: string[]) =>
    top.address_components?.find((component) =>
      types.some((type) => component.types.includes(type)),
    );

  const streetNumber = get('street_number')?.long_name;
  const route = get('route')?.long_name;
  const street =
    joinParts(streetNumber, route) || top.formatted_address?.split(',')[0] || 'Unknown street';
  const city =
    get('locality')?.long_name ||
    get('postal_town')?.long_name ||
    get('administrative_area_level_2')?.long_name ||
    'Unknown city';
  const state = get('administrative_area_level_1')?.short_name || '—';
  const zipCode = get('postal_code')?.long_name || '00000';

  return {
    label,
    street,
    city,
    state,
    zipCode,
    lat,
    lng,
  };
}
