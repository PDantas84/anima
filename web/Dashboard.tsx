import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  PenLine,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useAnima } from './Store';
import {
  localDate,
  moodLabels,
  saveCheckIn,
  weekDays,
  presenceDays,
} from './domain/model';
import { cycles, rituals, Ritual } from './domain/content';
import {
  BrandMark,
  MoodPicker,
  RitualCard,
  SectionHeading,
} from './components/UI';
import { RitualDialog } from './components/RitualDialog';
export default function Dashboard() {
  const { state, update, notify } = useAnima();
  const [ritual, setRitual] = useState<Ritual | null>(null);
  const today = state.checkIns.find((c) => c.date === localDate());
  const cycle = cycles.find((c) => c.id === state.activeCycle) ?? cycles[0];
  const journey = state.journeys[cycle.id];
  const completed = journey?.completed.length ?? 0;
  const presence = presenceDays(state);
  const days = weekDays();
  const date = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return (
    <div className="page-enter dashboard">
      <div className="home-heading">
        <div>
          <p className="eyebrow">
            <Sun size={14} />
            {date}
          </p>
          <h1>
            {state.profile.name
              ? `Que bom te ver, ${state.profile.name.split(' ')[0]}.`
              : 'Que bom ter você aqui.'}
          </h1>
          <p>Respire. Você não precisa dar conta de tudo agora.</p>
        </div>
        <button
          className="text-button quiet"
          onClick={() => router.push('/profile')}
        >
          {state.profile.name
            ? 'Meu espaço'
            : 'Deixe este espaço com a sua cara'}
          <ArrowUpRight size={15} />
        </button>
      </div>
      <div className="hero-grid">
        <section className="hero-card">
          <div className="hero-shade" />
          <div className="hero-content">
            <span className="hero-eyebrow">
              <span /> UM PEQUENO CONVITE
            </span>
            <h2>
              O mundo pode esperar.
              <br />
              <em>Esse momento é seu.</em>
            </h2>
            <p>
              Encontre um pouco de calma
              <br />
              em uma pausa de um minuto.
            </p>
            <div className="hero-actions">
              <button
                className="button cream"
                onClick={() => setRitual(rituals[0])}
              >
                Fazer uma pausa <ArrowRight size={17} />
              </button>
              <span>
                <Clock3 size={13} /> 1 min
              </span>
            </div>
          </div>
          <span className="hero-caption">PRESENÇA, NÃO PERFEIÇÃO.</span>
        </section>
        <section className="card checkin-card">
          <span className="eyebrow">
            SEU CHECK-IN DIÁRIO <span className="tiny-star">✧</span>
          </span>
          <h2>
            Como está seu
            <br />
            mundo aí dentro?
          </h2>
          <p>Todos os sentimentos têm lugar aqui.</p>
          <MoodPicker
            value={today?.mood}
            onChange={(mood) => {
              if (update((s) => saveCheckIn(s, mood)))
                notify('Check-in salvo. Obrigado por se escutar.');
            }}
          />
          <div className={`checkin-note ${today ? 'has-checkin' : ''}`}>
            {today ? (
              <>
                <Check size={13} /> Hoje: {moodLabels[today.mood].toLowerCase()}
                . Você pode atualizar.
              </>
            ) : (
              'Escolha o que mais se aproxima de você.'
            )}
          </div>
        </section>
      </div>
      <div className="journey-grid">
        <section className="card journey-card">
          <div className="section-heading">
            <span className="eyebrow">
              {journey ? 'SUA TRAVESSIA' : 'UM CAMINHO PARA COMEÇAR'}
            </span>
            <span className="subtle-pill">7 dias · No seu ritmo</span>
          </div>
          <div className="journey-body">
            <div className="journey-illustration">
              <BrandMark size={75} />
              <span className="orbit-line" />
            </div>
            <div className="journey-copy">
              <h2>{cycle.title}</h2>
              <p>
                {completed === 7
                  ? 'Um ciclo inteiro de cuidado. Releia o que descobriu pelo caminho.'
                  : journey
                    ? cycle.days[completed].title
                    : cycle.description}
              </p>
              <div
                className="journey-days"
                aria-label={`${completed} de 7 dias concluídos`}
              >
                {Array.from({ length: 7 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < completed
                        ? 'done'
                        : journey && i === completed
                          ? 'current'
                          : ''
                    }
                  >
                    {i < completed ? <Check size={11} /> : i + 1}
                  </span>
                ))}
                <small>{completed}/7</small>
              </div>
            </div>
            <button
              className="round-button"
              aria-label={
                journey ? 'Continuar meu ciclo' : 'Explorar meu primeiro ciclo'
              }
              onClick={() => router.push('/cycles')}
            >
              <ArrowRight size={21} />
            </button>
          </div>
        </section>
        <section className="card presence-card">
          <div className="section-heading">
            <span className="eyebrow">SEUS MOMENTOS DE PRESENÇA</span>
            <Sparkles size={15} />
          </div>
          <div className="week-dots">
            {days.map((day) => (
              <div key={day.key}>
                <span
                  className={`${presence.has(day.key) ? 'present' : ''} ${day.key === localDate() ? 'today' : ''}`}
                  aria-label={`${day.label}: ${presence.has(day.key) ? 'presença registrada' : 'sem registro'}`}
                >
                  {presence.has(day.key) ? <Check size={12} /> : '·'}
                </span>
                <small>{day.label}</small>
              </div>
            ))}
          </div>
          <p>
            {presence.size
              ? `${days.filter((d) => presence.has(d.key)).length} dia(s) de cuidado nesta semana.`
              : 'Cada pequeno encontro com você conta.'}
            <br />
            <span>Sem cobranças. Sem dias perdidos.</span>
          </p>
        </section>
      </div>
      <SectionHeading
        title="Pequenos rituais, novos espaços"
        subtitle="Escolha o cuidado que cabe no seu agora."
        action={
          <button
            className="text-button"
            onClick={() => router.push('/rituals')}
          >
            Ver todos <ArrowRight size={15} />
          </button>
        }
      />
      <div className="ritual-grid home-rituals">
        {[rituals[1], rituals[2], rituals[3]].map((r) => (
          <RitualCard
            key={r.id}
            ritual={r}
            onOpen={() => setRitual(r)}
            compact
          />
        ))}
      </div>
      <section className="journal-nudge">
        <span className="nudge-icon">
          <PenLine size={23} strokeWidth={1.3} />
        </span>
        <div>
          <span className="eyebrow">UMA PERGUNTA PARA LEVAR COM VOCÊ</span>
          <p>O que você precisa ouvir de si hoje?</p>
        </div>
        <button
          className="text-button"
          onClick={() =>
            router.push({
              pathname: '/journal',
              params: {
                new: '1',
                prompt: 'O que eu preciso ouvir de mim hoje?',
              },
            })
          }
        >
          Escrever no diário <ArrowUpRight size={16} />
        </button>
      </section>
      {ritual && (
        <RitualDialog ritual={ritual} onClose={() => setRitual(null)} />
      )}
    </div>
  );
}
