import * as Location from 'expo-location';

import { GOOGLE_MAPS_API_KEY } from '@/constants/config';
import type { Address } from '@/types/user';
import { mapExpoGeocodedAddress, mapGoogleGeocodeResult } from '@/utils/mapGeocodedAddress';

export class LocationPermissionError extends Error {
  constructor(message = 'Location permission is required') {
    super(message);
    this.name = 'LocationPermissionError';
  }
}

async function reverseGeocodeWithGoogle(lat: number, lng: number): Promise<Address> {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google Maps API key is not configured');
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  const response = await fetch(url);
  const data = (await response.json()) as {
    status?: string;
    error_message?: string;
    results?: Array<{
      formatted_address?: string;
      address_components?: Array<{
        long_name: string;
        short_name: string;
        types: string[];
      }>;
    }>;
  };

  if (data.status !== 'OK') {
    throw new Error(data.error_message ?? 'Could not resolve address');
  }

  return mapGoogleGeocodeResult(data, lat, lng);
}

async function reverseGeocode(lat: number, lng: number): Promise<Address> {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    if (results[0]) {
      return mapExpoGeocodedAddress(results[0], lat, lng);
    }
  } catch {
    // Fall through to Google Geocoding when native reverse geocode fails.
  }

  return reverseGeocodeWithGoogle(lat, lng);
}

export async function reverseGeocodeCoordinates(lat: number, lng: number): Promise<Address> {
  return reverseGeocode(lat, lng);
}

export async function requestLocationPermission(): Promise<boolean> {
  const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
  if (existingStatus === Location.PermissionStatus.GRANTED) {
    return true;
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
}

export async function getCurrentLocationAddress(): Promise<Address> {
  const granted = await requestLocationPermission();
  if (!granted) {
    throw new LocationPermissionError();
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude } = position.coords;
  return reverseGeocode(latitude, longitude);
}

export async function getCoordinates(): Promise<{ lat: number; lng: number }> {
  const granted = await requestLocationPermission();
  if (!granted) {
    throw new LocationPermissionError();
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
}
