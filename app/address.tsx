import { router } from 'expo-router';
import { Map, Search } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AddressListItem,
  AddressListItemPlaceholder,
  isAddressSelected,
} from '@/components/location/AddressListItem';
import { LocationPermissionCard } from '@/components/location/LocationPermissionCard';
import { ErrorBoundary, FigmaButton, InlineError } from '@/components';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useLocation } from '@/hooks/useLocation';

export default function AddressScreen() {
  const {
    selectedAddress,
    coordinates,
    savedAddresses,
    isLocating,
    locationError,
    detectCurrentLocation,
    selectAddress,
  } = useLocation();

  const [query, setQuery] = useState('');
  const [pendingAddress, setPendingAddress] = useState(selectedAddress);
  const [showPermissionCard, setShowPermissionCard] = useState(false);

  useEffect(() => {
    setPendingAddress(selectedAddress);
  }, [selectedAddress]);

  useEffect(() => {
    if (!selectedAddress && !coordinates) {
      setShowPermissionCard(true);
    }
  }, [coordinates, selectedAddress]);

  const filteredAddresses = useMemo(() => {
    if (!query.trim()) return savedAddresses;
    const q = query.toLowerCase();
    return savedAddresses.filter(
      (address) =>
        address.street.toLowerCase().includes(q) ||
        address.city.toLowerCase().includes(q) ||
        address.zipCode.toLowerCase().includes(q) ||
        address.label.toLowerCase().includes(q),
    );
  }, [query, savedAddresses]);

  const openMapPicker = () => {
    const params = new URLSearchParams();
    const lat = pendingAddress?.lat ?? coordinates?.lat;
    const lng = pendingAddress?.lng ?? coordinates?.lng;
    if (lat != null) params.set('lat', String(lat));
    if (lng != null) params.set('lng', String(lng));
    const suffix = params.toString();
    router.push(suffix ? `/location-map?${suffix}` : '/location-map');
  };

  const handleShareLocation = async () => {
    const address = await detectCurrentLocation();
    if (address) {
      setPendingAddress(address);
      setShowPermissionCard(false);
    }
  };

  const handleConfirm = () => {
    if (pendingAddress) {
      selectAddress(pendingAddress);
    }
    router.back();
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.neutral[700]} />
          <TextInput
            accessibilityLabel="Search address"
            placeholder="Search for an address"
            placeholderTextColor={colors.placeholder}
            value={query}
            onChangeText={setQuery}
            style={styles.searchInput}
            autoCorrect={false}
          />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <AddressListItemPlaceholder
            title="Set location on map"
            subtitle="Drag the pin to your exact delivery spot"
            onPress={openMapPicker}
          />

          <Pressable accessibilityRole="button" onPress={openMapPicker} style={styles.mapBanner}>
            <Map size={18} color={colors.primary} />
            <Text style={styles.mapBannerText}>Adjust on map</Text>
          </Pressable>

          {filteredAddresses.map((address) => (
            <AddressListItem
              key={address.id ?? `${address.label}-${address.street}`}
              address={address}
              selected={isAddressSelected(pendingAddress, address)}
              onPress={() => setPendingAddress(address)}
              onEdit={
                address.id
                  ? () => router.push(`/add-address?id=${encodeURIComponent(address.id!)}`)
                  : undefined
              }
            />
          ))}

          {filteredAddresses.length === 0 ? (
            <Text style={styles.empty}>No saved addresses match your search.</Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/add-address')}
            style={styles.addNew}>
            <Text style={styles.addNewText}>+ Add new address</Text>
          </Pressable>

          {locationError ? (
            <View style={styles.errorWrap}>
              <InlineError message={locationError} />
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <FigmaButton
            label="Confirm address"
            onPress={handleConfirm}
            disabled={!pendingAddress}
            loading={isLocating}
          />
        </View>

        <LocationPermissionCard
          visible={showPermissionCard}
          loading={isLocating}
          onShareLocation={handleShareLocation}
          onDismiss={() => setShowPermissionCard(false)}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    minHeight: layout.inputHeight,
    paddingHorizontal: spacing.md,
    borderRadius: layout.inputRadius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.neutral[100],
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.neutral[900],
    paddingVertical: spacing.sm,
  },
  scroll: { paddingBottom: 120 },
  mapBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: layout.screenPadding,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
  },
  mapBannerText: { ...typography.labelMd, color: colors.primary },
  empty: {
    ...typography.body,
    color: colors.neutral[700],
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.lg,
  },
  addNew: { paddingHorizontal: layout.screenPadding, paddingVertical: spacing.md },
  addNewText: { ...typography.labelMd, color: colors.primary },
  errorWrap: { paddingHorizontal: layout.screenPadding },
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.white,
  },
});
