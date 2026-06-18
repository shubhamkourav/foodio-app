import { Image } from 'expo-image';
import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { dishImageUri } from '@/constants/placeholders';
import { typography } from '@/constants/typography';
import { formatCurrency } from '@/utils/formatCurrency';
import { getCartItemTotal } from '@/types/cart';
import type { CartItem as CartItemType } from '@/types/cart';

export interface CartItemProps {
  item: CartItemType;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
}

/** Cart line row — Screen/ Cart/ 3 (72px) */
export function CartItem({ item, onIncrease, onDecrease }: CartItemProps) {
  return (
    <View style={styles.container} accessibilityLabel={`${item.name}, quantity ${item.quantity}`}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: dishImageUri(item.image) }} style={styles.image} contentFit="cover" />
      </View>

      <View style={styles.details}>
        <View style={styles.nameRow}>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>{item.quantity}x</Text>
          </View>
          <View style={styles.copy}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.price}>{formatCurrency(getCartItemTotal(item))}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityLabel="Decrease quantity"
          hitSlop={8}
          onPress={() => onDecrease?.(item.id)}
          style={styles.circleButton}>
          <Minus size={16} color={colors.neutral[900]} />
        </Pressable>
        <Pressable
          accessibilityLabel="Increase quantity"
          hitSlop={8}
          onPress={() => onIncrease?.(item.id)}
          style={styles.circleButton}>
          <Plus size={16} color={colors.neutral[900]} />
        </Pressable>
      </View>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: 8,
  },
  imageWrap: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: colors.neutral[100],
    padding: 4,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: colors.neutral[100],
  },
  imagePlaceholder: { backgroundColor: colors.secondary },
  details: { flex: 1, marginLeft: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  quantityBadge: {
    minWidth: 22,
    height: 25,
    borderRadius: 4,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginTop: 6,
  },
  quantityText: { ...typography.captionMedium, color: colors.neutral[900] },
  copy: { flex: 1, gap: 2 },
  name: { ...typography.fieldLabel, color: colors.neutral[900] },
  price: { ...typography.caption, color: colors.neutral[600] },
  actions: { flexDirection: 'row', gap: 4 },
  circleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: layout.screenPadding,
    right: layout.screenPadding,
    height: 1,
    backgroundColor: colors.neutral[200],
  },
});
