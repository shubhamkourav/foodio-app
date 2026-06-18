import { router } from 'expo-router';
import {
  Bell,
  Briefcase,
  Clock,
  CreditCard,
  Heart,
  HelpCircle,
  MessageCircleQuestion,
  Settings,
  ShoppingCart,
  Star,
  Tag,
  User,
} from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ErrorBoundary } from '@/components';
import { AccountMenuItem } from '@/components/profile/AccountMenuItem';
import { AccountScreenHeader } from '@/components/profile/AccountScreenHeader';
import { colors } from '@/constants/colors';

const MENU_ITEMS = [
  {
    label: 'My Account',
    icon: User,
    onPress: () => router.push('/my-account'),
  },
  {
    label: 'Your Favourites',
    icon: Heart,
    onPress: () => router.push('/(tabs)/search'),
  },
  {
    label: 'Payment Methods',
    icon: CreditCard,
    onPress: undefined,
  },
  {
    label: 'Carts & Bags',
    icon: ShoppingCart,
    onPress: () => router.push('/cart'),
  },
  {
    label: 'My orders',
    icon: Clock,
    onPress: () => router.push('/(tabs)/orders'),
  },
  {
    label: 'Business',
    icon: Briefcase,
    onPress: undefined,
  },
  {
    label: 'Rewards',
    icon: Star,
    onPress: undefined,
  },
  {
    label: 'Best deals',
    icon: Tag,
    onPress: undefined,
  },
  {
    label: 'Support',
    icon: HelpCircle,
    onPress: undefined,
  },
  {
    label: 'Notification',
    icon: Bell,
    onPress: () => router.push('/(tabs)/notifications'),
  },
  {
    label: 'Settings',
    icon: Settings,
    onPress: undefined,
  },
  {
    label: 'FAQ',
    icon: MessageCircleQuestion,
    onPress: undefined,
  },
] as const;

export default function ProfileScreen() {
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <AccountScreenHeader
          title="Account"
          showBack
          onBack={() => router.navigate('/(tabs)')}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.list}>
          {MENU_ITEMS.map((item) => (
            <AccountMenuItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              onPress={item.onPress}
            />
          ))}
        </ScrollView>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  list: { flexGrow: 1 },
});
