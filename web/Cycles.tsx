import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  ArrowRight,
  Check,
  LockKeyhole,
  PenLine,
  Clock3,
  Orbit,
} from 'lucide-react';
import { cycles, Cycle } from './domain/content';
import { completeDay, localDate } from './domain/model';
import { useAnima } from './Store';
import { BrandMark, Dialog, PageHeading } from './components/UI';
export default function Cycles() {
  const { state, update, notify } = useAnima();
  const [selected, setSelected] = useState<Cycle | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const journey = selected ? state.journeys[selected.id] : null;
  const completed = journey?.completed.length ?? 0;
  function start(cycle: Cycle) {
    if (
      update((s) => ({
        ...s,
        activeCycle: cycle.id,
        journeys: {
          ...s.journeys,
          [cycle.id]: s.journeys[cycle.id] ?? {
            completed: [],
            lastCompletedOn: null,
            startedAt: new Date().toISOString(),
          },
        },
      }))
    ) {
      notify('Seu ciclo está pronto. Comece pelo primeiro encontro.');
    }
  }
  const close = () => {
    setSelected(null);
    setDay(null);
  };
  return (
    <div className="page-enter">
      <PageHeading
        eyebrow="UM PASSO DE CADA VEZ"
        title="Meus ciclos"
        description="Pequenos encontros diários. Um caminho que respeita o seu tempo."
      />
      <div className="cycle-intro">
        <Orbit size={20} />
        <p>
          Sete dias de reflexão, sem pressa para terminar. Se precisar pausar,
          seu caminho continua aqui.
        </p>
      </div>
      <div className="cycles-grid">
        {cycles.map((cycle, index) => {
          const progress = state.journeys[cycle.id]?.completed.length ?? 0;
          return (
            <article
              key={cycle.id}
              className={`cycle-card card ${cycle.color}`}
            >
              <div className="cycle-art">
                <div className={`cycle-symbol symbol-${index}`}>
                  <BrandMark size={100} />
                  <span />
                  <span />
                </div>
                <span className="subtle-pill">7 encontros</span>
                {state.activeCycle === cycle.id && (
                  <span className="active-cycle-label">Seu ciclo atual</span>
                )}
              </div>
              <div className="cycle-content">
                <span className="eyebrow">{cycle.category}</span>
                <h2>{cycle.title}</h2>
                <p>{cycle.description}</p>
                <div className="progress-label">
                  <span>
                    {progress
                      ? `${progress} de 7 encontros concluídos`
                      : 'Um novo caminho te espera'}
                  </span>
                  {progress === 7 && <Check size={16} />}
                </div>
                <div className="progress-track">
                  <span style={{ width: `${(progress / 7) * 100}%` }} />
                </div>
                <button
                  className="button secondary full"
                  onClick={() => setSelected(cycle)}
                >
                  {progress === 7
                    ? 'Revisitar ciclo'
                    : state.journeys[cycle.id]
                      ? 'Continuar meu ciclo'
                      : 'Conhecer este ciclo'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <div className="quote-card">
        <BrandMark size={38} />
        <p>
          “Você pode crescer sem deixar de ser gentil
          <br className="desktop-break" /> com quem é hoje.”
        </p>
        <span>UM LEMBRETE DA ANIMA</span>
      </div>
      {selected && (
        <Dialog
          title={
            day
              ? `Dia ${day} · ${selected.days[day - 1].title}`
              : selected.title
          }
          onClose={close}
          wide
        >
          {day ? (
            <div className="day-detail">
              <p className="day-reflection">
                {selected.days[day - 1].reflection}
              </p>
              <div className="exercise-box">
                <span className="eyebrow">O CONVITE DE HOJE</span>
                <p>{selected.days[day - 1].exercise}</p>
              </div>
              <p className="muted">
                Para levar ao diário: {selected.days[day - 1].prompt}
              </p>
              <button
                className="text-button"
                onClick={() => {
                  const prompt = selected.days[day - 1].prompt;
                  close();
                  router.push({
                    pathname: '/journal',
                    params: { new: '1', prompt },
                  });
                }}
              >
                <PenLine size={16} /> Escrever sobre este encontro{' '}
                <ArrowRight size={15} />
              </button>
              <div className="dialog-actions">
                <button
                  className="button secondary"
                  onClick={() => setDay(null)}
                >
                  Voltar ao ciclo
                </button>
                <button
                  className="button primary"
                  disabled={
                    day <= completed || journey?.lastCompletedOn === localDate()
                  }
                  onClick={() => {
                    if (update((s) => completeDay(s, selected.id, day))) {
                      setDay(null);
                      notify(
                        day === 7
                          ? 'Seu ciclo foi concluído. Que bom ter caminhado até aqui.'
                          : 'Encontro concluído. O próximo estará aqui amanhã.',
                      );
                    }
                  }}
                >
                  <Check size={16} />
                  {day <= completed
                    ? 'Encontro concluído'
                    : 'Concluir encontro'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="muted">{selected.description}</p>
              {!journey && (
                <button
                  className="button primary full"
                  onClick={() => start(selected)}
                >
                  Começar este ciclo <ArrowRight size={16} />
                </button>
              )}
              {journey && state.activeCycle !== selected.id && (
                <button className="text-button" onClick={() => start(selected)}>
                  Tornar meu ciclo atual
                </button>
              )}
              <div className="cycle-day-list">
                {selected.days.map((item, index) => {
                  const done = index < completed;
                  const waiting =
                    index === completed &&
                    journey?.lastCompletedOn === localDate();
                  const locked = !journey || index > completed || waiting;
                  return (
                    <button
                      key={item.title}
                      disabled={!!locked}
                      onClick={() => setDay(index + 1)}
                      className={`cycle-day ${done ? 'done' : ''}`}
                    >
                      <span className="day-number">
                        {done ? <Check size={17} /> : index + 1}
                      </span>
                      <span>
                        <strong>{item.title}</strong>
                        <small>
                          {done
                            ? 'Concluído · Releia quando quiser'
                            : waiting
                              ? 'Seu próximo encontro, amanhã'
                              : index === completed && journey
                                ? 'Pronto para você'
                                : 'Um encontro por dia'}
                        </small>
                      </span>
                      {locked ? (
                        <LockKeyhole size={15} />
                      ) : (
                        <ArrowRight size={17} />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="privacy-note">
                <Clock3 size={14} /> Cada encontro leva cerca de 5 minutos. Não
                há penalidade por pausar.
              </p>
            </>
          )}
        </Dialog>
      )}
    </div>
  );
}
