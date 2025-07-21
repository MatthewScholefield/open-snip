import { useLocalStorage, useMediaQuery } from 'usehooks-ts';
import { useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type EffectiveTheme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<ThemeMode>('theme', 'auto');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const getEffectiveTheme = (): EffectiveTheme => {
    if (theme === 'auto') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return theme;
  };

  const toggleTheme = () => {
    if (theme === 'auto') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('auto');
    }
  };

  const effectiveTheme = getEffectiveTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  return {
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme,
  };
};
