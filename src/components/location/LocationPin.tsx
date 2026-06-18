import { MapPin } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';

/** Figma Location/pin/1 — 32px delivery pin */
export function LocationPin({ size = 32 }: { size?: number }) {
  const circle = size * 1.25;

  return (
    <View style={styles.wrapper} accessibilityElementsHidden importantForAccessibility="no">
      <View
        style={[
          styles.shadow,
          {
            width: circle,
            height: circle,
            borderRadius: circle / 2,
            marginBottom: size * 0.35,
          },
        ]}>
        <View
          style={[
            styles.circle,
            {
              width: circle,
              height: circle,
              borderRadius: circle / 2,
            },
          ]}>
          <MapPin size={size * 0.55} color={colors.white} fill={colors.white} />
        </View>
      </View>
      <View
        style={[
          styles.tip,
          {
            borderLeftWidth: size * 0.22,
            borderRightWidth: size * 0.22,
            borderTopWidth: size * 0.3,
            marginTop: -size * 0.12,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  circle: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tip: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
  },
});
