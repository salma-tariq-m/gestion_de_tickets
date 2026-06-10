import React from 'react';
import PropTypes from 'prop-types';
import Badge from '../ui/Badge';

/**
 * Badge de statut conforme à la charte graphique TicketFlow
 */
export function StatusBadge({ status = 'nouveau' }) {
  const norm = status.toLowerCase().replace('_', '-');

  const config = {
    nouveau: {
      text: 'Nouveau',
      bg: '#E6F1FB',
      color: '#378ADD',
    },
    'en-cours': {
      text: 'En cours',
      bg: '#FAEEDA',
      color: '#EF9F27',
    },
    'en-attente': {
      text: 'En attente',
      bg: '#FAEEDA',
      color: '#EF9F27',
    },
    escalade: {
      text: 'Escalade',
      bg: '#EEEDFE',
      color: '#7F77DD',
    },
    resolu: {
      text: 'Résolu',
      bg: '#EAF3DE',
      color: '#639922',
    },
    ferme: {
      text: 'Fermé',
      bg: '#F1EFE8',
      color: '#888780',
    },
  }[norm] || {
    text: status,
    bg: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
  };

  return (
    <Badge bgColor={config.bg} textColor={config.color}>
      {config.text}
    </Badge>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string,
};

export default StatusBadge;
