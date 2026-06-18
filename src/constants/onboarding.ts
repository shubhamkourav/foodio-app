export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  illustration: number;
  illustrationFormat?: 'svg' | 'png';
}

/** Copy and illustrations from Figma onboarding screens */
export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Order your food',
    subtitle: 'Order your food anytime from anywhere.',
    illustration: require('../../assets/onboarding/slide-1.svg'),
    illustrationFormat: 'svg',
  },
  {
    id: '2',
    title: 'Healthy & Fresh',
    subtitle: 'Thousands of healthy & fresh recipes for you to enjoy.',
    illustration: require('../../assets/onboarding/slide-2.svg'),
    illustrationFormat: 'svg',
  },
  {
    id: '3',
    title: 'Add your favourites',
    subtitle:
      'Add your favourites recipe, food menus to your list. So that you can get reminder in future.',
    illustration: require('../../assets/onboarding/slide-3.svg'),
    illustrationFormat: 'svg',
  },
];
