import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from '@tanstack/react-router';
import auroraSmile from '@/assets/avatar-aurora-smile.png';
import auroraWink from '@/assets/avatar-aurora-wink.png';
import marcusSmile from '@/assets/avatar-marcus-smile.png';
import marcusTilt from '@/assets/avatar-marcus-tilt.png';
import elenaSmile from '@/assets/avatar-elena-smile.png';
import elenaWink from '@/assets/avatar-elena-wink.png';
import thomasSmile from '@/assets/avatar-thomas-smile.png';
import thomasTilt from '@/assets/avatar-thomas-tilt.png';
import amaraSmile from '@/assets/avatar-amara-smile.png';
import amaraWink from '@/assets/avatar-amara-wink.png';

type CompanionId = 'aurora' | 'marcus' | 'elena' | 'thomas' | 'amara';

const COMPANIONS: Array<{
  id: CompanionId;
  name: string;
  tagline: string;
  src: string;
  altSrc: string;
  altDuration: number;
  interval: number;
  startDelay: number;
  glow: string;
  delay: number;
}> = [
  {
    id: 'aurora',
    name: 'Aurora',
    tagline: 'Warm, gentle, here to listen',
    src: auroraSmile,
    altSrc: auroraWink,
    altDuration: 320,
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
    altDuration: 1400,
    interval: 6400,
    startDelay: 4200,
    glow: 'from-emerald-200/40 via-teal-200/30 to-sky-200/40',
    delay: 0.4,
  },
  {
    id: 'elena',
    name: 'Elena',
    tagline: 'Kind, wise, always comforting',
    src: elenaSmile,
    altSrc: elenaWink,
    altDuration: 400,
    interval: 5800,
    startDelay: 2600,
    glow: 'from-orange-200/40 via-amber-200/30 to-yellow-200/40',
    delay: 0.2,
  },
  {
    id: 'thomas',
    name: 'Thomas',
    tagline: 'Reliable, calm, reassuring',
    src: thomasSmile,
    altSrc: thomasTilt,
    altDuration: 1200,
    interval: 7000,
    startDelay: 3400,
    glow: 'from-blue-200/40 via-slate-200/30 to-indigo-200/40',
    delay: 0.6,
  },
  {
    id: 'amara',
    name: 'Amara',
    tagline: 'Optimistic, joyful, inspiring',
    src: amaraSmile,
    altSrc: amaraWink,
    altDuration: 350,
    interval: 5500,
    startDelay: 3000,
    glow: 'from-yellow-200/40 via-orange-200/30 to-red-200/40',
    delay: 0.8,
  },
];

/** Random gesture offset to avoid identical repetition. */
function randomGesture(base: number, variance: number) {
  return base + (Math.random() - 0.5) * 2 * variance;
}

type GestureProfile = {
  yRange: [number, number];
  xRange: [number, number];
  rotateRange: [number, number];
  scaleRange: [number, number];
};

const GESTURE_PROFILES: Record<CompanionId, GestureProfile> = {
  aurora:  { yRange: [-2, 1.2], xRange: [0.8, 0.8], rotateRange: [0, 1.5], scaleRange: [1, 0.012] },
  marcus:  { yRange: [-1.4, 1], xRange: [-0.6, 0.6], rotateRange: [0, 1.2], scaleRange: [1, 0.01] },
  // Slightly wider, softer envelopes — feel more alive but still gentle.
  elena:   { yRange: [-2.4, 1.6], xRange: [0.4, 1.4], rotateRange: [-0.4, 2.2], scaleRange: [1.004, 0.014] },
  thomas:  { yRange: [-1.8, 1.2], xRange: [-1.2, 1.2], rotateRange: [-0.6, 1.8], scaleRange: [1, 0.012] },
  amara:   { yRange: [-2.6, 1.8], xRange: [0.6, 1.6], rotateRange: [-0.6, 2.4], scaleRange: [1.005, 0.016] },
};

function pickGesture(p: GestureProfile) {
  return {
    y: randomGesture(p.yRange[0], p.yRange[1]),
    x: randomGesture(p.xRange[0], p.xRange[1]),
    rotate: randomGesture(p.rotateRange[0], p.rotateRange[1]),
    scale: randomGesture(p.scaleRange[0], p.scaleRange[1]),
  };
}

