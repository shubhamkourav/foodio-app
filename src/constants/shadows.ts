import { Platform, type ViewStyle } from 'react-native';

export const shadows = {
  header: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.04,
      shadowRadius: 16,
    },
    android: { elevation: 4 },
    default: {},
  }),
  tabBar: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.04,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
    default: {},
  }),
  card: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 36,
    },
    android: { elevation: 3 },
    default: {},
  }),
};
