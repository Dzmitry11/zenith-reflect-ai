import type { Locale } from '@/i18n/translations';

export interface DiscQuestion {
  id: number;
  options: {
    label: Record<Locale, string>;
    type: 'D' | 'I' | 'S' | 'C';
  }[];
}

// 12 DISC questions — user picks "most like me" from 4 options per question
export const DISC_QUESTIONS: DiscQuestion[] = [
  {
    id: 1,
    options: [
      { label: { en: 'I take charge and make decisions quickly', sv: 'Jag tar kommandot och fattar beslut snabbt', ru: 'Я беру на себя ответственность и быстро принимаю решения' }, type: 'D' },
      { label: { en: 'I enjoy meeting new people and sharing ideas', sv: 'Jag gillar att träffa nya människor och dela idéer', ru: 'Мне нравится знакомиться с новыми людьми и делиться идеями' }, type: 'I' },
      { label: { en: 'I prefer a calm, predictable environment', sv: 'Jag föredrar en lugn, förutsägbar miljö', ru: 'Я предпочитаю спокойную, предсказуемую обстановку' }, type: 'S' },
      { label: { en: 'I like to analyze all the facts before acting', sv: 'Jag gillar att analysera alla fakta innan jag agerar', ru: 'Я люблю проанализировать все факты, прежде чем действовать' }, type: 'C' },
    ],
  },
  {
    id: 2,
    options: [
      { label: { en: 'I am direct and results-oriented', sv: 'Jag är direkt och resultatorienterad', ru: 'Я прямолинеен и ориентирован на результат' }, type: 'D' },
      { label: { en: 'I am enthusiastic and optimistic', sv: 'Jag är entusiastisk och optimistisk', ru: 'Я полон энтузиазма и оптимизма' }, type: 'I' },
      { label: { en: 'I am patient and a good listener', sv: 'Jag är tålmodig och en bra lyssnare', ru: 'Я терпелив и хороший слушатель' }, type: 'S' },
      { label: { en: 'I am precise and pay attention to detail', sv: 'Jag är noggrann och uppmärksam på detaljer', ru: 'Я точен и внимателен к деталям' }, type: 'C' },
    ],
  },
  {
    id: 3,
    options: [
      { label: { en: 'I focus on overcoming challenges', sv: 'Jag fokuserar på att övervinna utmaningar', ru: 'Я сосредотачиваюсь на преодолении трудностей' }, type: 'D' },
      { label: { en: 'I focus on influencing and persuading others', sv: 'Jag fokuserar på att påverka och övertyga andra', ru: 'Я сосредоточен на влиянии и убеждении других' }, type: 'I' },
      { label: { en: 'I focus on maintaining stability and harmony', sv: 'Jag fokuserar på att upprätthålla stabilitet och harmoni', ru: 'Я сосредоточен на поддержании стабильности и гармонии' }, type: 'S' },
      { label: { en: 'I focus on accuracy and quality', sv: 'Jag fokuserar på noggrannhet och kvalitet', ru: 'Я сосредоточен на точности и качестве' }, type: 'C' },
    ],
  },
  {
    id: 4,
    options: [
      { label: { en: 'Under stress I become controlling', sv: 'Under stress blir jag kontrollerande', ru: 'В стрессе я становлюсь контролирующим' }, type: 'D' },
      { label: { en: 'Under stress I become emotional', sv: 'Under stress blir jag emotionell', ru: 'В стрессе я становлюсь эмоциональным' }, type: 'I' },
      { label: { en: 'Under stress I become passive', sv: 'Under stress blir jag passiv', ru: 'В стрессе я становлюсь пассивным' }, type: 'S' },
      { label: { en: 'Under stress I become critical', sv: 'Under stress blir jag kritisk', ru: 'В стрессе я становлюсь критичным' }, type: 'C' },
    ],
  },
  {
    id: 5,
    options: [
      { label: { en: 'I value winning and achieving goals', sv: 'Jag värdesätter att vinna och nå mål', ru: 'Я ценю победу и достижение целей' }, type: 'D' },
      { label: { en: 'I value recognition and being liked', sv: 'Jag värdesätter erkännande och att bli omtyckt', ru: 'Я ценю признание и симпатию окружающих' }, type: 'I' },
      { label: { en: 'I value loyalty and trust', sv: 'Jag värdesätter lojalitet och förtroende', ru: 'Я ценю лояльность и доверие' }, type: 'S' },
      { label: { en: 'I value correctness and standards', sv: 'Jag värdesätter korrekthet och standarder', ru: 'Я ценю правильность и стандарты' }, type: 'C' },
    ],
  },
  {
    id: 6,
    options: [
      { label: { en: 'I make decisions quickly and confidently', sv: 'Jag fattar beslut snabbt och självsäkert', ru: 'Я принимаю решения быстро и уверенно' }, type: 'D' },
      { label: { en: 'I make decisions based on gut feeling', sv: 'Jag fattar beslut baserat på magkänsla', ru: 'Я принимаю решения на основе интуиции' }, type: 'I' },
      { label: { en: 'I take my time to decide carefully', sv: 'Jag tar god tid på mig att besluta noggrant', ru: 'Я не тороплюсь и принимаю решения обдуманно' }, type: 'S' },
      { label: { en: 'I decide based on data and logic', sv: 'Jag beslutar baserat på data och logik', ru: 'Я принимаю решения на основе данных и логики' }, type: 'C' },
    ],
  },
  {
    id: 7,
    options: [
      { label: { en: 'I prefer to lead and be in control', sv: 'Jag föredrar att leda och ha kontroll', ru: 'Я предпочитаю вести за собой и контролировать' }, type: 'D' },
      { label: { en: 'I prefer to collaborate and brainstorm', sv: 'Jag föredrar att samarbeta och brainstorma', ru: 'Я предпочитаю сотрудничать и генерировать идеи' }, type: 'I' },
      { label: { en: 'I prefer to support and help others', sv: 'Jag föredrar att stötta och hjälpa andra', ru: 'Я предпочитаю поддерживать и помогать другим' }, type: 'S' },
      { label: { en: 'I prefer to research and plan', sv: 'Jag föredrar att forska och planera', ru: 'Я предпочитаю исследовать и планировать' }, type: 'C' },
    ],
  },
  {
    id: 8,
    options: [
      { label: { en: 'I dislike being taken advantage of', sv: 'Jag ogillar att bli utnyttjad', ru: 'Мне не нравится, когда мной пользуются' }, type: 'D' },
      { label: { en: 'I dislike being ignored', sv: 'Jag ogillar att bli ignorerad', ru: 'Мне не нравится, когда меня игнорируют' }, type: 'I' },
      { label: { en: 'I dislike sudden changes', sv: 'Jag ogillar plötsliga förändringar', ru: 'Мне не нравятся внезапные перемены' }, type: 'S' },
      { label: { en: 'I dislike being wrong or making errors', sv: 'Jag ogillar att ha fel eller göra misstag', ru: 'Мне не нравится ошибаться' }, type: 'C' },
    ],
  },
  {
    id: 9,
    options: [
      { label: { en: 'I communicate directly and to the point', sv: 'Jag kommunicerar direkt och rakt på sak', ru: 'Я общаюсь прямо и по делу' }, type: 'D' },
      { label: { en: 'I communicate with energy and stories', sv: 'Jag kommunicerar med energi och berättelser', ru: 'Я общаюсь с энергией и через истории' }, type: 'I' },
      { label: { en: 'I communicate gently and diplomatically', sv: 'Jag kommunicerar mjukt och diplomatiskt', ru: 'Я общаюсь мягко и дипломатично' }, type: 'S' },
      { label: { en: 'I communicate with facts and evidence', sv: 'Jag kommunicerar med fakta och bevis', ru: 'Я общаюсь фактами и доказательствами' }, type: 'C' },
    ],
  },
  {
    id: 10,
    options: [
      { label: { en: 'My strength is determination', sv: 'Min styrka är beslutsamhet', ru: 'Моя сильная сторона — решительность' }, type: 'D' },
      { label: { en: 'My strength is communication', sv: 'Min styrka är kommunikation', ru: 'Моя сильная сторона — коммуникабельность' }, type: 'I' },
      { label: { en: 'My strength is reliability', sv: 'Min styrka är pålitlighet', ru: 'Моя сильная сторона — надёжность' }, type: 'S' },
      { label: { en: 'My strength is analytical thinking', sv: 'Min styrka är analytiskt tänkande', ru: 'Моя сильная сторона — аналитическое мышление' }, type: 'C' },
    ],
  },
  {
    id: 11,
    options: [
      { label: { en: 'In a team, I push for action', sv: 'I ett team driver jag på handling', ru: 'В команде я подталкиваю к действию' }, type: 'D' },
      { label: { en: 'In a team, I motivate and energize', sv: 'I ett team motiverar och energiserar jag', ru: 'В команде я мотивирую и вдохновляю' }, type: 'I' },
      { label: { en: 'In a team, I mediate and unify', sv: 'I ett team medlar och förenar jag', ru: 'В команде я посредничаю и объединяю' }, type: 'S' },
      { label: { en: 'In a team, I ensure quality and structure', sv: 'I ett team säkerställer jag kvalitet och struktur', ru: 'В команде я обеспечиваю качество и структуру' }, type: 'C' },
    ],
  },
  {
    id: 12,
    options: [
      { label: { en: 'I feel fulfilled when I accomplish something big', sv: 'Jag känner mig nöjd när jag åstadkommer något stort', ru: 'Я чувствую удовлетворение, когда достигаю чего-то значительного' }, type: 'D' },
      { label: { en: 'I feel fulfilled when I connect with people', sv: 'Jag känner mig nöjd när jag får kontakt med människor', ru: 'Я чувствую удовлетворение, когда нахожу связь с людьми' }, type: 'I' },
      { label: { en: 'I feel fulfilled when everything is peaceful', sv: 'Jag känner mig nöjd när allt är fridfullt', ru: 'Я чувствую удовлетворение, когда вокруг покой' }, type: 'S' },
      { label: { en: 'I feel fulfilled when my work is flawless', sv: 'Jag känner mig nöjd när mitt arbete är felfritt', ru: 'Я чувствую удовлетворение, когда моя работа безупречна' }, type: 'C' },
    ],
  },
];

