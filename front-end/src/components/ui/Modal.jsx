import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { IconX } from '@tabler/icons-react';
import { cn } from '../../utils/cn';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Modal accessible conforme à la charte graphique TicketFlow
 */
export function Modal({ isOpen, onClose, title, size = 'md', children, className }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-50 animate-fade-in"
      style={{
        backgroundColor: 'rgba(4, 44, 83, 0.4)', // Sombre transparent
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'relative w-full bg-white flex flex-col max-h-[90vh]',
          sizeClasses[size],
          className
        )}
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: '0 10px 25px rgba(12, 68, 124, 0.1)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          {title ? (
            <h2 id="modal-title" className="m-0" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)' }}>
              {title}
            </h2>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="p-1 rounded"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Fermer"
          >
            <IconX size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Modal;
