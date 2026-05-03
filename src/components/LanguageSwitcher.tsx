import { useLanguage } from '@/i18n/LanguageContext';
import { LOCALE_LABELS, type Locale } from '@/i18n/translations';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LOCALES: Locale[] = ['en', 'sv', 'ru'];
const SHORT: Record<Locale, string> = { en: 'EN', sv: 'SV', ru: 'RU' };

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{SHORT[locale]}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[140px] rounded-xl border border-border bg-card shadow-lg py-1 z-50">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => { setLocale(loc); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${locale === loc ? 'text-primary font-medium bg-primary/5' : 'text-foreground hover:bg-accent/30'}`}
            >
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
