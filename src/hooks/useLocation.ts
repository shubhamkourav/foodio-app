import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getCurrentLocationAddress, LocationPermissionError } from '@/services/deviceLocation';
import { usersApi } from '@/services/usersApi';
import { useAuthStore } from '@/stores/authStore';
import { useLocationStore } from '@/stores/locationStore';
import type { Address } from '@/types/user';

export function useLocation() {
  const selectedAddress = useLocationStore((s) => s.selectedAddress);
  const coordinates = useLocationStore((s) => s.coordinates);
  const setSelectedAddress = useLocationStore((s) => s.setSelectedAddress);
  const setCoordinates = useLocationStore((s) => s.setCoordinates);
  const clearLocation = useLocationStore((s) => s.clearLocation);
  const isAuthenticated = !!useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const autoLocateAttempted = useRef(false);

  const addressesQuery = useQuery({
    queryKey: ['user', 'addresses'],
    queryFn: usersApi.getAddresses,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  const addAddressMutation = useMutation({
    mutationFn: usersApi.addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, address }: { id: string; address: Partial<Address> }) =>
      usersApi.updateAddress(id, address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] });
    },
  });

  useEffect(() => {
    if (!selectedAddress && addressesQuery.data?.length) {
      const defaultAddress =
        addressesQuery.data.find((a) => a.isDefault) ?? addressesQuery.data[0];
      setSelectedAddress(defaultAddress);
    }
  }, [addressesQuery.data, selectedAddress, setSelectedAddress]);

  const detectCurrentLocation = useCallback(async (): Promise<Address | null> => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const address = await getCurrentLocationAddress();
      setSelectedAddress(address);
      return address;
    } catch (error) {
      if (error instanceof LocationPermissionError) {
        setLocationError('Location permission is required to use your current address.');
      } else if (error instanceof Error) {
        setLocationError(error.message);
      } else {
        setLocationError('Could not get your location');
      }
      return null;
    } finally {
      setIsLocating(false);
    }
  }, [setSelectedAddress]);

  useEffect(() => {
    if (autoLocateAttempted.current) return;
    if (selectedAddress || coordinates) return;

    autoLocateAttempted.current = true;
    void detectCurrentLocation();
  }, [coordinates, detectCurrentLocation, selectedAddress]);

  const selectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const saveAddress = async (address: Address) => {
    if (!isAuthenticated) {
      setSelectedAddress(address);
      return address;
    }

    if (address.id) {
      const { id, ...updates } = address;
      const saved = await updateAddressMutation.mutateAsync({ id, address: updates });
      const normalized = { ...saved, id };
      if (selectedAddress?.id === id) {
        setSelectedAddress(normalized);
      }
      return normalized;
    }

    const saved = await addAddressMutation.mutateAsync(address);
    setSelectedAddress(saved);
    return saved;
  };

  return {
    selectedAddress,
    coordinates,
    savedAddresses: addressesQuery.data ?? [],
    isLoadingAddresses: addressesQuery.isLoading,
    isLocating,
    locationError,
    selectAddress,
    detectCurrentLocation,
    saveAddress,
    isSavingAddress: addAddressMutation.isPending || updateAddressMutation.isPending,
    setCoordinates,
    clearLocation,
    refetchAddresses: addressesQuery.refetch,
  };
}
