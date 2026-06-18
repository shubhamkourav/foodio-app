import { router, useLocalSearchParams } from 'expo-router';

import {
  ErrorBoundary,
  ErrorState,
  FloatingCartBar,
  LoadingState,
  MenuSection,
  RestaurantHeader,
} from '@/components';
import { colors } from '@/constants/colors';
import { useCart } from '@/hooks/useCart';
import { useLocation } from '@/hooks/useLocation';
import { useMenu } from '@/hooks/useMenu';
import { useRestaurant } from '@/hooks/useRestaurants';
import { getErrorMessage } from '@/utils/getErrorMessage';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const restaurantId = id ?? '';
  const { coordinates } = useLocation();
  const { itemCount, subtotal } = useCart();

  const lat = coordinates?.lat ?? 37.7749;
  const lng = coordinates?.lng ?? -122.4194;

  const restaurantQuery = useRestaurant(restaurantId, lat, lng);
  const menuQuery = useMenu(restaurantId);

  const restaurant = restaurantQuery.data;
  const menu = menuQuery.data;

  if (restaurantQuery.isLoading) {
    return (
      <ErrorBoundary>
        <LoadingState message="Loading restaurant..." />
      </ErrorBoundary>
    );
  }

  if (restaurantQuery.isError || !restaurant) {
    return (
      <ErrorBoundary>
        <ErrorState
          message={getErrorMessage(restaurantQuery.error, 'Restaurant not found')}
          onRetry={() => restaurantQuery.refetch()}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <MenuSection
        restaurantId={restaurantId}
        categories={menu?.categories ?? []}
        loading={menuQuery.isLoading}
        header={<RestaurantHeader restaurant={restaurant} />}
        onItemPress={(itemId) => router.push(`/restaurant/${restaurantId}/item/${itemId}`)}
      />

      <FloatingCartBar
        itemCount={itemCount}
        subtotal={subtotal}
        onPress={() => router.push('/cart')}
      />
    </ErrorBoundary>
  );
}
