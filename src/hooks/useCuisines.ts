import { useQuery } from '@tanstack/react-query';

import type { Cuisine } from '@/services/cuisinesApi';
import { cuisinesApi } from '@/services/cuisinesApi';

const FALLBACK_CUISINES: Cuisine[] = [
  { id: 'biryani', name: 'Biryani', slug: 'biryani', emoji: '🍛', sortOrder: 1, matchers: ['biryani'] },
  { id: 'north-indian', name: 'North Indian', slug: 'north-indian', emoji: '🫓', sortOrder: 2, matchers: ['north indian'] },
  { id: 'south-indian', name: 'South Indian', slug: 'south-indian', emoji: '🥘', sortOrder: 3, matchers: ['south indian'] },
  { id: 'street-food', name: 'Street Food', slug: 'street-food', emoji: '🌮', sortOrder: 4, matchers: ['street food'] },
];

export function useCuisines() {
  return useQuery({
    queryKey: ['cuisines'],
    queryFn: cuisinesApi.list,
    staleTime: 10 * 60 * 1000,
    placeholderData: FALLBACK_CUISINES,
  });
}
