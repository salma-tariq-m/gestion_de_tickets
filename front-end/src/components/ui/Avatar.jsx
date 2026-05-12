import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Avatar avec initiales ou image.
 * @param {{ name: string, src?: string, size?: 'xs'|'sm'|'md'|'lg', className?: string }} props
 */
export function Avatar({ name = '', src, size = 'md', className }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-blue-500',
    'bg-emerald-500', 'bg-orange-500', 'bg-pink-500',
  ];
  const colorIndex =
    name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white shrink-0 overflow-hidden',
        sizes[size],
        !src && colors[colorIndex],
        className
      )}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials || '?'
      )}
    </div>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default Avatar;
