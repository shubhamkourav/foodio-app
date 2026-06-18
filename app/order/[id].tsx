import { Redirect, useLocalSearchParams } from 'expo-router';

export default function OrderDeepLinkScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return <Redirect href="/(tabs)/orders" />;
  }

  return <Redirect href={`/tracking/${id}`} />;
}
