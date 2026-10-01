import { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaCard, AnimaGradientCard } from '@/components/anima/AnimaCard';
import { getSoulMap } from '@/services/anima';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing, typography } from '@/constants/theme';

export default function SoulMapView() {
  const { session } = useAuth();
  const [m, setM] = useState<any>(null);

  useEffect(() => {
    if (!session) return;
    (async () => { setM(await getSoulMap(session.user.id)); })();
  }, [session]);

  if (!m) return (
    <AnimaScreen>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 120, gap: spacing.md }}>
        <ActivityIndicator color={colors.rose} />
        <Text style={typography.small}>Resgatando seu Mapa de Alma</Text>
      </View>
    </AnimaScreen>
  );

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <Text style={typography.label}>Mapa de Alma</Text>
        <Text style={typography.h1}>Sua leitura atual</Text>
      </View>
      <AnimaGradientCard>
        <Text style={typography.label}>Arquetipo atual</Text>
        <Text style={[typography.h2, { marginTop: 4 }]}>{m.current_archetype}</Text>
      </AnimaGradientCard>
      {[
        ['Estado atual', m.current_state],
        ['Padrao dominante', m.dominant_pattern],
        ['Ferida provavel', m.probable_wound],
        ['Mascara', m.survival_mask],
        ['Sombra ativa', m.active_shadow],
        ['Ciclo de repeticao', m.repetition_cycle],
        ['Direcao de evolucao', m.evolution_direction],
        ['Ciclo recomendado', m.recommended_cycle],
      ].map(([l, v]) => (
        <AnimaCard key={l as string} style={{ gap: spacing.sm }}>
          <Text style={typography.label}>{l}</Text>
          <Text style={typography.body}>{v}</Text>
        </AnimaCard>
      ))}
    </AnimaScreen>
  );
}
