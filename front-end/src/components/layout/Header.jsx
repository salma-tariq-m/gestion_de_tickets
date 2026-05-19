import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Globe, Sun, Moon, User } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Spinner } from '../ui/Spinner';
import { useAuth } from '../../features/auth/useAuth';
import { formatRelative } from '../../utils/formatDate';
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from '../../features/dashboard/dashboardApi';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';
import i18n from '../../app/i18n';

const ROLE_BADGE = {
  admin: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  agent: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  user: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
};

/**
 * En-tête de l'application avec dark toggle, notifications et profil.
 * @param {{ title?: string, isDark?: boolean, onToggleDark?: () => void }} props
 */
export function Header({ title, isDark, onToggleDark }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const { data: notifications = [], isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
  });
  const [markRead] = useMarkNotificationReadMutation();

  const unread = notifications.filter((n) => !n.read_at).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0 z-10 transition-colors duration-200">
      {/* Left: page title */}
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{title}</h1>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Changer la langue"
        >
          <Globe size={16} />
          <span className="uppercase">{i18n.language}</span>
        </button>

        {/* Dark mode toggle */}
        <button
          id="dark-mode-toggle"
          onClick={onToggleDark}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-yellow-400 transition-all duration-200"
          title={isDark ? 'Mode clair' : 'Mode sombre'}
          aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
        >
          {isDark ? (
            <Sun size={18} className="text-yellow-400 animate-fade-in" />
          ) : (
            <Moon size={18} className="animate-fade-in" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-btn"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label={t('nav.notifications')}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse-slow">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{t('notifications.title')}</span>
                {unread > 0 && <Badge variant="error" size="xs">{unread} non lues</Badge>}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                {isLoading ? (
                  <div className="py-8 flex justify-center"><Spinner /></div>
                ) : notifications.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('notifications.empty')}</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors',
                        !n.read_at && 'bg-indigo-50/60 dark:bg-indigo-950/30'
                      )}
                      onClick={() => markRead(n.id)}
                    >
                      <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatRelative(n.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar + role chip */}
        <div className="flex items-center gap-2 ml-1 pl-2 border-l border-gray-200 dark:border-gray-700">
          {user?.role && (
            <span className={cn('hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full', ROLE_BADGE[user.role] || ROLE_BADGE.user)}>
              {user.role}
            </span>
          )}
          <Avatar name={user?.name || ''} size="sm" />
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-gray-900 dark:text-white leading-none">{user?.name}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-0.5">
              <User size={9} /> {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  isDark: PropTypes.bool,
  onToggleDark: PropTypes.func,
};

export default Header;
