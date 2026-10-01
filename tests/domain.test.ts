import test from 'node:test';
import assert from 'node:assert/strict';
import {
  completeDay,
  emptyState,
  localDate,
  parseState,
  saveCheckIn,
  weekDays,
} from '../domain/model';
import { guidedReply, needsImmediateSupport } from '../domain/conversation';
import { cycles } from '../domain/content';

test('a check-in replaces the local calendar day without erasing other days', () => {
  const yesterday = new Date(2026, 9, 1, 23, 59);
  const today = new Date(2026, 9, 2, 0, 1);
  let state = saveCheckIn(emptyState(), 2, 3, yesterday);
  state = saveCheckIn(state, 4, 3, today);
  state = saveCheckIn(state, 5, 4, today);
  assert.equal(state.checkIns.length, 2);
  assert.equal(state.checkIns[1].mood, 5);
  assert.equal(state.checkIns[1].date, localDate(today));
});
test('calendar calculations cross month and year boundaries', () => {
  const days = weekDays(new Date(2027, 0, 2, 1));
  assert.equal(days[0].key, '2026-12-27');
  assert.equal(days[6].key, '2027-01-02');
  assert.equal(new Set(days.map((d) => d.key)).size, 7);
});
test('cycle progress cannot skip days, complete twice or advance twice in a day', () => {
  let state = emptyState();
  const now = new Date(2026, 9, 1, 8);
  state.journeys.presence = {
    completed: [],
    lastCompletedOn: null,
    startedAt: now.toISOString(),
  };
  assert.equal(completeDay(state, 'presence', 2, now), state);
  assert.equal(completeDay(state, 'unknown', 1, now), state);
  state = completeDay(state, 'presence', 1, now);
  assert.deepEqual(state.journeys.presence.completed, [1]);
  assert.equal(completeDay(state, 'presence', 1, now), state);
  assert.equal(completeDay(state, 'presence', 2, now), state);
  state = completeDay(state, 'presence', 2, new Date(2026, 9, 5));
  assert.deepEqual(state.journeys.presence.completed, [1, 2]);
});
test('backups preserve valid data and reject corrupt or unknown structures', () => {
  const state = saveCheckIn(emptyState(), 4);
  assert.deepEqual(parseState(JSON.parse(JSON.stringify(state))), state);
  for (const broken of [
    null,
    [],
    {},
    { ...state, version: 2 },
    { ...state, profile: { name: 42 } },
    { ...state, checkIns: [{ date: 'bad', mood: 9 }] },
    { ...state, favorites: ['unknown'] },
    { ...state, journeys: { unknown: {} } },
    { ...state, activeCycle: 'presence' },
    { ...state, entries: [{ content: '<script>' }] },
  ])
    assert.equal(parseState(broken), null);
  assert.equal(
    parseState({ ...state, checkIns: [...state.checkIns, ...state.checkIns] }),
    null,
  );
});
test('risk phrases work with accents, punctuation and whitespace before thematic replies', () => {
  for (const phrase of [
    'Estou cansada e quero me matar',
    'NÃO QUERO MAIS VIVER',
    'Me   machucar',
    'penso em suicídio',
    'Quero acabar com minha vida.',
  ]) {
    assert.equal(needsImmediateSupport(phrase), true, phrase);
    const reply = guidedReply(phrase, 9);
    assert.equal(reply.urgent, true);
    assert.match(reply.content, /192/);
    assert.match(reply.content, /188/);
  }
  for (const phrase of [
    'Quero me jogar no projeto',
    'O dia está difícil',
    'preciso matar a saudade',
    'Uma história de superação',
  ])
    assert.equal(needsImmediateSupport(phrase), false, phrase);
});
test('normal reflection does not assert diagnoses or invented history', () => {
  const response = guidedReply('Estou com ansiedade');
  assert.equal(response.urgent, false);
  assert.match(response.content, /alcance/);
  assert.doesNotMatch(response.content, /trauma|ferida|diagnóstico/);
});
test('each cycle contains seven distinct encounters with its own exercises', () => {
  const exercises = cycles.flatMap((c) => c.days.map((d) => d.exercise));
  assert.equal(exercises.length, 21);
  assert.equal(new Set(exercises).size, 21);
});
