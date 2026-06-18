import { MapPin } from 'lucide-react-native';
import { useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { GOOGLE_MAPS_API_KEY } from '@/constants/config';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { Coordinates } from '@/types/restaurant';
import { regionFromCoordinates } from '@/utils/mapRegion';

export interface TrackingMapProps {
  restaurantLocation?: Coordinates;
  deliveryLocation?: Coordinates;
  driverLocation?: Coordinates;
}

const MARKERS = {
  restaurant: { color: colors.accent, label: 'Restaurant' },
  driver: { color: colors.primary, label: 'Driver' },
  delivery: { color: colors.success, label: 'Delivery' },
} as const;

export function TrackingMap({
  restaurantLocation,
  deliveryLocation,
  driverLocation,
}: TrackingMapProps) {
  const points = useMemo(
    () =>
      [restaurantLocation, deliveryLocation, driverLocation].filter(
        (point): point is Coordinates => point != null,
      ),
    [restaurantLocation, deliveryLocation, driverLocation],
  );

  const region = useMemo(() => regionFromCoordinates(points), [points]);

  const canRenderNativeMap = Platform.OS !== 'web';

  if (!canRenderNativeMap || points.length === 0) {
    return (
      <View style={styles.container} accessibilityLabel="Order tracking map">
        <View style={styles.placeholder}>
          <MapPin size={32} color={colors.primary} />
          <Text style={styles.placeholderText}>Map preview</Text>
          <Text style={styles.hint}>
            {Platform.OS === 'web'
              ? 'Maps are available in the iOS and Android apps'
              : 'Waiting for location data'}
          </Text>
        </View>
        <Legend
          restaurantLocation={restaurantLocation}
          deliveryLocation={deliveryLocation}
          driverLocation={driverLocation}
        />
      </View>
    );
  }

  const mapProvider =
    Platform.OS === 'android' && GOOGLE_MAPS_API_KEY ? PROVIDER_GOOGLE : undefined;

  return (
    <View style={styles.container} accessibilityLabel="Order tracking map">
      <MapView
        style={styles.map}
        provider={mapProvider}
        initialRegion={region}
        region={region}
        showsUserLocation={false}
        showsMyLocationButton={false}
        accessibilityLabel="Live delivery map">
        {restaurantLocation ? (
          <Marker
            coordinate={{
              latitude: restaurantLocation.lat,
              longitude: restaurantLocation.lng,
            }}
            title={MARKERS.restaurant.label}
            pinColor={MARKERS.restaurant.color}
          />
        ) : null}
        {driverLocation ? (
          <Marker
            coordinate={{
              latitude: driverLocation.lat,
              longitude: driverLocation.lng,
            }}
            title={MARKERS.driver.label}
            pinColor={MARKERS.driver.color}
          />
        ) : null}
        {deliveryLocation ? (
          <Marker
            coordinate={{
              latitude: deliveryLocation.lat,
              longitude: deliveryLocation.lng,
            }}
            title={MARKERS.delivery.label}
            pinColor={MARKERS.delivery.color}
          />
        ) : null}
      </MapView>
      <Legend
        restaurantLocation={restaurantLocation}
        deliveryLocation={deliveryLocation}
        driverLocation={driverLocation}
      />
    </View>
  );
}

function Legend({
  restaurantLocation,
  deliveryLocation,
  driverLocation,
}: Pick<TrackingMapProps, 'restaurantLocation' | 'deliveryLocation' | 'driverLocation'>) {
  return (
    <View style={styles.legend}>
      {restaurantLocation ? <LegendItem color={MARKERS.restaurant.color} label={MARKERS.restaurant.label} /> : null}
      {driverLocation ? <LegendItem color={MARKERS.driver.color} label={MARKERS.driver.label} /> : null}
      {deliveryLocation ? <LegendItem color={MARKERS.delivery.color} label={MARKERS.delivery.label} /> : null}
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  map: { flex: 1 },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  placeholderText: { ...typography.h3, color: colors.neutral[900] },
  hint: {
    ...typography.caption,
    color: colors.neutral[400],
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...typography.caption, color: colors.neutral[700] },
});
