import React from 'react';
import PropTypes from 'prop-types';
import Badge from '../ui/Badge';

/**
 * Badge de priorité conforme à la charte (Critique, Haute, Normale, Basse)
 */
export function PriorityBadge({ priority = 'normal', size = 'sm' }) {
  const norm = priority.toLowerCase();
  
  const config = {
    critical: {
      text: 'Critique',
      bg: '#FCEBEB',
      color: '#E24B4A',
      showDot: true,
    },
    high: {
      text: 'Haute',
      bg: '#FAEEDA',
      color: '#EF9F27',
      showDot: false,
    },
    normal: {
      text: 'Normale',
      bg: '#E6F1FB',
      color: '#378ADD',
      showDot: false,
    },
    low: {
      text: 'Basse',
      bg: '#EAF3DE',
      color: '#639922',
      showDot: false,
    },
  }[norm] || {
    text: priority,
    bg: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    showDot: false,
  };

  return (
    <Badge
      bgColor={config.bg}
      textColor={config.color}
      showDot={config.showDot}
      dotColor={config.color}
      className="priority-badge"
    >
      {config.text}
    </Badge>
  );
}

PriorityBadge.propTypes = {
  priority: PropTypes.string,
  size: PropTypes.string,
};

export default PriorityBadge;
