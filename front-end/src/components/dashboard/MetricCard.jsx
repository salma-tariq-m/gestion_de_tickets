import React from 'react';
import PropTypes from 'prop-types';

/**
 * Carte de métrique KPI pour le dashboard conforme à la charte TicketFlow
 */
export function MetricCard({
  value,
  label,
  subLabel,
  color = 'var(--color-600)',
  icon: Icon,
}) {
  return (
    <div 
      className="tf-metric-card animate-fade-in"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 1px 3px rgba(12, 68, 124, 0.02)',
        height: '100%'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="tf-metric-label" style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {label}
        </span>
        <h1 
          className="tf-metric-value" 
          style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: color, 
            margin: '0 0 4px 0',
            lineHeight: 1.1
          }}
        >
          {value}
        </h1>
        {subLabel && (
          <span className="tf-metric-subtext" style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
            {subLabel}
          </span>
        )}
      </div>

      {Icon && (
        <div 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
          }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
}

MetricCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  subLabel: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.elementType,
};

export default MetricCard;
