import { apiRequest, apiRequestPaginated } from './apiClient';
import type { Restaurant, RestaurantFilters } from '@/types/restaurant';
import type { MenuItem, MenuItemFilters, RestaurantMenu } from '@/types/menu';

const MENU_PAGE_SIZE = 20;

function buildQuery(filters?: RestaurantFilters): string {
  if (!filters) return '';

  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.cuisine) params.set('cuisine', filters.cuisine);
  if (filters.minRating) params.set('minRating', String(filters.minRating));
  if (filters.lat !== undefined) params.set('lat', String(filters.lat));
  if (filters.lng !== undefined) params.set('lng', String(filters.lng));
  if (filters.radius) params.set('radius', String(filters.radius));

  const query = params.toString();
  return query ? `?${query}` : '';
}

export const restaurantsApi = {
  list: (filters?: RestaurantFilters) =>
    apiRequestPaginated<Restaurant[]>(`/restaurants${buildQuery(filters)}`, { auth: false }),

  getById: (id: string, lat?: number, lng?: number) => {
    const params = new URLSearchParams();
    if (lat !== undefined) params.set('lat', String(lat));
    if (lng !== undefined) params.set('lng', String(lng));
    const query = params.toString();
    return apiRequest<Restaurant>(`/restaurants/${id}${query ? `?${query}` : ''}`, {
      auth: false,
    });
  },

  getMenu: (id: string) =>
    apiRequest<RestaurantMenu>(`/restaurants/${id}/menu`, { auth: false }),

  listMenuItems: (restaurantId: string, filters?: MenuItemFilters & { page?: number }) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.set('categoryId', filters.categoryId);
    if (filters?.q) params.set('q', filters.q);
    if (filters?.isVeg !== undefined) params.set('isVeg', String(filters.isVeg));
    if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
    if (filters?.page) params.set('page', String(filters.page));
    params.set('limit', String(filters?.limit ?? MENU_PAGE_SIZE));
    const query = params.toString();
    return apiRequestPaginated<MenuItem[]>(
      `/restaurants/${restaurantId}/menu/items${query ? `?${query}` : ''}`,
      { auth: false },
    );
  },

  getMenuItem: (restaurantId: string, itemId: string) =>
    apiRequest<MenuItem>(`/restaurants/${restaurantId}/menu/items/${itemId}`, { auth: false }),
};
