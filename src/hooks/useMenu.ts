import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { restaurantsApi } from '@/services/restaurantsApi';
import type { MenuItemFilters } from '@/types/menu';

const MENU_PAGE_SIZE = 20;

export function useMenu(restaurantId: string) {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => restaurantsApi.getMenu(restaurantId),
    enabled: !!restaurantId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMenuItems(restaurantId: string, filters: MenuItemFilters) {
  return useInfiniteQuery({
    queryKey: ['menu-items', restaurantId, filters],
    queryFn: ({ pageParam }) =>
      restaurantsApi.listMenuItems(restaurantId, {
        ...filters,
        page: pageParam,
        limit: MENU_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!restaurantId,
    staleTime: 60 * 1000,
  });
}

export function useMenuItem(restaurantId: string, itemId: string) {
  return useQuery({
    queryKey: ['menu-item', restaurantId, itemId],
    queryFn: () => restaurantsApi.getMenuItem(restaurantId, itemId),
    enabled: !!restaurantId && !!itemId,
    staleTime: 2 * 60 * 1000,
  });
}
