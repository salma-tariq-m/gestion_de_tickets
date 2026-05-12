import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Badge générique.
 * @param {{ variant?: 'default'|'success'|'warning'|'error'|'info', size?: 'sm'|'md', className?: string, children: React.ReactNode }} props
 */
export function Badge({ variant = 'default', size = 'sm', className, children }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

Badge.propTypes = {
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'error', 'info', 'indigo']),
  size: PropTypes.oneOf(['xs', 'sm', 'md']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Badge;
