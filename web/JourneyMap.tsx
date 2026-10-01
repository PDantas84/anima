import React from 'react';
import { router } from 'expo-router';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Leaf,
  Orbit,
  PenLine,
  Sparkles,
} from 'lucide-react';
import { useAnima } from './Store';
import { localDate, moodLabels, presenceDays, weekDays } from './domain/model';
import { cycles } from './domain/content';
import { BrandMark, PageHeading, SectionHeading } from './components/UI';
export default function JourneyMap() {
  const { state } = useAnima();
  const days = weekDays();
  const presence = presenceDays(state);
  const active = cycles.find((c) => c.id === state.activeCycle);
  return (
    <div className="page-enter">
      <PageHeading
        eyebrow="O CAMINHO QUE VOCÊ CONSTRÓI"
        title="Mapa da jornada"
        description="Pequenos registros, vistos com mais espaço e perspectiva."
      />
      <div className="map-intention">
        <BrandMark size={44} />
        <div>
          <span className="eyebrow">SUA INTENÇÃO NESTE MOMENTO</span>
          <h2>{state.profile.intention}</h2>
        </div>
        <button className="text-button" onClick={() => router.push('/profile')}>
          Revisitar <ArrowRight size={15} />
        </button>
      </div>
      <div className="stats-grid">
        {[
          {
            icon: CalendarDays,
            number: presence.size,
            label: 'dias com presença',
          },
          {
            icon: BookOpen,
            number: state.entries.length,
            label: 'registros no diário',
          },
          {
            icon: Leaf,
            number: state.practices.length,
            label: 'rituais realizados',
          },
          {
            icon: Orbit,
            number: Object.values(state.journeys).reduce(
              (sum, j) => sum + j.completed.length,
              0,
            ),
            label: 'encontros nos ciclos',
          },
        ].map((stat) => (
          <div className="card stat-card" key={stat.label}>
            <stat.icon size={19} />
            <strong>{stat.number}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <section className="card chart-card">
        <SectionHeading
          title="Como você tem se sentido"
          subtitle="Seus check-ins nos últimos sete dias. Todo sentimento tem espaço."
        />
        <div
          className="mood-chart"
          role="img"
          aria-label={days
            .map(
              (day) =>
                `${day.label}: ${state.checkIns.find((c) => c.date === day.key) ? moodLabels[state.checkIns.find((c) => c.date === day.key)!.mood] : 'sem registro'}`,
            )
            .join('; ')}
        >
          <div className="chart-labels">
            <span>Em paz</span>
            <span>Assim assim</span>
            <span>Difícil</span>
          </div>
          <div className="chart-plot">
            <div className="chart-grid-lines">
              <i />
              <i />
              <i />
            </div>
            {days.map((day) => {
              const checkIn = state.checkIns.find((c) => c.date === day.key);
              return (
                <div
                  className={`chart-column ${day.key === localDate() ? 'is-today' : ''}`}
                  key={day.key}
                >
                  {checkIn ? (
                    <div
                      className={`chart-point mood-${checkIn.mood}`}
                      style={{ bottom: `${20 + (checkIn.mood - 1) * 36}px` }}
                    >
                      <span />
                      <small>{moodLabels[checkIn.mood]}</small>
                    </div>
                  ) : (
                    <span className="chart-missing" aria-hidden="true">
                      —
                    </span>
                  )}
                  <span className="chart-day">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="chart-note">
          {state.checkIns.length
            ? 'Os pontos representam o que você registrou. Eles não são uma avaliação da sua saúde.'
            : 'Seu primeiro check-in começa a desenhar este mapa. Dias sem registro ficam em branco.'}
        </p>
      </section>
      <div className="map-bottom-grid">
        <section className="card map-path">
          <span className="eyebrow">SUA TRAVESSIA ATUAL</span>
          <h2>{active ? active.title : 'Um caminho pode começar hoje.'}</h2>
          <p>
            {active
              ? `${state.journeys[active.id]?.completed.length ?? 0} de 7 encontros concluídos. Cada passo é uma oportunidade de se ouvir.`
              : 'Explore um ciclo de sete encontros para cultivar um pouco mais de presença.'}
          </p>
          <button
            className="text-button"
            onClick={() => router.push('/cycles')}
          >
            {active ? 'Voltar ao meu ciclo' : 'Conhecer os ciclos'}
            <ArrowRight size={16} />
          </button>
        </section>
        <section className="card future-card">
          <Sparkles size={25} strokeWidth={1.2} />
          <span className="eyebrow">UMA CARTA PARA O QUE VEM</span>
          <h2>Quem você está se tornando?</h2>
          <p>Deixe algumas palavras para o seu eu futuro.</p>
          <button
            className="text-button"
            onClick={() => router.push('/future-self')}
          >
            <PenLine size={15} />{' '}
            {state.profile.futureLetter
              ? 'Revisitar minha carta'
              : 'Escrever minha carta'}
            <ArrowRight size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}
