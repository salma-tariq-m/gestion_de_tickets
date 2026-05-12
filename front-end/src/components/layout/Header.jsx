import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Search, Globe } from 'lucide-react';
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

/**
 * En-tête de l'application avec recherche, notifications et profil.
 * @param {{ title?: string }} props
 */
export function Header({ title }) {
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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
      {/* Left: page title */}
      <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors flex items-center gap-1 text-xs font-medium"
          title="Changer la langue"
        >
          <Globe size={16} />
          <span className="uppercase">{i18n.language}</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            id="notifications-btn"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label={t('nav.notifications')}
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-gray-900">{t('notifications.title')}</span>
                {unread > 0 && <Badge variant="error" size="xs">{unread} non lues</Badge>}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {isLoading ? (
                  <div className="py-8 flex justify-center"><Spinner /></div>
                ) : notifications.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-400">{t('notifications.empty')}</p>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors',
                        !n.read_at && 'bg-indigo-50/50'
                      )}
                      onClick={() => markRead(n.id)}
                    >
                      <p className="text-sm text-gray-800 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatRelative(n.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <Avatar name={user?.name || ''} size="sm" />
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string,
};

export default Header;
