import type { LucideIcon } from 'lucide-react-native';
import { Bike, ShoppingBag } from 'lucide-react-native';

import { MENU_PRICE_CHIP_LABEL } from '@/constants/priceFilters';

export type FilterSheetId = 'ratings' | 'offers' | 'price';

export type FilterToggleId =
  | '30 min delivery'
  | 'Takeout'
  | 'Picked for you'
  | 'Top place'
  | 'Halal'
  | 'Fastfood'
  | 'Vegetarian';

export type FilterChipId = FilterToggleId | FilterSheetId;

type FilterChipConfig =
  | {
      id: FilterToggleId;
      label: string;
      kind: 'toggle';
      icon?: LucideIcon;
    }
  | {
      id: FilterSheetId;
      label: string;
      kind: 'sheet';
      chevron?: boolean;
    };

/** Figma Filter tag row — tabs & tags */
export const FILTER_TAG_CHIPS: FilterChipConfig[] = [
  { id: '30 min delivery', label: '30 min delivery', kind: 'toggle', icon: Bike },
  { id: 'Takeout', label: 'Takeout', kind: 'toggle', icon: ShoppingBag },
  { id: 'ratings', label: 'Ratings', kind: 'sheet', chevron: true },
  { id: 'offers', label: 'Offers', kind: 'sheet', chevron: true },
  { id: 'price', label: MENU_PRICE_CHIP_LABEL, kind: 'sheet', chevron: true },
  { id: 'Picked for you', label: 'Picked for you', kind: 'toggle' },
  { id: 'Top place', label: 'Top place', kind: 'toggle' },
  { id: 'Halal', label: 'Halal', kind: 'toggle' },
  { id: 'Fastfood', label: 'Fastfood', kind: 'toggle' },
  { id: 'Vegetarian', label: 'Vegetarian', kind: 'toggle' },
];

export const DIETARY_MATCHERS: Record<'Halal' | 'Fastfood' | 'Vegetarian', string[]> = {
  Halal: ['halal', 'middle eastern', 'kebab', 'mediterranean'],
  Fastfood: ['burger', 'american', 'fast food', 'fastfood', 'pizza'],
  Vegetarian: ['vegetarian', 'vegan', 'salad', 'healthy', 'bowl'],
};
