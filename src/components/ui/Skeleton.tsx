import { useEffect } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/colors';

export interface SkeletonProps extends ViewProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
  ...props
}: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View accessibilityLabel="Loading" accessibilityRole="progressbar" {...props}>
      <Animated.View
        style={[
          styles.skeleton,
          animatedStyle,
          { width, height, borderRadius },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.neutral[200],
  },
});
