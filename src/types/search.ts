import type { Restaurant } from './restaurant';

export interface SearchResult extends Restaurant {
  matchedDishes?: string[];
}

export interface SearchFilters {
  q: string;
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
  radius?: number;
}
