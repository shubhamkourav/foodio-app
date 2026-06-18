import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface SocialAuthButtonProps {
  provider: 'facebook' | 'google';
  onPress?: () => void;
}

const PROVIDER_CONFIG = {
  facebook: {
    label: 'Continue with facebook',
    tone: 'facebook' as const,
    icon: 'logo-facebook' as const,
  },
  google: {
    label: 'Continue with google',
    tone: 'google' as const,
    icon: 'logo-google' as const,
  },
} as const;

export function SocialAuthButton({ provider, onPress }: SocialAuthButtonProps) {
  const config = PROVIDER_CONFIG[provider];

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={config.label}
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.fullWidth}>
      <View style={[styles.button, styles[config.tone]]}>
        <View style={styles.iconRing}>
          <Ionicons name={config.icon} size={20} color={colors.white} />
        </View>
        <View style={styles.labelWrap}>
          <Text style={styles.label}>{config.label}</Text>
        </View>
        <View style={styles.iconSpacer} />
      </View>
    </TouchableOpacity>
  );
}

const iconSize = layout.socialIconSize;

const styles = StyleSheet.create({
  fullWidth: {
    alignSelf: 'stretch',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: layout.buttonRadius,
    paddingHorizontal: 12,
    height: layout.socialButtonHeight,
    width: '100%',
  },
  facebook: {
    backgroundColor: colors.facebook,
  },
  google: {
    backgroundColor: colors.google,
  },
  iconRing: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacer: {
    width: iconSize,
  },
  label: {
    ...typography.labelMd,
    color: colors.white,
  },
});
