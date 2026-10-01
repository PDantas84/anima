import { useState } from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Phone, Heart, X } from 'lucide-react-native';
import { AnimaScreen } from '@/components/anima/AnimaScreen';
import { AnimaCard } from '@/components/anima/AnimaCard';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { colors, radius, spacing, typography } from '@/constants/theme';

const steps = [
  { n: 5, label: 'coisas que voce ve ao redor' },
  { n: 4, label: 'coisas que voce sente no corpo' },
  { n: 3, label: 'sons que voce escuta' },
  { n: 2, label: 'cheiros ou sabores' },
  { n: 1, label: 'acao segura que pode fazer agora' },
];

export default function Crisis() {
  const [mode, setMode] = useState<'main' | 'grounding'>('main');
  const [step, setStep] = useState(0);

  const call = (num: string) => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.location.href = `tel:${num}`;
    } else {
      Linking.openURL(`tel:${num}`);
    }
  };

  if (mode === 'grounding') {
    const s = steps[step];
    return (
      <AnimaScreen>
        <LinearGradient colors={['#1A0F16', '#09090B']} style={StyleSheet.absoluteFill} />
        <Pressable onPress={() => setMode('main')} style={styles.close}>
          <X color={colors.textMuted} size={20} />
        </Pressable>
        <View style={{ flex: 1, justifyContent: 'center', gap: spacing.lg, marginTop: 80 }}>
          <Text style={typography.label}>Estabilizacao {step + 1} de {steps.length}</Text>
          <Text style={typography.display}>Nomeie {s.n}</Text>
          <Text style={typography.h2}>{s.label}.</Text>
          <Text style={[typography.quote, { marginTop: spacing.md }]}>Respire. Voce esta aqui. Eu fico com voce.</Text>
        </View>
        <AnimaButton
          label={step === steps.length - 1 ? 'Concluir' : 'Proximo'}
          onPress={() => {
            if (step === steps.length - 1) setMode('main');
            else setStep(step + 1);
          }}
        />
      </AnimaScreen>
    );
  }

  return (
    <AnimaScreen>
      <Pressable onPress={() => router.back()} style={styles.close}>
        <X color={colors.textMuted} size={20} />
      </Pressable>
      <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
        <View style={styles.heart}><Heart color={colors.rose} size={22} /></View>
        <Text style={typography.h1}>Voce nao precisa lidar com isso sozinha agora.</Text>
        <Text style={typography.body}>
          A ANIMA nao substitui atendimento de emergencia. Se voce esta em risco ou pode se machucar, procure ajuda humana agora.
        </Text>
      </View>

      <AnimaCard style={{ gap: spacing.md }}>
        <Text style={typography.label}>Contatos de apoio</Text>
        <ContactRow label="CVV - Centro de Valorizacao da Vida" number="188" onCall={call} />
        <ContactRow label="SAMU - Emergencia medica" number="192" onCall={call} />
        <ContactRow label="Emergencia policial" number="190" onCall={call} />
      </AnimaCard>

      <AnimaButton label="Exercicio de estabilizacao agora" onPress={() => { setMode('grounding'); setStep(0); }} />
      <AnimaButton variant="soft" label="Registrar que estou em seguranca" onPress={() => router.back()} />
    </AnimaScreen>
  );
}

function ContactRow({ label, number, onCall }: { label: string; number: string; onCall: (n: string) => void }) {
  return (
    <Pressable onPress={() => onCall(number)} style={styles.contact}>
      <View style={{ flex: 1 }}>
        <Text style={typography.bodyStrong}>{label}</Text>
        <Text style={[typography.small, { color: colors.goldSoft, marginTop: 2 }]}>Ligar agora para {number}</Text>
      </View>
      <View style={styles.callBtn}>
        <Phone color={colors.bg} size={18} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  close: { alignSelf: 'flex-end' },
  heart: {
    width: 52, height: 52, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2A1720', borderWidth: 1, borderColor: '#3F2330',
  },
  contact: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
  },
  callBtn: {
    width: 44, height: 44, borderRadius: radius.pill,
    backgroundColor: colors.rose, alignItems: 'center', justifyContent: 'center',
  },
});
