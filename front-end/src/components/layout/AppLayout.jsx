import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ROUTES } from '../../utils/constants';

/** Map routes → titres de page */
const PAGE_TITLES = {
  [ROUTES.DASHBOARD]: 'Tableau de bord',
  [ROUTES.TICKETS]: 'Tickets',
  [ROUTES.TICKET_NEW]: 'Nouveau ticket',
  [ROUTES.ADMIN_USERS]: 'Utilisateurs',
  [ROUTES.ADMIN_CATEGORIES]: 'Catégories',
  [ROUTES.ADMIN_SETTINGS]: 'Paramètres',
};

function resolveTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/tickets/')) return 'Détail du ticket';
  return 'TicketFlow';
}

/**
 * Layout principal avec sidebar + header + contenu.
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header title={resolveTitle(pathname)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
