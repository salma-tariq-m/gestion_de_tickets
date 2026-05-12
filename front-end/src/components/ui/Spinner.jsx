import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Spinner de chargement.
 * @param {{ size?: 'xs'|'sm'|'md'|'lg', className?: string }} props
 */
export function Spinner({ size = 'md', className }) {
  const sizes = {
    xs: 'h-3 w-3 border-[1.5px]',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-[3px]',
  };

  return (
    <span
      role="status"
      aria-label="Chargement"
      className={cn(
        'inline-block rounded-full border-indigo-600 border-t-transparent animate-spin',
        sizes[size],
        className
      )}
    />
  );
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  className: PropTypes.string,
};

/**
 * Plein écran de chargement centré.
 */
export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );
}

export default Spinner;
