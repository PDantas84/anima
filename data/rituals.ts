export type Ritual = {
  id: string;
  title: string;
  category: string;
  duration: number;
  objective: string;
  instructions: string;
  closing: string;
};

export const rituals: Ritual[] = [
  { id: 'r1', title: 'Carta para a versao que sobreviveu', category: 'Morte da Mascara', duration: 12, objective: 'Reconhecer a parte de voce que fez o possivel com o que tinha.', instructions: 'Escreva uma carta para a versao sua que precisou ser forte antes da hora. Nao tente corrigir essa versao. Apenas reconheca o que ela carregou.', closing: 'Respire fundo e diga: obrigada. Agora eu posso tentar de outro jeito.' },
  { id: 'r2', title: 'Tres respiracoes, tres verdades', category: 'Encontro com a Sombra', duration: 6, objective: 'Nomear o que a mente evita.', instructions: 'Tres respiracoes longas. Em cada expiracao, diga em voz baixa uma verdade sua. Nao julgue.', closing: 'Escreva as tres verdades no seu diario.' },
  { id: 'r3', title: 'Ritual de perdao sem reconciliacao', category: 'Perdao', duration: 15, objective: 'Soltar uma divida interior sem precisar reaproximar.', instructions: 'Escreva o nome de quem voce quer perdoar e o que voce libera. Nao precisa reconciliar. Precisa soltar.', closing: 'Leia em voz baixa e rasgue o papel ou guarde em um envelope.' },
  { id: 'r4', title: 'Quebra de ciclo familiar', category: 'Familia', duration: 20, objective: 'Escolher conscientemente o que para em voce.', instructions: 'Escreva um padrao que veio antes de voce. Escreva a frase: isso para aqui, em mim, com amor.', closing: 'Repita a frase ao acordar durante tres dias.' },
  { id: 'r5', title: 'Carta para a menina', category: 'Retorno da Inocencia', duration: 12, objective: 'Reencontrar a menina que ficou.', instructions: 'Escreva uma carta para voce aos sete anos. Conte que voce esta aqui agora.', closing: 'Guarde a carta em um lugar especial.' },
  { id: 'r6', title: 'Limite doce', category: 'Limites', duration: 8, objective: 'Praticar um nao sem culpa.', instructions: 'Escreva um nao que voce precisa dar. Treine a frase em voz alta tres vezes.', closing: 'Envie o nao hoje, se possivel.' },
  { id: 'r7', title: 'Ancora corporal', category: 'Corpo', duration: 5, objective: 'Voltar ao corpo.', instructions: 'Nomeie 5 coisas que ve, 4 que sente, 3 sons, 2 cheiros e 1 acao segura agora.', closing: 'Respire por tres ciclos longos.' },
];
