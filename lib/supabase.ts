import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const supabaseConfigured = Boolean(
  supabaseUrl && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
);
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const webStorage = {
  getItem: (k: string) =>
    Promise.resolve(
      typeof window !== 'undefined' ? window.localStorage.getItem(k) : null,
    ),
  setItem: (k: string, v: string) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(k, v);
    return Promise.resolve();
  },
  removeItem: (k: string) => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(k);
    return Promise.resolve();
  },
};

export const supabase = createClient(
  supabaseUrl || 'http://127.0.0.1:54321',
  supabaseAnonKey || 'anima-not-configured',
  {
    // Expo discovers native routes during web bundling. Keep imports safe without credentials.
    // No request is allowed to leave an unconfigured client.
    global: supabaseConfigured
      ? {}
      : {
          fetch: async () => {
            throw new Error(
              'Supabase não configurado. Use o MVP web local ou configure as variáveis de ambiente.',
            );
          },
        },
    auth: {
      storage: Platform.OS === 'web' ? (webStorage as any) : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
