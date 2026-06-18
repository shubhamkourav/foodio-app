import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorBoundary, ErrorState, LoadingState } from '@/components';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { dishImageUri } from '@/constants/placeholders';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useCart } from '@/hooks/useCart';
import { useMenuItem } from '@/hooks/useMenu';
import { useRestaurant } from '@/hooks/useRestaurants';
import { formatCurrency } from '@/utils/formatCurrency';
import type { Customization, CustomizationOption } from '@/types/menu';
import type { SelectedCustomization } from '@/types/order';

function toggleCustomization(
  current: SelectedCustomization[],
  group: Customization,
  option: CustomizationOption,
): SelectedCustomization[] {
  const entry: SelectedCustomization = {
    groupName: group.groupName,
    optionName: option.name,
    priceModifier: option.priceModifier,
  };

  if (group.multiSelect) {
    const exists = current.some(
      (c) => c.groupName === group.groupName && c.optionName === option.name,
    );
    if (exists) {
      return current.filter(
        (c) => !(c.groupName === group.groupName && c.optionName === option.name),
      );
    }
    return [...current, entry];
  }

  const withoutGroup = current.filter((c) => c.groupName !== group.groupName);
  const alreadySelected = current.some(
    (c) => c.groupName === group.groupName && c.optionName === option.name,
  );
  return alreadySelected ? withoutGroup : [...withoutGroup, entry];
}

export default function ItemDetailScreen() {
  const { id: restaurantId, itemId } = useLocalSearchParams<{
    id: string;
    itemId: string;
  }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<SelectedCustomization[]>([]);

  const restaurantQuery = useRestaurant(restaurantId ?? '');
  const itemQuery = useMenuItem(restaurantId ?? '', itemId ?? '');

  const item = itemQuery.data;

  const unitPrice = useMemo(() => {
    if (!item) return 0;
    const modifierTotal = customizations.reduce((sum, c) => sum + c.priceModifier, 0);
    return item.price + modifierTotal;
  }, [item, customizations]);

  const handleAddToCart = () => {
    if (!item || !restaurantId) return;

    addItem({
      menuItemId: item.id,
      restaurantId,
      restaurantName: restaurantQuery.data?.name ?? 'Restaurant',
      name: item.name,
      price: item.price,
      quantity,
      image: item.image,
      selectedCustomizations: customizations,
    });

    router.back();
  };

  if (itemQuery.isLoading) {
    return (
      <ErrorBoundary>
        <LoadingState />
      </ErrorBoundary>
    );
  }

  if (!item) {
    return (
      <ErrorBoundary>
        <ErrorState message="Item not found" onRetry={() => itemQuery.refetch()} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Image source={{ uri: dishImageUri(item.image) }} style={styles.image} contentFit="cover" />

        <View style={styles.body}>
          <Text style={styles.name}>{item.name}</Text>
          {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
          <Text style={styles.price}>{formatCurrency(unitPrice)}</Text>

          {item.customizations?.map((group) => (
            <View key={group.groupName} style={styles.group}>
              <Text style={styles.groupTitle}>
                {group.groupName}
                {group.required ? ' *' : ''}
              </Text>
              {group.options.map((option) => {
                const selected = customizations.some(
                  (c) => c.groupName === group.groupName && c.optionName === option.name,
                );
                return (
                  <Pressable
                    key={option.name}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    hitSlop={8}
                    onPress={() =>
                      setCustomizations((prev) => toggleCustomization(prev, group, option))
                    }
                    style={[styles.option, selected && styles.optionSelected]}>
                    <Text style={styles.optionName}>{option.name}</Text>
                    {option.priceModifier > 0 ? (
                      <Text style={styles.optionPrice}>
                        +{formatCurrency(option.priceModifier)}
                      </Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ))}

          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <Pressable
                accessibilityLabel="Decrease quantity"
                hitSlop={8}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                style={styles.qtyButton}>
                <Minus size={16} color={colors.neutral[700]} />
              </Pressable>
              <Text style={styles.quantity}>{quantity}</Text>
              <Pressable
                accessibilityLabel="Increase quantity"
                hitSlop={8}
                onPress={() => setQuantity((q) => q + 1)}
                style={styles.qtyButton}>
                <Plus size={16} color={colors.neutral[700]} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={`Add to cart · ${formatCurrency(unitPrice * quantity)}`}
          onPress={handleAddToCart}
          fullWidth
          disabled={!item.isAvailable}
        />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  content: { paddingBottom: 100 },
  image: { width: '100%', height: 220, backgroundColor: colors.secondary },
  imagePlaceholder: { backgroundColor: colors.secondary },
  body: { padding: spacing.md, gap: spacing.md },
  name: { ...typography.h1, color: colors.neutral[900] },
  description: { ...typography.body, color: colors.neutral[700] },
  price: { ...typography.h2, color: colors.primary },
  group: { gap: spacing.sm },
  groupTitle: { ...typography.h3, color: colors.neutral[900] },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.secondary },
  optionName: { ...typography.body, color: colors.neutral[900] },
  optionPrice: { ...typography.caption, color: colors.neutral[700] },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  quantityLabel: { ...typography.h3, color: colors.neutral[900] },
  quantityControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: { ...typography.h3, color: colors.neutral[900], minWidth: 24, textAlign: 'center' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
});
