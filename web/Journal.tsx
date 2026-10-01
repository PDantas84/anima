import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  BookOpen,
  Plus,
  Search,
  PenLine,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { Entry, Mood, moodLabels } from './domain/model';
import { journalPrompts } from './domain/content';
import { needsImmediateSupport } from './domain/conversation';
import { useAnima } from './Store';
import {
  Confirm,
  Dialog,
  EmptyState,
  MoodFace,
  MoodPicker,
  PageHeading,
} from './components/UI';
function EntryEditor({
  entry,
  prompt,
  onClose,
}: {
  entry?: Entry;
  prompt?: string;
  onClose: () => void;
}) {
  const { state, update, notify } = useAnima();
  const [title, setTitle] = useState(entry?.title ?? '');
  const [content, setContent] = useState(entry?.content ?? '');
  const [mood, setMood] = useState<Mood>(entry?.mood ?? 3);
  const [support, setSupport] = useState(false);
  const [discard, setDiscard] = useState(false);
  const dirty =
    title !== (entry?.title ?? '') ||
    content !== (entry?.content ?? '') ||
    mood !== (entry?.mood ?? 3);
  function requestClose() {
    if (discard) setDiscard(false);
    else if (dirty && !support) setDiscard(true);
    else onClose();
  }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    const now = new Date().toISOString();
    const next: Entry = {
      id: entry?.id ?? crypto.randomUUID(),
      title: title.trim() || 'Um momento para mim',
      content: content.trim(),
      mood,
      createdAt: entry?.createdAt ?? now,
      updatedAt: now,
    };
    // An entry deleted in another tab must not silently reappear.
    if (entry && !state.entries.some((e) => e.id === entry.id)) {
      notify(
        'Esta entrada foi apagada em outra aba. Feche a janela e escreva uma nova entrada.',
      );
      return;
    }
    if (
      !update((s) => ({
        ...s,
        entries: entry
          ? s.entries.map((e) => (e.id === next.id ? next : e))
          : [next, ...s.entries],
      }))
    )
      return;
    notify('Suas palavras foram guardadas neste navegador.');
    if (needsImmediateSupport(content)) setSupport(true);
    else onClose();
  }
  return (
    <Dialog
      title={
        discard
          ? 'Descartar as alterações?'
          : support
            ? 'Você merece apoio agora.'
            : entry
              ? 'Voltar às suas palavras'
              : 'Um espaço para o que você sente'
      }
      onClose={requestClose}
      wide
    >
      {discard ? (
        <>
          <p className="muted">
            Suas últimas palavras ainda não foram salvas. Você pode continuar
            escrevendo ou fechar sem guardar estas alterações.
          </p>
          <div className="dialog-actions">
            <button
              className="button secondary"
              onClick={() => setDiscard(false)}
            >
              Continuar escrevendo
            </button>
            <button className="button danger" onClick={onClose}>
              Descartar alterações
            </button>
          </div>
        </>
      ) : support ? (
        <>
          <p className="muted">
            Sua entrada foi salva. Se houver perigo imediato, ligue para o SAMU
            192. O CVV oferece escuta gratuita pelo 188. Se puder, procure
            alguém de confiança para ficar com você.
          </p>
          <button
            className="button primary"
            onClick={() => {
              onClose();
              router.push('/crisis');
            }}
          >
            Encontrar apoio <ArrowRight size={16} />
          </button>
        </>
      ) : (
        <form onSubmit={save}>
          <p className="muted">
            {prompt ||
              'Não precisa encontrar as palavras perfeitas. Comece por onde fizer sentido.'}
          </p>
          <label className="field">
            Um título, se quiser
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              placeholder="Como eu chego hoje…"
            />
          </label>
          <label className="field">
            Suas palavras
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={7}
              maxLength={12000}
              placeholder="Aqui, eu posso ser…"
            />
          </label>
          <div className="editor-counter">
            {content.length.toLocaleString('pt-BR')} / 12.000
          </div>
          <span className="field-label">Como você se sente ao escrever?</span>
          <MoodPicker value={mood} onChange={setMood} />
          <p className="privacy-note">
            O diário fica neste navegador, sem senha ou criptografia. Prefira um
            dispositivo pessoal.
          </p>
          <div className="dialog-actions">
            <button
              className="button secondary"
              type="button"
              onClick={requestClose}
            >
              Cancelar
            </button>
            <button
              className="button primary"
              type="submit"
              disabled={!content.trim()}
            >
              Guardar minhas palavras
            </button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
export default function Journal() {
  const { state, update, notify } = useAnima();
  const params = useLocalSearchParams<{ new?: string; prompt?: string }>();
  const [editor, setEditor] = useState<{
    entry?: Entry;
    prompt?: string;
  } | null>(null);
  const [remove, setRemove] = useState<Entry | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    if (params.new === '1') {
      setEditor({ prompt: params.prompt });
      router.setParams({ new: undefined, prompt: undefined });
    }
  }, [params.new, params.prompt]);
  const entries = [...state.entries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter(
      (entry) =>
        `${entry.title} ${entry.content}`
          .toLocaleLowerCase('pt-BR')
          .includes(query.toLocaleLowerCase('pt-BR')) &&
        (filter === 'all' || entry.mood === Number(filter)),
    );
  return (
    <div className="page-enter">
      <PageHeading
        eyebrow="PALAVRAS QUE ACOLHEM"
        title="Meu diário"
        description="O que você sente merece um lugar. Este pode ser o seu."
        action={
          <button className="button primary" onClick={() => setEditor({})}>
            <Plus size={17} /> Nova entrada
          </button>
        }
      />
      <div className="prompt-strip">
        <PenLine size={22} />
        <div>
          <span className="eyebrow">SE PRECISAR DE UM COMEÇO</span>
          <p>{journalPrompts[new Date().getDate() % journalPrompts.length]}</p>
        </div>
        <button
          className="text-button"
          onClick={() =>
            setEditor({
              prompt:
                journalPrompts[new Date().getDate() % journalPrompts.length],
            })
          }
        >
          Escrever <ArrowRight size={16} />
        </button>
      </div>
      <div className="journal-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            aria-label="Buscar no diário"
            placeholder="Encontre uma palavra, um momento…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Filtrar por sentimento"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos os sentimentos</option>
          {Object.entries(moodLabels).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <span className="muted small">
          {entries.length} {entries.length === 1 ? 'entrada' : 'entradas'}
        </span>
      </div>
      {entries.length ? (
        <div className="entries-grid">
          {entries.map((entry) => (
            <article className="card entry-card" key={entry.id}>
              <div className="entry-meta">
                <time dateTime={entry.createdAt}>
                  {new Date(entry.createdAt).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <span className={`entry-mood mood-${entry.mood}`}>
                  <MoodFace value={entry.mood} size={19} />
                  {moodLabels[entry.mood]}
                </span>
              </div>
              <button
                className="entry-open"
                onClick={() => setEditor({ entry })}
              >
                <h2>{entry.title}</h2>
                <p>{entry.content}</p>
                <span>
                  Ler e editar <ArrowUpRightSmall />
                </span>
              </button>
              <div className="entry-footer">
                <span>Um registro seu.</span>
                <button
                  className="icon-button"
                  aria-label={`Apagar entrada: ${entry.title}`}
                  onClick={() => setRemove(entry)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen size={32} strokeWidth={1.2} />}
          title={
            query || filter !== 'all'
              ? 'Nenhum registro por aqui.'
              : 'Sua história começa com uma palavra.'
          }
          description={
            query || filter !== 'all'
              ? 'Tente outra palavra ou escolha todos os sentimentos.'
              : 'Pode ser uma frase, um desabafo ou uma pequena descoberta. Você escolhe o que quer guardar.'
          }
          action={
            query || filter !== 'all' ? (
              <button
                className="button secondary"
                onClick={() => {
                  setQuery('');
                  setFilter('all');
                }}
              >
                Limpar filtros
              </button>
            ) : (
              <button
                className="button secondary"
                onClick={() => setEditor({})}
              >
                <PenLine size={16} /> Escrever minha primeira entrada
              </button>
            )
          }
        />
      )}
      {editor && (
        <EntryEditor
          entry={editor.entry}
          prompt={editor.prompt}
          onClose={() => setEditor(null)}
        />
      )}
      {remove && (
        <Confirm
          title="Apagar este registro?"
          description="Essa entrada será apagada deste navegador. Esta ação não pode ser desfeita."
          label="Apagar entrada"
          danger
          onClose={() => setRemove(null)}
          onConfirm={() => {
            if (
              update((s) => ({
                ...s,
                entries: s.entries.filter((e) => e.id !== remove.id),
              }))
            ) {
              notify('Entrada apagada.');
              setRemove(null);
            }
          }}
        />
      )}
      <p className="page-note">
        Suas palavras ficam apenas neste navegador. Você pode exportá-las em Meu
        espaço.
      </p>
    </div>
  );
}
function ArrowUpRightSmall() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 12 12 4M4 4h8v8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
