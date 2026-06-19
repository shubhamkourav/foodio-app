import { useQuery } from '@tanstack/react-query';

import { searchApi } from '@/services/searchApi';
import type { SearchFilters } from '@/types/search';

const SEARCH_RADIUS = 12000;

export function useSearch(
  query: string,
  coords?: { lat: number; lng: number },
  options?: { enabled?: boolean },
) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ['search', trimmed, coords?.lat, coords?.lng],
    queryFn: () =>
      searchApi.search({
        q: trimmed,
        lat: coords?.lat,
        lng: coords?.lng,
        radius: SEARCH_RADIUS,
        limit: 50,
      }),
    enabled: (options?.enabled ?? true) && trimmed.length > 0,
    staleTime: 30_000,
  });
}

export { SEARCH_RADIUS };
