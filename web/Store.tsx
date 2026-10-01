import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AnimaState,
  emptyState,
  parseState,
  STORAGE_KEY,
} from './domain/model';

type Store = {
  state: AnimaState;
  ready: boolean;
  storageError: string;
  notice: string;
  notify: (message: string) => void;
  update: (fn: (state: AnimaState) => AnimaState) => boolean;
  replace: (state: AnimaState) => boolean;
  reset: () => boolean;
};
const Context = createContext<Store | null>(null);
export function AnimaProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AnimaState>(emptyState);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [notice, notify] = useState('');
  const current = React.useRef(state);
  const damaged = React.useRef(false);
  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? parseState(JSON.parse(raw)) : emptyState();
        if (!parsed) throw new Error('invalid');
        damaged.current = false;
        current.current = parsed;
        setState(parsed);
        setStorageError('');
      } catch {
        damaged.current = true;
        setStorageError(
          'Não foi possível abrir os dados locais. Em Meu espaço, você pode baixar uma cópia de recuperação ou redefinir os dados.',
        );
      }
      setReady(true);
    }
    load();
    const listener = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) load();
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => notify(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  function replace(next: AnimaState) {
    if (!parseState(next)) {
      notify(
        'Não foi possível salvar: o registro excede os limites deste espaço. Exporte um backup antes de liberar espaço.',
      );
      return false;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      damaged.current = false;
      current.current = next;
      setState(next);
      setStorageError('');
      return true;
    } catch {
      setStorageError(
        'Não foi possível salvar. O armazenamento pode estar cheio ou bloqueado. Exporte seus dados em Meu espaço antes de fechar.',
      );
      notify('Alteração não salva. Verifique o armazenamento do navegador.');
      return false;
    }
  }
  function update(fn: (state: AnimaState) => AnimaState) {
    if (damaged.current) {
      notify('Recupere ou redefina os dados em Meu espaço antes de salvar.');
      return false;
    }
    return replace(fn(current.current));
  }
  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      const next = emptyState();
      current.current = next;
      damaged.current = false;
      setState(next);
      setStorageError('');
      return true;
    } catch {
      notify('O navegador não permitiu apagar os dados.');
      return false;
    }
  }
  return (
    <Context.Provider
      value={{
        state,
        ready,
        storageError,
        notice,
        notify,
        update,
        replace,
        reset,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAnima() {
  const value = useContext(Context);
  if (!value) throw new Error('AnimaProvider is required');
  return value;
}
export function downloadJSON(data: unknown, filename: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
