import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import auroraSmile from '@/assets/avatar-aurora-smile.png';
import marcusSmile from '@/assets/avatar-marcus-smile.png';

type CompanionId = 'aurora' | 'marcus';

const COMPANIONS: Array<{
  id: CompanionId;
  name: string;
  tagline: string;
  src: string;
  glow: string; // tailwind colour for the breathing halo
  delay: number;
}> = [
  {
    id: 'aurora',
    name: 'Aurora',
    tagline: 'Warm, gentle, here to listen',
    src: auroraSmile,
    glow: 'from-amber-200/40 via-rose-200/30 to-purple-200/40',
    delay: 0,
  },
  {
    id: 'marcus',
    name: 'Marcus',
    tagline: 'Calm, grounded, steady presence',
    src: marcusSmile,
    glow: 'from-emerald-200/40 via-teal-200/30 to-sky-200/40',
    delay: 0.4,
  },
];

export function CompanionInvite() {
  const navigate = useNavigate();

  const choose = (id: CompanionId) => {
    try {
      localStorage.setItem('reflecta:preferred_companion', id);
    } catch {
      /* noop */
    }
    navigate({ to: '/signup' });
  };

  return (
    <div className="mt-10 mb-2">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-sm text-muted-foreground mb-6"
      >
        Choose a companion to begin
      </motion.p>

      <div className="flex items-end justify-center gap-6 sm:gap-12">
        {COMPANIONS.map((c, idx) => (
          <motion.button
            key={c.id}
            type="button"
            onClick={() => choose(c.id)}
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.8 + idx * 0.18,
              duration: 0.7,
              ease: [0.25, 0.4, 0.25, 1],
            }}
            whileHover={{ scale: 1.06, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex flex-col items-center gap-3 focus:outline-none"
            aria-label={`Choose ${c.name} as your companion`}
          >
            {/* Pulsing glow halo */}
            <motion.div
              aria-hidden
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.55, 0.85, 0.55],
              }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: c.delay,
              }}
              className={`absolute -inset-3 sm:-inset-4 rounded-full bg-gradient-to-br ${c.glow} blur-2xl -z-10`}
            />

            {/* Breathing avatar wrapper */}
            <motion.div
              animate={{
                y: [0, -4, 0],
                scale: [1, 1.015, 1],
              }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: c.delay,
              }}
              className="relative"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-background/80 shadow-xl group-hover:ring-primary/40 transition-all duration-500">
                <img
                  src={c.src}
                  alt={`${c.name}, your reflective companion`}
                  className="w-full h-full object-cover"
                  width={256}
                  height={256}
                  loading="lazy"
                />
              </div>

              {/* Soft inviting shimmer overlay */}
              <motion.div
                aria-hidden
                animate={{ opacity: [0, 0.25, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: c.delay + 1.5,
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none"
              />
            </motion.div>

            <div className="text-center">
              <p className="font-display text-base font-semibold text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground max-w-[10rem] leading-snug mt-0.5">
                {c.tagline}
              </p>
            </div>

            {/* Subtle "tap me" hint on hover */}
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 0, y: -4 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute -top-3 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            >
              Start with {c.name}
            </motion.span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
