import { Platform, StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { LocationPin } from '@/components/location/LocationPin';
import { GOOGLE_MAPS_API_KEY } from '@/constants/config';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';

export interface AddressMapPreviewProps {
  lat: number;
  lng: number;
}

/** Figma Map mask — 361×180 preview with center pin */
export function AddressMapPreview({ lat, lng }: AddressMapPreviewProps) {
  const mapProvider =
    GOOGLE_MAPS_API_KEY && Platform.OS !== 'web' ? PROVIDER_GOOGLE : undefined;

  return (
    <View style={styles.wrap}>
      <MapView
        style={styles.map}
        provider={mapProvider}
        pointerEvents="none"
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        accessibilityLabel="Address map preview"
      />
      <View pointerEvents="none" style={styles.pinLayer}>
        <LocationPin size={24} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 180,
    borderRadius: layout.largeCardRadius,
    overflow: 'hidden',
    backgroundColor: colors.neutral[100],
  },
  map: { ...StyleSheet.absoluteFillObject },
  pinLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});
