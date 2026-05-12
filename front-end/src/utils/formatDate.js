import {
  format,
  formatDistanceToNow,
  parseISO,
  isValid,
} from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Convertit une chaîne ISO ou un objet Date en objet Date valide.
 * @param {string|Date} date
 * @returns {Date}
 */
function toDate(date) {
  if (typeof date === 'string') return parseISO(date);
  return date;
}

/**
 * Formate une date au format court (ex: 12 mai 2026).
 * @param {string|Date} date
 * @returns {string}
 */
export function formatShort(date) {
  const d = toDate(date);
  if (!isValid(d)) return '—';
  return format(d, 'd MMM yyyy', { locale: fr });
}

/**
 * Formate une date complète avec l'heure (ex: 12 mai 2026, 14:30).
 * @param {string|Date} date
 * @returns {string}
 */
export function formatLong(date) {
  const d = toDate(date);
  if (!isValid(d)) return '—';
  return format(d, 'd MMM yyyy, HH:mm', { locale: fr });
}

/**
 * Formate une date de manière relative (ex: il y a 3 heures).
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelative(date) {
  const d = toDate(date);
  if (!isValid(d)) return '—';
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}

/**
 * Formate une date pour un input HTML (YYYY-MM-DD).
 * @param {string|Date} date
 * @returns {string}
 */
export function formatInput(date) {
  const d = toDate(date);
  if (!isValid(d)) return '';
  return format(d, 'yyyy-MM-dd');
}