/** Periodically swaps to an alt expression frame with varied gesture. */
function useExpressionFrame(
  interval: number,
  altDuration: number,
  startDelay: number,
  profile: GestureProfile,
  enabled: boolean = true,
) {
  const [showAlt, setShowAlt] = useState(false);
  const [gesture, setGesture] = useState({ y: 0, x: 0, rotate: 0, scale: 1 });

  useEffect(() => {
    if (!enabled) return;
    let altTimeout: ReturnType<typeof setTimeout>;
    let nextTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const schedule = (delay: number) => {
      nextTimeout = setTimeout(() => {
        if (cancelled) return;
        setGesture(pickGesture(profile));
        setShowAlt(true);
        // Vary the hold duration ±20% so repeats don't feel identical.
        const hold = altDuration * (0.85 + Math.random() * 0.3);
        altTimeout = setTimeout(() => {
          if (cancelled) return;
          setShowAlt(false);
          // Vary the gap between gestures ±25%.
          schedule(interval * (0.75 + Math.random() * 0.5));
        }, hold);
      }, delay);
    };

    schedule(startDelay);

    return () => {
      cancelled = true;
      clearTimeout(nextTimeout);
      clearTimeout(altTimeout);
    };
  }, [interval, altDuration, startDelay, profile, enabled]);

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
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  // On mobile, throttle the gesture loop ~1.6x to halve commits per second
  // without changing the perceived rhythm. Disable entirely under reduced motion.
  const animationsEnabled = !prefersReducedMotion;
  const mobileFactor = isMobile ? 1.6 : 1;
  const { showAlt, gesture } = useExpressionFrame(
    c.interval * mobileFactor,
    c.altDuration,
    c.startDelay,
    GESTURE_PROFILES[c.id],
    animationsEnabled,
  );
  const isWinkType = c.id === 'aurora' || c.id === 'elena' || c.id === 'amara';
  // Smoother, slightly longer eases for the new trio.
  const isNewTrio = c.id === 'elena' || c.id === 'thomas' || c.id === 'amara';
  const transitionDuration = isNewTrio ? (isWinkType ? 0.6 : 1.0) : isWinkType ? 0.4 : 0.8;
  const opacityTransition = isNewTrio
    ? isWinkType
      ? 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)'
    : isWinkType
      ? 'opacity 0.3s ease-in-out'
      : 'opacity 0.8s ease-in-out';
  // Hint to the compositor — keep these layers off the main paint pass.
  const gpuStyle = { willChange: 'transform', transform: 'translateZ(0)' } as const;

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
      {/* Pulsing glow halo — static (no scale loop) on mobile to avoid blur repaints */}
      <motion.div
        aria-hidden
        animate={
          animationsEnabled && !isMobile
            ? { scale: [1, 1.12, 1], opacity: [0.55, 0.85, 0.55] }
            : { scale: 1, opacity: 0.65 }
        }
        transition={{
          duration: 3.6,
          repeat: animationsEnabled && !isMobile ? Infinity : 0,
          ease: 'easeInOut',
          delay: c.delay,
        }}
        style={gpuStyle}
        className={`absolute -inset-3 sm:-inset-4 rounded-2xl bg-gradient-to-br ${c.glow} ${
          isMobile ? 'blur-lg' : 'blur-2xl'
        } -z-10`}
      />

      {/* Breathing avatar wrapper */}
      <motion.div
        animate={
          animationsEnabled
            ? { y: [0, -4, 0], scale: [1, 1.015, 1] }
            : { y: 0, scale: 1 }
        }
        transition={{
          duration: isMobile ? 6 : 4.2,
          repeat: animationsEnabled ? Infinity : 0,
          ease: 'easeInOut',
          delay: c.delay,
        }}
        style={gpuStyle}
        className="relative"
      >
        <motion.div
          animate={{
            rotate: showAlt && isWinkType ? gesture.rotate - 3 : showAlt ? gesture.rotate * 0.4 : 0,
            scale: showAlt ? gesture.scale : 1,
          }}
          transition={{
            duration: isNewTrio ? 0.9 : 0.6,
            ease: isNewTrio ? [0.4, 0, 0.2, 1] : 'easeInOut',
          }}
          style={gpuStyle}
          className="w-20 h-26 sm:w-28 sm:h-36 rounded-2xl overflow-hidden ring-4 ring-background/80 shadow-xl group-hover:ring-primary/40 transition-all duration-500 relative"
        >
          <motion.img
            src={c.src}
            alt={`${c.name}, your reflective companion`}
            className="absolute inset-0 w-full h-full object-cover"
            width={512}
            height={640}
            loading="lazy"
            decoding="async"
            draggable={false}
            animate={{
              y: showAlt ? gesture.y : 0,
              x: showAlt ? gesture.x * (isWinkType ? 1 : -1) : 0,
            }}
            transition={{
              duration: transitionDuration,
              ease: isNewTrio ? [0.4, 0, 0.2, 1] : 'easeInOut',
            }}
            style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
          />
          <motion.img
            src={c.altSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: showAlt ? 1 : 0,
              transition: opacityTransition,
              willChange: 'opacity, transform',
              backfaceVisibility: 'hidden',
            }}
            width={512}
            height={640}
            loading="lazy"
            decoding="async"
            draggable={false}
            animate={{
              y: showAlt ? gesture.y : 0,
              x: showAlt ? gesture.x * (isWinkType ? 1 : -1) : 0,
            }}
            transition={{
              duration: transitionDuration,
              ease: isNewTrio ? [0.4, 0, 0.2, 1] : 'easeInOut',
            }}
          />
        </motion.div>

        {/* Decorative sheen — skip on mobile (large gradient overlay = wasted GPU). */}
        {!isMobile && animationsEnabled && (
          <motion.div
            aria-hidden
            animate={{ opacity: [0, 0.25, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: c.delay + 1.5,
            }}
            style={gpuStyle}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white to-transparent pointer-events-none"
          />
        )}
      </motion.div>

      <div className="text-center">
        <p className="font-display text-sm sm:text-base font-semibold text-foreground">{c.name}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground max-w-[8rem] sm:max-w-[10rem] leading-snug mt-0.5">
          {c.tagline}
        </p>
      </div>

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

      <div className="flex items-end justify-center gap-4 sm:gap-8 flex-wrap">
        {COMPANIONS.map((c, idx) => (
          <CompanionCard key={c.id} c={c} idx={idx} onChoose={choose} />
        ))}
      </div>
    </div>
  );
}
