import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import auroraSmile from '@/assets/avatar-aurora-smile.png';
import auroraWink from '@/assets/avatar-aurora-wink.png';
import marcusSmile from '@/assets/avatar-marcus-smile.png';
import marcusTilt from '@/assets/avatar-marcus-tilt.png';

type CompanionId = 'aurora' | 'marcus';

const COMPANIONS: Array<{
  id: CompanionId;
  name: string;
  tagline: string;
  src: string;
  altSrc: string;
  altDuration: number; // how long the alt frame stays visible (ms)
  interval: number;    // time between expressions (ms)
  startDelay: number;  // initial offset so they don't sync
  glow: string;
  delay: number;
}> = [
  {
    id: 'aurora',
    name: 'Aurora',
    tagline: 'Warm, gentle, here to listen',
    src: auroraSmile,
    altSrc: auroraWink,
    altDuration: 320,    // quick wink
    interval: 5200,
    startDelay: 1800,
    glow: 'from-amber-200/40 via-rose-200/30 to-purple-200/40',
    delay: 0,
  },
  {
    id: 'marcus',
    name: 'Marcus',
    tagline: 'Calm, grounded, steady presence',
    src: marcusSmile,
    altSrc: marcusTilt,
    altDuration: 1400,   // longer thoughtful tilt
    interval: 6400,
    startDelay: 4200,
    glow: 'from-emerald-200/40 via-teal-200/30 to-sky-200/40',
    delay: 0.4,
  },
];

/** Random gesture offset to avoid identical repetition. */
function randomGesture(base: number, variance: number) {
  return base + (Math.random() - 0.5) * 2 * variance;
}

/** Periodically swaps to an alt expression frame with varied gesture. */
function useExpressionFrame(interval: number, altDuration: number, startDelay: number) {
  const [showAlt, setShowAlt] = useState(false);
  const [gesture, setGesture] = useState({ y: 0, x: 0, rotate: 0 });

  useEffect(() => {
    let altTimeout: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const startTimeout = setTimeout(() => {
      const tick = () => {
        setGesture({
          y: randomGesture(-2, 1.2),
          x: randomGesture(0.8, 0.8),
          rotate: randomGesture(0, 1.5),
        });
        setShowAlt(true);
        altTimeout = setTimeout(() => setShowAlt(false), altDuration);
      };
      tick();
      intervalId = setInterval(tick, interval);
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(altTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [interval, altDuration, startDelay]);

  return { showAlt, gesture };
}


type Companion = (typeof COMPANIONS)[number];

function CompanionCard({
  c,
  idx,
  onChoose,
}: {
  c: Companion;
  idx: number;
  onChoose: (id: CompanionId) => void;
}) {
  const showAlt = useExpressionFrame(c.interval, c.altDuration, c.startDelay);

  return (
    <motion.button
      type="button"
      onClick={() => onChoose(c.id)}
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
        className={`absolute -inset-3 sm:-inset-4 rounded-2xl bg-gradient-to-br ${c.glow} blur-2xl -z-10`}
      />

      {/* Breathing avatar wrapper, with subtle head tilt when alt frame shows */}
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
        <motion.div
          animate={{
            rotate: showAlt && c.id === 'aurora' ? -3 : 0,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="w-28 h-36 sm:w-36 sm:h-44 rounded-2xl overflow-hidden ring-4 ring-background/80 shadow-xl group-hover:ring-primary/40 transition-all duration-500 relative"
        >
          {/* Base smile frame — shifts slightly when alt shows to hint at hand movement */}
          <motion.img
            src={c.src}
            alt={`${c.name}, your reflective companion`}
            className="absolute inset-0 w-full h-full object-cover"
            width={512}
            height={640}
            loading="lazy"
            animate={{
              y: showAlt ? (c.id === 'aurora' ? -2 : -1.5) : 0,
              x: showAlt ? (c.id === 'aurora' ? 1 : -1) : 0,
            }}
            transition={{ duration: c.id === 'marcus' ? 0.8 : 0.4, ease: 'easeInOut' }}
          />
          {/* Alt expression frame, cross-faded on top with matching shift */}
          <motion.img
            src={c.altSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: showAlt ? 1 : 0,
              transition: c.id === 'marcus' ? 'opacity 0.8s ease-in-out' : 'opacity 0.3s ease-in-out',
            }}
            width={512}
            height={640}
            loading="lazy"
            animate={{
              y: showAlt ? (c.id === 'aurora' ? -2 : -1.5) : 0,
              x: showAlt ? (c.id === 'aurora' ? 1 : -1) : 0,
            }}
            transition={{ duration: c.id === 'marcus' ? 0.8 : 0.4, ease: 'easeInOut' }}
          />
        </motion.div>

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
  );
}

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
          <CompanionCard key={c.id} c={c} idx={idx} onChoose={choose} />
        ))}
      </div>
    </div>
  );
}
