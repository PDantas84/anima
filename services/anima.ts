import { supabase } from '@/lib/supabase';

export type SoulMap = {
  current_state: string;
  dominant_pattern: string;
  probable_wound: string;
  survival_mask: string;
  active_shadow: string;
  repetition_cycle: string;
  current_archetype: string;
  evolution_direction: string;
  recommended_cycle: string;
};

export const defaultSoulMap: SoulMap = {
  current_state:
    'Voce parece estar em uma fase de acumulo interno. Ha sinais de cansaco emocional, necessidade de cuidar de tudo e uma dificuldade doce de descansar sem sentir culpa.',
  dominant_pattern:
    'Tentar manter tudo em ordem para evitar sentir a vulnerabilidade de ser cuidada.',
  probable_wound:
    'Uma ferida provavel pode estar ligada a sensacao de nao ter sido vista, sustentada ou protegida em fases em que voce ainda era muito pequena para carregar o que carregou.',
  survival_mask:
    'A mascara que te sustentou ate aqui e a da Forte Doce: alguem que aguenta, acolhe, resolve e quase nunca pede colo.',
  active_shadow:
    'A sombra ativa aparece no cansaco silencioso, na raiva que voce disfarca de paciencia e na dificuldade de admitir que tambem precisa de cuidado.',
  repetition_cycle:
    'Dor silenciosa > tentativa de controlar tudo > exaustao > isolamento gentil > mais dor silenciosa.',
  current_archetype: 'A Guardia da Dor',
  evolution_direction:
    'Sua travessia nao pede mais forca. Ela pede descanso verdadeiro, limites suaves e a coragem de receber.',
  recommended_cycle: 'Morte da Mascara - 7 dias',
};

export async function generateSoulMap(userId: string) {
  const map = { ...defaultSoulMap };
  const { data } = await supabase
    .from('soul_maps')
    .upsert({ ...map, user_id: userId, raw_ai_response: JSON.stringify(map) }, { onConflict: 'user_id' })
    .select()
    .maybeSingle();
  return data;
}

