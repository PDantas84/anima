import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, LogOut, Shield, MapPin, Heart, Flower2 } from 'lucide-react-native';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaCard } from '@/components/anima/AnimaCard';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function Profile() {
  const { session, signOut } = useAuth();
  const [name, setName] = useState('');
  const [stats, setStats] = useState({ entries: 0, rituals: 0 });

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: p } = await supabase.from('users_profile').select('name').eq('user_id', session.user.id).maybeSingle();
      if (p?.name) setName(p.name);
      const { count: ec } = await supabase.from('journal_entries').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);
      const { count: rc } = await supabase.from('user_rituals').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);
      setStats({ entries: ec ?? 0, rituals: rc ?? 0 });
    })();
  }, [session]);

  const onSignOut = async () => {
    await signOut();
    router.replace('/intro');
  };

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <Text style={typography.label}>Seu refugio</Text>
        <Text style={typography.h1}>{name || 'Perfil'}</Text>
        <Text style={typography.small}>{session?.user.email}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing.md }}>
        <Stat label="Entradas no diario" value={stats.entries} />
        <Stat label="Rituais completos" value={stats.rituals} />
      </View>

      <Row icon={<Heart color={colors.rose} size={18} />} label="Meu Mapa de Alma" onPress={() => router.push('/soul-map')} />
      <Row icon={<Flower2 color={colors.goldSoft} size={18} />} label="Meu Eu Futuro" onPress={() => router.push('/future-self')} />
      <Row icon={<MapPin color={colors.rose} size={18} />} label="Linha da Vida" onPress={() => router.push('/life-line')} />
      <Row icon={<Shield color={colors.goldSoft} size={18} />} label="Seguranca e ajuda" onPress={() => router.push('/crisis')} />

      <Pressable onPress={onSignOut} style={styles.logout}>
        <LogOut color={colors.danger} size={18} />
        <Text style={[typography.bodyStrong, { color: colors.danger }]}>Sair</Text>
      </Pressable>
    </AnimaScreen>
  );
}

function Row({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <AnimaCard style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        {icon}
        <Text style={[typography.bodyStrong, { flex: 1 }]}>{label}</Text>
        <ChevronRight color={colors.textMuted} size={18} />
      </AnimaCard>
    </Pressable>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <AnimaCard style={{ flex: 1, alignItems: 'center', gap: 4 }}>
      <Text style={[typography.h1, { color: colors.goldSoft }]}>{value}</Text>
      <Text style={[typography.small, { textAlign: 'center' }]}>{label}</Text>
    </AnimaCard>
  );
}

const styles = StyleSheet.create({
  logout: {
    flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center',
    padding: spacing.md, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border,
    marginTop: spacing.md,
  },
});
