import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { IconX, IconCheck } from '@tabler/icons-react';
import { fetchNotifications, markNotificationsRead } from '../../app/slices/notifSlice';
import { formatRelative } from '../../utils/formatDate';

/**
 * Panneau de notifications latéral droit
 */
export function NotifPanel({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { list: notifications, loading } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen && user) {
      dispatch(fetchNotifications());
    }
  }, [isOpen, user, dispatch]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    dispatch(markNotificationsRead());
  };

  const getDotColor = (type) => {
    switch (type) {
      case 'critical':
        return '#E24B4A'; // rouge
      case 'sla_risk':
      case 'sla-risk':
        return '#EF9F27'; // orange
      case 'resolved':
      case 'resolu':
        return '#639922'; // vert
      default:
        return '#95A5A6'; // gris info
    }
  };

  return (
    <div className="tf-notif-panel animate-slide-in">
      <div className="tf-notif-header">
        <h3 className="m-0" style={{ fontSize: '16px', fontWeight: 500 }}>
          Notifications
        </h3>
        <div className="d-flex align-items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {notifications.some(n => !n.read) && (
            <button
              onClick={handleMarkAllRead}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-600)',
                fontSize: '12px',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
              title="Tout marquer comme lu"
            >
              <IconCheck size={14} />
              <span>Tout lu</span>
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              padding: '2px'
            }}
            aria-label="Fermer"
          >
            <IconX size={20} />
          </button>
        </div>
      </div>

      <ul className="tf-notif-list">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Chargement des notifications...
          </div>
        ) : notifications.length === 0 ? (
          <li style={{ padding: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px', fontStyle: 'italic' }}>
            Aucune notification pour le moment.
          </li>
        ) : (
          notifications.map((notif) => (
            <li
              key={notif.id}
              className="tf-notif-item animate-fade-in"
              style={{
                backgroundColor: notif.read ? 'var(--white)' : 'var(--color-50)'
              }}
            >
              <span
                className="tf-notif-dot"
                style={{ backgroundColor: getDotColor(notif.type) }}
              />
              <div className="tf-notif-content">
                <p className="tf-notif-message">{notif.message}</p>
                <span className="tf-notif-time">
                  {formatRelative(notif.createdAt || notif.created_at)}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

NotifPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotifPanel;
