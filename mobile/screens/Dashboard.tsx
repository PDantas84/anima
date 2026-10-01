import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import {
  ArrowRight,
  Check,
  Feather,
  HeartHandshake,
  Wind,
} from 'lucide-react-native';
import {
  Screen,
  Button,
  Card,
  MoodPicker,
  Section,
  IconButton,
  common,
} from '../components/UI';
import { Landscape, Mark } from '../components/Artwork';
import { palette, fonts, type } from '../theme';
import { useMobile } from '../Store';
import { presenceDays, saveCheckIn, weekDays } from '@/domain/model';
import { cycles } from '@/domain/content';
export default function Dashboard() {
  const { state, update, today, saving } = useMobile();
  const checkIn = state.checkIns.find((c) => c.date === today);
  const presence = presenceDays(state);
  const cycle = cycles.find((c) => c.id === state.activeCycle);
  const completed = cycle ? state.journeys[cycle.id].completed.length : 0;
  return (
    <Screen>
      <View style={[common.row, { justifyContent: 'space-between' }]}>
        <View style={common.row}>
          <Mark size={30} />
          <Text style={s.brand}>anima</Text>
        </View>
        <IconButton
          label="Encontrar apoio"
          onPress={() => router.push('/crisis')}
          icon={<HeartHandshake color={palette.rose} size={22} />}
        />
      </View>
      <View style={{ gap: 8 }}>
        <Text style={type.eyebrow}>
          {new Date()
            .toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })
            .toUpperCase()}
        </Text>
        <Text accessibilityRole="header" style={type.title}>
          {state.profile.name
            ? `Olá, ${state.profile.name}.`
            : 'Que bom ter você aqui.'}
        </Text>
        <Text style={type.body}>Hoje, vá com um pouco mais de gentileza.</Text>
      </View>
      <View style={s.hero}>
        <Landscape />
        <View style={s.heroContent}>
          <View style={common.row}>
            <Wind size={16} color={palette.rose} />
            <Text style={type.eyebrow}>UM MINUTO SÓ SEU</Text>
          </View>
          <Text style={s.heroTitle}>Volte para{'\n'}o seu ritmo.</Text>
          <Text style={[type.body, { maxWidth: 210, color: '#E5D2D7' }]}>
            O mundo pode esperar um respiro.
          </Text>
          <Button
            title="Fazer uma pausa"
            onPress={() => router.push('/ritual/breath')}
            icon={<ArrowRight size={18} color={palette.ink} />}
            style={{ alignSelf: 'flex-start', marginTop: 8 }}
          />
        </View>
      </View>
      <Card style={{ paddingHorizontal: 13 }}>
        <View style={{ paddingHorizontal: 8, gap: 6 }}>
          <Text accessibilityRole="header" style={type.heading}>
            Como você está agora?
          </Text>
          <Text style={type.small}>
            {checkIn
              ? 'Seu registro de hoje. Você pode mudar de ideia.'
              : 'Não existe resposta certa. Só a sua.'}
          </Text>
        </View>
        <MoodPicker
          value={checkIn?.mood}
          disabled={saving}
          onChange={(mood) => {
            void update(
              (s) => saveCheckIn(s, mood),
              'Seu momento foi guardado.',
            );
          }}
        />
      </Card>
      <View style={{ gap: 16 }}>
        <Section
          title="Seu tempo de presença"
          action="Ver caminho"
          onPress={() => router.push('/soul-map')}
        />
        <View style={s.week}>
          {weekDays().map((day) => (
            <View key={day.key} style={s.day}>
              <Text style={type.small}>{day.label}</Text>
              <View
                style={[
                  s.dayCircle,
                  presence.has(day.key) && s.dayPresent,
                  day.key === today && { borderColor: palette.rose },
                ]}
              >
                {presence.has(day.key) ? (
                  <Check size={17} color={palette.ink} />
                ) : (
                  <View style={s.dayDot} />
                )}
              </View>
            </View>
          ))}
        </View>
        <Text style={type.small}>
          Cada vez que você volta já tem valor. Sem metas de perfeição.
        </Text>
      </View>
      <Section title="Um passo de cada vez" />
      <Card>
        <Text style={type.eyebrow}>
          {cycle ? 'SUA JORNADA' : 'PARA COMEÇAR COM CALMA'}
        </Text>
        <Text style={type.heading}>{cycle?.title ?? 'De volta a si'}</Text>
        <Text style={type.body}>
          {cycle
            ? `${completed} de 7 encontros concluídos. ${completed === 7 ? 'Você pode revisitar o caminho ou começar outro ciclo.' : 'Um convite por dia, no seu ritmo.'}`
            : 'Sete pequenos encontros para se escutar e criar espaço no seu dia.'}
        </Text>
        <View style={s.progress}>
          <View style={[s.fill, { width: `${(completed / 7) * 100}%` }]} />
        </View>
        <Button
          title={cycle ? 'Abrir minha jornada' : 'Conhecer a jornada'}
          variant="secondary"
          onPress={() => router.push(`/cycle/${cycle?.id ?? 'presence'}`)}
        />
      </Card>
      <Section
        title="O que faria bem agora?"
        action="Rituais"
        onPress={() => router.push('/rituals')}
      />
      <View style={s.shortcuts}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Escrever no diário"
          onPress={() => router.push('/entry')}
          style={s.shortcut}
        >
          <Feather color={palette.rose} size={25} />
          <Text style={type.subheading}>Colocar em{'\n'}palavras</Text>
          <Text style={type.small}>Abrir meu diário →</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Explorar rituais"
          onPress={() => router.push('/rituals')}
          style={[s.shortcut, { backgroundColor: '#2E332E' }]}
        >
          <Wind color={palette.sage} size={25} />
          <Text style={type.subheading}>Encontrar{'\n'}uma pausa</Text>
          <Text style={type.small}>Explorar rituais →</Text>
        </Pressable>
      </View>
      <Text style={[common.note, { fontFamily: fonts.italic, fontSize: 16 }]}>
        Você não precisa florescer todos os dias.
      </Text>
    </Screen>
  );
}
const s = StyleSheet.create({
  brand: {
    fontFamily: fonts.title,
    color: palette.text,
    fontSize: 29,
    letterSpacing: 3,
  },
  hero: {
    minHeight: 322,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#493346',
  },
  heroContent: { padding: 26, gap: 15 },
  heroTitle: {
    fontFamily: fonts.title,
    color: palette.text,
    fontSize: 39,
    lineHeight: 48,
  },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: 10 },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPresent: { backgroundColor: palette.sage, borderColor: palette.sage },
  dayDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: palette.quiet,
  },
  progress: {
    height: 4,
    backgroundColor: palette.line,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: { height: 4, backgroundColor: palette.rose },
  shortcuts: { flexDirection: 'row', gap: 12 },
  shortcut: {
    flex: 1,
    padding: 20,
    gap: 16,
    borderRadius: 20,
    backgroundColor: '#392A38',
    borderWidth: 1,
    borderColor: palette.line,
  },
});
