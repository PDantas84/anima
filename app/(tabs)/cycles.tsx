import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Compass } from 'lucide-react-native';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { cycles } from '@/data/cycles';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function Cycles() {
  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <Text style={typography.label}>Travessias guiadas</Text>
        <Text style={typography.h1}>Ciclos de Transformacao</Text>
        <Text style={typography.body}>Cada ciclo e uma travessia breve. Dia apos dia, voce se reencontra em outro lugar.</Text>
      </View>

      {cycles.map((c, i) => (
        <Pressable key={c.id} onPress={() => router.push(`/cycle/${c.id}`)}>
          <LinearGradient
            colors={i % 2 === 0 ? ['#1E141C', '#120F16'] : ['#1A1720', '#110F17']}
            style={styles.card}
          >
            <View style={styles.rowTop}>
              <Compass color={colors.goldSoft} size={18} />
              <Text style={[typography.small, { color: colors.goldSoft }]}>{c.duration} dias</Text>
            </View>
            <Text style={[typography.h2, { marginTop: spacing.sm }]}>{c.title}</Text>
            <Text style={[typography.body, { marginTop: 4 }]}>{c.description}</Text>
            <Text style={[typography.small, { marginTop: spacing.sm, fontStyle: 'italic', color: colors.rose }]}>
              {c.objective}
            </Text>
          </LinearGradient>
        </Pressable>
      ))}
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
