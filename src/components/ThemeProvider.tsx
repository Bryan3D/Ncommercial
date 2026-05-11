'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Read saved preference (or system preference) once mounted
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(saved ?? system);
  }, []);

  // Apply / remove the `dark` class whenever theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

/**
 * Inline script injected into <head> before hydration to prevent the white
 * flash when a user returns with a saved "dark" preference.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`;
