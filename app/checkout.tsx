import { router } from 'expo-router';
import { CreditCard, MapPin, Tag } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CheckoutItemsSection,
  CheckoutOptionRow,
  ErrorBoundary,
  FigmaButton,
  InlineError,
  OrderCostSummary,
  PaymentMethodCard,
  TipSelector,
} from '@/components';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { useCart } from '@/hooks/useCart';
import { useLocation } from '@/hooks/useLocation';
import { usePlaceOrder } from '@/hooks/useOrders';
import { useStripePayment } from '@/hooks/useStripePayment';
import type { PaymentMethod } from '@/types/order';
import { getErrorMessage, getValidationErrors } from '@/utils/getErrorMessage';
import {
  DEFAULT_DELIVERY_FEE,
  calculateOrderTotal,
  estimateTax,
} from '@/utils/orderPricing';

export default function CheckoutScreen() {
  const { items, subtotal, promoCode, restaurantId, clearCart, isEmpty } = useCart();
  const { savedAddresses, selectedAddress } = useLocation();
  const placeOrder = usePlaceOrder();
  const { confirmCardPayment, isStripeEnabled } = useStripePayment();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [tip, setTip] = useState<number | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const deliveryFee = DEFAULT_DELIVERY_FEE;
  const estimatedTax = estimateTax(subtotal);
  const tipAmount = tip ?? 0;
  const total = calculateOrderTotal(subtotal, deliveryFee, estimatedTax, tipAmount);

  const paymentLabel =
    paymentMethod === 'card'
      ? 'Credit / Debit Card'
      : paymentMethod === 'upi'
        ? 'UPI'
        : 'Cash on Delivery';

  const addressLine = selectedAddress
    ? `${selectedAddress.street}, ${selectedAddress.city}`
    : 'Select delivery address';
  const addressSubtitle = selectedAddress
    ? `${selectedAddress.zipCode}${selectedAddress.state ? `, ${selectedAddress.state}` : ''}`
    : savedAddresses.length === 0
      ? 'Add an address to continue'
      : undefined;

  const handlePlaceOrder = async () => {
    if (!restaurantId || !selectedAddress || isEmpty) {
      setError('Please select a delivery address');
      return;
    }

    if (paymentMethod === 'card' && !isStripeEnabled) {
      setError('Card payments require EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY');
      return;
    }

    setError(null);
    setValidationErrors([]);

    try {
      const result = await placeOrder.mutateAsync({
        restaurantId,
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          selectedCustomizations: item.selectedCustomizations,
        })),
        deliveryAddress: selectedAddress,
        paymentMethod,
        promoCode: promoCode ?? undefined,
      });

      if (paymentMethod === 'card') {
        if (!result.clientSecret) {
          setError('Payment could not be initialized. Check backend Stripe configuration.');
          return;
        }
        await confirmCardPayment(result.clientSecret);
      }

      clearCart();
      router.replace(`/tracking/${result.order.id}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not place order'));
      setValidationErrors(getValidationErrors(err));
    }
  };

  const cycleAddress = () => {
    router.push('/address');
  };

  if (isEmpty) {
    return (
      <ErrorBoundary>
        <SafeAreaView style={styles.container} edges={['bottom']}>
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <FigmaButton label="Go back" onPress={() => router.back()} />
          </View>
        </SafeAreaView>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <CheckoutOptionRow
            icon={MapPin}
            label={addressLine}
            subtitle={addressSubtitle}
            onPress={cycleAddress}
          />

          <TipSelector selected={tip} onSelect={setTip} />

          <CheckoutItemsSection
            items={items}
            restaurantName={items[0]?.restaurantName}
            onSeeMenu={restaurantId ? () => router.push(`/restaurant/${restaurantId}`) : undefined}
            onAddItems={restaurantId ? () => router.push(`/restaurant/${restaurantId}`) : undefined}
          />

          <CheckoutOptionRow
            icon={CreditCard}
            label={showPaymentOptions ? 'Payment Method' : 'Add Payment Method'}
            subtitle={showPaymentOptions ? paymentLabel : paymentLabel}
            onPress={() => setShowPaymentOptions((value) => !value)}
          />

          {showPaymentOptions ? (
            <View style={styles.paymentCard}>
              <PaymentMethodCard selected={paymentMethod} onSelect={setPaymentMethod} />
            </View>
          ) : null}

          <CheckoutOptionRow
            icon={Tag}
            label="Promo Code"
            subtitle={promoCode ?? undefined}
            onPress={() => undefined}
          />

          <OrderCostSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            estimatedTax={estimatedTax}
            tip={tipAmount}
            total={total}
          />

          {error || validationErrors.length > 0 ? (
            <View style={styles.errorWrap}>
              <InlineError message={error ?? ''} errors={validationErrors} />
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <FigmaButton
            label="Place order"
            onPress={handlePlaceOrder}
            loading={placeOrder.isPending}
          />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingBottom: 100 },
  paymentCard: {
    paddingHorizontal: layout.screenPadding,
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
  errorWrap: {
    paddingHorizontal: layout.screenPadding,
    marginTop: 8,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.screenPadding,
    gap: 16,
  },
  emptyTitle: { ...typography.h3, color: colors.neutral[900] },
});
