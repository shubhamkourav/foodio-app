import { Image } from 'expo-image';
import { MessageCircle, Phone, Car } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export interface DriverCardProps {
  name: string;
  photo?: string;
  vehicleType?: string;
  vehicleNumber?: string;
  onCall?: () => void;
  onMessage?: () => void;
}

export function DriverCard({
  name,
  photo,
  vehicleType,
  vehicleNumber,
  onCall,
  onMessage,
}: DriverCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Your Driver</Text>
      <View style={styles.row}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} accessibilityLabel={`${name} photo`} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          {vehicleType ? (
            <View style={styles.vehicleRow}>
              <Car size={14} color={colors.neutral[400]} />
              <Text style={styles.vehicle}>
                {vehicleType}
                {vehicleNumber ? ` · ${vehicleNumber}` : ''}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel="Call driver"
            hitSlop={8}
            onPress={onCall}
            style={styles.actionButton}>
            <Phone size={18} color={colors.primary} />
          </Pressable>
          <Pressable
            accessibilityLabel="Message driver"
            hitSlop={8}
            onPress={onMessage}
            style={styles.actionButton}>
            <MessageCircle size={18} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  title: { ...typography.h3, color: colors.neutral[900] },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.secondary },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...typography.h3, color: colors.primary },
  info: { flex: 1, gap: spacing.xs },
  name: { ...typography.h3, color: colors.neutral[900] },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  vehicle: { ...typography.caption, color: colors.neutral[700] },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
