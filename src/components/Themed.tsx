/**
 * Theme-aware components using Foodio design tokens.
 */
import { Text as DefaultText, View as DefaultView } from 'react-native';

import { colors } from '@/constants/colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

const themeColors = {
  light: {
    text: colors.neutral[900],
    background: colors.neutral[50],
    tint: colors.primary,
    tabIconDefault: colors.neutral[400],
    tabIconSelected: colors.primary,
  },
  dark: {
    text: colors.white,
    background: colors.neutral[900],
    tint: colors.primary,
    tabIconDefault: colors.neutral[400],
    tabIconSelected: colors.primary,
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof (typeof themeColors)['light'],
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return themeColors[theme][colorName];
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
