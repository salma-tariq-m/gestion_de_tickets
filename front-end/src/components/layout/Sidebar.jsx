import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  IconLayoutDashboard, 
  IconTicket, 
  IconUsers, 
  IconBook, 
  IconChartBar, 
  IconSettings,
  IconLogout,
  IconCategory
} from '@tabler/icons-react';
import { logoutUser } from '../../app/slices/authSlice';
import { fetchTickets } from '../../app/slices/ticketSlice';

/**
 * Navigation latérale (Sidebar 240px fixe à gauche)
 */
export function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: tickets } = useSelector((state) => state.tickets);

  useEffect(() => {
    if (user) {
      dispatch(fetchTickets());
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate('/login');
  };

  const myTicketsCount = tickets.filter(t => {
    if (user?.role === 'user') {
      return t.status !== 'resolu' && t.status !== 'ferme';
    } else {
      return t.assigned_users?.some(u => u.id === user?.id) && t.status !== 'resolu' && t.status !== 'ferme';
    }
  }).length;

  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
    { to: '/tickets', label: 'Mes tickets', icon: IconTicket, badge: myTicketsCount > 0 ? myTicketsCount : null },
    { to: '/teams', label: 'Équipes', icon: IconUsers },
    { to: '/kb', label: 'Base KB', icon: IconBook },
    { to: '/reports', label: 'Rapports', icon: IconChartBar },
  ];

  if (user?.role === 'admin') {
    menuItems.push(
      { to: '/admin/users', label: 'Utilisateurs', icon: IconUsers },
      { to: '/admin/categories', label: 'Catégories', icon: IconCategory }
    );
  }

  return (
    <aside className="tf-sidebar">
      {/* Logo Section */}
      <div 
        className="d-flex align-items-center"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          padding: '0 var(--spacing-lg)',
          borderBottom: '1px solid var(--border)',
          height: '60px',
          flexShrink: 0
        }}
      >
        <div 
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#639922',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--white)',
            fontWeight: 'bold',
            fontSize: '14px',
            flexShrink: 0
          }}
        >
          TF
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)', lineHeight: '1.2' }}>
            TicketFlow
          </span>
          <span className="tiny" style={{ color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
            Système de Gestion des Tickets
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="tf-sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `tf-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="tf-nav-item-content">
              <item.icon size={20} stroke={1.5} />
              <span>{item.label}</span>
            </div>
            {item.badge && <span className="tf-nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div style={{ padding: 'var(--spacing-sm)', borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={handleLogout}
          className="tf-nav-item w-100" 
          style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}
        >
          <div className="tf-nav-item-content">
            <IconLogout size={20} stroke={1.5} />
            <span>Déconnexion</span>
          </div>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
