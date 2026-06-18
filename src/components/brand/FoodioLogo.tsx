import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

export interface FoodioLogoProps {
  variant?: 'color' | 'white';
  size?: 'md' | 'lg';
}

const ICON_SIZES = {
  md: 64,
  lg: 82,
} as const;

export function FoodioLogo({ variant = 'color', size = 'lg' }: FoodioLogoProps) {
  const iconSize = ICON_SIZES[size];
  const textColor = variant === 'white' ? colors.white : colors.neutral[900];
  const iconColors =
    variant === 'white'
      ? {
          yellow: colors.white,
          green: colors.white,
          orange: colors.white,
        }
      : {
          yellow: colors.accent,
          green: colors.primary,
          orange: colors.coral,
        };

  return (
    <View style={styles.container} accessibilityRole="image" accessibilityLabel="Foodio">
      <FoodioIcon size={iconSize} colors={iconColors} />
      <Text style={[styles.wordmark, size === 'lg' && styles.wordmarkLg, { color: textColor }]}>
        Foodio
      </Text>
    </View>
  );
}

interface FoodioIconProps {
  size: number;
  colors: {
    yellow: string;
    green: string;
    orange: string;
  };
}

function FoodioIcon({ size, colors: iconColors }: FoodioIconProps) {
  const gap = size * 0.06;
  const cell = (size - gap) / 2;
  const blY = cell + gap;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={cell / 2} cy={cell / 2} r={cell / 2} fill={iconColors.yellow} />
      <Rect
        x={cell + gap}
        y={0}
        width={cell}
        height={cell}
        rx={cell * 0.12}
        fill={iconColors.green}
      />
      <Path
        d={`M 0 ${size} L ${cell / 2} ${blY} L ${cell} ${blY} L ${cell} ${size} Z`}
        fill={iconColors.orange}
      />
      <Circle cx={cell + gap + cell / 2} cy={blY + cell / 2} r={cell / 2} fill={iconColors.green} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  wordmark: {
    ...typography.onboardingTitle,
    fontSize: 28,
    lineHeight: 34,
  },
  wordmarkLg: {
    fontSize: 32,
    lineHeight: 38,
  },
});
