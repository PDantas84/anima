import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Alert,
  Animated,
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Crypto from 'expo-crypto';
import { Check, Heart, Leaf, Pause, Play, Wind } from 'lucide-react-native';
import { rituals } from '@/domain/content';
import { useMobile, successHaptic } from '../Store';
import {
  Button,
  Card,
  Empty,
  IconButton,
  Screen,
  common,
} from '../components/UI';
import { palette, fonts, type } from '../theme';
export default function Rituals() {
  const { state, update } = useMobile();
  const [category, setCategory] = useState('Todos');
  const filtered = rituals.filter(
    (r) =>
      category === 'Todos' ||
      category === r.category ||
      (category === 'Favoritos' && state.favorites.includes(r.id)),
  );
  return (
    <Screen
      title="Pequenos rituais"
      eyebrow="ESPAÇO PARA RESPIRAR"
      back
      description="Encontre uma pausa que caiba no seu agora."
    >
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {['Todos', 'Presença', 'Escrita', 'Cuidado', 'Favoritos'].map((c) => (
            <Pressable
              key={c}
              accessibilityRole="button"
              accessibilityState={{ selected: category === c }}
              onPress={() => setCategory(c)}
              style={[
                s.chip,
                category === c && {
                  backgroundColor: '#4C3644',
                  borderColor: '#A28191',
                },
              ]}
            >
              <Text style={type.small}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {filtered.length ? (
        filtered.map((r) => (
          <Card key={r.id}>
            <View style={[common.row, { justifyContent: 'space-between' }]}>
              <View style={s.symbol}>
                {r.category === 'Presença' ? (
                  <Wind size={25} color={palette.rose} />
                ) : (
                  <Leaf size={25} color={palette.sage} />
                )}
              </View>
              <IconButton
                label={
                  state.favorites.includes(r.id)
                    ? `Remover ${r.title} dos favoritos`
                    : `Favoritar ${r.title}`
                }
                onPress={() => {
                  void update((s) => ({
                    ...s,
                    favorites: s.favorites.includes(r.id)
                      ? s.favorites.filter((f) => f !== r.id)
                      : [...s.favorites, r.id],
                  }));
                }}
                icon={
                  <Heart
                    size={22}
                    color={palette.rose}
                    fill={
                      state.favorites.includes(r.id) ? palette.rose : 'none'
                    }
                  />
                }
              />
            </View>
            <Text style={type.eyebrow}>
              {r.category.toUpperCase()} · {r.minutes} MIN
            </Text>
            <Text style={type.heading}>{r.title}</Text>
            <Text style={type.body}>{r.subtitle}</Text>
            <Button
              title={`Começar ${r.title.toLowerCase()}`}
              variant="secondary"
              onPress={() => router.push(`/ritual/${r.id}`)}
            />
          </Card>
        ))
      ) : (
        <Empty
          title="Guarde suas pausas favoritas"
          description="Toque no coração de um ritual para encontrá-lo aqui."
          icon={<Heart color={palette.rose} size={30} />}
        />
      )}
    </Screen>
  );
}
export function RitualDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ritual = rituals.find((r) => r.id === id);
  const { update, saving } = useMobile();
  const [remaining, setRemaining] = useState((ritual?.minutes ?? 1) * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const deadline = useRef(0);
  const completed = useRef(false);
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced,
    );
    return () => sub.remove();
  }, []);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status !== 'active') setRunning(false);
    });
    return () => sub.remove();
  }, []);
  useEffect(() => {
    if (!running) return;
    deadline.current = Date.now() + remaining * 1000;
    const timer = setInterval(() => {
      const next = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(next);
      setElapsed((ritual?.minutes ?? 1) * 60 - next);
      if (!next) {
        setRunning(false);
        successHaptic();
      }
    }, 250);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (!running || reduced) {
      scale.stopAnimation();
      scale.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.12,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [running, reduced, scale]);
  async function finish() {
    if (completed.current || !ritual) return;
    completed.current = true;
    setRunning(false);
    const ok = await update(
      (s) => ({
        ...s,
        practices: [
          ...s.practices,
          {
            id: Crypto.randomUUID(),
            ritualId: ritual.id,
            completedAt: new Date().toISOString(),
          },
        ],
      }),
      'Sua pausa foi guardada.',
    );
    if (ok) {
      setDone(true);
      successHaptic();
    } else completed.current = false;
  }
  if (!ritual)
    return (
      <Screen title="Ritual não encontrado" back>
        <Button
          title="Ver rituais"
          onPress={() => router.replace('/rituals')}
        />
      </Screen>
    );
  return (
    <Screen
      title={ritual.title}
      eyebrow={`${ritual.category.toUpperCase()} · ${ritual.minutes} MIN`}
      back
      description={ritual.subtitle}
    >
      <View style={s.orbit}>
        <Animated.View style={[s.outerCircle, { transform: [{ scale }] }]}>
          <View style={s.innerCircle}>
            {done ? (
              <Check size={38} color={palette.rose} />
            ) : (
              <>
                <Wind size={28} strokeWidth={1.3} color={palette.rose} />
                <Text
                  style={s.clock}
                  accessibilityLabel={`${Math.floor(remaining / 60)} ${Math.floor(remaining / 60) === 1 ? 'minuto' : 'minutos'} e ${remaining % 60} ${remaining % 60 === 1 ? 'segundo' : 'segundos'}`}
                >
                  {Math.floor(remaining / 60)}:
                  {String(remaining % 60).padStart(2, '0')}
                </Text>
                <Text style={type.small}>
                  {running && id === 'breath'
                    ? elapsed % 10 < 4
                      ? 'Inspire suavemente'
                      : 'Solte o ar'
                    : remaining === 0
                      ? 'Uma pausa acolhida'
                      : 'No seu ritmo'}
                </Text>
              </>
            )}
          </View>
        </Animated.View>
      </View>
      {done ? (
        <Card>
          <Text style={type.heading}>Um pouco mais perto de si.</Text>
          <Text style={type.body}>{ritual.prompt}</Text>
          <Button
            title="Levar para o diário"
            onPress={() =>
              router.push({
                pathname: '/entry',
                params: { prompt: ritual.prompt },
              })
            }
          />
          <Button
            title="Voltar aos rituais"
            variant="ghost"
            onPress={() => router.back()}
          />
        </Card>
      ) : (
        <>
          <View style={{ gap: 12 }}>
            {ritual.steps.map((step, i) => (
              <View
                key={step}
                style={[common.row, { alignItems: 'flex-start' }]}
              >
                <Text style={[type.eyebrow, { paddingTop: 5, width: 20 }]}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Text style={[type.body, { flex: 1 }]}>{step}</Text>
              </View>
            ))}
          </View>
          {remaining > 0 && (
            <Button
              title={
                running
                  ? 'Pausar'
                  : remaining === ritual.minutes * 60
                    ? 'Começar minha pausa'
                    : 'Continuar'
              }
              onPress={() => setRunning((v) => !v)}
              icon={
                running ? (
                  <Pause size={19} color={palette.ink} />
                ) : (
                  <Play size={19} color={palette.ink} />
                )
              }
            />
          )}
          <Button
            title="Concluir meu ritual"
            variant={remaining === 0 ? 'primary' : 'secondary'}
            busy={saving}
            onPress={finish}
          />
          <Text style={common.note}>
            O tempo é um convite. Você pode concluir antes.{'\n'}Ao sair do app,
            a contagem pausa.
          </Text>
        </>
      )}
    </Screen>
  );
}
const s = StyleSheet.create({
  chip: {
    paddingHorizontal: 17,
    paddingVertical: 12,
    minHeight: 44,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 24,
  },
  symbol: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#45313F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    height: 290,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  outerCircle: {
    width: 238,
    height: 238,
    borderRadius: 119,
    backgroundColor: '#302630',
    borderWidth: 1,
    borderColor: '#654B60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 204,
    height: 204,
    borderRadius: 102,
    backgroundColor: '#44313F',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#896573',
  },
  clock: {
    fontFamily: fonts.title,
    fontSize: 46,
    color: palette.text,
    fontVariant: ['tabular-nums'],
  },
});
