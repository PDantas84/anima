export type Mood = 1 | 2 | 3 | 4 | 5;
export type CheckIn = { date: string; mood: Mood; energy: number };
export type Entry = {
  id: string;
  title: string;
  content: string;
  mood: Mood;
  createdAt: string;
  updatedAt: string;
};
export type Journey = {
  completed: number[];
  lastCompletedOn: string | null;
  startedAt: string;
};
export type AnimaState = {
  version: 1;
  onboarded: boolean;
  profile: { name: string; intention: string; futureLetter: string };
  checkIns: CheckIn[];
  entries: Entry[];
  journeys: Record<string, Journey>;
  activeCycle: string | null;
  practices: { id: string; ritualId: string; completedAt: string }[];
  favorites: string[];
};
export const STORAGE_KEY = 'anima.device.v1';
export const emptyState = (): AnimaState => ({
  version: 1,
  onboarded: false,
  profile: { name: '', intention: 'Encontrar mais calma', futureLetter: '' },
  checkIns: [],
  entries: [],
  journeys: {},
  activeCycle: null,
  practices: [],
  favorites: [],
});
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function weekDays(now = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - 6 + index);
    return {
      key: localDate(date),
      label: date
        .toLocaleDateString('pt-BR', { weekday: 'short' })
        .replace('.', ''),
    };
  });
}
export const moodLabels: Record<Mood, string> = {
  1: 'Difícil',
  2: 'Sensível',
  3: 'Assim assim',
  4: 'Bem',
  5: 'Em paz',
};
export function saveCheckIn(
  state: AnimaState,
  mood: Mood,
  energy = 3,
  now = new Date(),
): AnimaState {
  const date = localDate(now);
  return {
    ...state,
    checkIns: [
      ...state.checkIns.filter((item) => item.date !== date),
      { date, mood, energy },
    ],
  };
}
export function completeDay(
  state: AnimaState,
  cycleId: string,
  day: number,
  now = new Date(),
): AnimaState {
  const journey = state.journeys[cycleId];
  if (
    !journey ||
    day !== journey.completed.length + 1 ||
    day > 7 ||
    journey.lastCompletedOn === localDate(now)
  )
    return state;
  return {
    ...state,
    journeys: {
      ...state.journeys,
      [cycleId]: {
        ...journey,
        completed: [...journey.completed, day],
        lastCompletedOn: localDate(now),
      },
    },
  };
}
export function presenceDays(state: AnimaState): Set<string> {
  return new Set([
    ...state.checkIns.map((c) => c.date),
    ...state.entries.map((e) => localDate(new Date(e.createdAt))),
    ...state.practices.map((p) => localDate(new Date(p.completedAt))),
  ]);
}
const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const text = (v: unknown, max: number): v is string =>
  typeof v === 'string' && v.length <= max;
const mood = (v: unknown): v is Mood =>
  typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 5;
const date = (v: unknown): v is string =>
  typeof v === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(Date.parse(v));
const timestamp = (v: unknown): v is string =>
  text(v, 40) && !Number.isNaN(Date.parse(v));
const safeIds = ['presence', 'boundaries', 'renewal'];
const ritualIds = [
  'breath',
  'ground',
  'letter',
  'pause',
  'gratitude',
  'boundary',
];
const array = (v: unknown): v is unknown[] =>
  Array.isArray(v) && v.length <= 10000;
/** Validate imports and device data before any rendering or replacement. */
export function parseState(value: unknown): AnimaState | null {
  if (!isObject(value) || value.version !== 1 || !isObject(value.profile))
    return null;
  const p = value.profile;
  if (
    !text(p.name, 60) ||
    !text(p.intention, 160) ||
    !text(p.futureLetter, 12000)
  )
    return null;
  if (
    !array(value.checkIns) ||
    !value.checkIns.every(
      (c) => isObject(c) && date(c.date) && mood(c.mood) && mood(c.energy),
    )
  )
    return null;
  if (
    new Set(value.checkIns.map((c) => (c as CheckIn).date)).size !==
    value.checkIns.length
  )
    return null;
  if (
    !array(value.entries) ||
    !value.entries.every(
      (e) =>
        isObject(e) &&
        text(e.id, 100) &&
        text(e.title, 120) &&
        text(e.content, 12000) &&
        mood(e.mood) &&
        timestamp(e.createdAt) &&
        timestamp(e.updatedAt),
    )
  )
    return null;
  if (
    new Set(value.entries.map((e) => (e as Entry).id)).size !==
    value.entries.length
  )
    return null;
  if (
    !isObject(value.journeys) ||
    !Object.entries(value.journeys).every(
      ([id, j]) =>
        safeIds.includes(id) &&
        isObject(j) &&
        Array.isArray(j.completed) &&
        j.completed.length <= 7 &&
        j.completed.every((d, index) => d === index + 1) &&
        (j.lastCompletedOn === null || date(j.lastCompletedOn)) &&
        timestamp(j.startedAt),
    )
  )
    return null;
  if (
    value.activeCycle !== null &&
    (typeof value.activeCycle !== 'string' ||
      !safeIds.includes(value.activeCycle) ||
      !value.journeys[value.activeCycle])
  )
    return null;
  if (
    !array(value.practices) ||
    !value.practices.every(
      (p) =>
        isObject(p) &&
        text(p.id, 100) &&
        typeof p.ritualId === 'string' &&
        ritualIds.includes(p.ritualId) &&
        timestamp(p.completedAt),
    )
  )
    return null;
  if (
    !array(value.favorites) ||
    !value.favorites.every(
      (f) => typeof f === 'string' && ritualIds.includes(f),
    )
  )
    return null;
  // Only retain known properties; never render arbitrary imported metadata.
  return {
    version: 1,
    onboarded: typeof value.onboarded === 'boolean' ? value.onboarded : true,
    profile: {
      name: p.name,
      intention: p.intention,
      futureLetter: p.futureLetter,
    },
    checkIns: value.checkIns as CheckIn[],
    entries: value.entries as Entry[],
    journeys: value.journeys as Record<string, Journey>,
    activeCycle: value.activeCycle as string | null,
    practices: value.practices as AnimaState['practices'],
    favorites: value.favorites as string[],
  };
}
