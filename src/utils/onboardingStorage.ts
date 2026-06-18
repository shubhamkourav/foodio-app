import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_SEEN_KEY = 'foodio_has_seen_onboarding';

let cachedHasSeenOnboarding: boolean | null = null;

export async function getHasSeenOnboarding(): Promise<boolean> {
  if (cachedHasSeenOnboarding !== null) {
    return cachedHasSeenOnboarding;
  }

  const value = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
  cachedHasSeenOnboarding = value === 'true';
  return cachedHasSeenOnboarding;
}

export async function markOnboardingSeen(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
  cachedHasSeenOnboarding = true;
}
