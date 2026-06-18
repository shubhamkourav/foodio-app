import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ErrorBoundary,
  FeaturedSection,
  FilterTagCarousel,
  FloatingCartBar,
  FoodCategoryCarousel,
  HeroBanner,
  HomeSectionHeader,
  HorizontalRestaurantRow,
  LocationHeader,
  RestaurantCard,
} from '@/components';
import { RatingsFilterSheet } from '@/components/home/filters/RatingsFilterSheet';
import { OffersFilterSheet } from '@/components/home/filters/OffersFilterSheet';
import { PriceFilterSheet } from '@/components/home/filters/PriceFilterSheet';
import type { FilterToggleId } from '@/components/home/FilterTagCarousel';
import type { FilterSheetId } from '@/constants/filterTags';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { useCuisines } from '@/hooks/useCuisines';
import { useCart } from '@/hooks/useCart';
import { useLocation } from '@/hooks/useLocation';
import { useRestaurants } from '@/hooks/useRestaurants';
import { promotionsApi } from '@/services/paymentsApi';
import { useHomeFiltersStore } from '@/stores/homeFiltersStore';
import { applyHomeFilters } from '@/utils/applyHomeFilters';
import { filterRestaurantsByCategory } from '@/utils/categoryFilter';
import { formatPromoHighlight, formatPromoTitle } from '@/utils/formatPromoTitle';
import { getErrorMessage } from '@/utils/getErrorMessage';

const PROMO_BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
];

