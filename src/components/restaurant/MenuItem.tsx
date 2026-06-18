import { Image } from 'expo-image';
import { Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { layout } from '@/constants/layout';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { dishImageUri } from '@/constants/placeholders';
import type { MenuItem as MenuItemType } from '@/types/menu';

export interface MenuItemProps {
  item: MenuItemType;
  onPress?: (itemId: string) => void;
}

export function MenuItem({ item, onPress }: MenuItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${formatCurrency(item.price)}`}
      hitSlop={8}
      disabled={!item.isAvailable}
      onPress={() => onPress?.(item.id)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, !item.isAvailable && styles.disabled]}>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{item.name}</Text>
          {item.isPopular ? <Badge label="Popular" variant="accent" /> : null}
          {item.isVeg ? <Badge label="Veg" variant="success" /> : null}
        </View>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
      </View>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: dishImageUri(item.image) }}
          style={styles.image}
          contentFit="cover"
          accessibilityLabel={item.name}
        />
        <View style={styles.addButton}>
          <Plus size={16} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    minHeight: layout.restaurantMenuItemHeight,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
    alignItems: 'center',
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  info: { flex: 1, gap: spacing.xs },
  titleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, alignItems: 'center' },
  name: { ...typography.h3, color: colors.neutral[900] },
  description: { ...typography.caption, color: colors.neutral[700] },
  price: { ...typography.label, color: colors.neutral[900], marginTop: spacing.xs },
  imageWrap: { position: 'relative' },
  image: { width: 88, height: 88, borderRadius: 12, backgroundColor: colors.secondary },
  addButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
