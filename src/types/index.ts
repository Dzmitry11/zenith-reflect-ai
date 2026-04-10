export type SessionMode = 'checkin' | 'situation_breakdown' | 'journal' | 'therapy_prep' | 'open_reflection';
export type SessionStatus = 'active' | 'completed' | 'abandoned';
export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';
export type MessageRole = 'user' | 'assistant' | 'system';
export type MemoryType = 'stable_fact' | 'goal' | 'trigger' | 'pattern' | 'preference' | 'support_style';
export type MemoryOrigin = 'direct' | 'inferred';
export type MemoryConfidence = 'low' | 'medium' | 'high';
export type MemoryStatus = 'active' | 'hidden' | 'rejected' | 'corrected';
export type PlanTier = 'free' | 'premium';
export type TonePreference = 'warm_and_gentle' | 'warm_and_structured' | 'concise_and_grounding';

export interface JournalTemplate {
  id: string;
  title: string;
  description: string;
  prompts: string[];
  icon: string;
}

export interface SupportCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface EmotionOption {
  label: string;
  emoji: string;
}

export const EMOTION_OPTIONS: EmotionOption[] = [
  { label: 'Anxious', emoji: '😰' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Angry', emoji: '😠' },
  { label: 'Overwhelmed', emoji: '🤯' },
  { label: 'Numb', emoji: '😶' },
  { label: 'Frustrated', emoji: '😤' },
  { label: 'Hopeful', emoji: '🌱' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Grateful', emoji: '🙏' },
  { label: 'Content', emoji: '😊' },
  { label: 'Confused', emoji: '😕' },
  { label: 'Lonely', emoji: '🥺' },
  { label: 'Guilty', emoji: '😔' },
  { label: 'Relieved', emoji: '😮‍💨' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Restless', emoji: '🫠' },
];

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'anxious_thoughts',
    title: 'Unpacking Anxious Thoughts',
    description: 'Gently examine what your anxiety is trying to tell you.',
    prompts: ['What is making me anxious right now?', 'What is the worst case scenario I am imagining?', 'What evidence do I have for and against this fear?', 'What would I tell a friend in this situation?'],
    icon: '🌊',
  },
  {
    id: 'conflict_debrief',
    title: 'Conflict Debrief',
    description: 'Process a difficult conversation or disagreement.',
    prompts: ['What happened?', 'What was I feeling during the conflict?', 'What do I think the other person was feeling?', 'What do I wish I had said or done differently?', 'What do I need to move forward?'],
    icon: '🔄',
  },
  {
    id: 'end_of_day',
    title: 'End-of-Day Reset',
    description: 'Release the day and make space for rest.',
    prompts: ['What is one thing that went well today?', 'What felt hard today?', 'What am I still carrying from today?', 'What can wait until tomorrow?'],
    icon: '🌙',
  },
  {
    id: 'self_compassion',
    title: 'Self-Compassion After a Hard Day',
    description: 'Offer yourself the kindness you would give a friend.',
    prompts: ['What happened that was hard today?', 'How am I feeling about it right now?', 'What would I say to someone I love going through this?', 'What do I actually need right now?'],
    icon: '💛',
  },
  {
    id: 'what_i_need',
    title: 'What Do I Actually Need?',
    description: 'Get clear on what would help you right now.',
    prompts: ['What is bothering me most right now?', 'Is this about what happened, or how I feel about it?', 'What would help me feel even slightly better?', 'What is one small thing I can do for myself?'],
    icon: '🎯',
  },
  {
    id: 'pre_sleep',
    title: 'Before Sleep Unload',
    description: 'Let go of the mental clutter before rest.',
    prompts: ['What is on my mind right now?', 'Is there anything I need to remember for tomorrow?', 'What can I release for tonight?', 'One thing I am grateful for today.'],
    icon: '✨',
  },
  {
    id: 'after_therapy',
    title: 'After Therapy Reflection',
    description: 'Capture insights while they are still fresh.',
    prompts: ['What stood out to me from today\'s session?', 'Was there anything surprising or uncomfortable?', 'What do I want to remember?', 'What do I want to work on before next time?'],
    icon: '📝',
  },
];

export const SUPPORT_CARDS: SupportCard[] = [
  { id: 'facts_fears', title: 'Facts vs Fears', description: 'Separate what you know from what you are imagining.', icon: '🔍' },
  { id: 'name_hurts', title: 'Name What Hurts', description: 'Putting words to pain can make it smaller.', icon: '💬' },
  { id: 'three_breaths', title: 'Three Slow Breaths', description: 'Pause. Breathe in for 4, hold for 4, out for 6.', icon: '🌬️' },
  { id: 'under_reaction', title: 'What Is Under My Reaction?', description: 'Look beneath the surface response.', icon: '🪞' },
  { id: 'need_tonight', title: 'What Do I Need Tonight?', description: 'Check in with yourself right now.', icon: '🌙' },
  { id: 'can_wait', title: 'What Can Wait Until Tomorrow?', description: 'Give yourself permission to set things down.', icon: '📦' },
];

export const STARTER_CHIPS = [
  'I feel overwhelmed',
  'Help me sort this out',
  'I need to calm down',
  'Prepare me for therapy',
  'Turn this into a journal entry',
  'Help me separate facts from fears',
];

export const CALMING_QUOTES = [
  "You don't need to figure everything out at once.",
  "Start with what feels most present.",
  "This space is here to help you slow things down.",
  "Clarity comes from reflecting, not from rushing.",
  "You are allowed to take up space with your feelings.",
  "Being honest with yourself is an act of courage.",
  "Progress is not always visible, but it is always happening.",
  "You can keep this brief. There is no pressure here.",
];
