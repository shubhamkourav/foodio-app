import { Tabs } from 'expo-router';
import { Bell, Home, Search, ShoppingBag, UserCircle } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { layout } from '@/constants/layout';
import { shadows } from '@/constants/shadows';
import { typography } from '@/constants/typography';

/** Bottom nav labels from Figma Nav component (Screen/ home/01) */
const TAB_LABELS = {
  home: 'Home',
  search: 'Search',
  orders: 'Order',
  notifications: 'Notification',
  profile: 'Account',
} as const;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'web' ? 0 : insets.bottom;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neutral[500],
        headerShown: false,
        tabBarLabelStyle: typography.tabLabel,
        tabBarIconStyle: { marginBottom: 4 },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          height: layout.tabBarHeight + bottomInset,
          paddingTop: 8,
          paddingBottom: bottomInset,
          ...shadows.tabBar,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: TAB_LABELS.home,
          tabBarIcon: ({ color }) => <Home color={color} size={layout.tabIconSize} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: TAB_LABELS.search,
          tabBarIcon: ({ color }) => <Search color={color} size={layout.tabIconSize} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: TAB_LABELS.orders,
          tabBarIcon: ({ color }) => <ShoppingBag color={color} size={layout.tabIconSize} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: TAB_LABELS.notifications,
          tabBarIcon: ({ color }) => <Bell color={color} size={layout.tabIconSize} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: TAB_LABELS.profile,
          tabBarIcon: ({ color }) => <UserCircle color={color} size={layout.tabIconSize} />,
        }}
      />
    </Tabs>
  );
}
