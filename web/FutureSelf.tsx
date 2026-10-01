import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useAnima } from './Store';
import { PageHeading } from './components/UI';
export default function FutureSelf() {
  const { state, update, notify } = useAnima();
  const [letter, setLetter] = useState(state.profile.futureLetter);
  return (
    <div className="page-enter">
      <PageHeading
        eyebrow="UM ENCONTRO COM O QUE VEM"
        title="Meu eu futuro"
        description="Uma carta sua, para a pessoa que você está se tornando."
      />
      <div className="future-layout">
        <aside className="future-prompts">
          <Sparkles size={31} strokeWidth={1} />
          <h2>
            Não precisa prever.
            <br />
            <em>Só imaginar.</em>
          </h2>
          <p>
            Escreva para você daqui a algum tempo. Guarde uma intenção, um
            lembrete ou uma esperança.
          </p>
          <ul>
            <li>O que eu gostaria de continuar cultivando?</li>
            <li>O que quero me lembrar de agradecer?</li>
            <li>Qual pequeno cuidado quero levar comigo?</li>
          </ul>
          <span className="eyebrow">SEM PRAZO PARA FLORESCER.</span>
        </aside>
        <form
          className="card letter-paper"
          onSubmit={(e) => {
            e.preventDefault();
            if (
              update((s) => ({
                ...s,
                profile: { ...s.profile, futureLetter: letter.trim() },
              }))
            )
              notify('Sua carta foi guardada neste navegador.');
          }}
        >
          <label className="field">
            <span>Querido eu do futuro,</span>
            <textarea
              aria-label="Carta para meu eu futuro"
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              maxLength={12000}
              rows={15}
              placeholder="Espero que, quando você ler estas palavras…"
            />
          </label>
          <div className="letter-footer">
            <span>
              Com carinho,
              <br />
              {state.profile.name || 'seu eu de hoje'}
            </span>
            <button className="button primary" type="submit">
              <Check size={16} /> Guardar minha carta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
