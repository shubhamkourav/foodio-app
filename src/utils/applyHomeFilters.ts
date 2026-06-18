import { DIETARY_MATCHERS } from '@/constants/filterTags';
import type { HomeFilters } from '@/types/homeFilters';
import type { Restaurant } from '@/types/restaurant';

function matchesDietary(restaurant: Restaurant, matchers: string[]): boolean {
  return restaurant.cuisine.some((cuisine) =>
    matchers.some((matcher) => cuisine.toLowerCase().includes(matcher)),
  );
}

export function applyHomeFilters(restaurants: Restaurant[], filters: HomeFilters): Restaurant[] {
  let result = [...restaurants];

  const deliveryMax =
    filters.deliveryTimeMax ?? (filters.fastDelivery ? 30 : undefined);
  if (deliveryMax != null) {
    result = result.filter((restaurant) => restaurant.deliveryTimeMin <= deliveryMax);
  }

  if (filters.takeout) {
    const takeoutMatches = result.filter((restaurant) => restaurant.deliveryFee <= 1.99);
    if (takeoutMatches.length > 0) {
      result = takeoutMatches;
    }
  }

  if (filters.minRating != null) {
    result = result.filter((restaurant) => restaurant.rating >= filters.minRating!);
  }

  if (filters.maxDistanceKm != null) {
    result = result.filter(
      (restaurant) => (restaurant.distance ?? 0) <= filters.maxDistanceKm!,
    );
  }

  if (filters.priceAmounts != null && filters.priceAmounts.length > 0) {
    result = result.filter((restaurant) =>
      filters.priceAmounts!.some((amount) => restaurant.minOrderAmount <= amount),
    );
  }

  if (filters.hasOffers) {
    const withOffers = result.filter(
      (restaurant) => (restaurant.promotions?.length ?? 0) > 0 || restaurant.rating >= 4,
    );
    if (withOffers.length > 0) {
      result = withOffers;
    }
  }

  if (filters.freeDelivery) {
    const freeDeliveryMatches = result.filter((restaurant) => restaurant.deliveryFee === 0);
    if (freeDeliveryMatches.length > 0) {
      result = freeDeliveryMatches;
    }
  }

  if (filters.topPlace) {
    const topMatches = result.filter((restaurant) => restaurant.rating >= 4.5);
    if (topMatches.length > 0) {
      result = topMatches;
    }
  }

  if (filters.halal) {
    const halalMatches = result.filter((restaurant) =>
      matchesDietary(restaurant, DIETARY_MATCHERS.Halal),
    );
    if (halalMatches.length > 0) {
      result = halalMatches;
    }
  }

  if (filters.fastfood) {
    const fastfoodMatches = result.filter((restaurant) =>
      matchesDietary(restaurant, DIETARY_MATCHERS.Fastfood),
    );
    if (fastfoodMatches.length > 0) {
      result = fastfoodMatches;
    }
  }

  if (filters.vegetarian) {
    const vegetarianMatches = result.filter((restaurant) =>
      matchesDietary(restaurant, DIETARY_MATCHERS.Vegetarian),
    );
    if (vegetarianMatches.length > 0) {
      result = vegetarianMatches;
    }
  }

  if (filters.pickedForYou) {
    result.sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating);
  } else {
    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery_time':
        result.sort((a, b) => a.deliveryTimeMin - b.deliveryTimeMin);
        break;
      case 'distance':
        result.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
        break;
      case 'cost':
        result.sort((a, b) => a.deliveryFee - b.deliveryFee);
        break;
      default:
        break;
    }
  }

  return result;
}
