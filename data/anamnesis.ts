export type Question = {
  id: string;
  text: string;
  type: 'text' | 'scale' | 'choice';
  options?: string[];
};

export type Section = {
  id: string;
  title: string;
  overline: string;
  questions: Question[];
};

export const anamnesisSections: Section[] = [
  {
    id: 'estado',
    overline: 'Bloco 1',
    title: 'Estado atual',
    questions: [
      { id: 'q1', text: 'Como voce se sente na maior parte dos dias?', type: 'text' },
      { id: 'q2', text: 'O que mais pesa na sua vida neste momento?', type: 'text' },
      { id: 'q3', text: 'Qual area da sua vida mais precisa de mudanca?', type: 'choice', options: ['Emocoes', 'Relacionamentos', 'Trabalho', 'Corpo e saude', 'Familia', 'Proposito'] },
      { id: 'q4', text: 'O que voce sente que esta repetindo?', type: 'text' },
      { id: 'q5', text: 'De 0 a 10, o quanto voce nao aguenta mais carregar o que carrega?', type: 'scale' },
    ],
  },
  {
    id: 'historia',
    overline: 'Bloco 2',
    title: 'Sua historia',
    questions: [
      { id: 'q1', text: 'Que fase da sua vida mais te marcou?', type: 'text' },
      { id: 'q2', text: 'O que voce sente que perdeu de si mesma?', type: 'text' },
      { id: 'q3', text: 'Que tipo de pessoa voce precisou se tornar para sobreviver?', type: 'text' },
      { id: 'q4', text: 'Existe alguma parte sua que ficou para tras?', type: 'text' },
      { id: 'q5', text: 'Qual dor voce evita olhar diretamente?', type: 'text' },
    ],
  },
  {
    id: 'familia',
    overline: 'Bloco 3',
    title: 'Padroes familiares',
    questions: [
      { id: 'q1', text: 'Que padroes voce percebe na sua familia?', type: 'text' },
      { id: 'q2', text: 'O que mais houve na sua familia?', type: 'choice', options: ['Silencio', 'Conflito', 'Cobranca', 'Abandono', 'Medo', 'Controle'] },
      { id: 'q3', text: 'Voce sente que repete uma historia que nao comecou em voce?', type: 'text' },
      { id: 'q4', text: 'Que tipo de lealdade invisivel voce carrega?', type: 'text' },
      { id: 'q5', text: 'Que padrao familiar voce deseja interromper?', type: 'text' },
    ],
  },
  {
    id: 'corpo',
    overline: 'Bloco 4',
    title: 'Corpo, rotina e energia',
    questions: [
      { id: 'q1', text: 'De 0 a 10, como esta seu sono?', type: 'scale' },
      { id: 'q2', text: 'De 0 a 10, como esta sua alimentacao?', type: 'scale' },
      { id: 'q3', text: 'De 0 a 10, como esta sua energia?', type: 'scale' },
      { id: 'q4', text: 'Seu corpo esta tenso, cansado ou desconectado?', type: 'text' },
      { id: 'q5', text: 'Que habito mais prejudica sua vida hoje?', type: 'text' },
    ],
  },
  {
    id: 'futuro',
    overline: 'Bloco 5',
    title: 'Futuro desejado',
    questions: [
      { id: 'q1', text: 'Quem voce quer se tornar?', type: 'text' },
      { id: 'q2', text: 'Que versao sua precisa morrer?', type: 'text' },
      { id: 'q3', text: 'Que versao sua precisa nascer?', type: 'text' },
      { id: 'q4', text: 'Como seria sua vida sem os mesmos padroes?', type: 'text' },
      { id: 'q5', text: 'Que tipo de paz voce procura?', type: 'text' },
    ],
  },
];
