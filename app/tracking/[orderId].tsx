import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  DeliveryTimeline,
  DriverCard,
  ErrorBoundary,
  ErrorState,
  LoadingState,
  TrackingMap,
} from '@/components';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useCancelOrder, useOrder } from '@/hooks/useOrders';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { useLocation } from '@/hooks/useLocation';
import { useRestaurant } from '@/hooks/useRestaurants';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatETA } from '@/utils/formatETA';
import { getErrorMessage } from '@/utils/getErrorMessage';
import type { OrderStatus } from '@/types/order';

function formatStatus(status: OrderStatus) {
  return status.replace(/_/g, ' ');
}

export default function TrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const id = orderId ?? '';
  const { coordinates } = useLocation();

  const orderQuery = useOrder(id);
  const tracking = useOrderTracking(id);
  const cancelOrder = useCancelOrder();
  const restaurantQuery = useRestaurant(orderQuery.data?.restaurantId ?? '');

  const order = orderQuery.data;
  const driverLocation =
    tracking.driver && restaurantQuery.data?.coordinates && order
      ? {
          lat: (restaurantQuery.data.coordinates.lat + order.deliveryAddress.lat) / 2,
          lng: (restaurantQuery.data.coordinates.lng + order.deliveryAddress.lng) / 2,
        }
      : undefined;
  const status = tracking.status ?? order?.status ?? 'confirmed';
  const canCancel = status === 'confirmed' || status === 'preparing';

  if (orderQuery.isLoading) {
    return (
      <ErrorBoundary>
        <LoadingState message="Loading order..." />
      </ErrorBoundary>
    );
  }

  if (orderQuery.isError || !order) {
    return (
      <ErrorBoundary>
        <ErrorState
          message={getErrorMessage(orderQuery.error, 'Order not found')}
          onRetry={() => orderQuery.refetch()}
        />
      </ErrorBoundary>
    );
  }

  const handleCancel = async () => {
    await cancelOrder.mutateAsync(id);
    orderQuery.refetch();
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.orderId}>Order #{id.slice(-6).toUpperCase()}</Text>
            <Badge label={formatStatus(status)} variant={status === 'cancelled' ? 'neutral' : 'primary'} />
          </View>

          <Text style={styles.total}>{formatCurrency(order.total)}</Text>

          {tracking.etaMinutes != null ? (
            <Text style={styles.eta}>ETA {formatETA(tracking.etaMinutes)}</Text>
          ) : order.estimatedDeliveryMinutes != null ? (
            <Text style={styles.eta}>ETA {formatETA(order.estimatedDeliveryMinutes)}</Text>
          ) : order.estimatedDelivery ? (
            <Text style={styles.eta}>
              Estimated {new Date(order.estimatedDelivery).toLocaleTimeString()}
            </Text>
          ) : null}

          <TrackingMap
            restaurantLocation={restaurantQuery.data?.coordinates}
            deliveryLocation={
              coordinates ?? {
                lat: order.deliveryAddress.lat,
                lng: order.deliveryAddress.lng,
              }
            }
            driverLocation={driverLocation}
          />

          <DeliveryTimeline currentStatus={status} />

          {tracking.driver ? (
            <DriverCard
              name={tracking.driver.name}
              vehicleType={tracking.driver.vehicleType}
            />
          ) : null}

          {canCancel ? (
            <Button
              label="Cancel order"
              variant="outline"
              onPress={handleCancel}
              loading={cancelOrder.isPending}
              fullWidth
            />
          ) : null}

          <Button
            label="Back to orders"
            variant="ghost"
            onPress={() => router.replace('/(tabs)/orders')}
            fullWidth
          />
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral[50] },
  scroll: { padding: spacing.md, gap: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { ...typography.h2, color: colors.neutral[900] },
  total: { ...typography.h3, color: colors.neutral[900] },
  eta: { ...typography.body, color: colors.primary },
});
