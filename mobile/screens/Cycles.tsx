import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowRight, Check, LockKeyhole, Sprout } from 'lucide-react-native';
import { cycles } from '@/domain/content';
import { completeDay } from '@/domain/model';
import { useMobile, successHaptic } from '../Store';
import { Button, Card, Screen, common } from '../components/UI';
import { palette, fonts, type } from '../theme';
const tones: Record<string, string> = {
  rose: '#49353E',
  sage: '#303C34',
  lavender: '#3C334B',
};
export default function Cycles() {
  const { state } = useMobile();
  return (
    <Screen
      title="Seu próximo passo"
      eyebrow="JORNADAS DE 7 DIAS"
      description="Pequenos encontros. Novos jeitos de se escutar."
    >
      <View style={s.quote}>
        <Sprout size={27} strokeWidth={1.4} color={palette.sage} />
        <Text style={s.quoteText}>
          Um pouco de cuidado,{'\n'}um dia de cada vez.
        </Text>
      </View>
      {cycles.map((cycle, i) => {
        const count = state.journeys[cycle.id]?.completed.length ?? 0;
        return (
          <Pressable
            key={cycle.id}
            accessibilityRole="button"
            accessibilityLabel={`Abrir jornada ${cycle.title}`}
            onPress={() => router.push(`/cycle/${cycle.id}`)}
          >
            <Card style={{ backgroundColor: tones[cycle.color], padding: 24 }}>
              <View style={[common.row, { justifyContent: 'space-between' }]}>
                <Text style={type.eyebrow}>
                  0{i + 1} · {cycle.category}
                </Text>
                <Sprout size={23} color={palette.rose} />
              </View>
              <Text style={[type.heading, { fontSize: 30, lineHeight: 39 }]}>
                {cycle.title}
              </Text>
              <Text style={type.body}>{cycle.description}</Text>
              <View style={s.progress}>
                {cycle.days.map((_, d) => (
                  <View
                    key={d}
                    style={[
                      s.segment,
                      d < count && { backgroundColor: palette.rose },
                    ]}
                  />
                ))}
              </View>
              <View style={[common.row, { justifyContent: 'space-between' }]}>
                <Text style={type.small}>
                  {state.activeCycle === cycle.id ? 'Sua jornada atual · ' : ''}
                  {count
                    ? `${count} de 7 encontros`
                    : '7 dias · 5 minutos por dia'}
                </Text>
                <ArrowRight color={palette.rose} size={20} />
              </View>
            </Card>
          </Pressable>
        );
      })}
      <Text style={common.note}>
        Você pode retomar de onde parou. Os dias não precisam ser consecutivos.
      </Text>
    </Screen>
  );
}
export function CycleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, update, saving, today } = useMobile();
  const cycle = cycles.find((c) => c.id === id);
  const journey = state.journeys[id];
  const completed = journey?.completed.length ?? 0;
  const [selected, setSelected] = useState(Math.min(completed + 1, 7));
  if (!cycle)
    return (
      <Screen title="Jornada não encontrada" back>
        <Button
          title="Ver jornadas"
          onPress={() => router.replace('/(tabs)/cycles')}
        />
      </Screen>
    );
  const day = cycle.days[selected - 1];
  const done = journey?.completed.includes(selected);
  const waiting = journey?.lastCompletedOn === today && !done;
  const active = state.activeCycle === cycle.id;
  async function start() {
    await update(
      (s) => ({
        ...s,
        activeCycle: id,
        journeys: {
          ...s.journeys,
          [id]: s.journeys[id] ?? {
            completed: [],
            lastCompletedOn: null,
            startedAt: new Date().toISOString(),
          },
        },
      }),
      'Sua jornada está pronta.',
    );
  }
  async function complete() {
    if (
      await update(
        (s) => completeDay(s, id, selected),
        'Encontro concluído. O próximo fica disponível amanhã.',
      )
    )
      successHaptic();
  }
  return (
    <Screen
      title={cycle.title}
      eyebrow="SUA JORNADA"
      back
      description={cycle.description}
    >
      <Card style={{ backgroundColor: tones[cycle.color] }}>
        <Text style={type.eyebrow}>
          {completed === 7
            ? 'UM CICLO ACOLHIDO'
            : `${completed} DE 7 ENCONTROS`}
        </Text>
        <View style={s.progress}>
          {cycle.days.map((_, d) => (
            <View
              key={d}
              style={[
                s.segment,
                d < completed && { backgroundColor: palette.rose },
              ]}
            />
          ))}
        </View>
        <Text style={type.body}>
          {completed === 7
            ? 'O que você viveu continua com você. Releia seus encontros quando quiser.'
            : 'Um encontro por dia. Tempo para a reflexão encontrar lugar na sua vida.'}
        </Text>
        {!active && (
          <Button
            title={journey ? 'Retomar esta jornada' : 'Começar esta jornada'}
            onPress={start}
            busy={saving}
          />
        )}
      </Card>
      <View style={{ gap: 6 }}>
        {cycle.days.map((d, index) => {
          const number = index + 1;
          const unlocked = journey && number <= completed + 1;
          const finished = journey?.completed.includes(number);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Dia ${number}: ${d.title}`}
              accessibilityState={{
                selected: selected === number,
                disabled: !unlocked,
              }}
              key={d.title}
              disabled={!unlocked}
              onPress={() => setSelected(number)}
              style={[
                s.day,
                selected === number && s.selected,
                !unlocked && { opacity: 0.55 },
              ]}
            >
              <View
                style={[
                  s.dayNumber,
                  finished && { backgroundColor: palette.sage },
                ]}
              >
                {finished ? (
                  <Check size={17} color={palette.ink} />
                ) : (
                  <Text style={[type.small, { color: palette.rose }]}>
                    {String(number).padStart(2, '0')}
                  </Text>
                )}
              </View>
              <Text style={[type.body, { flex: 1, color: palette.text }]}>
                {d.title}
              </Text>
              {!unlocked && <LockKeyhole size={15} color={palette.quiet} />}
            </Pressable>
          );
        })}
      </View>
      {journey && (
        <Card>
          <Text style={type.eyebrow}>
            DIA {selected} · {done ? 'CONCLUÍDO' : 'SEU ENCONTRO'}
          </Text>
          <Text style={type.heading}>{day.title}</Text>
          <Text style={type.body}>{day.reflection}</Text>
          <View style={common.separator} />
          <Text style={type.subheading}>Experimente hoje</Text>
          <Text style={type.body}>{day.exercise}</Text>
          <View style={s.prompt}>
            <Text
              style={[
                type.body,
                { fontFamily: fonts.italic, color: palette.rose },
              ]}
            >
              {day.prompt}
            </Text>
          </View>
          <Button
            title="Escrever sobre isso"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: '/entry',
                params: { prompt: day.prompt },
              })
            }
          />
          {!done && (
            <Button
              title={
                waiting
                  ? 'Próximo encontro amanhã'
                  : 'Concluir encontro de hoje'
              }
              busy={saving}
              disabled={waiting || !active}
              onPress={complete}
            />
          )}
          <Text style={type.small}>
            {!active
              ? 'Retome esta jornada para continuar.'
              : done
                ? 'Você pode revisitar esta reflexão sempre que quiser.'
                : waiting
                  ? 'Hoje você já cuidou deste caminho. Pode descansar.'
                  : 'Marque quando tiver feito a reflexão, no seu tempo.'}
          </Text>
        </Card>
      )}
    </Screen>
  );
}
const s = StyleSheet.create({
  quote: { alignItems: 'center', gap: 18, paddingVertical: 25 },
  quoteText: {
    fontFamily: fonts.italic,
    color: palette.rose,
    fontSize: 26,
    lineHeight: 36,
    textAlign: 'center',
  },
  progress: { flexDirection: 'row', gap: 6, marginVertical: 8 },
  segment: { height: 4, flex: 1, backgroundColor: '#796071', borderRadius: 3 },
  day: {
    minHeight: 64,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selected: { borderColor: palette.line, backgroundColor: palette.surface },
  dayNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prompt: { padding: 16, backgroundColor: palette.elevated, borderRadius: 13 },
});
