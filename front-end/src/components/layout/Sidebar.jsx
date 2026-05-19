import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Ticket, Plus, Users, FolderOpen,
  Settings, LogOut, ChevronLeft, ChevronRight, Zap,
  Shield,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../features/auth/useAuth';
import { ROUTES } from '../../utils/constants';
import PropTypes from 'prop-types';

const NavItem = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
        isActive
          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
      )
    }
  >
    <Icon size={18} className="shrink-0" />
    {!collapsed && <span className="truncate">{label}</span>}
  </NavLink>
);

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  collapsed: PropTypes.bool,
};

/**
 * Barre latérale de navigation principale.
 * @param {{ collapsed: boolean, onToggle: () => void }} props
 */
export function Sidebar({ collapsed, onToggle }) {
  const { t } = useTranslation();
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <aside
      className={cn(
        'flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-2.5 px-4 py-5 border-b border-gray-100 dark:border-gray-800',
        collapsed && 'justify-center px-3'
      )}>
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight">TicketFlow</span>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium leading-none mt-0.5">Support Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        <NavItem to={ROUTES.DASHBOARD} icon={LayoutDashboard} label={t('nav.dashboard')} collapsed={collapsed} />
        <NavItem to={ROUTES.TICKETS} icon={Ticket} label={t('nav.tickets')} collapsed={collapsed} />
        <NavItem to={ROUTES.TICKET_NEW} icon={Plus} label={t('nav.newTicket')} collapsed={collapsed} />

        {isAdmin && (
          <>
            <div className={cn('my-3 border-t border-gray-100 dark:border-gray-800', collapsed && 'mx-1')} />
            {!collapsed && (
              <div className="flex items-center gap-1.5 px-3 py-1 mb-1">
                <Shield size={11} className="text-indigo-400" />
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {t('admin.title')}
                </p>
              </div>
            )}
            <NavItem to={ROUTES.ADMIN_USERS} icon={Users} label={t('nav.users')} collapsed={collapsed} />
            <NavItem to={ROUTES.ADMIN_CATEGORIES} icon={FolderOpen} label={t('nav.categories')} collapsed={collapsed} />
            <NavItem to={ROUTES.ADMIN_SETTINGS} icon={Settings} label={t('nav.settings')} collapsed={collapsed} />
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-1">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400',
            'hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full',
            collapsed && 'justify-center'
          )}
          title={t('auth.logout')}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>{t('auth.logout')}</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-400 transition-colors w-full',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Agrandir' : 'Réduire'}
        >
          {collapsed ? <ChevronRight size={16} /> : (
            <>
              <ChevronLeft size={16} />
              <span>Réduire</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Sidebar;
