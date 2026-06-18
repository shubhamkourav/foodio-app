export type HomeSortBy = 'popular' | 'rating' | 'delivery_time' | 'distance' | 'cost';

export interface HomeFilters {
  sortBy: HomeSortBy;
  fastDelivery: boolean;
  takeout: boolean;
  minRating?: number;
  deliveryTimeMax?: number;
  maxDistanceKm?: number;
  /** Selected menu price amounts (e.g. 10, 20) */
  priceAmounts?: number[];
  hasOffers?: boolean;
  freeDelivery?: boolean;
  pickedForYou?: boolean;
  topPlace?: boolean;
  halal?: boolean;
  fastfood?: boolean;
  vegetarian?: boolean;
}

export const DEFAULT_HOME_FILTERS: HomeFilters = {
  sortBy: 'popular',
  fastDelivery: false,
  takeout: false,
};

export function hasActiveHomeFilters(filters: HomeFilters): boolean {
  return (
    filters.fastDelivery ||
    filters.takeout ||
    filters.minRating != null ||
    filters.deliveryTimeMax != null ||
    filters.maxDistanceKm != null ||
    (filters.priceAmounts != null && filters.priceAmounts.length > 0) ||
    filters.hasOffers === true ||
    filters.freeDelivery === true ||
    filters.pickedForYou === true ||
    filters.topPlace === true ||
    filters.halal === true ||
    filters.fastfood === true ||
    filters.vegetarian === true ||
    filters.sortBy !== 'popular'
  );
}
