import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';
import { PRIORITY, PRIORITY_LABELS, PRIORITY_COLORS } from '../../utils/constants';
import { ArrowDown, Minus, ArrowUp } from 'lucide-react';

const icons = {
  [PRIORITY.LOW]: ArrowDown,
  [PRIORITY.MEDIUM]: Minus,
  [PRIORITY.HIGH]: ArrowUp,
};

/**
 * Badge affichant la priorité d'un ticket.
 * @param {{ priority: string, size?: 'xs'|'sm'|'md' }} props
 */
export function TicketPriorityBadge({ priority, size = 'sm' }) {
  const label = PRIORITY_LABELS[priority] || priority;
  const colors = PRIORITY_COLORS[priority] || 'bg-gray-100 text-gray-600 border-gray-200';
  const Icon = icons[priority];

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        colors,
        sizes[size]
      )}
    >
      {Icon && <Icon size={10} />}
      {label}
    </span>
  );
}

TicketPriorityBadge.propTypes = {
  priority: PropTypes.oneOf(Object.values(PRIORITY)).isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md']),
};

export default TicketPriorityBadge;
