import { StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export const authFormStyles = StyleSheet.create({
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 32,
  },
  social: {
    gap: layout.authSocialGap,
    marginTop: layout.authContentTop,
    marginBottom: layout.authSectionGap,
  },
  section: {
    marginBottom: layout.authSectionGap,
  },
  field: {
    gap: layout.authFieldLabelGap,
    marginBottom: layout.authSectionGap,
  },
  signupField: {
    gap: layout.authSignupFieldLabelGap,
    marginBottom: layout.authSectionGap,
  },
  nameRow: {
    flexDirection: 'row',
    gap: layout.authNameColumnGap,
    marginBottom: layout.authSectionGap,
  },
  nameColumn: {
    flex: 1,
    gap: layout.authSignupFieldLabelGap,
  },
  fieldLabel: {
    ...typography.fieldLabel,
    color: colors.neutral[900],
  },
  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  forgot: {
    ...typography.caption,
    color: colors.neutral[600],
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginBottom: layout.authSectionGap,
  },
  terms: {
    ...typography.caption,
    color: colors.neutral[600],
    textAlign: 'center',
    marginTop: layout.authTermsTopGap,
  },
  termsLink: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  verifyHint: {
    ...typography.body,
    color: colors.neutral[600],
    marginTop: layout.authContentTop,
    marginBottom: layout.authSectionGap,
  },
});
