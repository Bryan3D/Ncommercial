'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { t as translate, tCat, type Lang } from '@/lib/translations';

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
  tCat: (slug: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  toggle: () => {},
  t: (key) => key,
  tCat: (slug) => slug,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved === 'en' || saved === 'es') setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang === 'es' ? 'es' : 'en';
  }, [lang]);

  const toggle = () => setLang((l) => (l === 'en' ? 'es' : 'en'));

  return (
    <LangContext.Provider value={{
      lang,
      toggle,
      t: (key) => translate(key, lang),
      tCat: (slug) => tCat(slug, lang),
    }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLanguage = () => useContext(LangContext);
