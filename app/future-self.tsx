import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaCard } from '@/components/anima/AnimaCard';
import { getFutureSelf } from '@/services/anima';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function FutureView() {
  const { session } = useAuth();
  const [d, setD] = useState<any>(null);

  useEffect(() => {
    if (!session) return;
    (async () => { setD(await getFutureSelf(session.user.id)); })();
  }, [session]);

  if (!d) return (
    <AnimaScreen>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 120, gap: spacing.md }}>
        <ActivityIndicator color={colors.rose} />
      </View>
    </AnimaScreen>
  );

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <Text style={typography.label}>Eu Futuro</Text>
        <Text style={typography.h1}>A versao que voce esta construindo</Text>
      </View>
      <View style={styles.imgWrap}>
        <Image source={{ uri: d.image_url }} style={styles.img} />
        <LinearGradient colors={['transparent', 'rgba(9,9,11,0.85)']} style={StyleSheet.absoluteFill} />
      </View>
      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>De onde voce esta saindo</Text>
        <Text style={typography.body}>{d.from_state}</Text>
      </AnimaCard>
      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Para onde voce esta indo</Text>
        <Text style={typography.body}>{d.to_state}</Text>
      </AnimaCard>
      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Carta do Eu Futuro</Text>
        <Text style={[typography.quote, { color: colors.ivory }]}>{d.future_letter}</Text>
      </AnimaCard>
      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Plano de ponte</Text>
        <Text style={typography.body}>{d.bridge_plan}</Text>
      </AnimaCard>
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  imgWrap: { height: 240, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.surface },
  img: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
});
