import { router } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CartAddItemsRow,
  CartItem,
  EmptyState,
  ErrorBoundary,
  FigmaButton,
  OrderCostSummary,
} from '@/components';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useCart } from '@/hooks/useCart';
import {
  DEFAULT_DELIVERY_FEE,
  calculateOrderTotal,
  estimateTax,
} from '@/utils/orderPricing';

export default function CartScreen() {
  const { items, subtotal, updateQuantity, restaurantId, isEmpty } = useCart();

  const deliveryFee = DEFAULT_DELIVERY_FEE;
  const estimatedTax = estimateTax(subtotal);
  const total = calculateOrderTotal(subtotal, deliveryFee, estimatedTax);

  const goToRestaurant = () => {
    if (restaurantId) {
      router.push(`/restaurant/${restaurantId}`);
      return;
    }
    router.back();
  };

  if (isEmpty) {
    return (
      <ErrorBoundary>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <ShoppingBag size={72} color={colors.primary} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyBody}>
              Looks like you haven’t added anything in your cart yet.
            </Text>
            <FigmaButton label="Browse restaurants" onPress={() => router.replace('/(tabs)')} />
          </View>
        </SafeAreaView>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Items</Text>

          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={(id) => {
                const cartItem = items.find((i) => i.id === id);
                if (cartItem) updateQuantity(id, cartItem.quantity + 1);
              }}
              onDecrease={(id) => {
                const cartItem = items.find((i) => i.id === id);
                if (cartItem) updateQuantity(id, cartItem.quantity - 1);
              }}
            />
          ))}

          <CartAddItemsRow onPress={goToRestaurant} />

          <OrderCostSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            estimatedTax={estimatedTax}
            total={total}
          />
        </ScrollView>

        <View style={styles.footer}>
          <FigmaButton label="Go to checkout" onPress={() => router.push('/checkout')} />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingBottom: 100 },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral[900],
    paddingHorizontal: layout.screenPadding,
    paddingTop: 24,
    paddingBottom: 8,
  },
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    minHeight: 84,
    justifyContent: 'center',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layout.screenPadding,
    gap: 16,
  },
  emptyIcon: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    ...typography.h1,
    color: colors.neutral[900],
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.body,
    color: colors.neutral[600],
    textAlign: 'center',
    marginBottom: 8,
  },
});
