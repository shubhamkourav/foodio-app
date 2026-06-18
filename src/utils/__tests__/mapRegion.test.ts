import { regionFromCoordinates } from '../mapRegion';

describe('regionFromCoordinates', () => {
  it('returns default region when no points are provided', () => {
    const region = regionFromCoordinates([]);
    expect(region.latitude).toBe(37.7749);
    expect(region.longitude).toBe(-122.4194);
  });

  it('centers on a single coordinate', () => {
    const region = regionFromCoordinates([{ lat: 40.7, lng: -74.0 }]);
    expect(region.latitude).toBe(40.7);
    expect(region.longitude).toBe(-74.0);
  });

  it('fits multiple coordinates', () => {
    const region = regionFromCoordinates([
      { lat: 37.77, lng: -122.42 },
      { lat: 37.79, lng: -122.4 },
    ]);
    expect(region.latitude).toBeCloseTo(37.78, 2);
    expect(region.longitude).toBeCloseTo(-122.41, 2);
    expect(region.latitudeDelta).toBeGreaterThan(0);
  });
});
