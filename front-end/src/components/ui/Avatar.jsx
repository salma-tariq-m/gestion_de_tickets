import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Avatar conforme à la charte graphique TicketFlow (tailles: 40px/28px/20px, rôles colorés)
 */
export function Avatar({
  name = '',
  role = 'user', // agent, manager, admin, user, client
  size = 'md', // lg (40px), md (28px), sm (20px)
  className,
  ...rest
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const roleClass = {
    agent: 'tf-avatar-agent',
    manager: 'tf-avatar-manager',
    admin: 'tf-avatar-admin',
    user: 'tf-avatar-user',
    client: 'tf-avatar-client',
  }[role.toLowerCase()] || 'tf-avatar-user';

  const sizeClass = {
    lg: 'tf-avatar-lg', // 40px
    md: 'tf-avatar-md', // 28px
    sm: 'tf-avatar-sm', // 20px
  }[size] || 'tf-avatar-md';

  return (
    <div
      className={cn('tf-avatar', roleClass, sizeClass, className)}
      title={`${name} (${role})`}
      {...rest}
    >
      {initials || '?'}
    </div>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  role: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Avatar;
