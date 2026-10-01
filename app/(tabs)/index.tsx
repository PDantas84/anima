import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BookHeart, Compass, Flower2, MessageCircleHeart, Sparkles, Heart, MapPin, Clock } from 'lucide-react-native';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaCard, AnimaGradientCard } from '@/components/anima/AnimaCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function Home() {
  const { session } = useAuth();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase
        .from('users_profile')
        .select('name')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (data?.name) setName(data.name);
    })();
  }, [session]);

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.xs, marginTop: spacing.md }}>
        <Text style={typography.label}>Bom te ver aqui</Text>
        <Text style={typography.h1}>Ola, {name || 'querida'}.</Text>
        <Text style={[typography.quote, { marginTop: spacing.sm }]}>
          Voce nao precisa resolver sua vida inteira hoje. Hoje, apenas observe qual padrao esta tentando governar voce.
        </Text>
      </View>

      <AnimaGradientCard style={{ gap: spacing.sm }}>
        <View style={styles.row}>
          <Sparkles color={colors.goldSoft} size={16} />
          <Text style={[typography.label, { color: colors.goldSoft }]}>Ciclo ativo</Text>
        </View>
        <Text style={typography.h2}>Morte da Mascara</Text>
        <Text style={typography.small}>Dia 1 de 7</Text>
        <Text style={typography.body}>Hoje vamos apenas observar uma mascara que voce carrega quando tem medo de decepcionar alguem.</Text>
        <Pressable onPress={() => router.push('/(tabs)/cycles')} style={styles.cta}>
          <Text style={styles.ctaText}>Abrir o dia de hoje</Text>
        </Pressable>
      </AnimaGradientCard>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <MiniCard title="Sessao ANIMA" icon={<MessageCircleHeart color={colors.rose} size={18} />} onPress={() => router.push('/(tabs)/session')} />
        <MiniCard title="Diario" icon={<BookHeart color={colors.goldSoft} size={18} />} onPress={() => router.push('/(tabs)/journal')} />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <MiniCard title="Eu Futuro" icon={<Heart color={colors.rose} size={18} />} onPress={() => router.push('/future-self')} />
        <MiniCard title="Mapa de Alma" icon={<Compass color={colors.goldSoft} size={18} />} onPress={() => router.push('/soul-map')} />
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <MiniCard title="Rituais" icon={<Flower2 color={colors.rose} size={18} />} onPress={() => router.push('/rituals')} />
        <MiniCard title="Linha da Vida" icon={<MapPin color={colors.goldSoft} size={18} />} onPress={() => router.push('/life-line')} />
      </View>

      <AnimaCard style={{ gap: spacing.sm }}>
        <View style={styles.row}>
          <Clock color={colors.textMuted} size={16} />
          <Text style={typography.label}>Frase do dia</Text>
        </View>
        <Text style={[typography.quote, { color: colors.ivory }]}>
          Descansar tambem e um gesto de coragem.
        </Text>
      </AnimaCard>
    </AnimaScreen>
  );
}

function MiniCard({ title, icon, onPress }: { title: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <LinearGradient
        colors={['#1A141B', '#110F15']}
        style={styles.mini}
      >
        {icon}
        <Text style={[typography.bodyStrong, { marginTop: spacing.sm }]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cta: {
    alignSelf: 'flex-start', marginTop: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderRadius: radius.pill, backgroundColor: colors.rose,
  },
  ctaText: { ...typography.bodyStrong, color: colors.bg, fontSize: 13 },
  mini: {
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    height: 100,
    justifyContent: 'space-between',
  },
});
