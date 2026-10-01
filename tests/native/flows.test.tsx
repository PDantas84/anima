import React from 'react';
import { Alert, Linking } from 'react-native';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { MobileProvider } from '../../mobile/Store';
import {
  emptyState,
  STORAGE_KEY,
  AnimaState,
  localDate,
} from '../../domain/model';
import Intro from '../../mobile/screens/Intro';
import Dashboard from '../../mobile/screens/Dashboard';
import Journal from '../../mobile/screens/Journal';
import EntryEditor from '../../mobile/screens/EntryEditor';
import { CycleDetail } from '../../mobile/screens/Cycles';
import Rituals, { RitualDetail } from '../../mobile/screens/Rituals';
import Session from '../../mobile/screens/Session';
import FutureSelf from '../../mobile/screens/FutureSelf';
import Support from '../../mobile/screens/Support';
async function mount(
  Component: React.ComponentType,
  initial: AnimaState = { ...emptyState(), onboarded: true },
) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  render(
    <MobileProvider>
      <Component />
    </MobileProvider>,
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 10));
  });
}
async function stored() {
  return JSON.parse((await AsyncStorage.getItem(STORAGE_KEY))!) as AnimaState;
}
beforeEach(async () => {
  await AsyncStorage.clear();
  (useLocalSearchParams as jest.Mock).mockReturnValue({});
});
it('onboards without an account and persists name and intention', async () => {
  await mount(Intro, emptyState());
  fireEvent.press(screen.getByRole('button', { name: 'Quero começar' }));
  fireEvent.changeText(
    screen.getByLabelText('Como você gosta de ser chamado?'),
    'Pablo',
  );
  fireEvent.press(
    screen.getByRole('radio', { name: 'Cuidar dos meus limites' }),
  );
  fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
  fireEvent.press(screen.getByRole('button', { name: 'Entrar no meu espaço' }));
  await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/(tabs)'));
  expect((await stored()).profile.name).toBe('Pablo');
  expect((await stored()).profile.intention).toBe('Cuidar dos meus limites');
  expect((await stored()).onboarded).toBe(true);
});
it('saves and replaces the daily check-in on the device', async () => {
  await mount(Dashboard);
  fireEvent.press(screen.getByRole('button', { name: 'Bem' }));
  await waitFor(async () => expect((await stored()).checkIns[0].mood).toBe(4));
  fireEvent.press(screen.getByRole('button', { name: 'Em paz' }));
  await waitFor(async () => expect((await stored()).checkIns[0].mood).toBe(5));
  expect((await stored()).checkIns).toHaveLength(1);
});
it('writes a real journal entry and navigates only after persistence', async () => {
  await mount(EntryEditor);
  fireEvent.changeText(screen.getByLabelText('Título'), 'Meu dia');
  fireEvent.changeText(
    screen.getByLabelText('O que você quer guardar?'),
    'Caminhei perto de casa.',
  );
  fireEvent.press(screen.getByRole('button', { name: 'Guardar no diário' }));
  await waitFor(() => expect(router.back).toHaveBeenCalled());
  expect((await stored()).entries[0].content).toBe('Caminhei perto de casa.');
});
it('keeps the draft visible when saving fails', async () => {
  await mount(EntryEditor);
  fireEvent.changeText(
    screen.getByLabelText('O que você quer guardar?'),
    'Texto que preciso guardar.',
  );
  (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
    new Error('Sem espaço'),
  );
  fireEvent.press(screen.getByRole('button', { name: 'Guardar no diário' }));
  await waitFor(() =>
    expect(Alert.alert).toHaveBeenCalledWith(
      'Alteração não salva',
      expect.stringContaining('Sem espaço'),
    ),
  );
  expect(screen.getByDisplayValue('Texto que preciso guardar.')).toBeTruthy();
  expect(router.back).not.toHaveBeenCalled();
  expect((await stored()).entries).toHaveLength(0);
});
it('filters the journal by words and mood', async () => {
  const date = new Date().toISOString();
  await mount(Journal, {
    ...emptyState(),
    entries: [
      {
        id: 'one',
        title: 'Caminhada',
        content: 'Na praia',
        mood: 5,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: 'two',
        title: 'Trabalho',
        content: 'Um dia cheio',
        mood: 2,
        createdAt: date,
        updatedAt: date,
      },
    ],
  });
  fireEvent.changeText(screen.getByLabelText('Buscar no diário'), 'praia');
  expect(screen.getByText('Caminhada')).toBeTruthy();
  expect(screen.queryByText('Trabalho')).toBeNull();
  fireEvent.changeText(screen.getByLabelText('Buscar no diário'), '');
  fireEvent.press(screen.getByRole('button', { name: 'Filtrar por Sensível' }));
  expect(screen.queryByText('Caminhada')).toBeNull();
  expect(screen.getByText('Trabalho')).toBeTruthy();
});
it('starts a journey, completes one day and locks the next until tomorrow', async () => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'presence' });
  await mount(CycleDetail);
  fireEvent.press(screen.getByRole('button', { name: 'Começar esta jornada' }));
  await waitFor(() =>
    expect(
      screen.getByRole('button', { name: 'Concluir encontro de hoje' }),
    ).toBeTruthy(),
  );
  fireEvent.press(
    screen.getByRole('button', { name: 'Concluir encontro de hoje' }),
  );
  await waitFor(async () =>
    expect((await stored()).journeys.presence.completed).toEqual([1]),
  );
  fireEvent.press(
    screen.getByRole('button', { name: 'Dia 2: Dar nome ao que sente' }),
  );
  expect(
    screen.getByRole('button', { name: 'Próximo encontro amanhã' }),
  ).toBeDisabled();
  expect((await stored()).journeys.presence.lastCompletedOn).toBe(localDate());
});
it('favorites a ritual and filters favorites', async () => {
  await mount(Rituals);
  fireEvent.press(
    screen.getByRole('button', { name: 'Favoritar Um respiro, um recomeço' }),
  );
  await waitFor(async () =>
    expect((await stored()).favorites).toEqual(['breath']),
  );
  fireEvent.press(screen.getByRole('button', { name: 'Favoritos' }));
  expect(screen.getByText('Um respiro, um recomeço')).toBeTruthy();
  expect(screen.queryByText('De volta ao presente')).toBeNull();
});
it('records a completed ritual only once and offers a journal prompt', async () => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'breath' });
  await mount(RitualDetail);
  fireEvent.press(screen.getByRole('button', { name: 'Concluir meu ritual' }));
  await waitFor(() =>
    expect(
      screen.getByRole('button', { name: 'Levar para o diário' }),
    ).toBeTruthy(),
  );
  expect((await stored()).practices).toHaveLength(1);
  expect((await stored()).practices[0].ritualId).toBe('breath');
});
it('offers human support and stops scripted replies after a risk phrase', async () => {
  await mount(Session);
  fireEvent.press(screen.getByRole('button', { name: 'Só colocar para fora' }));
  fireEvent.changeText(screen.getByLabelText('Sua mensagem'), 'quero me matar');
  fireEvent.press(screen.getByRole('button', { name: 'Enviar mensagem' }));
  expect(
    screen.getByRole('button', { name: 'Encontrar apoio agora' }),
  ).toBeTruthy();
  expect(screen.queryByLabelText('Sua mensagem')).toBeNull();
  expect((await stored()).entries).toHaveLength(0);
});
it('saves and updates one conversation entry rather than creating duplicates', async () => {
  await mount(Session);
  fireEvent.press(screen.getByRole('button', { name: 'Acolher meu dia' }));
  fireEvent.changeText(screen.getByLabelText('Sua mensagem'), 'Estou cansado');
  fireEvent.press(screen.getByRole('button', { name: 'Enviar mensagem' }));
  fireEvent.press(screen.getByRole('button', { name: 'Guardar no diário' }));
  await waitFor(() =>
    expect(
      screen.getByRole('button', { name: 'Conversa guardada' }),
    ).toBeDisabled(),
  );
  fireEvent.changeText(
    screen.getByLabelText('Sua mensagem'),
    'Preciso de descanso',
  );
  fireEvent.press(screen.getByRole('button', { name: 'Enviar mensagem' }));
  fireEvent.press(screen.getByRole('button', { name: 'Guardar no diário' }));
  await waitFor(async () =>
    expect((await stored()).entries[0].content).toContain(
      'Preciso de descanso',
    ),
  );
  expect((await stored()).entries).toHaveLength(1);
});
it('stores the future letter in the device profile', async () => {
  await mount(FutureSelf);
  fireEvent.changeText(
    screen.getByLabelText('Minha carta'),
    'Espero que você continue caminhando.',
  );
  fireEvent.press(screen.getByRole('button', { name: 'Guardar minha carta' }));
  await waitFor(async () =>
    expect((await stored()).profile.futureLetter).toBe(
      'Espero que você continue caminhando.',
    ),
  );
});
it('uses the native telephone deep link for support', async () => {
  const link = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  await mount(Support);
  fireEvent.press(screen.getByRole('button', { name: 'Ligar 188' }));
  expect(link).toHaveBeenCalledWith('tel:188');
});
it('hydrates an existing letter before mounting a cold-start editor', async () => {
  const initial = emptyState();
  initial.profile.futureLetter = 'Uma carta já guardada';
  await mount(FutureSelf, initial);
  expect(screen.getByDisplayValue('Uma carta já guardada')).toBeTruthy();
  expect(
    screen.getByRole('button', { name: 'Guardar minha carta' }),
  ).toBeDisabled();
});
it('loads an existing journal entry for editing without duplicating it', async () => {
  const initial = emptyState();
  const timestamp = new Date().toISOString();
  initial.entries = [
    {
      id: 'existing',
      title: 'Meu momento',
      content: 'Antes',
      mood: 4,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
  (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'existing' });
  await mount(EntryEditor, initial);
  expect(screen.getByDisplayValue('Antes')).toBeTruthy();
  fireEvent.changeText(
    screen.getByLabelText('O que você quer guardar?'),
    'Depois de refletir',
  );
  fireEvent.press(screen.getByRole('button', { name: 'Guardar no diário' }));
  await waitFor(async () =>
    expect((await stored()).entries[0].content).toBe('Depois de refletir'),
  );
  expect((await stored()).entries).toHaveLength(1);
  expect((await stored()).entries[0].createdAt).toBe(timestamp);
});
it('deletes an entry only after native confirmation', async () => {
  const initial = emptyState();
  const timestamp = new Date().toISOString();
  initial.entries = [
    {
      id: 'delete-me',
      title: 'Minha página',
      content: 'Rascunho',
      mood: 3,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
  (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'delete-me' });
  await mount(EntryEditor, initial);
  fireEvent.press(screen.getByRole('button', { name: 'Apagar registro' }));
  expect((await stored()).entries).toHaveLength(1);
  const buttons = (Alert.alert as jest.Mock).mock.calls.at(-1)[2];
  await act(async () => {
    await buttons.find((b: { text: string }) => b.text === 'Apagar').onPress();
  });
  expect((await stored()).entries).toHaveLength(0);
});
