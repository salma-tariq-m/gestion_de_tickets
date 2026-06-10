import React from 'react';
import PropTypes from 'prop-types';
import { calculateSLA } from '../../utils/slaUtils';

/**
 * Barre de progression SLA conforme à la charte graphique TicketFlow
 */
export function SLABar({ createdAt, slaLimitHours = 8, closedAt = null }) {
  const { percentage, color, text } = calculateSLA(createdAt, slaLimitHours, closedAt);

  return (
    <div className="tf-sla-container">
      <div className="tf-sla-header">
        <span>SLA</span>
        <span style={{ color: color, fontWeight: 'bold' }}>{text}</span>
      </div>
      <div className="tf-sla-track">
        <div
          className="tf-sla-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

SLABar.propTypes = {
  createdAt: PropTypes.string.isRequired,
  slaLimitHours: PropTypes.number,
  closedAt: PropTypes.string,
};

export default SLABar;
