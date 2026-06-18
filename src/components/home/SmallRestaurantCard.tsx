import { RestaurantCard } from '@/components/home/RestaurantCard';
import type { Restaurant } from '@/types/restaurant';

export interface SmallRestaurantCardProps {
  restaurant: Restaurant;
  onPress?: (id: string) => void;
}

export function SmallRestaurantCard({ restaurant, onPress }: SmallRestaurantCardProps) {
  return <RestaurantCard restaurant={restaurant} onPress={onPress} compact />;
}
