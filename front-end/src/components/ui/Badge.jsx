import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Badge générique avec dark mode.
 * @param {{ variant?: 'default'|'success'|'warning'|'error'|'info'|'indigo', size?: 'xs'|'sm'|'md', className?: string, children: React.ReactNode }} props
 */
export function Badge({ variant = 'default', size = 'sm', className, children }) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    success: 'bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    warning: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    error:   'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    info:    'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    indigo:  'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-semibold',
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
