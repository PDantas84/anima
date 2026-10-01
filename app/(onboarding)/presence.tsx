import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaInput } from '@/components/anima/AnimaInput';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { AnimaCard } from '@/components/anima/AnimaCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/constants/theme';

const options = {
  apparent_gender: ['feminino', 'masculino', 'androgino', 'sem preferencia'],
  apparent_age: ['jovem adulta', 'madura', 'anciã', 'sem preferencia'],
  energy: ['acolhedora', 'firme', 'serena', 'intensa', 'racional', 'simbolica'],
  visual_style: ['minimalista', 'classico', 'mistico elegante', 'natural', 'contemporaneo'],
  conversation_tone: ['doce', 'direto', 'poetico', 'pratico', 'gentilmente confrontador'],
  main_approach: ['simbolica', 'comportamental', 'emocional', 'rotina', 'espiritualizada nao religiosa'],
};

type Key = keyof typeof options;

export default function Presence() {
  const { session } = useAuth();
  const [name, setName] = useState('Anima');
  const [sel, setSel] = useState<Record<Key, string>>({
    apparent_gender: 'feminino',
    apparent_age: 'madura',
    energy: 'acolhedora',
    visual_style: 'mistico elegante',
    conversation_tone: 'doce',
    main_approach: 'simbolica',
  });
  const [loading, setLoading] = useState(false);

  const pick = (k: Key, v: string) => setSel({ ...sel, [k]: v });

  const onSave = async () => {
    if (!session) return;
    setLoading(true);
    await supabase.from('guide_presence').upsert({
      user_id: session.user.id,
      name,
      ...sel,
    }, { onConflict: 'user_id' });
    setLoading(false);
    router.replace('/(onboarding)/future-self');
  };

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <Text style={typography.label}>Sua presenca</Text>
        <Text style={typography.h1}>Crie sua Presenca-Guia</Text>
        <Text style={typography.body}>Escolha como a ANIMA deve se apresentar para te acompanhar. Ela nao e autoridade sobre voce. E espelho, voz de reconstrucao e companhia doce.</Text>
      </View>

      <AnimaCard style={{ overflow: 'hidden', padding: 0 }}>
        <LinearGradient
          colors={['#2A1C25', '#14101A']}
          style={{ padding: spacing.lg, gap: spacing.sm }}
        >
          <Text style={typography.label}>Pre-visualizacao</Text>
          <Text style={typography.h2}>{name || 'Anima'}</Text>
          <Text style={[typography.body, { color: colors.goldSoft, fontStyle: 'italic' }]}>
            {sel.energy} | {sel.conversation_tone} | {sel.main_approach}
          </Text>
          <Text style={typography.small}>{sel.apparent_gender} | {sel.apparent_age} | {sel.visual_style}</Text>
        </LinearGradient>
      </AnimaCard>

      <AnimaInput label="Nome da presenca" value={name} onChangeText={setName} />

      {(Object.keys(options) as Key[]).map((k) => (
        <View key={k} style={{ gap: spacing.sm }}>
          <Text style={typography.label}>{labels[k]}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {options[k].map((v) => {
              const active = sel[k] === v;
              return (
                <Pressable key={v} onPress={() => pick(k, v)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{v}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <AnimaButton label="Salvar minha Presenca" onPress={onSave} loading={loading} />
    </AnimaScreen>
  );
}

const labels: Record<Key, string> = {
  apparent_gender: 'Genero aparente',
  apparent_age: 'Idade aparente',
  energy: 'Energia',
  visual_style: 'Estilo visual',
  conversation_tone: 'Tom de conversa',
  main_approach: 'Abordagem principal',
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.rose, borderColor: colors.rose },
  chipText: { ...typography.small, color: colors.textSoft },
  chipTextActive: { color: colors.bg, fontFamily: 'Inter-SemiBold' },
});