export default function HomeScreen() {
  const { selectedAddress, coordinates, isLocating } = useLocation();
  const { itemCount, subtotal } = useCart();
  const { data: cuisines = [] } = useCuisines();
  const [category, setCategory] = useState<string | undefined>();
  const [openSheet, setOpenSheet] = useState<FilterSheetId | null>(null);
  const { filters, patchFilters } = useHomeFiltersStore();

  const activeCategory = category ?? cuisines[0]?.name ?? 'Biryani';

  const restaurantQuery = useMemo(() => {
    const lat = coordinates?.lat ?? 19.076;
    const lng = coordinates?.lng ?? 72.8777;
    return { lat, lng, limit: 50, radius: 12000 };
  }, [coordinates]);

  const { data, isLoading, isError, error, refetch } = useRestaurants(restaurantQuery);

  const promosQuery = useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionsApi.list(),
  });

  const restaurants = useMemo(
    () => filterRestaurantsByCategory(data?.data ?? [], activeCategory, cuisines),
    [activeCategory, cuisines, data?.data],
  );

  const filteredRestaurants = useMemo(
    () => applyHomeFilters(restaurants, filters),
    [restaurants, filters],
  );

  const handleToggleChip = (id: FilterToggleId) => {
    if (id === '30 min delivery') {
      const isActive = filters.fastDelivery || filters.deliveryTimeMax === 30;
      patchFilters({
        fastDelivery: !isActive,
        deliveryTimeMax: isActive
          ? filters.deliveryTimeMax === 30
            ? undefined
            : filters.deliveryTimeMax
          : 30,
      });
      return;
    }

    if (id === 'Takeout') {
      patchFilters({ takeout: !filters.takeout });
      return;
    }

    if (id === 'Picked for you') {
      patchFilters({ pickedForYou: !filters.pickedForYou });
      return;
    }

    if (id === 'Top place') {
      patchFilters({ topPlace: !filters.topPlace });
      return;
    }

    if (id === 'Halal') {
      patchFilters({ halal: !filters.halal });
      return;
    }

    if (id === 'Fastfood') {
      patchFilters({ fastfood: !filters.fastfood });
      return;
    }

    if (id === 'Vegetarian') {
      patchFilters({ vegetarian: !filters.vegetarian });
    }
  };

  const popular = filteredRestaurants[0];
  const favourites = filteredRestaurants.slice(1, 5);
  const trending = filteredRestaurants.slice(0, 4);
  const recommended = filteredRestaurants;

  const heroItems = useMemo(() => {
    const fromApi =
      promosQuery.data?.slice(0, 3).map((p, index) => ({
        id: p.id,
        title: formatPromoTitle(p),
        discountHighlight: formatPromoHighlight(p),
        discountSuffix: ' off',
        code: p.code,
        image: PROMO_BANNER_IMAGES[index % PROMO_BANNER_IMAGES.length],
        variant: (index % 2 === 0 ? 'dark' : 'blue') as 'dark' | 'blue',
      })) ?? [];

    if (fromApi.length > 0) return fromApi;

    return [
      {
        id: 'default',
        title: '20% off',
        discountHighlight: '20%',
        discountSuffix: ' off',
        code: 'WELCOME10',
        image: PROMO_BANNER_IMAGES[0],
        variant: 'dark' as const,
      },
    ];
  }, [promosQuery.data]);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <LocationHeader
          address={selectedAddress}
          isLocating={isLocating}
          onPress={() => router.push('/address')}
        />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <FoodCategoryCarousel
            categories={cuisines}
            selected={activeCategory}
            onSelect={setCategory}
          />

          <FilterTagCarousel
            filters={filters}
            onOpenAllFilters={() => router.push('/filters')}
            onOpenSheet={(sheet) => setOpenSheet(sheet)}
            onToggleChip={handleToggleChip}
          />

          <HeroBanner items={heroItems} />

          <RatingsFilterSheet
            visible={openSheet === 'ratings'}
            value={filters.minRating}
            onClose={() => setOpenSheet(null)}
            onApply={(minRating) => {
              patchFilters({
                minRating,
                sortBy: minRating != null ? 'rating' : filters.sortBy,
              });
            }}
          />

          <OffersFilterSheet
            visible={openSheet === 'offers'}
            hasOffers={filters.hasOffers}
            freeDelivery={filters.freeDelivery}
            onClose={() => setOpenSheet(null)}
            onApply={({ hasOffers, freeDelivery }) => {
              patchFilters({ hasOffers, freeDelivery });
            }}
          />

          <PriceFilterSheet
            visible={openSheet === 'price'}
            value={filters.priceAmounts}
            onClose={() => setOpenSheet(null)}
            onApply={(priceAmounts) => patchFilters({ priceAmounts })}
          />

          {isError ? (
            <FeaturedSection
              title="Recommended for you"
              restaurants={[]}
              loading={false}
              onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
              emptyMessage={getErrorMessage(error, 'Could not load restaurants')}
              onRetry={() => refetch()}
            />
          ) : (
            <>
              {popular ? (
                <View style={styles.section}>
                  <HomeSectionHeader
                    title="Popular Near You"
                    onPress={() => router.push('/(tabs)/search')}
                  />
                  <View style={styles.popularCard}>
                    <RestaurantCard
                      restaurant={popular}
                      onPress={(id) => router.push(`/restaurant/${id}`)}
                    />
                  </View>
                </View>
              ) : null}

              {favourites.length > 0 ? (
                <View style={styles.section}>
                  <HomeSectionHeader title="Your Favourite" />
                  <HorizontalRestaurantRow
                    restaurants={favourites}
                    onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
                  />
                </View>
              ) : null}

              {trending.length > 0 ? (
                <View style={styles.section}>
                  <HomeSectionHeader title="Trending now" />
                  <HorizontalRestaurantRow
                    restaurants={trending}
                    onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
                  />
                </View>
              ) : null}

              <FeaturedSection
                title="Recommended for you"
                restaurants={recommended}
                loading={isLoading}
                onRestaurantPress={(id) => router.push(`/restaurant/${id}`)}
              />
            </>
          )}
        </ScrollView>

        <FloatingCartBar
          itemCount={itemCount}
          subtotal={subtotal}
          onPress={() => router.push('/cart')}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingBottom: 120 },
  section: { marginTop: layout.sectionGap },
  popularCard: { paddingHorizontal: layout.screenPadding },
});
