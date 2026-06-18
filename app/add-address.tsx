import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddressMapPreview } from '@/components/address/AddressMapPreview';
import { DeliveryOptionPicker } from '@/components/address/DeliveryOptionPicker';
import { ErrorBoundary, FigmaButton, InlineError } from '@/components';
import { colors } from '@/constants/colors';
import { DEFAULT_DELIVERY_OPTION } from '@/constants/deliveryOptions';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useLocation } from '@/hooks/useLocation';
import type { Address } from '@/types/user';
import { formatAddressLine, formatAddressSubtitle } from '@/utils/address';
import { validateAddress } from '@/utils/validateAddress';

const EMPTY_FORM: Address = {
  label: 'Home',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  lat: 0,
  lng: 0,
  deliveryOption: DEFAULT_DELIVERY_OPTION,
  deliveryInstructions: '',
};

function normalizeForm(address: Address): Address {
  return {
    ...address,
    deliveryOption: address.deliveryOption ?? DEFAULT_DELIVERY_OPTION,
    deliveryInstructions: address.deliveryInstructions ?? '',
  };
}

export default function AddAddressScreen() {
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(editId);
  const { saveAddress, isSavingAddress, selectedAddress, savedAddresses, isLoadingAddresses } =
    useLocation();

  const [form, setForm] = useState<Address>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isFormReady, setIsFormReady] = useState(!isEditing);

  const expectMapUpdate = useRef(false);

  useEffect(() => {
    if (editId) return;
    setForm(EMPTY_FORM);
    setShowInstructions(false);
    setErrors([]);
    setSaveError(null);
    setIsFormReady(true);
  }, [editId]);

  useEffect(() => {
    if (!isEditing || !editId) return;

    const existing = savedAddresses.find((address) => address.id === editId);
    if (!existing) return;

    const nextForm = normalizeForm(existing);
    setForm(nextForm);
    setShowInstructions(Boolean(nextForm.deliveryInstructions));
    setIsFormReady(true);
  }, [editId, isEditing, savedAddresses]);

  useFocusEffect(
    useCallback(() => {
      if (!expectMapUpdate.current || !selectedAddress) return;

      expectMapUpdate.current = false;
      setForm((current) => ({
        ...current,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipCode: selectedAddress.zipCode,
        lat: selectedAddress.lat,
        lng: selectedAddress.lng,
      }));
    }, [selectedAddress]),
  );

  const hasLocation = form.lat !== 0 && form.lng !== 0 && form.street.trim().length > 0;

  const openMapPicker = () => {
    expectMapUpdate.current = true;
    const params = new URLSearchParams();
    if (form.lat) params.set('lat', String(form.lat));
    if (form.lng) params.set('lng', String(form.lng));
    const suffix = params.toString();
    router.push(suffix ? `/location-map?${suffix}` : '/location-map');
  };

  const handleSave = async () => {
    const validationErrors = validateAddress(form);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setSaveError(null);

    try {
      await saveAddress({
        ...form,
        deliveryOption: form.deliveryOption ?? DEFAULT_DELIVERY_OPTION,
      });
      router.back();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save address');
    }
  };

  if (!isFormReady || (isEditing && isLoadingAddresses)) {
    return (
      <ErrorBoundary>
        <SafeAreaView style={styles.loadingContainer} edges={['bottom']}>
          <ActivityIndicator color={colors.primary} />
        </SafeAreaView>
      </ErrorBoundary>
    );
  }

  if (isEditing && !form.id) {
    return (
      <ErrorBoundary>
        <SafeAreaView style={styles.loadingContainer} edges={['bottom']}>
          <Text style={styles.missingText}>Address not found.</Text>
        </SafeAreaView>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {hasLocation ? (
            <View style={styles.mapSection}>
              <AddressMapPreview lat={form.lat} lng={form.lng} />
            </View>
          ) : (
            <Pressable accessibilityRole="button" onPress={openMapPicker} style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderTitle}>Set your delivery location</Text>
              <Text style={styles.mapPlaceholderHint}>Tap to open the map and place your pin</Text>
            </Pressable>
          )}

          <View style={styles.addressRow}>
            <View style={styles.addressText}>
              <Text style={styles.addressLine} numberOfLines={1}>
                {hasLocation ? formatAddressLine(form) : 'No address selected'}
              </Text>
              {hasLocation ? (
                <Text style={styles.addressSub} numberOfLines={1}>
                  {formatAddressSubtitle(form)}
                </Text>
              ) : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Adjust pin on map"
              onPress={openMapPicker}
              style={styles.adjustPill}>
              <Text style={styles.adjustPillText}>Adjust pin</Text>
            </Pressable>
            <View style={styles.addressDivider} />
          </View>

          <DeliveryOptionPicker
            value={form.deliveryOption ?? DEFAULT_DELIVERY_OPTION}
            instructions={form.deliveryInstructions ?? ''}
            onChange={(deliveryOption) => setForm((current) => ({ ...current, deliveryOption }))}
            onChangeInstructions={(deliveryInstructions) =>
              setForm((current) => ({ ...current, deliveryInstructions }))
            }
            showInstructionsInput={showInstructions}
            onToggleInstructions={() => setShowInstructions((value) => !value)}
          />

          {errors.length > 0 || saveError ? (
            <View style={styles.errorWrap}>
              <InlineError message={saveError ?? ''} errors={errors} />
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <FigmaButton label="Save Changes" onPress={handleSave} loading={isSavingAddress} />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.screenPadding,
  },
  missingText: { ...typography.body, color: colors.neutral[700] },
  scroll: { paddingBottom: 120 },
  mapSection: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.md,
  },
  mapPlaceholder: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.md,
    height: 180,
    borderRadius: layout.largeCardRadius,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xs,
  },
  mapPlaceholderTitle: { ...typography.labelMd, color: colors.neutral[900] },
  mapPlaceholderHint: { ...typography.caption, color: colors.neutral[700], textAlign: 'center' },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  addressText: { flex: 1, gap: 4 },
  addressLine: { ...typography.fieldLabel, color: colors.neutral[900] },
  addressSub: { ...typography.caption, color: colors.neutral[700] },
  adjustPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: layout.pillRadius,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.promoBlueCta,
  },
  adjustPillText: {
    ...typography.captionMedium,
    color: colors.promoBlueCta,
    fontWeight: '600',
  },
  addressDivider: {
    position: 'absolute',
    left: layout.screenPadding,
    right: layout.screenPadding,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.neutral[200],
  },
  errorWrap: { paddingHorizontal: layout.screenPadding, marginTop: spacing.md },
  footer: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    backgroundColor: colors.white,
  },
});
