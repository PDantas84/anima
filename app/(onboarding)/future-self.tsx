import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { AnimaCard } from '@/components/anima/AnimaCard';
import { generateFutureSelf } from '@/services/anima';
import { useAuth } from '@/context/AuthContext';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function FutureSelf() {
  const { session } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const d = await generateFutureSelf(session.user.id);
      setData(d);
    })();
  }, [session]);

  if (!data) {
    return (
      <AnimaScreen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 120, gap: spacing.md }}>
          <ActivityIndicator color={colors.rose} />
          <Text style={typography.quote}>Desenhando a ponte para o seu Eu Futuro</Text>
        </View>
      </AnimaScreen>
    );
  }

  return (
    <AnimaScreen>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <Text style={typography.label}>A versao que voce esta construindo</Text>
        <Text style={typography.h1}>Seu Eu Futuro</Text>
      </View>

      <View style={styles.imgWrap}>
        <Image source={{ uri: data.image_url }} style={styles.img} />
        <LinearGradient
          colors={['transparent', 'rgba(9,9,11,0.85)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.imgCaption}>
          <Text style={[typography.small, { color: colors.goldSoft, letterSpacing: 1 }]}>IMAGEM SIMBOLICA</Text>
          <Text style={[typography.h3, { color: colors.ivory }]}>Presenca, descanso e verdade.</Text>
        </View>
      </View>

      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>De onde voce esta saindo</Text>
        <Text style={typography.body}>{data.from_state}</Text>
      </AnimaCard>

      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Para onde voce esta indo</Text>
        <Text style={typography.body}>{data.to_state}</Text>
      </AnimaCard>

      <AnimaCard style={{ gap: spacing.sm, borderColor: '#3A2A36' }}>
        <Text style={typography.label}>Carta do Eu Futuro</Text>
        <Text style={[typography.quote, { color: colors.ivory }]}>{data.future_letter}</Text>
      </AnimaCard>

      <AnimaCard style={{ gap: spacing.sm }}>
        <Text style={typography.label}>Plano de ponte</Text>
        <Text style={typography.body}>{data.bridge_plan}</Text>
      </AnimaCard>

      <AnimaButton label="Entrar na ANIMA" onPress={() => router.replace('/(tabs)')} />
    </AnimaScreen>
  );
}

const styles = StyleSheet.create({
  imgWrap: { borderRadius: radius.lg, overflow: 'hidden', height: 260, backgroundColor: colors.surface },
  img: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  imgCaption: { position: 'absolute', left: spacing.lg, right: spacing.lg, bottom: spacing.lg, gap: 4 },
});
