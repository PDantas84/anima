import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Flower2, Sprout } from 'lucide-react-native';
import { presenceDays, moodLabels, Mood, weekDays } from '@/domain/model';
import { useMobile } from '../Store';
import { Button, Card, Empty, Screen, Section, common } from '../components/UI';
import { palette, fonts, type } from '../theme';
export default function JourneyMap() {
  const { state } = useMobile();
  const days = presenceDays(state);
  const moods = ([1, 2, 3, 4, 5] as Mood[]).map((mood) => ({
    mood,
    count: state.checkIns.filter((c) => c.mood === mood).length,
  }));
  const recent = [...state.entries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);
  return (
    <Screen
      title="Seu mapa de presença"
      eyebrow="UM CAMINHO QUE É SEU"
      back
      description="Pequenos registros de quando você voltou para si."
    >
      <View style={s.hero}>
        <Flower2 color={palette.rose} size={46} strokeWidth={1} />
        <Text style={s.number}>{days.size}</Text>
        <Text style={type.body}>
          {days.size === 1 ? 'dia de presença' : 'dias de presença'}
        </Text>
      </View>
      <View style={s.stats}>
        {[
          { value: state.entries.length, label: 'páginas escritas' },
          { value: state.practices.length, label: 'pausas acolhidas' },
          {
            value: Object.values(state.journeys).reduce(
              (n, j) => n + j.completed.length,
              0,
            ),
            label: 'encontros feitos',
          },
        ].map((item) => (
          <View key={item.label} style={s.stat}>
            <Text style={s.statNumber}>{item.value}</Text>
            <Text style={[type.small, { textAlign: 'center' }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
      <Card>
        <Text style={type.heading}>Os últimos sete dias</Text>
        <View style={s.week}>
          {weekDays().map((day) => {
            const checkIn = state.checkIns.find((c) => c.date === day.key);
            return (
              <View
                key={day.key}
                accessible
                accessibilityLabel={`${day.label}: ${checkIn ? moodLabels[checkIn.mood] : 'sem check-in'}`}
                style={s.weekDay}
              >
                <View style={s.barSpace}>
                  {checkIn ? (
                    <View
                      style={[
                        s.bar,
                        {
                          height: checkIn.mood * 18,
                          backgroundColor: [
                            palette.lavender,
                            '#D0A9BD',
                            palette.rose,
                            palette.sage,
                            '#DFCE9F',
                          ][checkIn.mood - 1],
                        },
                      ]}
                    />
                  ) : (
                    <View style={s.emptyDot} />
                  )}
                </View>
                <Text style={type.small}>{day.label}</Text>
              </View>
            );
          })}
        </View>
        <Text style={type.small}>
          Altura de 1 (Difícil) a 5 (Em paz), conforme o que você marcou. Pontos
          indicam dias sem check-in.
        </Text>
      </Card>
      <Section title="O que você tem sentido" />
      {state.checkIns.length ? (
        <Card>
          {moods.map((item) => (
            <View key={item.mood} style={{ gap: 8 }}>
              <View style={[common.row, { justifyContent: 'space-between' }]}>
                <Text style={type.small}>{moodLabels[item.mood]}</Text>
                <Text style={type.small}>
                  {item.count} {item.count === 1 ? 'dia' : 'dias'}
                </Text>
              </View>
              <View style={s.track}>
                <View
                  style={[
                    s.fill,
                    { width: `${(item.count / state.checkIns.length) * 100}%` },
                  ]}
                />
              </View>
            </View>
          ))}
          <Text style={type.small}>
            Os registros mostram suas escolhas. Não são uma avaliação clínica ou
            uma medida de progresso.
          </Text>
        </Card>
      ) : (
        <Empty
          title="Seu mapa vai nascer aos poucos"
          description="Faça um check-in na tela Hoje. Aqui aparecerá apenas o que você registrar."
          icon={<Sprout color={palette.sage} size={30} />}
          action={
            <Button
              title="Como estou hoje?"
              variant="secondary"
              onPress={() => router.push('/(tabs)')}
            />
          }
        />
      )}
      <Section title="Palavras pelo caminho" />
      {recent.length ? (
        recent.map((entry) => (
          <Card key={entry.id}>
            <Text style={type.eyebrow}>
              {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
            </Text>
            <Text style={type.heading}>{entry.title}</Text>
            <Text style={type.body} numberOfLines={2}>
              {entry.content}
            </Text>
            <Button
              title="Reler esta página"
              variant="ghost"
              onPress={() =>
                router.push({ pathname: '/entry', params: { id: entry.id } })
              }
            />
          </Card>
        ))
      ) : (
        <Text style={type.body}>
          Suas próximas páginas também farão parte deste caminho.
        </Text>
      )}
      <Text style={common.note}>
        Não é sobre estar bem o tempo todo.{'\n'}É sobre ter espaço para ser.
      </Text>
    </Screen>
  );
}
const s = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  number: {
    fontFamily: fonts.title,
    color: palette.text,
    fontSize: 72,
    lineHeight: 84,
  },
  stats: { flexDirection: 'row', gap: 12 },
  stat: {
    flex: 1,
    backgroundColor: palette.surface,
    paddingVertical: 22,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 18,
    gap: 9,
    alignItems: 'center',
  },
  statNumber: { fontFamily: fonts.title, color: palette.rose, fontSize: 29 },
  week: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  weekDay: { flex: 1, gap: 12, alignItems: 'center' },
  barSpace: { height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: 18, borderRadius: 9, minHeight: 18 },
  emptyDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.quiet,
  },
  track: { height: 4, backgroundColor: palette.line, borderRadius: 2 },
  fill: { height: 4, backgroundColor: palette.rose, borderRadius: 2 },
});
