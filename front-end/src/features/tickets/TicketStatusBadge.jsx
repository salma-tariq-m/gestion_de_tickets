import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';
import { STATUS, STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

/**
 * Badge affichant le statut d'un ticket avec couleur sémantique.
 * @param {{ status: string, size?: 'xs'|'sm'|'md' }} props
 */
export function TicketStatusBadge({ status, size = 'sm' }) {
  const label = STATUS_LABELS[status] || status;
  const colors = STATUS_COLORS[status] || 'bg-gray-100 text-gray-600 border-gray-200';

  const dotColors = {
    [STATUS.OPEN]: 'bg-blue-500',
    [STATUS.IN_PROGRESS]: 'bg-orange-500',
    [STATUS.RESOLVED]: 'bg-green-500',
    [STATUS.CLOSED]: 'bg-gray-400',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        colors,
        sizes[size]
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[status])} />
      {label}
    </span>
  );
}

TicketStatusBadge.propTypes = {
  status: PropTypes.oneOf(Object.values(STATUS)).isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md']),
};

export default TicketStatusBadge;
