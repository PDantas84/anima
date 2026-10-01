import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaCard, AnimaGradientCard } from '@/components/anima/AnimaCard';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { cycles } from '@/data/cycles';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function CycleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cycle = cycles.find((c) => c.id === id) ?? cycles[0];
  const [dayIdx, setDayIdx] = useState(0);
  const day = cycle.days[dayIdx];

  return (
    <AnimaScreen>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft color={colors.textMuted} size={18} />
        <Text style={typography.small}>Voltar aos ciclos</Text>
      </Pressable>

      <View style={{ gap: spacing.sm }}>
        <Text style={typography.label}>{cycle.duration} dias</Text>
        <Text style={typography.h1}>{cycle.title}</Text>
        <Text style={typography.body}>{cycle.description}</Text>
      </View>

      <AnimaGradientCard>
        <Text style={typography.label}>Objetivo do ciclo</Text>
        <Text style={[typography.body, { color: colors.ivory, marginTop: 4 }]}>{cycle.objective}</Text>
      </AnimaGradientCard>

      <View style={styles.daysRow}>
        {cycle.days.map((d, i) => {
          const active = i === dayIdx;
          return (
            <Pressable key={d.day} onPress={() => setDayIdx(i)} style={[styles.dayDot, active && styles.dayDotActive]}>
              <Text style={[styles.dayN, active && styles.dayNActive]}>{d.day}</Text>
            </Pressable>
          );
        })}
      </View>

      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Dia {day.day}</Text>
        <Text style={typography.h2}>{day.title}</Text>
      </AnimaCard>

      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Reflexao</Text>
        <Text style={typography.body}>{day.reflection}</Text>
      </AnimaCard>

      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Exercicio</Text>
        <Text style={typography.body}>{day.exercise}</Text>
      </AnimaCard>

      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Tarefa pratica</Text>
        <Text style={typography.body}>{day.task}</Text>
      </AnimaCard>

      <AnimaCard style={{ gap: spacing.sm, borderColor: '#3A2A36' }}>
        <Text style={typography.label}>Pergunta para o diario</Text>
        <Text style={[typography.quote, { color: colors.ivory }]}>{day.prompt}</Text>
      </AnimaCard>

      <AnimaButton
        label={dayIdx === cycle.days.length - 1 ? 'Encerrar ciclo' : 'Concluir dia e avancar'}
        onPress={() => {
          if (dayIdx < cycle.days.length - 1) setDayIdx(dayIdx + 1);
          else router.back();
        }}
      />
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayDot: {
    width: 36, height: 36, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  dayDotActive: { backgroundColor: colors.rose, borderColor: colors.rose },
  dayN: { ...typography.small, color: colors.textSoft },
  dayNActive: { color: colors.bg, fontFamily: 'Inter-SemiBold' },
});
