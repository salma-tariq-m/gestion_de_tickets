import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Badge de base (pill shape) conforme aux spécifications WCAG
 */
export function Badge({
  bgColor = 'var(--bg-secondary)',
  textColor = 'var(--text-primary)',
  showDot = false,
  dotColor,
  className,
  children,
  ...rest
}) {
  return (
    <span
      className={cn('tf-badge', className)}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: '1px solid transparent',
      }}
      {...rest}
    >
      {showDot && (
        <span
          className="rounded-circle"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: dotColor || textColor,
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </span>
  );
}

Badge.propTypes = {
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  showDot: PropTypes.bool,
  dotColor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Badge;
