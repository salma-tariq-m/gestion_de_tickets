import { useState, useEffect } from 'react';

/**
 * Retarde la mise à jour d'une valeur après un délai (debounce).
 * @param {*} value — valeur à debouncer
 * @param {number} delay — délai en ms (défaut 300)
 * @returns {*} valeur debouncée
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
