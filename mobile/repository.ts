import {
  AnimaState,
  emptyState,
  parseState,
  STORAGE_KEY,
} from '../domain/model';
export type DeviceStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};
/** Serialize device writes, committing in-memory state only after disk succeeds. */
export function createRepository(storage: DeviceStorage) {
  let state = emptyState();
  let loaded = false;
  let damaged = false;
  let queue: Promise<unknown> = Promise.resolve();
  function enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const next = queue.then(operation);
    queue = next.catch(() => {});
    return next;
  }
  async function persist(next: AnimaState) {
    const valid = parseState(next);
    if (!valid)
      throw new Error(
        'O registro excede os limites do aplicativo. Exporte seus dados antes de liberar espaço.',
      );
    await storage.setItem(STORAGE_KEY, JSON.stringify(valid));
    state = valid;
    loaded = true;
    damaged = false;
    return state;
  }
  return {
    load: () =>
      enqueue(async () => {
        try {
          const raw = await storage.getItem(STORAGE_KEY);
          const parsed = raw ? parseState(JSON.parse(raw)) : emptyState();
          if (!parsed) throw new Error('invalid');
          state = parsed;
          loaded = true;
          damaged = false;
          return state;
        } catch {
          damaged = true;
          loaded = true;
          throw new Error(
            'Não foi possível abrir os dados do aparelho. Em Meu espaço, exporte uma cópia para recuperação ou redefina o armazenamento.',
          );
        }
      }),
    update: (fn: (current: AnimaState) => AnimaState) =>
      enqueue(async () => {
        if (!loaded || damaged)
          throw new Error(
            'Recupere ou redefina o armazenamento em Meu espaço antes de salvar.',
          );
        return persist(fn(state));
      }),
    replace: (next: AnimaState) => enqueue(() => persist(next)),
    reset: () =>
      enqueue(async () => {
        await storage.removeItem(STORAGE_KEY);
        state = emptyState();
        loaded = true;
        damaged = false;
        return state;
      }),
    raw: () => storage.getItem(STORAGE_KEY),
  };
}
