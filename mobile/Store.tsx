import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  AppState,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { AnimaState, emptyState, localDate } from '@/domain/model';
import { createRepository } from './repository';
import { palette, type } from './theme';

type Store = {
  state: AnimaState;
  ready: boolean;
  saving: boolean;
  error: string;
  today: string;
  update: (
    fn: (state: AnimaState) => AnimaState,
    message?: string,
  ) => Promise<boolean>;
  restore: (next: AnimaState) => Promise<boolean>;
  reset: () => Promise<boolean>;
  raw: () => Promise<string | null>;
  notify: (message: string) => void;
};
const Context = createContext<Store | null>(null);
export function MobileProvider({ children }: { children: React.ReactNode }) {
  const repository = useRef(createRepository(AsyncStorage)).current;
  const [state, setState] = useState(emptyState);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [today, setToday] = useState(localDate());
  useEffect(() => {
    let alive = true;
    repository
      .load()
      .then((value) => {
        if (alive) setState(value);
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [repository]);
  useEffect(() => {
    const tick = () => setToday(localDate());
    const interval = setInterval(tick, 60000);
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') tick();
    });
    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3800);
    return () => clearTimeout(timer);
  }, [notice]);
  const notify = (message: string) => {
    setNotice(message);
    AccessibilityInfo.announceForAccessibility(message);
  };
  async function run(operation: () => Promise<AnimaState>, message?: string) {
    setPending((n) => n + 1);
    try {
      const next = await operation();
      setState(next);
      setError('');
      if (message) notify(message);
      return true;
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'O aparelho não conseguiu salvar seus dados.';
      setError(message);
      Alert.alert(
        'Alteração não salva',
        `${message}\n\nSeu rascunho continua aberto.`,
      );
      return false;
    } finally {
      setPending((n) => n - 1);
    }
  }
  return (
    <Context.Provider
      value={{
        state,
        ready,
        saving: pending > 0,
        error,
        today,
        update: (fn, message) => run(() => repository.update(fn), message),
        restore: (next) =>
          run(() => repository.replace(next), 'Backup restaurado.'),
        reset: () =>
          run(
            () => repository.reset(),
            'Os dados foram apagados deste aparelho.',
          ),
        raw: repository.raw,
        notify,
      }}
    >
      {ready ? (
        children
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: palette.background,
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator
            color={palette.rose}
            accessibilityLabel="Abrindo seu espaço"
          />
        </View>
      )}
      {notice ? (
        <View
          pointerEvents="none"
          style={styles.toast}
          accessibilityLiveRegion="polite"
        >
          <Text style={[type.small, styles.toastText]}>{notice}</Text>
        </View>
      ) : null}
    </Context.Provider>
  );
}
export function useMobile() {
  const value = useContext(Context);
  if (!value) throw new Error('MobileProvider is required');
  return value;
}
export function selectionHaptic() {
  Haptics.selectionAsync().catch(() => {});
}
export function successHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
    () => {},
  );
}
const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 105,
    left: 22,
    right: 22,
    zIndex: 100,
    borderRadius: 16,
    backgroundColor: palette.rose,
    paddingHorizontal: 18,
    paddingVertical: 14,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  toastText: { color: palette.ink, textAlign: 'center' },
});
