import { apiRequestPaginated } from './apiClient';
import type { SearchResult, SearchFilters } from '@/types/search';

function buildQuery(filters: SearchFilters): string {
  const params = new URLSearchParams();
  params.set('q', filters.q);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.lat !== undefined) params.set('lat', String(filters.lat));
  if (filters.lng !== undefined) params.set('lng', String(filters.lng));
  if (filters.radius) params.set('radius', String(filters.radius));
  return `?${params.toString()}`;
}

export const searchApi = {
  search: (filters: SearchFilters) =>
    apiRequestPaginated<SearchResult[]>(`/search${buildQuery(filters)}`, { auth: false }),
};
