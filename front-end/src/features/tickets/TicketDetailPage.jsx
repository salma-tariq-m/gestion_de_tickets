import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ArrowLeft, UserCheck, RefreshCw, Paperclip, FileText, Image } from 'lucide-react';
import {
  useGetTicketQuery, useChangeTicketStatusMutation, useAssignTicketMutation,
} from './ticketsApi';
import { useGetUsersQuery } from '../admin/adminApi';
import { TicketStatusBadge } from './TicketStatusBadge';
import { TicketPriorityBadge } from './TicketPriorityBadge';
import { CommentThread } from './CommentThread';
import { Avatar } from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { formatLong } from '../../utils/formatDate';
import { STATUS, STATUS_LABELS } from '../../utils/constants';
import { useAuth } from '../auth/useAuth';

const STATUS_OPTIONS = Object.values(STATUS).map((s) => ({ value: s, label: STATUS_LABELS[s] }));

function AttachmentIcon({ filename }) {
  const ext = filename?.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <Image size={14} />;
  return <FileText size={14} />;
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAgent } = useAuth();

  const { data, isLoading, isError } = useGetTicketQuery(Number(id));
  const { data: usersData } = useGetUsersQuery({}, { skip: !isAgent });
  const [changeStatus, { isLoading: changingStatus }] = useChangeTicketStatusMutation();
  const [assignTicket, { isLoading: assigning }] = useAssignTicketMutation();

  const [statusModal, setStatusModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [assignUserId, setAssignUserId] = useState('');

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError) return <p className="text-red-500 text-center py-20">Ticket introuvable.</p>;

  const ticket = data?.ticket;
  const comments = data?.comments || [];
  const history = data?.history || [];
  const users = usersData?.data || [];

  const handleStatusChange = async () => {
    if (!newStatus) return;
    toast.promise(changeStatus({ id: ticket.id, status: newStatus }).unwrap(), {
      loading: 'Mise à jour…',
      success: () => { setStatusModal(false); return t('tickets.statusChanged'); },
      error: () => t('common.error'),
    });
  };

  const handleAssign = async () => {
    if (!assignUserId) return;
    toast.promise(assignTicket({ id: ticket.id, userId: Number(assignUserId) }).unwrap(), {
      loading: 'Assignation…',
      success: () => { setAssignModal(false); return t('tickets.assignSuccess'); },
      error: () => t('common.error'),
    });
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Back */}
      <button
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors w-fit"
      >
        <ArrowLeft size={15} /> Retour aux tickets
      </button>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-sm text-gray-400">#{ticket.id}</span>
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
              {ticket.category && (
                <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                  {ticket.category?.name}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{ticket.title}</h2>
            <p className="text-xs text-gray-400 mt-1">
              Créé le {formatLong(ticket.created_at)}
              {ticket.assigned_to && (
                <> · Assigné à <span className="font-medium text-gray-600">{ticket.assigned_to?.name}</span></>
              )}
            </p>
          </div>

          {/* Actions (agent/admin) */}
          {isAgent && (
            <div className="flex gap-2 shrink-0 flex-wrap">
              <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />}
                onClick={() => { setNewStatus(ticket.status); setStatusModal(true); }}>
                {t('tickets.changeStatus')}
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<UserCheck size={14} />}
                onClick={() => { setAssignUserId(''); setAssignModal(true); }}>
                {t('tickets.assignTo')}
              </Button>
            </div>
          )}
        </div>

        {/* Description */}
        {ticket.description && (
          <div
            className="mt-5 pt-5 border-t border-gray-100 prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: ticket.description }}
          />
        )}

        {/* Attachments */}
        {ticket.attachments?.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <Paperclip size={12} className="inline mr-1" />{t('tickets.attachments')}
            </p>
            <div className="flex flex-wrap gap-2">
              {ticket.attachments.map((att, i) => (
                <a
                  key={i}
                  href={att.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <AttachmentIcon filename={att.filename} />
                  {att.filename}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activity + Comments */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('tickets.activity')}</h3>
        <CommentThread ticketId={ticket.id} comments={comments} history={history} />
      </div>

      {/* Change status modal */}
      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title={t('tickets.changeStatus')} size="sm">
        <div className="flex flex-col gap-4">
          <Select
            id="new-status"
            label="Nouveau statut"
            options={STATUS_OPTIONS}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setStatusModal(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleStatusChange} isLoading={changingStatus}>{t('common.confirm')}</Button>
          </div>
        </div>
      </Modal>

      {/* Assign modal */}
      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title={t('tickets.assignTo')} size="sm">
        <div className="flex flex-col gap-4">
          <Select
            id="assign-user"
            label="Assigner à"
            options={users.map((u) => ({ value: String(u.id), label: u.name }))}
            value={assignUserId}
            onChange={(e) => setAssignUserId(e.target.value)}
            placeholder="Sélectionner un utilisateur"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setAssignModal(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleAssign} isLoading={assigning}>{t('common.confirm')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
