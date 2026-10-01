import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimaButton } from '@/components/anima/AnimaButton';
import { colors, spacing, typography } from '@/constants/theme';

const slides = [
  {
    overline: 'Boas-vindas',
    title: 'Toda transformacao comeca com uma morte.',
    body: 'Nao a morte do corpo. A morte da mascara. A morte do padrao. A morte da versao que precisou sobreviver.',
  },
  {
    overline: 'Sua travessia',
    title: 'Voce trouxe uma historia ate aqui.',
    body: 'A ANIMA ajuda voce a entender quais partes dessa historia ainda te protegem, quais te aprisionam e quais precisam ser transformadas.',
  },
  {
    overline: 'Eu Futuro',
    title: 'Conheca a versao que voce esta construindo.',
    body: 'Depois da sua Anamnese de Vida, a ANIMA cria um mapa da sua travessia: de onde voce esta saindo, para onde pode ir e qual caminho precisa percorrer.',
  },
  {
    overline: 'Antes de comecar',
    title: 'A ANIMA e uma presenca, nao uma terapia.',
    body: 'Ela nao substitui psicologos, psiquiatras, medicos ou servicos de emergencia. E uma ferramenta de autoconhecimento, reflexao e apoio comportamental.',
  },
];

export default function Intro() {
  const [i, setI] = useState(0);
  const last = i === slides.length - 1;
  const s = slides[i];

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#1A0F16', '#09090B']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.top}>
        <Pressable onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.skip}>Pular</Text>
        </Pressable>
      </View>

      <View style={styles.center}>
        <Text style={styles.overline}>{s.overline}</Text>
        <Text style={styles.title}>{s.title}</Text>
        <Text style={styles.body}>{s.body}</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {slides.map((_, idx) => (
            <View key={idx} style={[styles.dot, idx === i && styles.dotActive]} />
          ))}
        </View>
        <AnimaButton
          label={last ? 'Iniciar minha travessia' : 'Continuar'}
          onPress={() => {
            if (last) router.replace('/(auth)/register');
            else setI(i + 1);
          }}
        />
        {!last && (
          <AnimaButton
            variant="ghost"
            label="Ja tenho conta"
            onPress={() => router.replace('/(auth)/login')}
            style={{ marginTop: spacing.sm }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  top: { flexDirection: 'row', justifyContent: 'flex-end' },
  skip: { ...typography.small, color: colors.textMuted },
  center: { flex: 1, justifyContent: 'center', gap: spacing.md },
  overline: { ...typography.label, color: colors.roseDeep },
  title: { ...typography.display, color: colors.ivory },
  body: { ...typography.body, fontSize: 16, lineHeight: 26 },
  bottom: { gap: spacing.md },
  dots: { flexDirection: 'row', gap: 6, marginBottom: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt },
  dotActive: { backgroundColor: colors.roseDeep, width: 22 },
});
