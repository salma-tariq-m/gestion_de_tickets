import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useDarkMode } from '../../hooks/useDarkMode';
import { ROUTES } from '../../utils/constants';

/** Map routes → titres de page */
const PAGE_TITLES = {
  [ROUTES.DASHBOARD]: 'Tableau de bord',
  [ROUTES.TICKETS]: 'Tickets',
  [ROUTES.TICKET_NEW]: 'Nouveau ticket',
  [ROUTES.ADMIN_USERS]: 'Utilisateurs',
  [ROUTES.ADMIN_CATEGORIES]: 'Catégories',
  [ROUTES.ADMIN_SETTINGS]: 'Paramètres système',
};

function resolveTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/tickets/')) return 'Détail du ticket';
  return 'TicketFlow';
}

/**
 * Layout principal avec sidebar + header + contenu.
 * Gère également le toggle dark/light mode.
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { isDark, toggle: toggleDark } = useDarkMode();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          title={resolveTitle(pathname)}
          isDark={isDark}
          onToggleDark={toggleDark}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
