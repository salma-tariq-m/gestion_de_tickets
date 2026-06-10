import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotifPanel from './NotifPanel';

/** Map des routes vers les titres des pages en français */
const PAGE_TITLES = {
  '/dashboard': 'Tableau de bord',
  '/tickets': 'Mes tickets',
  '/tickets/new': 'Créer un ticket',
  '/admin/users': 'Console Utilisateurs',
  '/admin/categories': 'Gestion Catégories',
  '/settings': 'Paramètres',
  '/teams': 'Équipes support',
  '/kb': 'Base de Connaissances (KB)',
  '/reports': 'Rapports & Statistiques',
};

function resolveTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/tickets/')) return 'Détail du ticket';
  return 'TicketFlow';
}

/**
 * Layout principal avec Sidebar fixe, Navbar supérieure et panneau de notifications coulissant.
 */
export function AppLayout() {
  const { pathname } = useLocation();
  const [notifsOpen, setNotifsOpen] = useState(false);

  return (
    <div className="tf-app-container">
      {/* Barre de navigation latérale fixe 240px */}
      <Sidebar />

      {/* Zone de contenu principal décalée de 240px */}
      <div className="tf-main-content">
        <Navbar
          title={resolveTitle(pathname)}
          onToggleNotifs={() => setNotifsOpen(!notifsOpen)}
          notifsOpen={notifsOpen}
        />
        
        {/* Contenu principal de la page */}
        <div style={{ padding: 'var(--spacing-lg) 0' }}>
          <Outlet />
        </div>
      </div>

      {/* Panneau de notifications latéral droit */}
      <NotifPanel
        isOpen={notifsOpen}
        onClose={() => setNotifsOpen(false)}
      />
    </div>
  );
}

export default AppLayout;
