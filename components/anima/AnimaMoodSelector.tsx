import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';

type Props = {
  value: number;
  onChange: (v: number) => void;
  label?: string;
  min?: number;
  max?: number;
};

export function AnimaMoodSelector({ value, onChange, label, min = 0, max = 10 }: Props) {
  const items = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  return (
    <View style={{ gap: spacing.sm }}>
      {label && <Text style={typography.label}>{label}</Text>}
      <View style={styles.row}>
        {items.map((n) => {
          const active = value === n;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              style={[styles.dot, active && styles.active]}
            >
              <Text style={[styles.n, active && styles.nActive]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  active: { backgroundColor: colors.rose, borderColor: colors.rose },
  n: { color: colors.textMuted, fontFamily: 'Inter-Medium', fontSize: 13 },
  nActive: { color: colors.bg },
});
