import type { Coordinates } from '@/types/restaurant';

const DEFAULT_DELTA = 0.02;

export function regionFromCoordinates(
  points: Coordinates[],
  paddingFactor = 1.5,
): {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
} {
  if (points.length === 0) {
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      latitudeDelta: DEFAULT_DELTA,
      longitudeDelta: DEFAULT_DELTA,
    };
  }

  if (points.length === 1) {
    return {
      latitude: points[0].lat,
      longitude: points[0].lng,
      latitudeDelta: DEFAULT_DELTA,
      longitudeDelta: DEFAULT_DELTA,
    };
  }

  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const latitudeDelta = Math.max((maxLat - minLat) * paddingFactor, DEFAULT_DELTA);
  const longitudeDelta = Math.max((maxLng - minLng) * paddingFactor, DEFAULT_DELTA);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}
