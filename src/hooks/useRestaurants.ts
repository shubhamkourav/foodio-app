import { useQuery } from '@tanstack/react-query';

import { restaurantsApi } from '@/services/restaurantsApi';
import type { RestaurantFilters } from '@/types/restaurant';

export function useRestaurants(filters?: RestaurantFilters) {
  return useQuery({
    queryKey: ['restaurants', filters],
    queryFn: () => restaurantsApi.list(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useRestaurant(id: string, lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['restaurants', id, lat, lng],
    queryFn: () => restaurantsApi.getById(id, lat, lng),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}
