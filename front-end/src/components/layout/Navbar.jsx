import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { IconBell } from '@tabler/icons-react';
import { fetchNotifications } from '../../app/slices/notifSlice';
import Avatar from '../ui/Avatar';

/**
 * En-tête supérieur de l'application (Navbar)
 */
export function Navbar({ title, onToggleNotifs, notifsOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  // Charger périodiquement les notifications
  useEffect(() => {
    if (user) {
      dispatch(fetchNotifications());
      const interval = setInterval(() => {
        dispatch(fetchNotifications());
      }, 30000); // toutes les 30s
      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  return (
    <header className="tf-navbar">
      {/* Titre de la section active */}
      <h1 className="m-0" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)' }}>
        {title || 'TicketFlow'}
      </h1>

      {/* Actions à droite */}
      <div className="d-flex align-items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        {/* Bouton Notification */}
        <button
          onClick={onToggleNotifs}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--spacing-xs)',
            color: notifsOpen ? 'var(--color-600)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'all 0.2s ease-in-out'
          }}
          title="Notifications"
          aria-label="Voir les notifications"
        >
          <IconBell size={20} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                minWidth: '16px',
                height: '16px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-critical)',
                color: 'var(--white)',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                lineHeight: 1
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Détails Utilisateur */}
        {user && (
          <div 
            className="d-flex align-items-center gap-2" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-sm)',
              paddingLeft: 'var(--spacing-md)',
              borderLeft: '1px solid var(--border)',
              height: '30px'
            }}
          >
            <Avatar name={user.name} role={user.role} size="sm" />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '1.2' }}>
              <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                {user.name}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

Navbar.propTypes = {
  title: PropTypes.string,
  onToggleNotifs: PropTypes.func.isRequired,
  notifsOpen: PropTypes.bool.isRequired,
};

export default Navbar;
