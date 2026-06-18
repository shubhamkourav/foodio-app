import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { PromoPagination } from '@/components/home/PromoPagination';
import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { typography } from '@/constants/typography';

export interface HeroBannerItem {
  id: string;
  /** Accessibility label, e.g. "20% off" */
  title: string;
  /** Highlighted part: "20%" or "$5" */
  discountHighlight: string;
  /** Usually " off" in white */
  discountSuffix?: string;
  code?: string;
  image: string;
  variant?: 'dark' | 'blue';
}

export interface HeroBannerProps {
  items: HeroBannerItem[];
  /** Reserved for when promo checkout flow is implemented */
  onOrderNow?: (item: HeroBannerItem) => void;
}

const VARIANTS = {
  dark: {
    panel: colors.promoPanel,
    label: colors.white,
    discountHighlight: colors.promoGold,
    discountSuffix: colors.white,
    code: colors.white,
    ctaBg: colors.primary,
    ctaText: colors.white,
  },
  blue: {
    panel: colors.promoPanelAlt,
    label: colors.white,
    discountHighlight: colors.promoBlueText,
    discountSuffix: colors.white,
    code: colors.white,
    ctaBg: colors.promoBlueCta,
    ctaText: colors.white,
  },
} as const;

type PromoTheme = (typeof VARIANTS)[keyof typeof VARIANTS];

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getPromoGradient(theme: PromoTheme) {
  return {
    colors: [
      hexToRgba(theme.panel, 0.92),
      hexToRgba(theme.discountHighlight, 0.45),
      hexToRgba(theme.discountHighlight, 0.12),
      'transparent',
    ] as const,
    locations: [0, 0.38, 0.72, 1] as const,
  };
}

function PromoImageHalf({ uri, theme }: { uri: string; theme: PromoTheme }) {
  const gradient = getPromoGradient(theme);

  return (
    <View style={styles.imageHalf}>
      <Image
        source={{ uri }}
        style={styles.imageFill}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
      <LinearGradient
        colors={[...gradient.colors]}
        locations={[...gradient.locations]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
    </View>
  );
}

function PromoBannerCard({
  item,
  variantKey,
  onOrderNow,
}: {
  item: HeroBannerItem;
  variantKey: 'dark' | 'blue';
  onOrderNow?: (item: HeroBannerItem) => void;
}) {
  const theme = VARIANTS[variantKey];
  const actionReady = Boolean(onOrderNow);

  return (
    <View style={styles.banner}>
      <View style={[styles.half, styles.left, { backgroundColor: theme.panel }]}>
        <View style={styles.textBlock}>
          <Text style={[styles.upto, { color: theme.label }]}>Get upto</Text>
          <View style={styles.discountRow}>
            <Text style={[styles.discountHighlight, { color: theme.discountHighlight }]}>
              {item.discountHighlight}
            </Text>
            {item.discountSuffix ? (
              <Text style={[styles.discountSuffix, { color: theme.discountSuffix }]}>
                {item.discountSuffix}
              </Text>
            ) : null}
          </View>
          {item.code ? (
            <Text
              style={[styles.code, { color: theme.code }]}
              numberOfLines={1}
              ellipsizeMode="tail">
              Enter code: {item.code}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            actionReady ? `Order now with code ${item.code ?? ''}` : 'Order now, coming soon'
          }
          accessibilityState={{ disabled: !actionReady }}
          activeOpacity={actionReady ? 0.92 : 1}
          disabled={!actionReady}
          onPress={() => onOrderNow?.(item)}
          style={styles.ctaTouchable}>
          <View
            style={[
              styles.cta,
              { backgroundColor: theme.ctaBg },
              !actionReady && styles.ctaDisabled,
            ]}>
            <Text style={[styles.ctaText, { color: theme.ctaText }]}>Order Now</Text>
          </View>
        </TouchableOpacity>
      </View>
      <PromoImageHalf uri={item.image} theme={theme} />
    </View>
  );
}

/** Figma home promo carousel — 50/50 split card */
export function HeroBanner({ items, onOrderNow }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (layout.promoWidth + layout.promoGap));
    if (index !== activeIndex) setActiveIndex(index);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        decelerationRate="fast"
        snapToInterval={layout.promoWidth + layout.promoGap}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        onScroll={onScroll}
        scrollEventThrottle={16}
        accessibilityLabel="Promotions carousel">
        {items.map((item, index) => {
          const variantKey = item.variant ?? (index % 2 === 0 ? 'dark' : 'blue');
          return (
            <View
              key={item.id}
              accessibilityLabel={`${item.title}, code ${item.code ?? ''}`}
              style={styles.cardSlot}>
              <PromoBannerCard item={item} variantKey={variantKey} onOrderNow={onOrderNow} />
            </View>
          );
        })}
      </ScrollView>
      <PromoPagination total={items.length} activeIndex={activeIndex} />
    </View>
  );
}

const halfWidth = layout.promoWidth / 2;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    gap: layout.promoGap,
  },
  cardSlot: {
    width: layout.promoWidth,
  },
  banner: {
    width: layout.promoWidth,
    height: layout.promoHeight,
    borderRadius: layout.promoRadius,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  half: {
    width: halfWidth,
    height: layout.promoHeight,
  },
  left: {
    paddingHorizontal: layout.promoContentPadding,
    paddingTop: 18,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  textBlock: {
    gap: 4,
  },
  imageHalf: {
    width: halfWidth,
    height: layout.promoHeight,
    overflow: 'hidden',
  },
  imageFill: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  upto: {
    ...typography.captionMedium,
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  discountHighlight: {
    ...typography.promoDiscount,
  },
  discountSuffix: {
    ...typography.promoDiscount,
  },
  code: {
    marginTop: 8,
    minHeight: 20,
    ...typography.promoCode,
  },
  ctaTouchable: {
    alignSelf: 'flex-start',
  },
  cta: {
    width: layout.promoButtonWidth,
    height: layout.promoButtonHeight,
    borderRadius: layout.promoButtonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: {
    opacity: 0.85,
  },
  ctaText: {
    ...typography.promoCta,
  },
});
