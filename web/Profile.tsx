import React, { useEffect, useRef, useState } from 'react';
import {
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Leaf,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { AnimaState, localDate, parseState, STORAGE_KEY } from './domain/model';
import { downloadJSON, useAnima } from './Store';
import { Confirm, PageHeading } from './components/UI';
export default function Profile() {
  const { state, update, replace, reset, notify, storageError } = useAnima();
  const [name, setName] = useState(state.profile.name);
  const [intention, setIntention] = useState(state.profile.intention);
  const [deleteAll, setDeleteAll] = useState(false);
  const [incoming, setIncoming] = useState<AnimaState | null>(null);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setName(state.profile.name);
    setIntention(state.profile.intention);
  }, [state.profile.name, state.profile.intention]);
  async function importFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;
    if (selected.size > 10_000_000) {
      notify('Escolha um arquivo ANIMA com até 10 MB.');
      return;
    }
    try {
      const parsed = parseState(JSON.parse(await selected.text()));
      if (!parsed) throw new Error('invalid');
      setIncoming(parsed);
    } catch {
      notify(
        'Este arquivo não é um backup válido da ANIMA. Seus dados foram mantidos.',
      );
    }
  }
  return (
    <div className="page-enter">
      <PageHeading
        eyebrow="DO SEU JEITO"
        title="Meu espaço"
        description="Um lugar que respeita suas escolhas, seu ritmo e seus dados."
      />
      <div className="profile-grid">
        <section className="card settings-card">
          <div className="profile-heading">
            <span className="profile-big-avatar">
              {name ? (
                name.charAt(0).toLocaleUpperCase('pt-BR')
              ) : (
                <Leaf size={30} />
              )}
            </span>
            <div>
              <h2>Como quer estar aqui?</h2>
              <p className="muted">O primeiro passo pode ser se apresentar.</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                update((s) => ({
                  ...s,
                  profile: { ...s.profile, name: name.trim(), intention },
                }))
              )
                notify('Seu espaço foi atualizado.');
            }}
          >
            <label className="field">
              Como você gosta de ser chamado(a)?
              <input
                placeholder="Seu nome ou apelido"
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="field">
              O que você quer cultivar agora?
              <select
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
              >
                {[
                  'Encontrar mais calma',
                  'Me escutar com gentileza',
                  'Cuidar dos meus limites',
                  'Construir novos hábitos',
                  'Ter um momento para mim',
                  ...(![
                    'Encontrar mais calma',
                    'Me escutar com gentileza',
                    'Cuidar dos meus limites',
                    'Construir novos hábitos',
                    'Ter um momento para mim',
                  ].includes(intention)
                    ? [intention]
                    : []),
                ].map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </label>
            <p className="privacy-note">
              Você pode mudar sua intenção quando quiser. Não há uma meta a
              cumprir.
            </p>
            <button className="button primary" type="submit">
              <Check size={16} /> Salvar preferências
            </button>
          </form>
        </section>
        <section className="card privacy-card">
          <ShieldCheck size={28} strokeWidth={1.2} />
          <h2>O que fica aqui é seu.</h2>
          <p>
            Este MVP funciona sem conta. Diário, check-ins e práticas são salvos
            apenas no armazenamento deste navegador.
          </p>
          <ul>
            <li>Os dados não são enviados a um servidor.</li>
            <li>Não há senha ou criptografia do diário neste MVP.</li>
            <li>Quem usa este navegador pode acessar seus registros.</li>
            <li>
              Limpar os dados do navegador pode apagar sua jornada. Exporte uma
              cópia para guardá-la.
            </li>
          </ul>
          <span className="local-badge">
            <span /> Modo local · Sem sincronização
          </span>
        </section>
      </div>
      <section className="card data-card">
        <div>
          <h2>Você escolhe o que guardar.</h2>
          <p className="muted">
            {state.entries.length} entrada(s) no diário ·{' '}
            {state.checkIns.length} check-in(s) · {state.practices.length}{' '}
            prática(s)
          </p>
        </div>
        <div className="data-actions">
          <button
            className="button secondary"
            onClick={() => {
              downloadJSON(state, `anima-meus-dados-${localDate()}.json`);
              notify('Seu backup foi preparado para download.');
            }}
          >
            <Download size={16} /> Exportar meus dados
          </button>
          <button
            className="button secondary"
            onClick={() => file.current?.click()}
          >
            <Upload size={16} /> Importar backup
          </button>
          <input
            ref={file}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Selecionar backup da ANIMA"
            onChange={importFile}
          />
          <button
            className="text-button danger-text"
            onClick={() => setDeleteAll(true)}
          >
            <Trash2 size={15} /> Apagar todos os meus dados
          </button>
        </div>
        {storageError && (
          <button
            className="text-button"
            onClick={() => {
              try {
                downloadJSON(
                  { raw: localStorage.getItem(STORAGE_KEY) },
                  `anima-recuperacao-${localDate()}.json`,
                );
              } catch {
                notify('O navegador bloqueou a leitura do armazenamento.');
              }
            }}
          >
            Baixar cópia de recuperação <Download size={14} />
          </button>
        )}
      </section>
      <section className="about-anima">
        <h3>Sobre a ANIMA</h3>
        <p>
          Um espaço de autoconhecimento e reflexão. A conversa usa roteiros
          predefinidos; o mapa mostra apenas seus próprios registros. A ANIMA
          não oferece diagnóstico e não substitui profissionais de saúde ou
          serviços de emergência.
        </p>
        <a
          href="https://github.com/PDantas84/anima"
          target="_blank"
          rel="noreferrer"
        >
          Conhecer o projeto <ArrowUpRight size={14} />
        </a>
      </section>
      {deleteAll && (
        <Confirm
          title="Apagar sua jornada deste navegador?"
          description="Isso remove seu nome, diário, check-ins, ciclos, favoritos e carta. Exporte um backup antes, caso queira guardar uma cópia. A exclusão não pode ser desfeita."
          label="Apagar todos os dados"
          danger
          onClose={() => setDeleteAll(false)}
          onConfirm={() => {
            if (reset()) {
              setDeleteAll(false);
              notify('Seus dados foram apagados deste navegador.');
            }
          }}
        />
      )}{' '}
      {incoming && (
        <Confirm
          title="Restaurar este backup?"
          description={`O arquivo contém ${incoming.entries.length} entrada(s) e ${incoming.checkIns.length} check-in(s). Ele substituirá todos os dados atuais deste navegador. Exporte os dados atuais antes, se quiser preservá-los.`}
          label="Restaurar backup"
          onClose={() => setIncoming(null)}
          onConfirm={() => {
            if (replace(incoming)) {
              setIncoming(null);
              notify('Seu backup foi restaurado.');
            }
          }}
        />
      )}
    </div>
  );
}
