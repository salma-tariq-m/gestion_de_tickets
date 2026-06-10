import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { formatRelative } from '../../utils/formatDate';
import { calculateSLA } from '../../utils/slaUtils';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import SLABar from './SLABar';
import AvatarStack from '../ui/AvatarStack';

/**
 * Carte de ticket TicketFlow.
 */
export function TicketCard({ ticket }) {
  const navigate = useNavigate();
  const { isBreached } = calculateSLA(ticket.createdAt, ticket.slaLimitHours, ticket.closedAt);

  // Carte Critique (SLA dépassé) : border-left 3px solid #E24B4A
  const cardStyle = {
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    borderLeft: isBreached ? '3px solid var(--color-critical)' : '1px solid var(--border)',
  };

  const handleCardClick = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="tf-card tf-card-hover animate-fade-in"
      style={cardStyle}
    >
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          className="text-mono"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          #{ticket.id}
        </span>
        <div className="d-flex align-items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <PriorityBadge priority={ticket.priority} />
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            {formatRelative(ticket.createdAt)}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="m-0 mb-1" style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
        {ticket.title}
      </h3>

      {/* Description Excerpt 2 lines */}
      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-tertiary)',
          margin: '0 0 var(--spacing-md) 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          boxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: '1.5',
          height: '42px', // 14px * 1.5 * 2 = 42px
        }}
      >
        {ticket.description}
      </p>

      {/* Footer Info */}
      <div className="row align-items-center mt-3 g-2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="col-auto">
          <StatusBadge status={ticket.status} />
        </div>
        <div className="col" style={{ flex: '1', minWidth: '150px', padding: '0 var(--spacing-md)' }}>
          {ticket.status !== 'resolu' && ticket.status !== 'ferme' && (
            <SLABar createdAt={ticket.createdAt} slaLimitHours={ticket.slaLimitHours} closedAt={ticket.closedAt} />
          )}
        </div>
        <div className="col-auto">
          <AvatarStack users={ticket.assigned_users || []} size="sm" />
        </div>
      </div>
    </div>
  );
}

TicketCard.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.string,
    status: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    slaLimitHours: PropTypes.number,
    closedAt: PropTypes.string,
    assigned_users: PropTypes.array,
  }).isRequired,
};

export default TicketCard;
