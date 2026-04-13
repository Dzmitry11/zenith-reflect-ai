import { motion } from 'framer-motion';
import avatarAurora from '@/assets/avatar-aurora.png';
import avatarMarcus from '@/assets/avatar-marcus.png';

export type CompanionId = 'aurora' | 'marcus';

export const COMPANIONS = {
  aurora: {
    id: 'aurora' as const,
    name: 'Aurora',
    tagline: 'Мягкая, тёплая, заботливая',
    description: 'Спокойный и нежный голос. Тёплая поддержка и безопасное пространство для ваших мыслей.',
    avatar: avatarAurora,
  },
  marcus: {
    id: 'marcus' as const,
    name: 'Marcus',
    tagline: 'Спокойный, уверенный, вдумчивый',
    description: 'Уравновешенный и глубокий тон. Помогает структурировать мысли и находить ясность.',
    avatar: avatarMarcus,
  },
} as const;

export function getCompanionAvatar(id: string): string {
  return id === 'marcus' ? avatarMarcus : avatarAurora;
}

export function getCompanionName(id: string): string {
  return id === 'marcus' ? 'Marcus' : 'Aurora';
}

interface CompanionAvatarPickerProps {
  selected: CompanionId;
  onChange: (id: CompanionId) => void;
}

export function CompanionAvatarPicker({ selected, onChange }: CompanionAvatarPickerProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display font-semibold text-foreground">Выберите собеседника</h2>
      <p className="text-sm text-muted-foreground">Ваш спутник в процессе саморефлексии.</p>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(COMPANIONS).map((c) => (
          <motion.button
            key={c.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(c.id)}
            className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
              selected === c.id
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                : 'border-border bg-card/60 hover:border-primary/30'
            }`}
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 ring-2 ring-offset-2 ring-offset-background transition-all"
              style={{ ringColor: selected === c.id ? 'hsl(var(--primary))' : 'transparent' }}
            >
              <img
                src={c.avatar}
                alt={c.name}
                className="w-full h-full object-cover"
                loading="lazy"
                width={512}
                height={512}
              />
            </div>
            <span className="text-sm font-medium text-foreground">{c.name}</span>
            <span className="text-xs text-muted-foreground mt-0.5 text-center">{c.tagline}</span>
            {selected === c.id && (
              <motion.div
                layoutId="avatar-check"
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
