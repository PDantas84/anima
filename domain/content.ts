export type Ritual = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  minutes: number;
  color: string;
  icon: 'wind' | 'leaf' | 'pen' | 'sun' | 'heart' | 'shield';
  steps: string[];
  prompt: string;
};
export const rituals: Ritual[] = [
  {
    id: 'breath',
    title: 'Um respiro, um recomeço',
    subtitle: 'Uma pausa para chegar ao agora.',
    category: 'Presença',
    minutes: 1,
    color: 'rose',
    icon: 'wind',
    steps: [
      'Encontre uma posição confortável. Você pode manter os olhos abertos.',
      'Inspire suavemente por 4 segundos. Solte o ar por 6 segundos, sem forçar.',
      'Se houver desconforto, pare e respire no seu ritmo natural.',
    ],
    prompt: 'O que mudou depois dessa pausa?',
  },
  {
    id: 'ground',
    title: 'De volta ao presente',
    subtitle: 'Perceba o mundo ao seu redor.',
    category: 'Presença',
    minutes: 3,
    color: 'sage',
    icon: 'leaf',
    steps: [
      'Olhe ao redor e nomeie cinco coisas que você consegue ver.',
      'Perceba quatro pontos de contato do corpo e três sons próximos.',
      'Observe dois cheiros e um detalhe que te traz conforto. Tudo bem adaptar.',
    ],
    prompt: 'Que detalhe do presente me trouxe conforto?',
  },
  {
    id: 'letter',
    title: 'Uma carta para mim',
    subtitle: 'As palavras que você precisa ouvir.',
    category: 'Escrita',
    minutes: 5,
    color: 'lavender',
    icon: 'pen',
    steps: [
      'Pense em como você acolheria uma pessoa querida neste momento.',
      'Escreva algumas dessas palavras para si, em papel ou no diário.',
      'Leia devagar. Você pode guardar a carta e voltar a ela depois.',
    ],
    prompt: 'Hoje, quero me lembrar de que…',
  },
  {
    id: 'pause',
    title: 'O direito de pausar',
    subtitle: 'Alguns minutos sem precisar produzir.',
    category: 'Cuidado',
    minutes: 3,
    color: 'sand',
    icon: 'sun',
    steps: [
      'Se puder, coloque as notificações em silêncio por alguns minutos.',
      'Relaxe as mãos e perceba o apoio da cadeira ou do chão.',
      'Você não precisa alcançar um estado especial. Apenas estar aqui já basta.',
    ],
    prompt: 'O que eu posso deixar para depois?',
  },
  {
    id: 'gratitude',
    title: 'Pequenas coisas boas',
    subtitle: 'Abra espaço para o que te nutre.',
    category: 'Escrita',
    minutes: 4,
    color: 'rose',
    icon: 'heart',
    steps: [
      'Lembre de um detalhe agradável do dia, por menor que tenha sido.',
      'Descreva a cena, a sensação ou a pessoa que estava ali.',
      'Não é preciso apagar as dificuldades para reconhecer um momento bom.',
    ],
    prompt: 'Uma pequena coisa boa que quero guardar…',
  },
  {
    id: 'boundary',
    title: 'Um limite com cuidado',
    subtitle: 'Pratique ouvir as suas necessidades.',
    category: 'Cuidado',
    minutes: 5,
    color: 'sage',
    icon: 'shield',
    steps: [
      'Pense em um pedido que você precisa avaliar com mais tempo.',
      'Experimente a frase: “Preciso pensar antes de responder”.',
      'Adapte a frase ao seu contexto. Você decide se e quando usá-la.',
    ],
    prompt: 'Qual limite poderia me dar mais espaço esta semana?',
  },
];
export type CycleDay = {
  title: string;
  reflection: string;
  exercise: string;
  prompt: string;
};
export type Cycle = {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  days: CycleDay[];
};
export const cycles: Cycle[] = [
  {
    id: 'presence',
    title: 'De volta a si',
    description:
      'Sete pequenos encontros para se escutar e criar espaço no seu dia.',
    category: 'PRESENÇA & AUTOCUIDADO',
    color: 'rose',
    days: [
      {
        title: 'Chegar ao agora',
        reflection:
          'Você não precisa resolver toda a vida hoje. Pode começar percebendo como chegou até aqui.',
        exercise:
          'Faça uma pausa de um minuto e observe sua respiração, sem tentar mudá-la.',
        prompt: 'Como eu chego a este momento?',
      },
      {
        title: 'Dar nome ao que sente',
        reflection:
          'Às vezes, encontrar uma palavra já ajuda a organizar a experiência.',
        exercise:
          'Escolha três palavras para descrever seu dia. Não existem palavras certas.',
        prompt: 'O que está mais presente em mim?',
      },
      {
        title: 'Escutar o corpo',
        reflection:
          'O corpo também participa dos nossos dias. Podemos observá-lo com curiosidade.',
        exercise:
          'Perceba os pés, as mãos e os ombros. Faça um pequeno ajuste que traga conforto.',
        prompt: 'Que cuidado simples meu corpo pede?',
      },
      {
        title: 'Uma pausa possível',
        reflection:
          'Uma pausa pequena também tem valor. Ela pode caber na vida que existe agora.',
        exercise:
          'Reserve três minutos para uma atividade tranquila, sem outra tarefa ao mesmo tempo.',
        prompt: 'Como foi fazer uma coisa de cada vez?',
      },
      {
        title: 'Reconhecer o que nutre',
        reflection: 'O que faz bem pode estar em detalhes cotidianos.',
        exercise: 'Liste três coisas, lugares ou pessoas que te fazem bem.',
        prompt: 'Do que quero estar mais perto?',
      },
      {
        title: 'Pedir companhia',
        reflection:
          'Compartilhar pode ser uma escolha de cuidado. Você decide com quem e quanto.',
        exercise:
          'Pense em alguém de confiança. Se fizer sentido, proponha uma conversa breve.',
        prompt: 'Que tipo de apoio seria bem-vindo?',
      },
      {
        title: 'Levar um pouco consigo',
        reflection:
          'O fim de um ciclo pode ser o começo de um hábito que respeita seu ritmo.',
        exercise: 'Escolha uma prática desta semana que gostaria de repetir.',
        prompt: 'O que quero levar desta jornada?',
      },
    ],
  },
  {
    id: 'boundaries',
    title: 'O espaço que é seu',
    description:
      'Aprenda a reconhecer suas necessidades e a expressar seus limites.',
    category: 'LIMITES & RELAÇÕES',
    color: 'sage',
    days: [
      {
        title: 'Perceber seu espaço',
        reflection:
          'Reconhecer uma necessidade não exige justificá-la imediatamente.',
        exercise: 'Anote uma situação em que sentiu falta de tempo ou espaço.',
        prompt: 'Do que senti necessidade?',
      },
      {
        title: 'Separar desejo e obrigação',
        reflection:
          'Algumas escolhas misturam vontade e expectativa. É possível observá-las.',
        exercise: 'Escolha um compromisso e escreva por que disse sim.',
        prompt: 'O que pesou na minha escolha?',
      },
      {
        title: 'Ganhar tempo',
        reflection: 'Nem toda resposta precisa vir no mesmo instante.',
        exercise: 'Pratique: “Vou ver como estou e te respondo depois”.',
        prompt: 'Onde eu gostaria de responder com mais calma?',
      },
      {
        title: 'Um não possível',
        reflection: 'Limites podem ser claros e respeitosos ao mesmo tempo.',
        exercise:
          'Escreva uma recusa breve para uma situação simples e segura.',
        prompt: 'Como posso expressar meu limite?',
      },
      {
        title: 'Escutar o outro',
        reflection:
          'Uma conversa também envolve espaço para as necessidades de outra pessoa.',
        exercise: 'Pense em um acordo em que ambas as pessoas tenham voz.',
        prompt: 'O que podemos combinar?',
      },
      {
        title: 'Cuidar depois da conversa',
        reflection: 'Conversas importantes podem exigir um tempo de descanso.',
        exercise:
          'Planeje uma pequena atividade de cuidado para depois de uma conversa.',
        prompt: 'Como quero me acolher?',
      },
      {
        title: 'Um acordo consigo',
        reflection: 'Você pode revisar seus limites conforme a vida muda.',
        exercise: 'Escreva um compromisso realista com seu tempo nesta semana.',
        prompt: 'Que espaço quero preservar?',
      },
    ],
  },
  {
    id: 'renewal',
    title: 'Cultivar novos começos',
    description:
      'Transforme uma intenção em pequenos passos que cabem na vida real.',
    category: 'INTENÇÃO & POSSIBILIDADES',
    color: 'lavender',
    days: [
      {
        title: 'Escolher uma direção',
        reflection:
          'Um começo pode ser discreto: algo a que você quer dar um pouco de atenção.',
        exercise:
          'Escolha uma área da vida que gostaria de cuidar nesta semana.',
        prompt: 'O que quero cultivar?',
      },
      {
        title: 'Um passo pequeno',
        reflection:
          'Um passo viável ajuda mais do que uma meta que não cabe no dia.',
        exercise: 'Transforme sua intenção em uma ação de cinco minutos.',
        prompt: 'Qual é meu menor próximo passo?',
      },
      {
        title: 'Preparar o ambiente',
        reflection:
          'Às vezes, uma mudança ao redor torna uma escolha mais fácil.',
        exercise:
          'Organize um objeto ou espaço que te ajude a realizar sua ação.',
        prompt: 'O que pode facilitar meu caminho?',
      },
      {
        title: 'Abrir espaço para desvios',
        reflection: 'Um dia diferente não apaga o caminho percorrido.',
        exercise:
          'Pense em uma versão ainda menor da sua ação para dias difíceis.',
        prompt: 'Qual é meu plano possível para um dia cheio?',
      },
      {
        title: 'Reconhecer um movimento',
        reflection:
          'Vale perceber o esforço sem precisar compará-lo com o de ninguém.',
        exercise: 'Registre uma ação que você realizou e como se sentiu.',
        prompt: 'Que movimento quero reconhecer?',
      },
      {
        title: 'Encontrar companhia',
        reflection:
          'Alguns começos ficam mais leves quando são compartilhados.',
        exercise: 'Se desejar, conte sua intenção para alguém de confiança.',
        prompt: 'Quem pode caminhar um pouco comigo?',
      },
      {
        title: 'Continuar com gentileza',
        reflection:
          'Sua direção pode mudar. Ajustar o caminho também é uma escolha.',
        exercise:
          'Revise sua intenção e escolha o que deseja manter na próxima semana.',
        prompt: 'Qual será meu próximo começo?',
      },
    ],
  },
];
export const journalPrompts = [
  'O que está pedindo espaço em mim hoje?',
  'Uma coisa que quero deixar ir…',
  'O que me fez sentir presente hoje?',
  'Como posso cuidar de mim com mais gentileza?',
];
