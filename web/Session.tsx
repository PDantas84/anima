import React, { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import {
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  Leaf,
  MessageCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Wind,
} from 'lucide-react';
import { guidedReply } from './domain/conversation';
import { useAnima } from './Store';
import { BrandMark, Confirm, PageHeading } from './components/UI';
type Message = { role: 'user' | 'guide'; content: string };
const intentions = [
  {
    title: 'Entender o que estou sentindo',
    subtitle: 'Dar nome ao que está aqui.',
    icon: MessageCircle,
    greeting:
      'Vamos começar pelo presente. Se você pudesse escolher uma palavra para o que sente agora, qual seria? Pode contar um pouco do que aconteceu também.',
  },
  {
    title: 'Organizar meus pensamentos',
    subtitle: 'Uma coisa de cada vez.',
    icon: Wind,
    greeting:
      'Você pode começar colocando em palavras uma situação que tem ocupado seus pensamentos. Qual parte gostaria de explorar primeiro?',
  },
  {
    title: 'Encontrar um pequeno próximo passo',
    subtitle: 'O possível também é valioso.',
    icon: Leaf,
    greeting:
      'Pense em algo de que gostaria de cuidar hoje. O que está acontecendo e que mudança pequena faria diferença para você?',
  },
  {
    title: 'Fazer espaço para mim',
    subtitle: 'Ouvir suas próprias necessidades.',
    icon: Sparkles,
    greeting:
      'Este momento pode ser seu. Como foi seu dia até aqui? Há alguma necessidade sua que ficou para depois?',
  },
];
export default function Session() {
  const { update, notify } = useAnima();
  const [intent, setIntent] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (messages.length > 1)
      end.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'nearest',
      });
  }, [messages]);
  function send(event?: React.FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || urgent) return;
    const reply = guidedReply(
      text,
      messages.filter((m) => m.role === 'user').length,
    );
    setMessages((m) => [
      ...m,
      { role: 'user', content: text },
      { role: 'guide', content: reply.content },
    ]);
    setInput('');
    setUrgent(reply.urgent);
    setSaved(false);
    textarea.current?.focus();
  }
  function save() {
    if (saved) return;
    const now = new Date().toISOString();
    const content = messages
      .map((m) => `${m.role === 'user' ? 'Eu' : 'Roteiro ANIMA'}: ${m.content}`)
      .join('\n\n')
      .slice(0, 12000);
    if (
      update((s) => ({
        ...s,
        entries: [
          {
            id: crypto.randomUUID(),
            title: intent ?? 'Minha reflexão',
            content,
            mood: 3,
            createdAt: now,
            updatedAt: now,
          },
          ...s.entries,
        ],
      }))
    ) {
      setSaved(true);
      notify('Reflexão guardada no diário.');
    }
  }
  return (
    <div className="page-enter session-page">
      <PageHeading
        eyebrow="UMA CONVERSA COM SEU AGORA"
        title="Conversa guiada"
        description="Perguntas para se escutar com um pouco mais de gentileza."
      />
      <div className="guide-disclosure">
        <ShieldCheck size={17} />
        <span>
          Roteiro de reflexão com respostas predefinidas. Não é IA generativa,
          terapia ou atendimento profissional.
        </span>
      </div>
      {!intent ? (
        <>
          <div className="session-intro">
            <div className="guide-orb">
              <BrandMark size={52} />
            </div>
            <h2>Por onde você quer começar?</h2>
            <p>Escolha uma intenção. Não precisa ter todas as respostas.</p>
          </div>
          <div className="intent-grid">
            {intentions.map((item) => (
              <button
                key={item.title}
                className="card intent-card"
                onClick={() => {
                  setIntent(item.title);
                  setMessages([{ role: 'guide', content: item.greeting }]);
                }}
              >
                <span className="intent-icon">
                  <item.icon size={22} strokeWidth={1.3} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
          <p className="page-note">
            A conversa é temporária. Você escolhe se quer guardá-la no diário.
          </p>
        </>
      ) : (
        <section className="chat-card card">
          <div className="chat-header">
            <div className="guide-avatar">
              <BrandMark size={28} />
            </div>
            <div>
              <strong>{intent}</strong>
              <span>Reflexão guiada · No seu ritmo</span>
            </div>
            <button
              className="icon-button"
              aria-label="Recomeçar conversa"
              onClick={() => setConfirm(true)}
            >
              <RefreshCw size={17} />
            </button>
          </div>
          <div
            className="messages"
            role="log"
            aria-label="Conversa guiada"
            aria-live="polite"
          >
            {messages.map((message, i) => (
              <div key={i} className={`message ${message.role}`}>
                <span className="message-author">
                  {message.role === 'guide' ? 'ANIMA · ROTEIRO' : 'VOCÊ'}
                </span>
                <p>{message.content}</p>
              </div>
            ))}
            {urgent && (
              <div className="urgent-chat">
                <button
                  className="button primary"
                  onClick={() => router.push('/crisis')}
                >
                  Ver opções de apoio <ArrowRight size={16} />
                </button>
                <a className="button secondary" href="tel:188">
                  Ligar para o CVV · 188
                </a>
              </div>
            )}
            <div ref={end} />
          </div>
          {!urgent && (
            <form className="chat-composer" onSubmit={send}>
              <textarea
                ref={textarea}
                aria-label="Sua mensagem"
                placeholder="O que está vivo em você agora?"
                value={input}
                maxLength={2000}
                rows={2}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing
                  ) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button
                aria-label="Enviar mensagem"
                className="send-button"
                type="submit"
                disabled={!input.trim()}
              >
                <ArrowUp size={20} />
              </button>
            </form>
          )}
          <div className="chat-bottom">
            <span>
              {urgent
                ? 'Procure apoio humano. A ANIMA não acompanha emergências.'
                : 'Enter envia · Shift + Enter cria uma nova linha'}
            </span>
            {messages.some((m) => m.role === 'user') && (
              <button className="text-button" disabled={saved} onClick={save}>
                {saved ? <Check size={14} /> : <BookOpen size={14} />}{' '}
                {saved ? 'Guardado no diário' : 'Guardar no diário'}
              </button>
            )}
          </div>
        </section>
      )}
      {confirm && (
        <Confirm
          title="Começar uma nova conversa?"
          description="A conversa atual será encerrada. Se quiser mantê-la, cancele e use Guardar no diário primeiro."
          label="Recomeçar"
          onClose={() => setConfirm(false)}
          onConfirm={() => {
            setIntent(null);
            setMessages([]);
            setInput('');
            setUrgent(false);
            setSaved(false);
            setConfirm(false);
          }}
        />
      )}
    </div>
  );
}
