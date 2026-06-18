import { ChevronDown } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { typography } from '@/constants/typography';
import type { Address } from '@/types/user';

export interface LocationHeaderProps {
  address?: Address | null;
  isLocating?: boolean;
  onPress?: () => void;
}

function formatAddress(address: Address) {
  return `${address.street}, ${address.city}`;
}

export function LocationHeader({ address, isLocating = false, onPress }: LocationHeaderProps) {
  const addressText = isLocating
    ? 'Getting your location…'
    : address
      ? formatAddress(address)
      : 'Set delivery address';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Change delivery address"
      hitSlop={8}
      onPress={onPress}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.deliverTo}>Deliver to</Text>
        <View style={styles.addressRow}>
          <Text style={styles.address} numberOfLines={1}>
            {addressText}
          </Text>
          <ChevronDown size={20} color={colors.neutral[900]} />
        </View>
      </View>
      <View style={styles.divider} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    minHeight: layout.locationHeaderHeight,
    ...shadows.header,
  },
  content: {
    alignItems: 'center',
    padding: 8,
    gap: 8,
  },
  deliverTo: {
    ...typography.deliverTo,
    color: colors.primary,
    textAlign: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    maxWidth: '100%',
  },
  address: {
    ...typography.address,
    color: colors.neutral[900],
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
  },
});
