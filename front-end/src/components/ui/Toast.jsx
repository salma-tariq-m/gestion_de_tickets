import { toast as sonnerToast } from 'sonner';

/**
 * Service de notifications Toast TicketFlow (wrapper autour de Sonner)
 */
export const toast = {
  success: (message, options = {}) => {
    sonnerToast.success(message, {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        borderColor: 'var(--color-low)',
      },
      ...options,
    });
  },
  
  error: (message, options = {}) => {
    sonnerToast.error(message, {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        borderColor: 'var(--color-critical)',
      },
      ...options,
    });
  },

  warning: (message, options = {}) => {
    sonnerToast.warning(message, {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        borderColor: 'var(--color-high)',
      },
      ...options,
    });
  },

  info: (message, options = {}) => {
    sonnerToast.info(message, {
      style: {
        fontFamily: 'var(--font-sans)',
        fontSize: '14px',
        borderColor: 'var(--color-600)',
      },
      ...options,
    });
  }
};

export default toast;
