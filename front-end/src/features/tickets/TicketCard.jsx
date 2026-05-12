import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { formatRelative } from '../../utils/formatDate';
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import { Avatar } from '../../components/ui/Avatar';
import { cn } from '../../utils/cn';

/**
 * Carte ticket pour les vues liste / kanban.
 * @param {{ ticket: object, className?: string }} props
 */
export function TicketCard({ ticket, className }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className={cn(
        'bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all duration-200 group',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 font-mono">#{ticket.id}</span>
            <TicketStatusBadge status={ticket.status} size="xs" />
            <TicketPriorityBadge priority={ticket.priority} size="xs" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
            {ticket.title}
          </h3>
          {ticket.category && (
            <span className="text-xs text-gray-500 mt-0.5 block">{ticket.category?.name}</span>
          )}
        </div>
        {ticket.assigned_to && (
          <Avatar name={ticket.assigned_to?.name || ''} size="xs" />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span>{formatRelative(ticket.created_at)}</span>
        {ticket.comments_count > 0 && (
          <span>{ticket.comments_count} commentaire{ticket.comments_count > 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
}

TicketCard.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    created_at: PropTypes.string,
    category: PropTypes.object,
    assigned_to: PropTypes.object,
    comments_count: PropTypes.number,
  }).isRequired,
  className: PropTypes.string,
};

export default TicketCard;
