import { create } from 'zustand';

import type { Coordinates } from '@/types/restaurant';
import type { Address } from '@/types/user';

interface LocationState {
  selectedAddress: Address | null;
  coordinates: Coordinates | null;
  setSelectedAddress: (address: Address) => void;
  setCoordinates: (coordinates: Coordinates) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  selectedAddress: null,
  coordinates: null,

  setSelectedAddress: (address) =>
    set({
      selectedAddress: address,
      coordinates: { lat: address.lat, lng: address.lng },
    }),

  setCoordinates: (coordinates) => set({ coordinates }),

  clearLocation: () => set({ selectedAddress: null, coordinates: null }),
}));
