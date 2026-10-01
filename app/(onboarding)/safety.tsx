import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ShieldCheck, Heart } from 'lucide-react-native';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { AnimaCard } from '@/components/anima/AnimaCard';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function Safety() {
  const { session } = useAuth();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const onAccept = async () => {
    if (!checked || !session) return;
    setLoading(true);
    await supabase.from('safety_acceptances').upsert({
      user_id: session.user.id,
      accepted_terms: true,
      version: '1.0',
    }, { onConflict: 'user_id' });
    await supabase.from('users_profile').upsert({
      user_id: session.user.id,
      email: session.user.email ?? '',
    }, { onConflict: 'user_id', ignoreDuplicates: true });
    setLoading(false);
    router.replace('/(onboarding)/anamnesis');
  };

  return (
    <AnimaScreen>
      <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
        <View style={styles.iconWrap}>
          <ShieldCheck color={colors.roseDeep} size={28} />
        </View>
        <Text style={typography.label}>Antes de entrar</Text>
        <Text style={typography.h1}>Limites de seguranca</Text>
        <Text style={typography.body}>
          A ANIMA e uma ferramenta de autoconhecimento, educacao emocional e apoio a mudanca de habitos.
          Ela nao realiza diagnostico clinico, nao substitui psicoterapia, atendimento medico, psiquiatrico
          ou servicos de emergencia.
        </Text>
        <Text style={typography.body}>
          Se voce estiver em risco imediato, pensando em se machucar ou sentindo que pode machucar alguem,
          procure ajuda humana agora.
        </Text>

        <AnimaCard style={{ gap: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Heart color={colors.rose} size={18} />
            <Text style={typography.bodyStrong}>Contatos de apoio no Brasil</Text>
          </View>
          <Text style={typography.body}>CVV 188 - Centro de Valorizacao da Vida</Text>
          <Text style={typography.body}>SAMU 192 - Emergencia medica</Text>
          <Text style={typography.body}>190 - Emergencia policial</Text>
        </AnimaCard>

        <Pressable onPress={() => setChecked(!checked)} style={styles.check}>
          <View style={[styles.box, checked && styles.boxActive]}>
            {checked && <Text style={styles.tick}>v</Text>}
          </View>
          <Text style={[typography.body, { flex: 1, color: colors.text }]}>
            Entendo que a ANIMA nao substitui atendimento profissional.
          </Text>
        </Pressable>

        <AnimaButton label="Aceitar e continuar" onPress={onAccept} disabled={!checked} loading={loading} />
      </View>
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 52, height: 52, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2A1720', borderWidth: 1, borderColor: '#3F2330',
  },
  check: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginTop: spacing.sm },
  box: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  boxActive: { backgroundColor: colors.rose, borderColor: colors.rose },
  tick: { color: colors.bg, fontFamily: 'Inter-Bold' },
});
