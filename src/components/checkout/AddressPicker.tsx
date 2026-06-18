import { MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import type { Address } from '@/types/user';
import { isSameAddress } from '@/utils/address';

export interface AddressPickerProps {
  addresses: Address[];
  selected?: Address | null;
  onSelect?: (address: Address) => void;
  onAddNew?: () => void;
}

export function AddressPicker({ addresses, selected, onSelect, onAddNew }: AddressPickerProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Delivery Address</Text>
      {addresses.length === 0 ? (
        <Text style={styles.empty}>No saved addresses. Add one to continue.</Text>
      ) : (
        addresses.map((address) => {
          const isSelected = isSameAddress(selected, address);
          return (
            <Pressable
              key={address.id ?? `${address.label}-${address.street}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`${address.label}, ${address.street}`}
              hitSlop={8}
              onPress={() => onSelect?.(address)}
              style={[styles.addressRow, isSelected && styles.addressSelected]}>
              <MapPin size={18} color={isSelected ? colors.primary : colors.neutral[400]} />
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>{address.label}</Text>
                <Text style={styles.addressText} numberOfLines={2}>
                  {address.street}, {address.city}
                </Text>
              </View>
            </Pressable>
          );
        })
      )}
      <Pressable accessibilityRole="button" accessibilityLabel="Add new address" hitSlop={8} onPress={onAddNew}>
        <Text style={styles.addNew}>+ Add new address</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  title: { ...typography.h3, color: colors.neutral[900] },
  empty: { ...typography.body, color: colors.neutral[700] },
  addressRow: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  addressSelected: { borderColor: colors.primary, backgroundColor: colors.secondary },
  addressInfo: { flex: 1, gap: spacing.xs },
  addressLabel: { ...typography.label, color: colors.neutral[900] },
  addressText: { ...typography.caption, color: colors.neutral[700] },
  addNew: { ...typography.label, color: colors.primary },
});
