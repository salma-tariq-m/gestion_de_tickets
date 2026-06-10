import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconArrowLeft, IconCircleX, IconPaperclip } from '@tabler/icons-react';
import { 
  fetchTicketById, 
  fetchComments, 
  closeTicket, 
  clearCurrentTicket 
} from '../../app/slices/ticketSlice';
import StatusBadge from '../../components/tickets/StatusBadge';
import PriorityBadge from '../../components/tickets/PriorityBadge';
import SLABar from '../../components/tickets/SLABar';
import CommentThread from '../../components/tickets/CommentThread';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import toast from '../../components/ui/Toast';
import { formatLong } from '../../utils/formatDate';

export function TicketDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentTicket: ticket, comments, detailLoading, error } = useSelector((state) => state.tickets);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    dispatch(fetchTicketById(id));
    dispatch(fetchComments(id));

    return () => {
      dispatch(clearCurrentTicket());
    };
  }, [dispatch, id]);

  const handleCloseTicket = async () => {
    if (!window.confirm('Voulez-vous vraiment clôturer ce ticket ? cette action est irréversible.')) return;
    
    setClosing(true);
    try {
      await dispatch(closeTicket(id)).unwrap();
      toast.success('Le ticket a été clôturé avec succès.');
    } catch (err) {
      toast.error('Impossible de clôturer le ticket.');
    } finally {
      setClosing(false);
    }
  };

  if (detailLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="tf-card" style={{ padding: 'var(--spacing-xl)', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-critical)' }}>Erreur de chargement</h2>
        <p>{error || 'Ce ticket est introuvable ou vous n\'avez pas la permission de le consulter.'}</p>
        <Link to="/tickets">
          <Button variant="secondary" size="sm">Retourner à la liste</Button>
        </Link>
      </div>
    );
  }

  const isClosed = ticket.status === 'ferme' || ticket.status === 'resolu';

  return (
    <div className="animate-fade-in">
      {/* Retour et Actions */}
      <div 
        className="d-flex justify-content-between align-items-center mb-3"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}
      >
        <Link to="/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <IconArrowLeft size={16} />
          Retour à mes demandes
        </Link>

        {!isClosed && (
          <Button
            variant="danger"
            size="sm"
            onClick={handleCloseTicket}
            isLoading={closing}
            leftIcon={<IconCircleX size={16} />}
          >
            Clôturer le ticket
          </Button>
        )}
      </div>

      {/* Détails du ticket */}
      <div className="row g-4">
        {/* Contenu principal */}
        <div className="col-12 col-lg-8">
          <div className="tf-card" style={{ padding: 'var(--spacing-xl)' }}>
            
            {/* Header info */}
            <div className="d-flex justify-content-between align-items-start mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
              <div>
                <span className="text-mono" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  #{ticket.id}
                </span>
                <h2 className="m-0 mt-1" style={{ fontSize: '20px', fontWeight: 500 }}>{ticket.title}</h2>
              </div>
              <div className="d-flex flex-column align-items-end gap-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
            </div>

            {/* Description */}
            <div style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.7', whiteSpace: 'pre-wrap', marginBottom: 'var(--spacing-xl)' }}>
              {ticket.description}
            </div>

            {/* Attachment */}
            {ticket.attachment && (
              <div 
                style={{ 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: 'var(--spacing-md)', 
                  backgroundColor: 'var(--bg-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px'
                }}
              >
                <IconPaperclip size={16} style={{ color: 'var(--text-secondary)' }} />
                <span>Pièce jointe : <strong>{ticket.attachment.name}</strong> ({ticket.attachment.size})</span>
              </div>
            )}
          </div>

          {/* Fil de discussion */}
          <CommentThread ticketId={ticket.id} comments={comments} />
        </div>

        {/* Sidebar détails droite */}
        <div className="col-12 col-lg-4">
          <div className="tf-card" style={{ padding: 'var(--spacing-lg)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 500, borderBottom: '1px solid var(--border)', paddingBottom: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              Détails de la demande
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div>
                <span className="tf-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Date de création</span>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{formatLong(ticket.createdAt || ticket.created_at)}</div>
              </div>

              <div>
                <span className="tf-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Catégorie</span>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{ticket.category?.name || 'Non catégorisé'}</div>
              </div>

              <div>
                <span className="tf-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Créateur</span>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{ticket.creator?.name || 'Vous'}</div>
              </div>

              <div>
                <span className="tf-label" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Assignation</span>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                  {ticket.assigned_users && ticket.assigned_users.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {ticket.assigned_users.map(u => (
                        <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div className={`tf-avatar tf-avatar-sm tf-avatar-${u.role}`} style={{ width: '20px', height: '20px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>En attente de prise en charge</span>
                  )}
                </div>
              </div>

              {ticket.status !== 'resolu' && ticket.status !== 'ferme' && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-sm)' }}>
                  <SLABar createdAt={ticket.createdAt} slaLimitHours={ticket.slaLimitHours} closedAt={ticket.closedAt} />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetail;
