import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Check, KeyRound, Mail, MapPin, Phone, User } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary, LoadingState } from '@/components';
import { AccountDetailRow } from '@/components/profile/AccountDetailRow';
import { AccountScreenHeader } from '@/components/profile/AccountScreenHeader';
import { SignOutSheet } from '@/components/profile/SignOutSheet';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from '@/hooks/useLocation';
import { formatAddressLine } from '@/utils/address';

const AVATAR_PLACEHOLDER =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80';

export default function MyAccountScreen() {
  const { user, isLoading, logout } = useAuth();
  const { selectedAddress, savedAddresses } = useLocation();
  const [showSignOut, setShowSignOut] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const defaultAddress =
    savedAddresses.find((address) => address.isDefault) ??
    savedAddresses[0] ??
    selectedAddress;

  const savedPlaceText = defaultAddress
    ? formatAddressLine(defaultAddress)
    : 'Add a delivery address';

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await logout();
      setShowSignOut(false);
      router.replace('/(auth)/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading && !user) {
    return (
      <ErrorBoundary>
        <LoadingState />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AccountScreenHeader title="My Account" showBack />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Image
                source={{ uri: user?.avatar ?? AVATAR_PLACEHOLDER }}
                style={styles.avatar}
                contentFit="cover"
                accessibilityLabel="Profile photo"
              />
              <View style={styles.verifiedBadge}>
                <Check size={11} color={colors.white} strokeWidth={3} />
              </View>
            </View>
          </View>

          <View style={styles.rows}>
            <AccountDetailRow
              label="Name"
              value={user?.name ?? '—'}
              icon={User}
              onPress={() => undefined}
            />
            <AccountDetailRow
              label="Email"
              value={user?.email ?? '—'}
              icon={Mail}
              onPress={() => undefined}
            />
            <AccountDetailRow
              label="Saved Places"
              value={savedPlaceText}
              icon={MapPin}
              onPress={() => router.push('/address')}
            />
            <AccountDetailRow
              label="Phone"
              value={user?.phone ?? 'Add phone number'}
              icon={Phone}
              onPress={() => undefined}
            />
            <AccountDetailRow
              label="Password"
              value="password"
              icon={KeyRound}
              secure
              onPress={() => undefined}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            onPress={() => setShowSignOut(true)}
            style={styles.signOutWrap}>
            <Text style={styles.signOut}>Sign out</Text>
          </Pressable>
        </ScrollView>

        <SignOutSheet
          visible={showSignOut}
          loading={isSigningOut}
          onConfirm={handleSignOut}
          onClose={() => setShowSignOut(false)}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { paddingBottom: spacing.xl },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
  },
  avatarWrap: {
    position: 'relative',
    width: layout.accountAvatarSize,
    height: layout.accountAvatarSize,
  },
  avatar: {
    width: layout.accountAvatarSize,
    height: layout.accountAvatarSize,
    borderRadius: layout.accountAvatarSize / 2,
    backgroundColor: colors.neutral[100],
  },
  verifiedBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: layout.accountVerifiedBadgeSize,
    height: layout.accountVerifiedBadgeSize,
    borderRadius: layout.accountVerifiedBadgeSize / 2,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rows: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.neutral[200],
  },
  signOutWrap: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 28,
    alignSelf: 'flex-start',
  },
  signOut: {
    ...typography.fieldLabel,
    color: colors.primary,
  },
});
