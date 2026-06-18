import { create } from 'zustand';

import { DEFAULT_HOME_FILTERS, type HomeFilters } from '@/types/homeFilters';

interface HomeFiltersState {
  filters: HomeFilters;
  setFilters: (filters: HomeFilters) => void;
  patchFilters: (patch: Partial<HomeFilters>) => void;
  resetFilters: () => void;
}

export const useHomeFiltersStore = create<HomeFiltersState>((set) => ({
  filters: { ...DEFAULT_HOME_FILTERS },
  setFilters: (filters) => set({ filters }),
  patchFilters: (patch) =>
    set((state) => ({
      filters: { ...state.filters, ...patch },
    })),
  resetFilters: () => set({ filters: { ...DEFAULT_HOME_FILTERS } }),
}));
