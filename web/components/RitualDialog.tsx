import React, { useEffect, useRef, useState } from 'react';
import { Check, Pause, Play, RotateCcw, PenLine } from 'lucide-react';
import { router } from 'expo-router';
import { Ritual } from '../domain/content';
import { useAnima } from '../Store';
import { Dialog, RitualIcon } from './UI';
export function RitualDialog({
  ritual,
  onClose,
}: {
  ritual: Ritual;
  onClose: () => void;
}) {
  const { update, notify } = useAnima();
  const duration = ritual.minutes * 60;
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const [saved, setSaved] = useState(false);
  const deadline = useRef(0);
  useEffect(() => {
    if (!running) return;
    deadline.current = Date.now() + remaining * 1000;
    const timer = setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(left);
      if (!left) setRunning(false);
    }, 200);
    return () => clearInterval(timer);
    // The deadline is established only on start/resume, not on every clock tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);
  const phase = (duration - remaining) % 10 < 4 ? 'Inspire' : 'Solte o ar';
  function complete() {
    if (saved) return;
    if (
      update((state) => ({
        ...state,
        practices: [
          ...state.practices,
          {
            id: crypto.randomUUID(),
            ritualId: ritual.id,
            completedAt: new Date().toISOString(),
          },
        ],
      }))
    ) {
      setRunning(false);
      setSaved(true);
      notify('Prática registrada. Um pequeno cuidado faz parte da jornada.');
    }
  }
  return (
    <Dialog title={ritual.title} onClose={onClose}>
      {saved ? (
        <div className="practice-complete">
          <div className="completion-mark">
            <Check size={36} />
          </div>
          <h3>Guarde esse momento.</h3>
          <p className="muted">{ritual.prompt}</p>
          <button
            className="button primary"
            onClick={() => {
              onClose();
              router.push({
                pathname: '/journal',
                params: { prompt: ritual.prompt, new: '1' },
              });
            }}
          >
            <PenLine size={16} /> Levar para o diário
          </button>
          <button className="text-button" onClick={onClose}>
            Voltar ao meu espaço
          </button>
        </div>
      ) : (
        <>
          <p className="muted">
            {ritual.subtitle} Acompanhe o tempo ou conclua quando fizer sentido
            para você.
          </p>
          <div
            className={`breath-scene ${running ? 'is-running' : ''} ${ritual.color}`}
          >
            <div className="breath-ring" />
            <div className="breath-orb">
              <RitualIcon icon={ritual.icon} size={24} />
              <strong>
                {running && ritual.id === 'breath'
                  ? phase
                  : remaining === 0
                    ? 'Sua pausa'
                    : 'No seu ritmo'}
              </strong>
              <span className="timer" role="timer" aria-label="Tempo restante">
                {Math.floor(remaining / 60)}:
                {String(remaining % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="timer-controls">
            <button
              className="icon-button"
              aria-label="Reiniciar cronômetro"
              onClick={() => {
                setRunning(false);
                setRemaining(duration);
              }}
            >
              <RotateCcw size={17} />
            </button>
            <button
              className="button secondary"
              disabled={remaining === 0}
              onClick={() => setRunning(!running)}
            >
              {running ? <Pause size={16} /> : <Play size={16} />}{' '}
              {running
                ? 'Pausar'
                : remaining < duration
                  ? 'Continuar'
                  : 'Começar a pausa'}
            </button>
          </div>
          <ol className="practice-steps">
            {ritual.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <button className="button primary full" onClick={complete}>
            <Check size={17} /> Concluir prática
          </button>
        </>
      )}
    </Dialog>
  );
}
