import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Send, MessageCircle } from 'lucide-react';
import { useAddCommentMutation } from './ticketsApi';
import { Avatar } from '../../components/ui/Avatar';
import { RichEditor } from '../../components/ui/RichEditor';
import Button from '../../components/ui/Button';
import { formatRelative } from '../../utils/formatDate';
import { useAuth } from '../auth/useAuth';
import { cn } from '../../utils/cn';

/**
 * Fil de commentaires d'un ticket avec formulaire d'ajout.
 * @param {{ ticketId: number, comments: Array, history: Array }} props
 */
export function CommentThread({ ticketId, comments = [], history = [] }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [body, setBody] = useState('');
  const [addComment, { isLoading }] = useAddCommentMutation();

  const handleSubmit = async () => {
    const text = body.replace(/<[^>]+>/g, '').trim();
    if (!text) return;
    toast.promise(addComment({ ticketId, body }).unwrap(), {
      loading: 'Envoi…',
      success: () => { setBody(''); return 'Commentaire ajouté'; },
      error: () => t('common.error'),
    });
  };

  // Merge comments + history into a unified timeline sorted by date
  const timeline = [
    ...comments.map((c) => ({ ...c, _type: 'comment' })),
    ...history.map((h) => ({ ...h, _type: 'history' })),
  ].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return (
    <div className="flex flex-col gap-6">
      {/* Timeline */}
      <div className="flex flex-col">
        {timeline.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">Aucune activité pour le moment.</p>
        ) : (
          timeline.map((item, idx) => (
            <div key={item.id ?? idx} className="timeline-item">
              {/* Dot */}
              <span
                className={cn(
                  'absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-2 ring-white',
                  item._type === 'comment'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {item._type === 'comment' ? (
                  <MessageCircle size={12} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                )}
              </span>

              {item._type === 'comment' ? (
                /* Comment */
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm ml-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={item.user?.name || ''} size="xs" />
                    <span className="text-sm font-semibold text-gray-800">{item.user?.name}</span>
                    <span className="text-xs text-gray-400">{formatRelative(item.created_at)}</span>
                  </div>
                  <div
                    className="text-sm text-gray-700 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.body }}
                  />
                </div>
              ) : (
                /* History event */
                <div className="ml-2 py-1">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{item.user?.name || 'Système'}</span>
                    {' '}{item.description || `a changé le statut en `}
                    {item.new_value && (
                      <span className="font-medium text-indigo-600">{item.new_value}</span>
                    )}
                    <span className="ml-2 text-gray-400">{formatRelative(item.created_at)}</span>
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add comment */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Avatar name={user?.name || ''} size="sm" />
          <span className="text-sm font-semibold text-gray-700">{t('tickets.addComment')}</span>
        </div>
        <RichEditor
          value={body}
          onChange={setBody}
          placeholder="Rédigez votre commentaire…"
        />
        <div className="flex justify-end mt-3">
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            leftIcon={<Send size={14} />}
            size="sm"
          >
            {t('tickets.send')}
          </Button>
        </div>
      </div>
    </div>
  );
}

CommentThread.propTypes = {
  ticketId: PropTypes.number.isRequired,
  comments: PropTypes.array,
  history: PropTypes.array,
};

export default CommentThread;
