import { Check, MapPin, Pencil } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { Address } from '@/types/user';
import { formatAddressLine, formatAddressSubtitle, isSameAddress } from '@/utils/address';

export interface AddressListItemProps {
  address: Address;
  selected?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
  trailing?: React.ReactNode;
}

/** Figma Location & Address — Select row */
export function AddressListItem({
  address,
  selected = false,
  onPress,
  onEdit,
  trailing,
}: AddressListItemProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.row}>
      <MapPin size={20} color={selected ? colors.primary : colors.neutral[400]} />
      <View style={styles.text}>
        <Text style={styles.line} numberOfLines={1}>
          {formatAddressLine(address)}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {formatAddressSubtitle(address)}
        </Text>
      </View>
      {trailing ?? (
        <View style={styles.trailing}>
          {onEdit ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Edit ${formatAddressLine(address)}`}
              hitSlop={8}
              onPress={onEdit}
              style={styles.editButton}>
              <Pencil size={18} color={colors.neutral[700]} />
            </Pressable>
          ) : null}
          {selected ? <Check size={20} color={colors.primary} /> : <View style={styles.spacer} />}
        </View>
      )}
      <View style={styles.divider} />
    </Pressable>
  );
}

export function AddressListItemPlaceholder({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.row}>
      <MapPin size={20} color={colors.primary} />
      <View style={styles.text}>
        <Text style={styles.line}>{title}</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>
      <View style={styles.spacer} />
      <View style={styles.divider} />
    </Pressable>
  );
}

export function isAddressSelected(selected: Address | null | undefined, address: Address) {
  return isSameAddress(selected, address);
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.white,
  },
  text: { flex: 1, gap: 2, paddingVertical: spacing.sm },
  line: { ...typography.body16, color: colors.neutral[900], fontWeight: '500' },
  sub: { ...typography.caption, color: colors.neutral[700] },
  spacer: { width: 20 },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  editButton: { padding: 2 },
  divider: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[200],
  },
});
