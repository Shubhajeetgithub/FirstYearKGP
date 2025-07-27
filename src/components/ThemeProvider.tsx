'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { themes, ThemeType } from '@/styles/theme';

const ThemeContext = createContext<{
  theme: ThemeType;
  themeConfig: typeof themes.light | typeof themes.dark;
  toggleTheme: () => void;
}>({
  theme: 'dark',
  themeConfig: themes.dark,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [themeConfig, setThemeConfig] = useState<typeof themes[ThemeType]>(themes.dark);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    let initialTheme: ThemeType;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      initialTheme = savedTheme;
    } else {
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setTheme(initialTheme);
    setThemeConfig(themes[initialTheme]);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setThemeConfig(themes[newTheme]);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeConfig, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
