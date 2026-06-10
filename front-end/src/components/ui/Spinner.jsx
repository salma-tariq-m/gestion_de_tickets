import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Spinner de chargement conforme à la charte graphique
 */
export function Spinner({ size = 'md', className }) {
  const sizes = {
    xs: 'w-3 h-3 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-[3px]',
  };

  return (
    <span
      role="status"
      aria-label="Chargement..."
      className={cn('inline-block rounded-full animate-spin', className)}
      style={{
        borderStyle: 'solid',
        borderColor: 'var(--color-600)',
        borderTopColor: 'transparent',
        ...Object.assign({}, ...sizes[size].split(' ').map(s => {
          if (s.startsWith('w-')) return { width: s.replace('w-', '') === '3' ? '12px' : s.replace('w-', '') === '4' ? '16px' : s.replace('w-', '') === '6' ? '24px' : '40px' };
          if (s.startsWith('h-')) return { height: s.replace('h-', '') === '3' ? '12px' : s.replace('h-', '') === '4' ? '16px' : s.replace('h-', '') === '6' ? '24px' : '40px' };
          if (s.includes('border-')) {
            const w = s.match(/\[(.*?)\]/)?.[1] || '2px';
            return { borderWidth: w };
          }
          return {};
        }))
      }}
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
    <div className="d-flex align-items-center justify-center w-100" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size="lg" />
    </div>
  );
}

export default Spinner;
