import React from 'react';
import { Alert } from 'react-native';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { MobileProvider } from '../../mobile/Store';
import { emptyState, STORAGE_KEY } from '../../domain/model';
import Profile from '../../mobile/screens/Profile';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
const mockFiles = new Map<string, string>();
const mockWrites = jest.fn();
jest.mock('expo-file-system', () => ({
  Paths: { cache: 'cache' },
  File: class {
    uri: string;
    constructor(...paths: string[]) {
      this.uri = paths.join('/');
    }
    get exists() {
      return mockFiles.has(this.uri);
    }
    get size() {
      return mockFiles.get(this.uri)?.length ?? 0;
    }
    write(value: string) {
      mockWrites(value);
      mockFiles.set(this.uri, value);
    }
    delete() {
      mockFiles.delete(this.uri);
    }
    text() {
      return Promise.resolve(mockFiles.get(this.uri)!);
    }
  },
}));
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => {}),
}));
jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn() }));
async function mount(
  raw = JSON.stringify({ ...emptyState(), onboarded: true }),
) {
  await AsyncStorage.setItem(STORAGE_KEY, raw);
  render(
    <MobileProvider>
      <Profile />
    </MobileProvider>,
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
}
function selectBackup(value: string) {
  mockFiles.set('cache/import.json', value);
  (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'cache/import.json', size: value.length }],
  });
}
beforeEach(async () => {
  await AsyncStorage.clear();
  mockFiles.clear();
});
it('exports an actual JSON backup through the native share sheet and clears its temporary file', async () => {
  await mount();
  fireEvent.press(screen.getByRole('button', { name: 'Exportar backup' }));
  await waitFor(() =>
    expect(Sharing.shareAsync).toHaveBeenCalledWith(
      'cache/anima-backup.json',
      expect.objectContaining({ mimeType: 'application/json' }),
    ),
  );
  expect(JSON.parse(mockWrites.mock.calls[0][0]).version).toBe(1);
  expect(mockFiles.has('cache/anima-backup.json')).toBe(false);
});
it('validates an import before asking to replace local data', async () => {
  await mount();
  selectBackup('{"version":99}');
  fireEvent.press(screen.getByRole('button', { name: 'Importar backup' }));
  await waitFor(() =>
    expect(Alert.alert).toHaveBeenCalledWith(
      'Backup não importado',
      expect.stringContaining('não é um backup válido'),
    ),
  );
  expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY))!).version).toBe(
    1,
  );
  expect(mockFiles.has('cache/import.json')).toBe(false);
});
it('restores a valid backup only after native confirmation', async () => {
  await mount();
  const backup = emptyState();
  backup.profile.name = 'Restaurado';
  selectBackup(JSON.stringify(backup));
  fireEvent.press(screen.getByRole('button', { name: 'Importar backup' }));
  await waitFor(() =>
    expect(Alert.alert).toHaveBeenCalledWith(
      'Restaurar este backup?',
      expect.any(String),
      expect.any(Array),
    ),
  );
  expect(
    JSON.parse((await AsyncStorage.getItem(STORAGE_KEY))!).profile.name,
  ).toBe('');
  const buttons = (Alert.alert as jest.Mock).mock.calls.at(-1)[2];
  await act(async () => {
    buttons.find((b: { text: string }) => b.text === 'Restaurar').onPress();
  });
  await waitFor(() =>
    expect(screen.getByDisplayValue('Restaurado')).toBeTruthy(),
  );
  expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEY))!).onboarded).toBe(
    true,
  );
});
it('exports corrupt raw data for recovery without overwriting it', async () => {
  await mount('{damaged');
  fireEvent.press(
    screen.getByRole('button', { name: 'Exportar dados para recuperação' }),
  );
  await waitFor(() => expect(Sharing.shareAsync).toHaveBeenCalled());
  expect(mockWrites).toHaveBeenCalledWith('{damaged');
  expect(await AsyncStorage.getItem(STORAGE_KEY)).toBe('{damaged');
});
it('erases all local data only after native confirmation', async () => {
  await mount();
  fireEvent.press(
    screen.getByRole('button', { name: 'Apagar todos os meus dados' }),
  );
  expect(await AsyncStorage.getItem(STORAGE_KEY)).not.toBeNull();
  const buttons = (Alert.alert as jest.Mock).mock.calls.at(-1)[2];
  await act(async () => {
    await buttons
      .find((b: { text: string }) => b.text === 'Apagar tudo')
      .onPress();
  });
  expect(await AsyncStorage.getItem(STORAGE_KEY)).toBeNull();
  expect(router.replace).toHaveBeenCalledWith('/intro');
});
