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
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorBoundary, LoadingState } from '@/components';
import { AccountMenuItem } from '@/components/profile/AccountMenuItem';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';
import { useAuth } from '@/hooks/useAuth';

const MENU_ITEMS = [
  { label: 'My Account', icon: User, route: null },
  { label: 'Your Favourites', icon: Heart, route: '/(tabs)/search' },
  { label: 'Payment Methods', icon: CreditCard, route: null },
  { label: 'Carts & Bags', icon: ShoppingCart, route: '/cart' },
  { label: 'My orders', icon: Clock, route: '/(tabs)/orders' },
  { label: 'Business', icon: Briefcase, route: null },
  { label: 'Rewards', icon: Star, route: null },
  { label: 'Best deals', icon: Tag, route: null },
  { label: 'Support', icon: HelpCircle, route: null },
  { label: 'Notification', icon: Bell, route: null },
  { label: 'Settings', icon: Settings, route: null },
  { label: 'FAQ', icon: MessageCircleQuestion, route: null },
] as const;

export default function ProfileScreen() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (isLoading && !user) {
    return (
      <ErrorBoundary>
        <LoadingState />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Account</Text>
          {user ? <Text style={styles.subtitle}>{user.name}</Text> : null}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {MENU_ITEMS.map((item) => (
            <AccountMenuItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              onPress={item.route ? () => router.push(item.route as never) : undefined}
            />
          ))}
          <View style={styles.about}>
            <Text style={styles.aboutLabel}>About</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Sign Out"
            variant="outline"
            onPress={handleLogout}
            fullWidth
            disabled={!isAuthenticated}
          />
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    minHeight: 88,
    justifyContent: 'flex-end',
  },
  title: { ...typography.pageTitle, color: colors.neutral[900] },
  subtitle: { ...typography.body, color: colors.neutral[600], marginTop: spacing.xs },
  about: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  aboutLabel: { ...typography.fieldLabel, color: colors.neutral[900] },
  footer: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.neutral[200] },
});
