import { router, useLocalSearchParams } from 'expo-router';

import { ErrorBoundary } from '@/components';
import { LocationMapPicker } from '@/components/location/LocationMapPicker';
import { useLocation } from '@/hooks/useLocation';

export default function LocationMapScreen() {
  const { lat, lng } = useLocalSearchParams<{ lat?: string; lng?: string }>();
  const { selectAddress } = useLocation();

  const initialLat = lat ? Number(lat) : undefined;
  const initialLng = lng ? Number(lng) : undefined;

  return (
    <ErrorBoundary>
      <LocationMapPicker
        initialLat={Number.isFinite(initialLat) ? initialLat : undefined}
        initialLng={Number.isFinite(initialLng) ? initialLng : undefined}
        onConfirm={(address) => {
          selectAddress(address);
          router.back();
        }}
      />
    </ErrorBoundary>
  );
}
