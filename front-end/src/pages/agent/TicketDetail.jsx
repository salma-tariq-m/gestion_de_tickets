import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IconArrowLeft, IconUserPlus, IconHistory, IconPaperclip } from '@tabler/icons-react';
import { 
  fetchTicketById, 
  fetchComments, 
  assignTicketUsers,
  clearCurrentTicket 
} from '../../app/slices/ticketSlice';
import { fetchUsers } from '../../app/slices/userSlice';
import StatusBadge from '../../components/tickets/StatusBadge';
import PriorityBadge from '../../components/tickets/PriorityBadge';
import SLABar from '../../components/tickets/SLABar';
import CommentThread from '../../components/tickets/CommentThread';
import WorkflowStepper from '../../components/tickets/WorkflowStepper';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import AvatarStack from '../../components/ui/AvatarStack';
import Avatar from '../../components/ui/Avatar';
import FormField from '../../components/ui/FormField';
import Modal from '../../components/ui/Modal';
import toast from '../../components/ui/Toast';
import { formatLong } from '../../utils/formatDate';

export function TicketDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { currentTicket: ticket, comments, detailLoading } = useSelector((state) => state.tickets);
  const { users } = useSelector((state) => state.users);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    dispatch(fetchTicketById(id));
    dispatch(fetchComments(id));
    dispatch(fetchUsers());

    return () => {
      dispatch(clearCurrentTicket());
    };
  }, [dispatch, id]);

  const handleAssign = async () => {
    if (!selectedAgent) return;
    try {
      await dispatch(assignTicketUsers({ id, userIds: [Number(selectedAgent)] })).unwrap();
      toast.success('Agent assigné avec succès');
      setShowAssignModal(false);
    } catch (err) {
      toast.error('Erreur lors de l\'assignation');
    }
  };

  if (detailLoading || !ticket) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '13px' }}>
          <IconArrowLeft size={16} />
          Retour à la file d'attente
        </Link>
        <div className="d-flex gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            leftIcon={<IconUserPlus size={16} />}
            onClick={() => setShowAssignModal(true)}
          >
            Réassigner
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<IconHistory size={16} />}>
            Historique
          </Button>
        </div>
      </div>

      {/* Workflow Stepper */}
      <WorkflowStepper ticketId={ticket.id} currentStatus={ticket.status} />

      <div className="row g-4">
        {/* Left Column: Ticket Content & Comments */}
        <div className="col-12 col-lg-8">
          <div className="tf-card mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="text-mono mb-1 d-block" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  #{ticket.id}
                </span>
                <h1 className="h2 m-0">{ticket.title}</h1>
              </div>
              <PriorityBadge priority={ticket.priority} />
            </div>

            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', marginBottom: 'var(--spacing-xl)' }}>
              {ticket.description}
            </div>

            {ticket.attachment && (
              <div 
                style={{ 
                  padding: 'var(--spacing-md)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)'
                }}
              >
                <IconPaperclip size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{ticket.attachment.name}</span>
                <span className="tiny" style={{ color: 'var(--text-tertiary)' }}>({ticket.attachment.size})</span>
              </div>
            )}
          </div>

          <CommentThread ticketId={ticket.id} comments={comments} />
        </div>

        {/* Right Column: Sidebar info */}
        <div className="col-12 col-lg-4">
          <div className="tf-card mb-4">
            <h3 className="mb-3">Informations</h3>
            
            <div className="mb-4">
              <label className="tf-label">Statut actuel</label>
              <StatusBadge status={ticket.status} />
            </div>

            <div className="mb-4">
              <label className="tf-label">SLA Restant</label>
              <SLABar createdAt={ticket.createdAt} slaLimitHours={ticket.slaLimitHours} closedAt={ticket.closedAt} />
            </div>

            <div className="mb-4">
              <label className="tf-label">Client</label>
              <div className="d-flex align-items-center gap-2">
                <Avatar name={ticket.creator?.name || 'Client'} role="client" size="sm" />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{ticket.creator?.name || 'Client'}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="tf-label">Assigné à</label>
              <AvatarStack users={ticket.assigned_users || []} />
            </div>

            <div>
              <label className="tf-label">Date de création</label>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {formatLong(ticket.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal 
        isOpen={showAssignModal} 
        onClose={() => setShowAssignModal(false)} 
        title="Réassigner le ticket"
      >
        <FormField
          label="Choisir un agent"
          type="select"
          options={users.filter(u => u.role === 'agent' || u.role === 'manager').map(u => ({ value: u.id, label: u.name }))}
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
        />
        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => setShowAssignModal(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleAssign}>Confirmer</Button>
        </div>
      </Modal>
    </div>
  );
}

export default TicketDetail;