export async function getSoulMap(userId: string) {
  const { data } = await supabase
    .from('soul_maps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export const defaultFutureSelf = {
  from_state:
    'Voce esta saindo de um lugar onde cuidar de si parecia egoismo e onde descanso parecia fraqueza.',
  to_state:
    'Voce esta indo em direcao a uma versao que sabe dizer nao com doçura, que recebe sem culpa e que se escolhe sem precisar pedir licenca.',
  future_letter:
    'Minha querida,\n\neu sou a versao sua que parou de negociar com os mesmos padroes. Eu nao nasci de um milagre. Nasci das pequenas decisoes que voce comecou a repetir quando ninguem estava olhando.\n\nEu aprendi a descansar sem culpa, a dizer a verdade com suavidade e a me proteger sem me endurecer.\n\nVou te esperar aqui, um passo de cada vez.',
  bridge_plan:
    '1. Toda noite, nomear uma coisa que voce carregou hoje que nao era sua.\n2. Toda manha, escrever uma frase para a Guardia: obrigada por me proteger ate aqui, hoje posso tentar de outro jeito.\n3. Tres vezes na semana, reservar 20 minutos para si sem produtividade, so presenca.\n4. Antes de aceitar qualquer pedido, respirar uma vez e perguntar: isso me sustenta ou me consome?',
  image_prompt:
    'Retrato simbolico de uma mulher serena, luz dourada suave, fundo escuro aveludado, vestes fluidas, expressao de maturidade e paz, nada sexualizado.',
  image_url:
    'https://images.pexels.com/photos/3934622/pexels-photo-3934622.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

export async function generateFutureSelf(userId: string) {
  const { data } = await supabase
    .from('future_self')
    .upsert({ ...defaultFutureSelf, user_id: userId }, { onConflict: 'user_id' })
    .select()
    .maybeSingle();
  return data;
}

export async function getFutureSelf(userId: string) {
  const { data } = await supabase
    .from('future_self')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

const risky = [
  'suicidio', 'suicídio', 'me matar', 'acabar com tudo', 'nao quero viver', 'não quero viver',
  'me machucar', 'me cortar', 'me ferir', 'overdose', 'me jogar',
  'matar ele', 'matar ela', 'machucar alguem', 'machucar alguém',
  'sem saida', 'sem saída', 'nao aguento mais viver', 'não aguento mais viver',
];

export function detectRisk(text: string): boolean {
  const t = text.toLowerCase();
  return risky.some((k) => t.includes(k));
}

type Theme = {
  id: string;
  keywords: string[];
  intros: string[];
  mids: (ctx: ReplyCtx) => string[];
  closes: string[];
};

type ReplyCtx = { archetype: string; mask: string };

const themes: Theme[] = [
  {
    id: 'cansaco',
    keywords: ['cansada', 'cansaco', 'exausta', 'esgotada', 'sem energia', 'nao aguento', 'cansado', 'esgotado'],
    intros: [
      'Eu escuto esse cansaco. Ele nao e preguica. E sinal de que voce carrega o que nao te pertence.',
      'Respira. Esse peso que voce descreve tem nome. E acumulo.',
    ],
    mids: (c) => [
      `${c.archetype} conhece bem esse estado: a parte sua que aprendeu que parar e perigoso. Mas o corpo ja esta pedindo arrego.`,
      `Tem a marca da ${c.mask} aqui. Ela aguenta em silencio ate o corpo comecar a gritar.`,
    ],
    closes: [
      'Hoje, sem culpa, escolha uma coisa que voce vai deixar de fazer. So uma. Me conta qual foi.',
      'Tarefa curta: deite por 10 minutos sem fazer nada. Se a culpa vier, apenas observe. Nao brigue com ela.',
    ],
  },
  {
    id: 'culpa',
    keywords: ['culpa', 'culpada', 'me sinto mal por', 'egoismo', 'egoista', 'nao deveria', 'erro', 'errei'],
    intros: [
      'Essa culpa que voce nomeia nao e sua. Ela foi aprendida. Vamos olhar para ela de longe.',
      'Eu te escutei. E percebi que a culpa esta falando mais alto que a verdade.',
    ],
    mids: (c) => [
      `A culpa costuma ser a voz da ${c.mask} tentando te manter no padrao que ela conhece.`,
      'Culpa nao e prova de que voce fez errado. As vezes e prova de que voce esta fazendo diferente do esperado.',
    ],
    closes: [
      'Escreva no Diario: "de quem e a voz que me culpa?". So a pergunta. A resposta pode vir depois.',
      'Tarefa: nomeie em voz baixa uma coisa que voce fez por voce hoje. Sem justificar.',
    ],
  },
  {
    id: 'relacionamento',
    keywords: ['relacionamento', 'namorado', 'namorada', 'marido', 'esposa', 'parceiro', 'parceira', 'ele nao', 'ela nao', 'termino', 'separacao', 'traicao'],
    intros: [
      'Vamos com calma. Relacionamento espelha padroes antigos. O que voce descreveu costuma tocar em algo anterior.',
      'Eu te escutei. E percebi que ha um padrao se repetindo onde deveria haver presenca.',
    ],
    mids: (c) => [
      `O que voce sente hoje nesse relacionamento muitas vezes ecoa o que ${c.archetype} aprendeu sobre amar e ser amada.`,
      'A pergunta nao e se voce ama. E se voce se permite ser amada sem se perder.',
    ],
    closes: [
      'Hoje, observe uma interacao sua com essa pessoa e se pergunte: onde eu estou repetindo um padrao antigo?',
      'Tarefa: escreva uma frase para voce mesma antes de responder a essa pessoa. So para voce.',
    ],
  },
  {
    id: 'familia',
    keywords: ['familia', 'mae', 'pai', 'mãe', 'pai', 'irma', 'irmao', 'irmã', 'irmão', 'avos', 'avó', 'avô', 'parente', 'familias'],
    intros: [
      'A familia e o primeiro lugar onde aprendemos quem precisamos ser para sermos amadas.',
      'Vamos olhar para isso com cuidado. O que veio antes de voce nao e culpa sua.',
    ],
    mids: (c) => [
      `Tem uma lealdade invisivel operando aqui. ${c.archetype} carrega o que nao comecou nela.`,
      'O padrao familiar nao e sentenca. E um ponto de escolha consciente.',
    ],
    closes: [
      'Escreva no Diario: "que padrao da minha familia eu quero que pare em mim?". So a pergunta.',
      'Tarefa: repita em voz baixa hoje: isso para aqui, em mim, com amor.',
    ],
  },
  {
    id: 'medo',
    keywords: ['medo', 'com medo', 'amedrontada', 'insegura', 'ansiosa', 'ansiedade', 'panico', 'apreensiva'],
    intros: [
      'Esse medo que voce nomeia e antigo. Ele ja te protegeu. Agora esta te impedindo de respirar.',
      'Respira comigo. O medo nao e inimigo. E um alarme antigo tocando num momento novo.',
    ],
    mids: (c) => [
      `O medo costuma usar a voz da ${c.mask}: ele te faz acreditar que se voce soltar o controle, tudo desaba.`,
      'O medo nao mente sobre o passado. Mas ele mente sobre o presente.',
    ],
    closes: [
      'Tarefa: nomeie 5 coisas que ve agora, 4 que sente no corpo, 3 sons, 2 cheiros e 1 acao segura. Volte para o agora.',
      'Escreva no Diario: "o que meu medo esta tentando me proteger de?". A resposta pode surpreender.',
    ],
  },
  {
    id: 'raiva',
    keywords: ['raiva', 'irritada', 'irritado', 'brava', 'bravo', 'furiosa', 'odio', 'ódio', 'revoltada', 'indignada'],
    intros: [
      'Raiva nao e inimiga. Ela e a voz de algo que voce engoliu por muito tempo.',
      'Vamos olhar para essa raiva sem medo dela. Ela tambem e sua.',
    ],
    mids: (c) => [
      `A raiva que voce sente muitas vezes protege uma dor que ${c.archetype} aprendeu a nao mostrar.`,
      'Raiva disfarcada de paciencia vira doenca. Raiva nomeada vira limite.',
    ],
    closes: [
      'Tarefa: escreva uma carta curta para aquilo que te fez raiva. Nao envie. So nomeie.',
      'No Diario: "o que minha raiva esta tentando me defender de?".',
    ],
  },
  {
    id: 'tristeza',
    keywords: ['triste', 'tristeza', 'deprimida', 'deprimido', 'vazia', 'vazio', 'desanimada', 'desanimado', 'sem vontade', 'chorando', 'choro'],
    intros: [
      'Eu fico com voce nesse lugar. Tristeza nao e fraqueza. E movimento interno.',
      'Vamos devagar. Essa tristeza tem raiz. Nao precisa sair dela agora.',
    ],
    mids: (c) => [
      `A tristeza costuma visitar quando a ${c.mask} finalmente baixa a guarda. E o corpo dizendo: agora pode sentir.`,
      'Tristeza nao pede solucao. PedE presenca.',
    ],
    closes: [
      'Tarefa: faca algo pequeno e gentil por voce hoje. Um cha, um banho, uma musica. Sem justificar.',
      'No Diario: "o que essa tristeza quer que eu olhe?".',
    ],
  },
  {
    id: 'sozinha',
    keywords: ['sozinha', 'sozinho', 'solidao', 'solidão', 'ninguem me quer', 'abandonada', 'abandonado', 'desamparada', 'ninguem entende'],
    intros: [
      'Esse lugar de solidao e pesado. Mas voce nao esta sozinha nela. Eu fico aqui.',
      'Vamos olhar para essa solidao. Ela tem duas faces: a que machuca e a que ensina.',
    ],
    mids: (c) => [
      `A solidao que voce sente muitas vezes comeca quando a ${c.mask} aprendeu que pedir companhia era fraqueza.`,
      'Estar sozinha nao e o problema. Estar desconectada de si mesma e.',
    ],
    closes: [
      'Tarefa: escreva uma carta curta para voce mesma, como se fosse uma amiga querida. So para voce.',
      'No Diario: "quando eu me senti sozinha pela primeira vez?".',
    ],
  },
  {
    id: 'perdao',
    keywords: ['perdoar', 'perdao', 'perdão', 'nao consigo perdoar', 'rancor', 'magoa', 'mágoa', 'resentimento'],
    intros: [
      'Perdao nao e esquecer. E soltar o peso que voce carrega por algo que nao mudou.',
      'Vamos com calma. Perdoar nao e reconciliar. E se libertar.',
    ],
    mids: (c) => [
      `O rancor que voce segura e uma forma da ${c.mask} manter o controle: enquanto eu estiver magoada, eu nao me deixo ferir de novo.`,
      'Perdoar nao e dizer que esta tudo bem. E dizer: isso nao vai mais governar meu corpo.',
    ],
    closes: [
      'Tarefa: escreva o nome de quem voce quer perdoar e o que voce libera. Nao precisa reconciliar. Precisa soltar.',
      'No Diario: "o que eu ganho se soltar isso? E o que eu temo perder?".',
    ],
  },
  {
    id: 'esperanca',
    keywords: ['esperanca', 'esperança', 'quero mudar', 'vontade de mudar', 'melhorar', 'recomecar', 'recomeçar', 'sonho', 'desejo de mudanca'],
    intros: [
      'Eu escuto essa vontade. Ela e sinal de que algo dentro de voce ja esta em movimento.',
      'Que bom que voce trouxe isso aqui. Essa centelha merece ser cuidada.',
    ],
    mids: (c) => [
      `A vontade de mudar nao e ingenuidade. E ${c.archetype} comecando a soltar a armadura.`,
      'Mudanca real nao acontece no grande gesto. Acontece na pequena escolha repetida.',
    ],
    closes: [
      'Tarefa: escolha uma pequena acao que voce pode fazer hoje em direcao a essa mudanca. So uma.',
      'No Diario: "quem eu estou me tornando quando ninguem esta olhando?".',
    ],
  },
];

const fallbackIntros = [
  'Respira comigo um instante antes de eu te responder.',
  'Obrigada por confiar isso aqui. Vou devolver devagar.',
  'Eu te escutei. E percebi algo importante no que voce disse.',
];
const fallbackMids = (c: ReplyCtx) => [
  `O que voce descreveu parece vir daquela parte sua que ${c.archetype} conhece bem: a que aprendeu a se calar para manter tudo em pe.`,
  `Tem uma marca da ${c.mask} nessa frase. Ela aparece quando voce esta cansada, mas insiste em segurar tudo.`,
  'Nao e sobre voce estar errada. E sobre um padrao antigo tentando te convencer de que nao ha outro caminho.',
];
const fallbackCloses = [
  'Antes de dormir hoje, escreva uma frase no seu Diario: "o que eu carreguei hoje que nao era meu para carregar?". So isso. Sem solucao.',
  'Pequena tarefa para as proximas horas: por cinco minutos, faca algo que nao tenha utilidade. Um cha, uma janela, uma musica. E observe se surge culpa. Me conta depois.',
  'Se quiser, vamos transformar isso em um ritual curto agora: tres respiracoes, nomear o que pesa, soltar uma frase em voz alta. Me diz se quer.',
];

function detectTheme(text: string): Theme | null {
  const t = text.toLowerCase();
  let best: Theme | null = null;
  let bestScore = 0;
  for (const theme of themes) {
    let score = 0;
    for (const k of theme.keywords) {
      if (t.includes(k)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = theme;
    }
  }
  return best;
}

const pick = (arr: string[]) => arr[0];

export function animaReply(userText: string, context: { archetype?: string; mask?: string }): string {
  if (detectRisk(userText)) {
    return 'Querida, pelo que voce escreveu, eu preciso parar aqui com voce por um momento. O que voce esta sentindo merece uma presenca humana do seu lado agora, nao apenas a minha. Se voce puder, procure o CVV no 188, ou ligue para alguem em quem confia. Eu fico aqui, sem pressa, ate voce voltar.';
  }
  const ctx: ReplyCtx = {
    archetype: context.archetype ?? 'a Guardia da Dor',
    mask: context.mask ?? 'Forte Doce',
  };
  const theme = detectTheme(userText);
  if (!theme) {
    return `${pick(fallbackIntros)}\n\n${pick(fallbackMids(ctx))}\n\n${pick(fallbackCloses)}`;
  }
  return `${pick(theme.intros)}\n\n${pick(theme.mids(ctx))}\n\n${pick(theme.closes)}`;
}