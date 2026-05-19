import { useEffect, useState } from 'react';

/**
 * Hook pour gérer le mode sombre.
 * Persiste le choix dans localStorage et applique/retire la classe `dark` sur <html>.
 *
 * @returns {{ isDark: boolean, toggle: () => void }}
 */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark((v) => !v);

  return { isDark, toggle };
}

export default useDarkMode;
