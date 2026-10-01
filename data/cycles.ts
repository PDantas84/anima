export type CycleDay = {
  day: number;
  title: string;
  reflection: string;
  exercise: string;
  task: string;
  prompt: string;
};

export type Cycle = {
  id: string;
  title: string;
  duration: number;
  objective: string;
  description: string;
  days: CycleDay[];
};

const maskDays: CycleDay[] = [
  { day: 1, title: 'A mascara que voce veste sem perceber', reflection: 'Todas nos construimos um rosto para o mundo. Hoje apenas observamos qual rosto voce usou ao acordar.', exercise: 'Escreva qual foi a primeira mascara que voce usou hoje e para quem.', task: 'Por cinco minutos, fique em silencio sem produzir nada.', prompt: 'Qual mascara me protegeu e qual me aprisionou hoje?' },
  { day: 2, title: 'A voz da Forte Doce', reflection: 'A mulher que aguenta tudo tambem precisa ser aguentada.', exercise: 'Escreva uma carta curta para essa parte sua.', task: 'Peça uma ajuda pequena hoje, mesmo que pareça bobo.', prompt: 'O que eu nunca admito precisar?' },
  { day: 3, title: 'O que voce finge que nao sente', reflection: 'Nomear o que esta escondido e o primeiro ato de liberdade.', exercise: 'Liste tres sentimentos que voce disfarca com sorriso.', task: 'Diga em voz alta um desses sentimentos quando ninguem estiver ouvindo.', prompt: 'O que meu sorriso esconde com mais frequencia?' },
  { day: 4, title: 'Limites suaves', reflection: 'Dizer nao tambem e uma forma de cuidado.', exercise: 'Escreva um nao que voce precisa dar essa semana.', task: 'Pratique um nao pequeno ainda hoje.', prompt: 'A quem eu tenho medo de decepcionar?' },
  { day: 5, title: 'Receber', reflection: 'Voce aprendeu a dar. Hoje comecamos a lembrar de receber.', exercise: 'Escreva tres coisas que voce gostaria de receber.', task: 'Aceite algo hoje sem se desculpar.', prompt: 'O que me faz pensar que nao mereco ser cuidada?' },
  { day: 6, title: 'A mascara que voce quer soltar', reflection: 'Ela te protegeu. Nao precisa ser arrancada, apenas agradecida.', exercise: 'Escreva um agradecimento a mascara.', task: 'Respire fundo e diga em voz baixa: obrigada, agora posso tentar de outro jeito.', prompt: 'O que eu posso soltar sem culpa?' },
  { day: 7, title: 'Encerramento do ciclo', reflection: 'Voce nao saiu inteira. Voce saiu mais verdadeira.', exercise: 'Escreva uma frase curta que resume sua travessia.', task: 'Acenda uma vela ou um cha e leia sua frase.', prompt: 'Quem eu fui nesses sete dias?' },
];

export const cycles: Cycle[] = [
  { id: 'mask', title: 'Morte da Mascara', duration: 7, objective: 'Identificar padroes de sobrevivencia.', description: 'Um primeiro ciclo para comecar a ver a mulher real por tras da mulher forte.', days: maskDays },
  { id: 'shadow', title: 'Encontro com a Sombra', duration: 7, objective: 'Olhar para raiva, culpa, medo e desejo reprimidos.', description: 'Um ciclo para integrar o que voce aprendeu a esconder de si mesma.', days: maskDays.map(d => ({ ...d, title: d.title.replace('mascara', 'sombra') })) },
  { id: 'innocence', title: 'Retorno da Inocencia', duration: 7, objective: 'Recuperar leveza, desejo e partes esquecidas.', description: 'Reencontrar a menina que ainda habita em voce.', days: maskDays },
  { id: 'body', title: 'Corpo, Rotina e Energia', duration: 7, objective: 'Reorganizar habitos basicos.', description: 'Um ciclo para reconstruir sono, movimento, alimentacao e ambiente.', days: maskDays },
  { id: 'future', title: 'Construcao do Eu Futuro', duration: 7, objective: 'Consolidar identidade e decisoes.', description: 'Sete dias de pratica para encarnar a mulher que voce esta se tornando.', days: maskDays },
];
