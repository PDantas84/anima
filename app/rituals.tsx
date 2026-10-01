import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Flower2, Clock, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaCard } from '@/components/anima/AnimaCard';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { AnimaInput } from '@/components/anima/AnimaInput';
import { rituals, Ritual } from '@/data/rituals';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function Rituals() {
  const { session } = useAuth();
  const [selected, setSelected] = useState<Ritual | null>(null);
  const [response, setResponse] = useState('');
  const [saving, setSaving] = useState(false);

  const complete = async () => {
    if (!session || !selected) return;
    setSaving(true);
    await supabase.from('user_rituals').insert({
      user_id: session.user.id,
      ritual_key: selected.id,
      response,
      completed: true,
      completed_at: new Date().toISOString(),
    });
    setSaving(false);
    setSelected(null);
    setResponse('');
  };

  if (selected) {
    return (
      <AnimaScreen>
        <Pressable onPress={() => setSelected(null)} style={styles.back}>
          <ArrowLeft color={colors.textMuted} size={18} />
          <Text style={typography.small}>Voltar aos rituais</Text>
        </Pressable>
        <View style={{ gap: spacing.sm }}>
          <Text style={typography.label}>{selected.category}</Text>
          <Text style={typography.h1}>{selected.title}</Text>
          <Text style={typography.small}>{selected.duration} minutos</Text>
        </View>
        <AnimaCard style={{ gap: spacing.sm }}>
          <Text style={typography.label}>Objetivo</Text>
          <Text style={typography.body}>{selected.objective}</Text>
        </AnimaCard>
        <AnimaCard style={{ gap: spacing.sm }}>
          <Text style={typography.label}>Instrucoes</Text>
          <Text style={typography.body}>{selected.instructions}</Text>
        </AnimaCard>
        <AnimaInput label="Sua resposta" value={response} onChangeText={setResponse} multiline />
        <AnimaCard style={{ gap: spacing.sm, borderColor: '#3A2A36' }}>
          <Text style={typography.label}>Encerramento</Text>
          <Text style={[typography.quote, { color: colors.ivory }]}>{selected.closing}</Text>
        </AnimaCard>
        <AnimaButton label="Concluir ritual" onPress={complete} loading={saving} />
      </AnimaScreen>
    );
  }

  return (
    <AnimaScreen>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <ArrowLeft color={colors.textMuted} size={18} />
        <Text style={typography.small}>Voltar</Text>
      </Pressable>
      <View style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Rituais</Text>
        <Text style={typography.h1}>Rituais de Reconstrucao</Text>
        <Text style={typography.body}>Pequenos gestos simbolicos com efeito real. Escolha um para hoje.</Text>
      </View>

      {rituals.map((r) => (
        <Pressable key={r.id} onPress={() => setSelected(r)}>
          <AnimaCard style={{ gap: spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Flower2 color={colors.rose} size={16} />
                <Text style={[typography.small, { color: colors.goldSoft }]}>{r.category}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Clock color={colors.textMuted} size={14} />
                <Text style={typography.small}>{r.duration} min</Text>
              </View>
            </View>
            <Text style={typography.h3}>{r.title}</Text>
            <Text style={typography.body}>{r.objective}</Text>
          </AnimaCard>
        </Pressable>
      ))}
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
});
