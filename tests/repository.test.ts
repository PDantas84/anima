import test from 'node:test';
import assert from 'node:assert/strict';
import { createRepository, DeviceStorage } from '../mobile/repository';
import { emptyState, saveCheckIn } from '../domain/model';
function memory(initial: string | null = null) {
  let raw = initial;
  let fail = false;
  const storage: DeviceStorage = {
    getItem: async () => raw,
    setItem: async (_, value) => {
      if (fail) throw new Error('disk full');
      await new Promise((resolve) => setTimeout(resolve, 3));
      raw = value;
    },
    removeItem: async () => {
      if (fail) throw new Error('disk full');
      raw = null;
    },
  };
  return {
    storage,
    read: () => raw,
    fail: (value: boolean) => {
      fail = value;
    },
  };
}
test('native writes serialize concurrent updates without losing earlier changes', async () => {
  const disk = memory();
  const repo = createRepository(disk.storage);
  await repo.load();
  await Promise.all([
    repo.update((s) => ({ ...s, profile: { ...s.profile, name: 'Pablo' } })),
    repo.update((s) => saveCheckIn(s, 4, 3, new Date('2026-10-01T12:00:00'))),
    repo.update((s) => ({ ...s, favorites: ['breath'] })),
  ]);
  const saved = JSON.parse(disk.read()!);
  assert.equal(saved.profile.name, 'Pablo');
  assert.equal(saved.checkIns[0].mood, 4);
  assert.deepEqual(saved.favorites, ['breath']);
});
test('failed native write leaves last committed state intact and queue recovers', async () => {
  const disk = memory(JSON.stringify(emptyState()));
  const repo = createRepository(disk.storage);
  await repo.load();
  disk.fail(true);
  await assert.rejects(
    repo.update((s) => ({
      ...s,
      profile: { ...s.profile, name: 'Unwritten' },
    })),
    /disk full/,
  );
  disk.fail(false);
  const next = await repo.update((s) => ({ ...s, favorites: ['ground'] }));
  assert.equal(next.profile.name, '');
  assert.deepEqual(next.favorites, ['ground']);
});
test('corrupt device data is preserved until explicit recovery or reset', async () => {
  const disk = memory('{bad json');
  const repo = createRepository(disk.storage);
  await assert.rejects(repo.load(), /recuperação/);
  await assert.rejects(
    repo.update((s) => s),
    /Recupere/,
  );
  assert.equal(await repo.raw(), '{bad json');
  const restored = await repo.replace({ ...emptyState(), onboarded: true });
  assert.equal(restored.onboarded, true);
  assert.deepEqual(await repo.load(), restored);
});
test('invalid import never overwrites a valid native store', async () => {
  const valid = {
    ...emptyState(),
    profile: { ...emptyState().profile, name: 'Original' },
  };
  const disk = memory(JSON.stringify(valid));
  const repo = createRepository(disk.storage);
  await repo.load();
  await assert.rejects(repo.replace({ ...valid, favorites: ['invalid'] }));
  assert.equal(JSON.parse(disk.read()!).profile.name, 'Original');
});
test('reset failure preserves disk data; explicit successful reset clears onboarding and data', async () => {
  const disk = memory(JSON.stringify({ ...emptyState(), onboarded: true }));
  const repo = createRepository(disk.storage);
  await repo.load();
  disk.fail(true);
  await assert.rejects(repo.reset());
  assert.equal(JSON.parse(disk.read()!).onboarded, true);
  disk.fail(false);
  assert.deepEqual(await repo.reset(), emptyState());
  assert.equal(disk.read(), null);
});
test('loading and immediately queued mutation use saved state', async () => {
  const original = {
    ...emptyState(),
    profile: { ...emptyState().profile, name: 'Ana' },
  };
  const disk = memory(JSON.stringify(original));
  const repo = createRepository(disk.storage);
  const loading = repo.load();
  const update = repo.update((s) => ({ ...s, favorites: ['pause'] }));
  await loading;
  assert.equal((await update).profile.name, 'Ana');
});
