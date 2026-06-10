import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { IconSend, IconLock } from '@tabler/icons-react';
import { addTicketComment } from '../../app/slices/ticketSlice';
import { formatRelative } from '../../utils/formatDate';
import Avatar from '../ui/Avatar';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import toast from '../ui/Toast';

/**
 * Fil de commentaires TicketFlow avec distinction Public/Interne
 */
export function CommentThread({ ticketId, comments = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seuls les agents, managers et admins peuvent voir et poster des notes internes
  const isAgentOrStaff = user && ['agent', 'manager', 'admin'].includes(user.role.toLowerCase());

  // Filtrer les notes internes pour les clients
  const visibleComments = comments.filter((c) => {
    if (c.isInternal || c.is_internal) {
      return isAgentOrStaff;
    }
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(addTicketComment({
        ticketId,
        content: content.trim(),
        isInternal: isInternal
      })).unwrap();
      
      setContent('');
      setIsInternal(false);
      toast.success(isInternal ? 'Note interne ajoutée' : 'Commentaire publié');
    } catch (err) {
      toast.error('Erreur lors de la publication du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-3" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 500, margin: 'var(--spacing-md) 0 var(--spacing-sm)' }}>
        Discussion ({visibleComments.length})
      </h3>

      {/* Liste des messages */}
      <div className="d-flex flex-column gap-3" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {visibleComments.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--spacing-md)' }}>
            Aucun commentaire pour le moment.
          </p>
        ) : (
          visibleComments.map((comment) => {
            const commentInternal = comment.isInternal || comment.is_internal;
            const author = comment.author || { name: 'Utilisateur', role: 'user' };

            return (
              <div
                key={comment.id}
                className={commentInternal ? 'tf-internal-note animate-fade-in' : 'tf-card animate-fade-in'}
                style={commentInternal ? {} : { padding: 'var(--spacing-md)', marginBottom: '0' }}
              >
                {commentInternal && (
                  <div className="tf-internal-note-label d-flex align-items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconLock size={12} />
                    <span>Note interne · Visible agents uniquement</span>
                  </div>
                )}
                <div className="d-flex align-items-center justify-content-between mb-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                  <div className="d-flex align-items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Avatar name={author.name} role={author.role} size="sm" />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {author.name}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        backgroundColor: 'var(--bg-secondary)',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-pill)'
                      }}
                    >
                      {author.role}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {formatRelative(comment.createdAt || comment.created_at)}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                  {comment.content || comment.body}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Formulaire de réponse */}
      {user && (
        <form onSubmit={handleSubmit} className="tf-card" style={{ padding: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
          <div className="d-flex align-items-center gap-2 mb-3" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
            <Avatar name={user.name} role={user.role} size="sm" />
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
              Ajouter un commentaire
            </span>
          </div>

          <FormField
            type="textarea"
            placeholder="Rédigez votre réponse ici..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
          />

          <div className="d-flex align-items-center justify-content-between mt-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {isAgentOrStaff ? (
              <label className="d-flex align-items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: '13px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span className="d-flex align-items-center gap-1">
                  <IconLock size={14} style={{ color: 'var(--color-high)' }} />
                  Publier comme Note Interne
                </span>
              </label>
            ) : (
              <div />
            )}

            <Button
              type="submit"
              variant={isInternal ? 'accent' : 'primary'}
              isLoading={isSubmitting}
              leftIcon={<IconSend size={16} />}
              disabled={!content.trim()}
            >
              Envoyer
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

CommentThread.propTypes = {
  ticketId: PropTypes.string.isRequired,
  comments: PropTypes.array,
};

export default CommentThread;
