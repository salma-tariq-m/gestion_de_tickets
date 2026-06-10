import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './Avatar';

/**
 * Pile d'avatars pour multi-assignation (overlap -8px, max 3 visible + "+N autres")
 */
export function AvatarStack({ users = [], size = 'md' }) {
  if (!users || users.length === 0) {
    return <span className="text-xs text-muted" style={{ fontStyle: 'italic' }}>Non assigné</span>;
  }

  const maxVisible = 3;
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div className="tf-avatar-stack">
      {visibleUsers.map((user, idx) => (
        <Avatar
          key={user.id || idx}
          name={user.name}
          role={user.role || 'agent'}
          size={size}
          style={{ zIndex: visibleUsers.length - idx }}
        />
      ))}
      {remainingCount > 0 && (
        <span className="tf-avatar-stack-more">
          +{remainingCount} autre{remainingCount > 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

AvatarStack.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
      role: PropTypes.string,
    })
  ),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default AvatarStack;
