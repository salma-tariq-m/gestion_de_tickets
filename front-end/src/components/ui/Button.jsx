import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Bouton conforme à la charte graphique TicketFlow
 */
export function Button({
  variant = 'primary', // primary, secondary, danger, ghost, accent
  size = 'md', // sm, md, lg
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  children,
  type = 'button',
  ...rest
}) {
  const variantClass = {
    primary: 'tf-btn-primary',
    secondary: 'tf-btn-secondary',
    danger: 'tf-btn-danger',
    ghost: 'tf-btn-ghost',
    accent: 'tf-btn-accent',
  }[variant] || 'tf-btn-primary';

  const sizeClass = {
    sm: 'py-1 px-3 text-xs',
    md: '', // Standard style
    lg: 'py-2 px-5 text-base',
  }[size] || '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'tf-btn',
        variantClass,
        sizeClass,
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : leftIcon}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'accent']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

export default Button;
