import React from 'react';
import {
  ArrowUpRight,
  HeartHandshake,
  Phone,
  ShieldCheck,
  Users,
  Wind,
} from 'lucide-react';
import { router } from 'expo-router';
import { PageHeading } from './components/UI';
export default function Support() {
  return (
    <div className="page-enter support-page">
      <PageHeading
        eyebrow="VOCÊ MERECE CUIDADO"
        title="Não precisa passar por isso só."
        description="Se as coisas estiverem difíceis, buscar uma pessoa é um passo importante."
      />
      <div className="urgent-notice">
        <ShieldCheck size={24} />
        <div>
          <h2>Se há perigo imediato, procure uma emergência.</h2>
          <p>
            Se você já se feriu ou corre risco agora, ligue para o SAMU 192 ou
            vá ao pronto-socorro. Se puder, peça a alguém de confiança para
            ficar com você.
          </p>
          <a className="button primary" href="tel:192">
            <Phone size={16} /> Ligar para o SAMU · 192
          </a>
        </div>
      </div>
      <div className="support-grid">
        <section className="card support-card">
          <HeartHandshake size={28} strokeWidth={1.3} />
          <h2>Alguém para te escutar.</h2>
          <p>
            O CVV oferece apoio emocional gratuito e sigiloso pelo telefone 188,
            24 horas por dia, no Brasil.
          </p>
          <a href="tel:188" className="button secondary">
            <Phone size={16} /> Ligar para o CVV · 188
          </a>
          <a
            className="text-button"
            href="https://cvv.org.br/"
            target="_blank"
            rel="noreferrer"
          >
            Conhecer outras formas de atendimento <ArrowUpRight size={14} />
          </a>
        </section>
        <section className="card support-card">
          <Users size={28} strokeWidth={1.3} />
          <h2>Procure uma presença de confiança.</h2>
          <p>
            Se for possível, chame alguém próximo. Você pode dizer algo simples:
          </p>
          <blockquote>
            “Não estou bem e preciso de companhia. Você pode ficar comigo um
            pouco?”
          </blockquote>
          <p className="small muted">
            Um profissional de saúde também pode ajudar a encontrar o cuidado
            adequado.
          </p>
        </section>
      </div>
      <div className="support-ground">
        <Wind size={21} />
        <p>
          Enquanto busca apoio, tente apoiar os pés no chão e perceber o que
          está ao seu redor, se isso for confortável.
        </p>
        <button className="text-button" onClick={() => router.push('/rituals')}>
          Ver uma prática de presença <ArrowUpRight size={15} />
        </button>
      </div>
      <p className="page-note">
        A ANIMA não é um serviço de emergência, não monitora suas mensagens e
        não aciona ajuda por você. Fora do Brasil, procure os serviços locais.
      </p>
      <p className="support-sources">
        Informações:{' '}
        <a href="https://cvv.org.br/o-cvv/" target="_blank" rel="noreferrer">
          CVV
        </a>{' '}
        ·{' '}
        <a
          href="https://www.gov.br/saude/pt-br/composicao/saes/samu-192"
          target="_blank"
          rel="noreferrer"
        >
          Ministério da Saúde — SAMU 192
        </a>
      </p>
    </div>
  );
}
