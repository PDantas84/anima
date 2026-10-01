const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
/** A small keyword-based safety net, not a clinical risk assessment. Help is always available. */
export function needsImmediateSupport(text: string): boolean {
  const normalized = normalize(text);
  return /\b(suicidio|suicidar|me matar|quero morrer|nao quero (mais )?viver|tirar minha vida|acabar com minha vida|me machucar|me cortar|me ferir|overdose|matar alguem|machucar alguem)\b/.test(
    normalized,
  );
}
export const supportMessage =
  'Sinto muito que esteja passando por isso. Sua segurança merece atenção agora. Se houver perigo imediato ou você já tiver se ferido, ligue para o SAMU 192 ou vá a uma emergência. Para conversar, o CVV atende no 188, 24 horas. Se puder, chame alguém de confiança para ficar com você. Esta ferramenta não consegue avaliar ou acompanhar uma emergência.';
export function guidedReply(
  text: string,
  turn = 0,
): { content: string; urgent: boolean } {
  if (needsImmediateSupport(text))
    return { content: supportMessage, urgent: true };
  const normalized = normalize(text);
  if (turn >= 2)
    return {
      content:
        'Para fechar esta reflexão, qual seria um passo pequeno e possível para cuidar de você hoje? Você pode guardar o que descobriu no diário ou fazer uma pausa. Não precisa encontrar todas as respostas agora.',
      urgent: false,
    };
  if (turn === 1)
    return {
      content:
        'Obrigado por colocar isso em palavras. Olhando para o que escreveu, do que você mais precisa neste momento: descanso, espaço, companhia ou outra coisa? Escolha o que fizer sentido para você.',
      urgent: false,
    };
  if (/\b(cansad[oa]|cansaco|exaust[oa]|esgotad[oa]|sono)\b/.test(normalized))
    return {
      content:
        'Você trouxe o cansaço para esta conversa. Se quiser explorar um pouco: o que tem pedido mais energia nos últimos dias? Há alguma tarefa que possa ser adiada ou compartilhada?',
      urgent: false,
    };
  if (/\b(ansiedade|ansios[oa]|medo|preocupad[oa])\b/.test(normalized))
    return {
      content:
        'Pode ser difícil ficar com essa sensação. Você pode fazer uma pausa antes de continuar. O que está sob seu alcance agora, mesmo que seja algo pequeno?',
      urgent: false,
    };
  if (/\b(triste|tristeza|sozinh[oa]|solidao|choro)\b/.test(normalized))
    return {
      content:
        'Você pode falar disso no seu ritmo. O que costuma trazer um pouco de conforto quando se sente assim? Se fizer sentido, pense também em alguém de confiança com quem gostaria de conversar.',
      urgent: false,
    };
  return {
    content:
      'Vamos olhar para isso com calma. Qual parte do que você escreveu mais pede sua atenção agora? Você pode começar por uma situação concreta ou por uma sensação, sem precisar explicar tudo.',
    urgent: false,
  };
}
