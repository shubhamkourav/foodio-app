import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingIllustration } from '@/components/auth/OnboardingIllustration';
import { OnboardingPagination } from '@/components/auth/OnboardingPagination';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FigmaButton } from '@/components/ui/FigmaButton';
import { ONBOARDING_SLIDES } from '@/constants/onboarding';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';
import { markOnboardingSeen } from '@/utils/onboardingStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function WelcomeScreen() {
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await markOnboardingSeen();
      router.push('/(auth)/launch');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (next !== index) setIndex(next);
  };

  return (
    <ErrorBoundary>
      <View style={styles.root}>
        <StatusBar style="dark" />
        <FlatList
          ref={listRef}
          data={ONBOARDING_SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.illustrationWrap}>
                <OnboardingIllustration
                  source={item.illustration}
                  format={item.illustrationFormat}
                  width={300}
                  height={300}
                />
              </View>
              <View style={styles.copyBlock}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
          )}
        />

        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <OnboardingPagination total={ONBOARDING_SLIDES.length} activeIndex={index} />
          <FigmaButton label={isLast ? 'Get Started' : 'Next'} onPress={handleNext} />
        </SafeAreaView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  list: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingTop: 88,
  },
  illustrationWrap: {
    alignItems: 'center',
    height: 300,
  },
  copyBlock: {
    marginTop: 89,
    paddingHorizontal: 50,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    ...typography.onboardingTitle,
    color: colors.neutral[900],
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body16,
    color: colors.placeholder,
    textAlign: 'center',
    maxWidth: 293,
  },
  footer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: layout.screenPadding,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 24,
    backgroundColor: colors.white,
  },
});
