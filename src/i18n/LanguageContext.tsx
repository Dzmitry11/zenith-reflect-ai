import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Locale, type TranslationKey } from './translations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reflecta-locale');
      if (saved && (saved === 'en' || saved === 'sv' || saved === 'ru')) return saved;
    }
    return 'en';
  });

  // Load locale from profile on auth
  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('locale').eq('id', user.id).single().then(({ data }) => {
      if (data?.locale && (data.locale === 'en' || data.locale === 'sv' || data.locale === 'ru')) {
        setLocaleState(data.locale as Locale);
        localStorage.setItem('reflecta-locale', data.locale);
      }
    });
  }, [user]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('reflecta-locale', newLocale);
    // Persist to DB
    if (user) {
      supabase.from('profiles').update({ locale: newLocale }).eq('id', user.id).then(() => {});
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
