import { Platform, type TextStyle } from 'react-native';

const system = Platform.select({
  ios: 'System',
  default: 'sans-serif',
});

export const fontFamily = {
  display: system,
  displayMedium: system,
  body: system,
  bodyMedium: system,
  bodySemiBold: system,
} as const;

/** Typography tokens mapped 1:1 from Figma Style Guide (SF Pro Display) */
export const typography: Record<string, TextStyle> = {
  h1: { fontSize: 28, fontWeight: '700', lineHeight: 34, fontFamily: system },
  h2: { fontSize: 22, fontWeight: '700', lineHeight: 29, fontFamily: system },
  h3: { fontSize: 18, fontWeight: '600', lineHeight: 22, fontFamily: system },
  sectionTitle: { fontSize: 22, fontWeight: '700', lineHeight: 29, fontFamily: system },
  pageTitle: { fontSize: 24, fontWeight: '700', lineHeight: 29, fontFamily: system },
  cardTitle: { fontSize: 20, fontWeight: '700', lineHeight: 24, fontFamily: system },
  onboardingTitle: { fontSize: 32, fontWeight: '700', lineHeight: 38, fontFamily: system },
  fieldLabel: { fontSize: 16, fontWeight: '600', lineHeight: 20, fontFamily: system },
  buttonLabel: { fontSize: 16, fontWeight: '600', lineHeight: 20, fontFamily: system },
  body: { fontSize: 14, fontWeight: '400', lineHeight: 21, fontFamily: system },
  body16: { fontSize: 16, fontWeight: '400', lineHeight: 24, fontFamily: system },
  bodyMedium: { fontSize: 14, fontWeight: '500', lineHeight: 17, fontFamily: system },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 18, fontFamily: system },
  captionMedium: { fontSize: 12, fontWeight: '500', lineHeight: 15, fontFamily: system },
  label: { fontSize: 12, fontWeight: '600', lineHeight: 15, fontFamily: system },
  labelMd: { fontSize: 14, fontWeight: '600', lineHeight: 17, fontFamily: system },
  tabLabel: { fontSize: 12, fontWeight: '500', lineHeight: 15, fontFamily: system },
  deliverTo: { fontSize: 14, fontWeight: '600', lineHeight: 17, fontFamily: system },
  address: { fontSize: 16, fontWeight: '600', lineHeight: 20, fontFamily: system },
  categoryLabel: { fontSize: 12, fontWeight: '400', lineHeight: 15, fontFamily: system },
  /** Banner/01 — discount line ("20% off") */
  promoDiscount: { fontSize: 22, fontWeight: '700', lineHeight: 29, fontFamily: system },
  /** Banner/01 — CTA label */
  promoCta: { fontSize: 12, fontWeight: '600', lineHeight: 14, fontFamily: system },
  /** Banner/01 — promo code line */
  promoCode: { fontSize: 13, fontWeight: '500', lineHeight: 20, fontFamily: system },
};
