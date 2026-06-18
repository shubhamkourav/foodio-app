import { router } from 'expo-router';
import { ArrowLeft, Crosshair } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocationPin } from '@/components/location/LocationPin';
import { FigmaButton } from '@/components/ui/FigmaButton';
import { GOOGLE_MAPS_API_KEY } from '@/constants/config';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { getCoordinates, reverseGeocodeCoordinates } from '@/services/deviceLocation';
import type { Address } from '@/types/user';
import { formatAddressLine, formatAddressSubtitle } from '@/utils/address';

const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const GEOCODE_DEBOUNCE_MS = 450;

export interface LocationMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  confirmLabel?: string;
  onConfirm: (address: Address) => void;
}

/** Figma Screen/ Location & Address/ Map — drag map, fixed center pin */
export function LocationMapPicker({
  initialLat,
  initialLng,
  confirmLabel = 'Confirm location',
  onConfirm,
}: LocationMapPickerProps) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [region, setRegion] = useState<Region>(() => ({
    ...DEFAULT_REGION,
    latitude: initialLat ?? DEFAULT_REGION.latitude,
    longitude: initialLng ?? DEFAULT_REGION.longitude,
  }));
  const [previewAddress, setPreviewAddress] = useState<Address | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const mapProvider =
    GOOGLE_MAPS_API_KEY && Platform.OS !== 'web' ? PROVIDER_GOOGLE : undefined;

  const geocodeCenter = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    setGeocodeError(null);
    try {
      const address = await reverseGeocodeCoordinates(lat, lng);
      setPreviewAddress({ ...address, label: 'Delivery location' });
    } catch {
      setGeocodeError('Could not resolve this address');
      setPreviewAddress(null);
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  const scheduleGeocode = useCallback(
    (lat: number, lng: number) => {
      if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
      geocodeTimer.current = setTimeout(() => {
        void geocodeCenter(lat, lng);
      }, GEOCODE_DEBOUNCE_MS);
    },
    [geocodeCenter],
  );

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        let lat = initialLat;
        let lng = initialLng;

        if (lat == null || lng == null) {
          const coords = await getCoordinates();
          lat = coords.lat;
          lng = coords.lng;
        }

        if (cancelled) return;

        const nextRegion: Region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(nextRegion);
        mapRef.current?.animateToRegion(nextRegion, 300);
        await geocodeCenter(lat, lng);
      } catch {
        if (!cancelled) {
          await geocodeCenter(
            initialLat ?? DEFAULT_REGION.latitude,
            initialLng ?? DEFAULT_REGION.longitude,
          );
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
      if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    };
  }, [geocodeCenter, initialLat, initialLng]);

  const handleRegionChangeComplete = (nextRegion: Region) => {
    setRegion(nextRegion);
    scheduleGeocode(nextRegion.latitude, nextRegion.longitude);
  };

  const handleMyLocation = async () => {
    try {
      const coords = await getCoordinates();
      const nextRegion: Region = {
        latitude: coords.lat,
        longitude: coords.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(nextRegion);
      mapRef.current?.animateToRegion(nextRegion, 350);
      scheduleGeocode(coords.lat, coords.lng);
    } catch {
      setGeocodeError('Could not access your location');
    }
  };

  const handleConfirm = () => {
    if (!previewAddress) return;
    onConfirm(previewAddress);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={mapProvider}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton={false}
        accessibilityLabel="Delivery location map"
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
        style={[styles.backButton, { top: insets.top + 8 }]}>
        <ArrowLeft size={18} color={colors.neutral[900]} />
      </Pressable>

      <View pointerEvents="none" style={styles.pinLayer}>
        <LocationPin size={32} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Center on my location"
        onPress={handleMyLocation}
        style={[styles.myLocationFab, { bottom: 120 + insets.bottom }]}>
        <Crosshair size={24} color={colors.neutral[900]} />
      </Pressable>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={styles.previewCard}>
          {isInitializing || isGeocoding ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.previewHint}>Finding address…</Text>
            </View>
          ) : geocodeError ? (
            <Text style={styles.errorText}>{geocodeError}</Text>
          ) : previewAddress ? (
            <>
              <Text style={styles.previewLine} numberOfLines={1}>
                {formatAddressLine(previewAddress)}
              </Text>
              <Text style={styles.previewSub} numberOfLines={1}>
                {formatAddressSubtitle(previewAddress)}
              </Text>
            </>
          ) : (
            <Text style={styles.previewHint}>Move the map to place the pin</Text>
          )}
        </View>

        <FigmaButton
          label={confirmLabel}
          onPress={handleConfirm}
          disabled={!previewAddress || isGeocoding || isInitializing}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[100] },
  backButton: {
    position: 'absolute',
    left: layout.screenPadding,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  pinLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  myLocationFab: {
    position: 'absolute',
    right: layout.screenPadding,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  previewCard: { minHeight: 44, justifyContent: 'center' },
  previewLine: { ...typography.body16, color: colors.neutral[900], fontWeight: '600' },
  previewSub: { ...typography.caption, color: colors.neutral[700], marginTop: 2 },
  previewHint: { ...typography.body, color: colors.neutral[700] },
  errorText: { ...typography.body, color: colors.error },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
