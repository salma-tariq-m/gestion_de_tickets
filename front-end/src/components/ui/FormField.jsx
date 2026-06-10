import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

/**
 * Composant de formulaire unifié (Input, Select, Textarea) conforme à la charte graphique
 */
export const FormField = React.forwardRef(({
  label,
  type = 'text', // text, password, email, number, select, textarea, file
  options = [], // Pour les selects: [{ value, label }]
  error,
  placeholder,
  className,
  rows = 3,
  ...rest
}, ref) => {
  const hasError = !!error;
  const inputId = React.useId();

  const commonClasses = cn(
    'tf-input',
    hasError && 'error',
    className
  );

  return (
    <div className="tf-form-group">
      {label && (
        <label htmlFor={inputId} className="tf-label">
          {label}
        </label>
      )}

      {type === 'select' ? (
        <select
          id={inputId}
          ref={ref}
          className={cn('tf-select', hasError && 'error', className)}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={inputId}
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          className={cn('tf-textarea', hasError && 'error', className)}
          {...rest}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={commonClasses}
          {...rest}
        />
      )}

      {hasError && (
        <span className="tf-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

FormField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  error: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  rows: PropTypes.number,
};

export default FormField;
