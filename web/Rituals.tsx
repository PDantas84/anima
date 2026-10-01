import React, { useState } from 'react';
import { Heart, Leaf } from 'lucide-react';
import { rituals, Ritual } from './domain/content';
import { useAnima } from './Store';
import { EmptyState, PageHeading, RitualCard } from './components/UI';
import { RitualDialog } from './components/RitualDialog';
export default function Rituals() {
  const { state, update, notify } = useAnima();
  const [filter, setFilter] = useState('Todos');
  const [selected, setSelected] = useState<Ritual | null>(null);
  const shown = rituals.filter(
    (r) =>
      filter === 'Todos' ||
      filter === r.category ||
      (filter === 'Favoritos' && state.favorites.includes(r.id)),
  );
  return (
    <div className="page-enter">
      <PageHeading
        eyebrow="CUIDADO EM PEQUENAS DOSES"
        title="Pequenos rituais"
        description="Às vezes, tudo o que você precisa é de alguns minutos para si."
      />
      <div className="ritual-banner">
        <div>
          <span className="eyebrow">MENOS PRESSA. MAIS PRESENÇA.</span>
          <h2>Faça espaço para respirar.</h2>
          <p>Você escolhe o tempo. A gente te acompanha na pausa.</p>
        </div>
        <Leaf size={74} strokeWidth={0.6} />
      </div>
      <div className="filter-tabs" role="group" aria-label="Filtrar rituais">
        {['Todos', 'Presença', 'Escrita', 'Cuidado', 'Favoritos'].map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f === 'Favoritos' && <Heart size={14} />} {f}
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="ritual-grid catalog">
          {shown.map((ritual) => (
            <div className="ritual-wrapper" key={ritual.id}>
              <RitualCard ritual={ritual} onOpen={() => setSelected(ritual)} />
              <button
                className={`favorite-button icon-button ${state.favorites.includes(ritual.id) ? 'is-favorite' : ''}`}
                aria-label={`${state.favorites.includes(ritual.id) ? 'Desfavoritar' : 'Favoritar'} ${ritual.title}`}
                aria-pressed={state.favorites.includes(ritual.id)}
                onClick={() => {
                  if (
                    update((s) => ({
                      ...s,
                      favorites: s.favorites.includes(ritual.id)
                        ? s.favorites.filter((id) => id !== ritual.id)
                        : [...s.favorites, ritual.id],
                    }))
                  )
                    notify(
                      state.favorites.includes(ritual.id)
                        ? 'Ritual removido dos favoritos.'
                        : 'Ritual guardado nos favoritos.',
                    );
                }}
              >
                <Heart
                  size={16}
                  fill={
                    state.favorites.includes(ritual.id)
                      ? 'currentColor'
                      : 'none'
                  }
                />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart size={32} />}
          title="Guarde o que te faz bem."
          description="Toque no coração de um ritual para encontrá-lo facilmente por aqui."
          action={
            <button
              className="button secondary"
              onClick={() => setFilter('Todos')}
            >
              Explorar rituais
            </button>
          }
        />
      )}
      {selected && (
        <RitualDialog ritual={selected} onClose={() => setSelected(null)} />
      )}
      <p className="page-note">
        {state.practices.length
          ? `${state.practices.length} prática(s) registrada(s) na sua jornada. Cada pausa tem valor.`
          : 'Não é uma lista de tarefas. É um convite para se cuidar.'}
      </p>
    </div>
  );
}