export const DISC_TYPE_INFO: Record<string, {
  name: Record<Locale, string>;
  emoji: string;
  color: string;
  description: Record<Locale, string>;
  strengths: Record<Locale, string[]>;
}> = {
  D: {
    name: { en: 'Dominance', sv: 'Dominans', ru: 'Доминирование' },
    emoji: '🔥',
    color: 'text-red-500',
    description: {
      en: 'You are decisive, competitive, and results-driven. You thrive on challenges and like to take the lead.',
      sv: 'Du är beslutsam, tävlingsinriktad och resultatdriven. Du trivs med utmaningar och gillar att ta ledningen.',
      ru: 'Вы решительны, конкурентоспособны и ориентированы на результат. Вы процветаете в условиях вызовов и любите лидировать.',
    },
    strengths: {
      en: ['Decisive leadership', 'Problem-solving', 'Big-picture thinking', 'Drive for results'],
      sv: ['Beslutsamt ledarskap', 'Problemlösning', 'Helhetstänkande', 'Drivkraft för resultat'],
      ru: ['Решительное лидерство', 'Решение проблем', 'Стратегическое мышление', 'Стремление к результату'],
    },
  },
  I: {
    name: { en: 'Influence', sv: 'Inflytande', ru: 'Влияние' },
    emoji: '☀️',
    color: 'text-yellow-500',
    description: {
      en: 'You are outgoing, enthusiastic, and optimistic. You thrive on social interaction and inspire others.',
      sv: 'Du är utåtriktad, entusiastisk och optimistisk. Du trivs med sociala interaktioner och inspirerar andra.',
      ru: 'Вы общительны, полны энтузиазма и оптимизма. Вы процветаете в социальном взаимодействии и вдохновляете других.',
    },
    strengths: {
      en: ['Persuasion', 'Networking', 'Creativity', 'Team motivation'],
      sv: ['Övertalning', 'Nätverkande', 'Kreativitet', 'Teammotivation'],
      ru: ['Убеждение', 'Нетворкинг', 'Креативность', 'Мотивация команды'],
    },
  },
  S: {
    name: { en: 'Steadiness', sv: 'Stabilitet', ru: 'Стабильность' },
    emoji: '🌿',
    color: 'text-green-500',
    description: {
      en: 'You are patient, reliable, and team-oriented. You value harmony and are a great listener and supporter.',
      sv: 'Du är tålmodig, pålitlig och teamorienterad. Du värdesätter harmoni och är en bra lyssnare och stöttepelare.',
      ru: 'Вы терпеливы, надёжны и командны. Вы цените гармонию и являетесь отличным слушателем и поддержкой.',
    },
    strengths: {
      en: ['Dependability', 'Active listening', 'Team loyalty', 'Patience'],
      sv: ['Pålitlighet', 'Aktivt lyssnande', 'Teamlojalitet', 'Tålamod'],
      ru: ['Надёжность', 'Активное слушание', 'Командная лояльность', 'Терпение'],
    },
  },
  C: {
    name: { en: 'Conscientiousness', sv: 'Samvetsgrannhet', ru: 'Добросовестность' },
    emoji: '🔬',
    color: 'text-blue-500',
    description: {
      en: 'You are analytical, detail-oriented, and quality-focused. You value accuracy and systematic approaches.',
      sv: 'Du är analytisk, detaljorienterad och kvalitetsfokuserad. Du värdesätter noggrannhet och systematiska tillvägagångssätt.',
      ru: 'Вы аналитичны, внимательны к деталям и ориентированы на качество. Вы цените точность и системный подход.',
    },
    strengths: {
      en: ['Analytical skills', 'Quality focus', 'Systematic planning', 'Attention to detail'],
      sv: ['Analytisk förmåga', 'Kvalitetsfokus', 'Systematisk planering', 'Uppmärksamhet på detaljer'],
      ru: ['Аналитические навыки', 'Фокус на качестве', 'Систематическое планирование', 'Внимание к деталям'],
    },
  },
};
