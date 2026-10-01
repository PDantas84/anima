import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, Check, LockKeyhole, Sparkles } from 'lucide-react-native';
import { Button, Card, Field, Screen, common } from '../components/UI';
import { Landscape, Mark } from '../components/Artwork';
import { palette, fonts, type } from '../theme';
import { useMobile } from '../Store';
const intentions = [
  'Encontrar mais calma',
  'Entender o que sinto',
  'Cuidar dos meus limites',
  'Criar tempo para mim',
];
export default function Intro() {
  const { state, update, saving } = useMobile();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(state.profile.name);
  const [intention, setIntention] = useState(state.profile.intention);
  async function finish() {
    if (
      await update((s) => ({
        ...s,
        onboarded: true,
        profile: { ...s.profile, name: name.trim(), intention },
      }))
    )
      router.replace('/(tabs)');
  }
  return (
    <Screen>
      <View style={[common.row, { justifyContent: 'center', marginTop: 12 }]}>
        <Mark />
        <Text style={s.wordmark}>anima</Text>
      </View>
      <View style={s.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[s.dot, i === step && s.dotActive]} />
        ))}
      </View>
      {step === 0 ? (
        <>
          <View style={s.art}>
            <Landscape />
            <View style={s.artText}>
              <Text style={type.eyebrow}>UM ENCONTRO COM VOCÊ</Text>
              <Text style={s.hero}>
                Há um lugar{'\n'}para o que você sente.
              </Text>
            </View>
          </View>
          <Text
            style={[type.body, { textAlign: 'center', paddingHorizontal: 12 }]}
          >
            Pequenas pausas, palavras e caminhos para se escutar. No seu tempo.
          </Text>
          <Button
            title="Quero começar"
            onPress={() => setStep(1)}
            icon={<ArrowRight size={19} color={palette.ink} />}
          />
        </>
      ) : step === 1 ? (
        <>
          <Text accessibilityRole="header" style={type.title}>
            Como podemos{'\n'}cuidar de você?
          </Text>
          <Field
            label="Como você gosta de ser chamado?"
            placeholder="Seu nome (opcional)"
            value={name}
            onChangeText={setName}
            maxLength={60}
            autoComplete="given-name"
          />
          <Text style={type.body}>O que te trouxe até aqui?</Text>
          {intentions.map((item) => (
            <Pressable
              key={item}
              accessibilityRole="radio"
              accessibilityState={{ checked: intention === item }}
              onPress={() => setIntention(item)}
              style={[s.option, intention === item && s.selected]}
            >
              <Text style={[type.body, { flex: 1, color: palette.text }]}>
                {item}
              </Text>
              {intention === item && <Check size={19} color={palette.rose} />}
            </Pressable>
          ))}
          <Button title="Continuar" onPress={() => setStep(2)} />
          <Button title="Voltar" variant="ghost" onPress={() => setStep(0)} />
        </>
      ) : (
        <>
          <View style={s.privacyIcon}>
            <LockKeyhole size={38} strokeWidth={1.3} color={palette.rose} />
          </View>
          <Text accessibilityRole="header" style={type.title}>
            Um espaço seu.{'\n'}Com escolhas claras.
          </Text>
          <Card>
            <Text style={type.subheading}>Seu diário fica neste aparelho</Text>
            <Text style={type.body}>
              Você pode usar o Anima sem conta e sem internet. Não há
              sincronização automática. Exporte um backup se quiser levar seus
              registros com você.
            </Text>
            <Text style={type.small}>
              Os dados locais e os backups não têm criptografia própria do app.
              Proteja o acesso ao seu celular.
            </Text>
          </Card>
          <Card>
            <Sparkles size={23} color={palette.rose} />
            <Text style={type.body}>
              As conversas são reflexões com respostas pré-escritas. O Anima não
              faz diagnóstico, não é terapia e não acompanha emergências.
            </Text>
          </Card>
          <Button title="Entrar no meu espaço" busy={saving} onPress={finish} />
          <Button title="Voltar" variant="ghost" onPress={() => setStep(1)} />
        </>
      )}
    </Screen>
  );
}
const s = StyleSheet.create({
  wordmark: {
    fontFamily: fonts.title,
    fontSize: 36,
    letterSpacing: 4,
    color: palette.text,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginVertical: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: palette.line },
  dotActive: { width: 24, backgroundColor: palette.rose },
  art: {
    height: 370,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#443345',
  },
  artText: { position: 'absolute', top: 32, left: 26, right: 26, gap: 18 },
  hero: {
    fontFamily: fonts.title,
    fontSize: 34,
    lineHeight: 45,
    color: palette.text,
  },
  option: {
    minHeight: 64,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selected: { backgroundColor: '#46333F', borderColor: '#9C7580' },
  privacyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#44313F',
    marginVertical: 8,
  },
});
