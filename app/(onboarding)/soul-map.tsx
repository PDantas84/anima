import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { AnimaCard, AnimaGradientCard } from '@/components/anima/AnimaCard';
import { generateSoulMap, SoulMap } from '@/services/anima';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/constants/theme';

const STEPS = [
  'Lendo sua historia com cuidado',
  'Identificando seus padroes',
  'Nomeando a mascara que te sustentou',
  'Desenhando sua travessia',
];

export default function SoulMapScreen() {
  const { session } = useAuth();
  const [step, setStep] = useState(0);
  const [map, setMap] = useState<SoulMap | null>(null);

  useEffect(() => {
    if (!session) return;
    let active = true;
    const run = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        await new Promise((r) => setTimeout(r, 900));
        if (!active) return;
        setStep(i);
      }
      const m = await generateSoulMap(session.user.id);
      if (m && active) setMap(m as any);
    };
    run();
    return () => { active = false; };
  }, [session]);

  if (!map) {
    return (
      <AnimaScreen>
        <LinearGradient colors={['#1A0F16', '#09090B']} style={StyleSheet.absoluteFill} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.lg, marginTop: 120 }}>
          <ActivityIndicator color={colors.rose} />
          <Text style={[typography.quote, { textAlign: 'center' }]}>{STEPS[step]}</Text>
          <Text style={[typography.small, { textAlign: 'center' }]}>Respire. Estou com voce.</Text>
        </View>
      </AnimaScreen>
    );
  }

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <View style={styles.badge}>
          <Sparkles color={colors.goldSoft} size={14} />
          <Text style={styles.badgeText}>Primeira leitura</Text>
        </View>
        <Text style={typography.h1}>Seu Mapa de Alma</Text>
        <Text style={typography.body}>Isto nao e um diagnostico. E uma hipotese amorosa sobre onde voce esta agora.</Text>
      </View>

      <AnimaGradientCard>
        <Text style={typography.label}>Arquetipo atual</Text>
        <Text style={[typography.h2, { marginTop: 4 }]}>{map.current_archetype}</Text>
      </AnimaGradientCard>

      <Section label="Estado atual" text={map.current_state} />
      <Section label="Padrao dominante" text={map.dominant_pattern} />
      <Section label="Ferida provavel" text={map.probable_wound} />
      <Section label="Mascara de sobrevivencia" text={map.survival_mask} />
      <Section label="Sombra ativa" text={map.active_shadow} />
      <Section label="Ciclo de repeticao" text={map.repetition_cycle} />
      <Section label="Direcao de evolucao" text={map.evolution_direction} />

      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Primeiro ciclo recomendado</Text>
        <Text style={typography.h2}>{map.recommended_cycle}</Text>
        <Text style={typography.body}>Identificar onde voce esta atuando como personagem de sobrevivencia e comecar a recuperar uma forma mais verdadeira de existir.</Text>
      </AnimaCard>

      <AnimaButton label="Criar minha Presenca-Guia" onPress={() => router.replace('/(onboarding)/presence')} />
    </AnimaScreen>
  );
}

function Section({ label, text }: { label: string; text: string }) {
  return (
    <AnimaCard style={{ gap: spacing.sm }}>
      <Text style={typography.label}>{label}</Text>
      <Text style={typography.body}>{text}</Text>
    </AnimaCard>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: '#261820', borderWidth: 1, borderColor: '#3B2430',
  },
  badgeText: { ...typography.small, color: colors.goldSoft, letterSpacing: 1 },
});
