// Browser Web Speech API utilities for TTS and STT.
// Free, no API key. Quality depends on browser/OS voices.

import type { Locale } from '@/i18n/translations';

export type CompanionVoiceId = 'aurora' | 'marcus';

const LOCALE_TO_BCP47: Record<Locale, string[]> = {
  en: ['en-US', 'en-GB', 'en'],
  ru: ['ru-RU', 'ru'],
  sv: ['sv-SE', 'sv'],
};

let cachedVoices: SpeechSynthesisVoice[] | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing && existing.length > 0) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }
    const handler = () => {
      const v = window.speechSynthesis.getVoices();
      cachedVoices = v;
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
      resolve(v);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    // Fallback timeout
    setTimeout(() => resolve(window.speechSynthesis.getVoices() || []), 1000);
  });
}

export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function isSTTSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/** Pick the best matching voice for companion + locale. */
async function pickVoice(
  companion: CompanionVoiceId,
  locale: Locale,
): Promise<SpeechSynthesisVoice | null> {
  const voices = cachedVoices ?? (await loadVoices());
  if (!voices.length) return null;

  const langTags = LOCALE_TO_BCP47[locale] ?? ['en-US'];

  // Filter by language first
  const langMatched = voices.filter((v) =>
    langTags.some((tag) => v.lang?.toLowerCase().startsWith(tag.toLowerCase().slice(0, 2))),
  );
  const pool = langMatched.length ? langMatched : voices;

  // Heuristic gender hints in voice names
  const femaleHints = [
    'female', 'aurora', 'samantha', 'victoria', 'karen', 'tessa', 'moira',
    'alena', 'milena', 'katya', 'tatyana', 'svetlana', 'anna', 'maria',
    'zira', 'hazel', 'fiona', 'allison', 'ava', 'serena', 'susan',
    'astrid', 'klara', 'alva', 'elsa',
  ];
  const maleHints = [
    'male', 'marcus', 'daniel', 'alex', 'fred', 'tom', 'george',
    'yuri', 'pavel', 'maxim', 'dmitri',
    'david', 'mark', 'james', 'oliver', 'aaron',
    'oskar', 'magnus', 'erik',
  ];

  const hints = companion === 'aurora' ? femaleHints : maleHints;

  const matched = pool.find((v) => {
    const n = v.name.toLowerCase();
    return hints.some((h) => n.includes(h));
  });
  if (matched) return matched;

  // Fallback: prefer non-matched gender opposite if possible
  const opposite = companion === 'aurora' ? maleHints : femaleHints;
  const nonOpposite = pool.find((v) => {
    const n = v.name.toLowerCase();
    return !opposite.some((h) => n.includes(h));
  });
  return nonOpposite ?? pool[0] ?? null;
}

export async function speak(
  text: string,
  companion: CompanionVoiceId,
  locale: Locale,
  callbacks?: { onEnd?: () => void; onError?: () => void },
): Promise<void> {
  if (!isTTSSupported() || !text.trim()) {
    callbacks?.onError?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel(); // stop any current playback

  const utter = new SpeechSynthesisUtterance(text);
  const voice = await pickVoice(companion, locale);
  if (voice) {
    utter.voice = voice;
    utter.lang = voice.lang;
  } else {
    utter.lang = LOCALE_TO_BCP47[locale]?.[0] ?? 'en-US';
  }

  // Tone tweaks per persona
  if (companion === 'aurora') {
    utter.pitch = 1.15; // softer, slightly higher
    utter.rate = 0.95;
  } else {
    utter.pitch = 0.75; // lower, calm
    utter.rate = 0.92;
  }

  utter.onend = () => callbacks?.onEnd?.();
  utter.onerror = () => callbacks?.onError?.();

  synth.speak(utter);
}

export function stopSpeaking() {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel();
  }
}

/* ── Speech Recognition (STT) ── */

type RecognitionHandle = {
  stop: () => void;
};

export function startRecognition(
  locale: Locale,
  callbacks: {
    onResult: (text: string, isFinal: boolean) => void;
    onEnd?: () => void;
    onError?: (err: string) => void;
  },
): RecognitionHandle | null {
  if (!isSTTSupported()) {
    callbacks.onError?.('not-supported');
    return null;
  }
  const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = LOCALE_TO_BCP47[locale]?.[0] ?? 'en-US';
  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onresult = (event: any) => {
    let transcript = '';
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
      if (event.results[i].isFinal) isFinal = true;
    }
    callbacks.onResult(transcript, isFinal);
  };
  recognition.onend = () => callbacks.onEnd?.();
  recognition.onerror = (e: any) => callbacks.onError?.(e.error ?? 'unknown');

  try {
    recognition.start();
  } catch (e) {
    callbacks.onError?.('start-failed');
    return null;
  }

  return {
    stop: () => {
      try { recognition.stop(); } catch { /* noop */ }
    },
  };
}
