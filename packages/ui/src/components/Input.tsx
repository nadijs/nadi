/** @jsxImportSource @nadi.js/core */
/**
 * @file Input.ts
 * @description Text input component with @nadi/forms integration
 *
 * @example
 * ```tsx
 * import { Input } from '@nadi/ui';
 * import { createField } from '@nadi/forms';
 *
 * // Standalone input
 * const [value, setValue] = signal('');
 * <Input
 *   value={value()}
 *   onInput={(e) => setValue(e.target.value)}
 *   label="Email"
 *   placeholder="you@example.com"
 * />
 *
 * // With @nadi/forms field (automatic binding!)
 * const emailField = createField({
 *   initialValue: '',
 *   validationRules: [
 *     { validator: (v) => v.includes('@'), message: 'Must be valid email' }
 *   ]
 * });
 *
 * <Input
 *   field={emailField}
 *   label="Email"
 *   placeholder="you@example.com"
 * />
 * // That's it! Value, errors, touched state all auto-bound!
 * ```
 */

import { type JSX, type Accessor } from '@nadi.js/core';
import type { Field } from '@nadi/forms';

export interface InputProps {
  /**
   * Input value (controlled)
   */
  value?: string | Accessor<string>;

  /**
   * Input change handler
   */
  onInput?: (event: InputEvent & { currentTarget: HTMLInputElement }) => void;

  /**
   * Blur handler
   */
  onBlur?: (event: FocusEvent & { currentTarget: HTMLInputElement }) => void;

  /**
   * @nadi/forms field for automatic binding
   * When provided, value/onInput/error are auto-bound
   */
  field?: Field<string>;

  /**
   * Input type
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'search' | 'number';

  /**
   * Input size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Label text
   */
  label?: string;

  /**
   * Show required asterisk
   * @default false
   */
  required?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Helper text shown below input
   */
  helperText?: string;

  /**
   * Error message (overrides field error)
   */
  error?: string | Accessor<string | null>;

  /**
   * Disabled state
   */
  disabled?: boolean | Accessor<boolean>;

  /**
   * Full width
   * @default true
   */
  fullWidth?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Inline styles
   */
  style?: JSX.CSSProperties | string;

  /**
   * Input ID (auto-generated if not provided)
   */
  id?: string;

  /**
   * Input name attribute
   */
  name?: string;

  /**
   * Autocomplete attribute
   */
  autocomplete?: string;

  /**
   * Input ref
   */
  ref?: (el: HTMLInputElement) => void;
}

/**
 * Input Component
 *
 * **Revolutionary @nadi/forms integration:**
 * - React: Need value={field.value} onChange={field.onChange} error={field.error}...
 * - Vue: Need v-model + error binding + manual validation triggers
 * - Nadi: Just `field={emailField}` - everything auto-bound via signals!
 *
 * The field's signals are directly accessed in the template, so updates
 * only re-render the specific parts that changed (error text, border color).
 * No full component re-renders like React.
 */
export function Input(props: InputProps): JSX.Element {
  const resolveValue = (value: any) =>
    typeof value === 'function' ? value() : value;

  // Generate unique ID if not provided
  const inputId = props.id || `nadi-input-${Math.random().toString(36).substr(2, 9)}`;

  // Resolve value from either prop or field
  const getValue = (): string => {
    if (props.field) {
      return props.field.value();
    }
    return resolveValue(props.value) || '';
  };

  // Resolve error from either prop or field
  const getError = (): string | null => {
    if (props.error) {
      return resolveValue(props.error);
    }
    if (props.field) {
      return props.field.error();
    }
    return null;
  };

  const isDisabled = () => resolveValue(props.disabled) || false;
  const hasError = () => !!getError();

  // Handle input change
  const handleInput = (event: InputEvent & { currentTarget: HTMLInputElement }) => {
    const newValue = event.currentTarget.value;

    if (props.field) {
      props.field.setValue(newValue);
    }

    props.onInput?.(event);
  };

  // Handle blur
  const handleBlur = (event: FocusEvent & { currentTarget: HTMLInputElement }) => {
    if (props.field) {
      props.field.setTouched(true);
    }

    props.onBlur?.(event);
  };

  return (
    <div
      data-nadi-component="input-wrapper"
      data-nadi-input-wrapper
      style={props.fullWidth !== false ? { width: '100%' } : {}}
    >
      {props.label && (
        <label htmlFor={inputId} class="nadi-input-label">
          {props.label}
          {props.required && (
            <span class="nadi-input-label-required" aria-label="required">*</span>
          )}
        </label>
      )}

      <input
        ref={props.ref}
        id={inputId}
        name={props.name}
        type={props.type || 'text'}
        value={getValue()}
        onInput={handleInput}
        onBlur={handleBlur}
        placeholder={props.placeholder}
        disabled={isDisabled()}
        required={props.required}
        autocomplete={props.autocomplete}
        aria-invalid={hasError()}
        aria-describedby={
          hasError()
            ? `${inputId}-error`
            : props.helperText
              ? `${inputId}-helper`
              : undefined
        }
        data-nadi-component="input"
        data-nadi-input
        data-size={props.size || 'md'}
        data-error={hasError()}
        class={props.class}
        style={props.style}
      />

      {props.helperText && !hasError() && (
        <span id={`${inputId}-helper`} class="nadi-input-helper">
          {props.helperText}
        </span>
      )}

      {hasError() && (
        <span id={`${inputId}-error`} class="nadi-input-error" role="alert">
          {getError()}
        </span>
      )}
    </div>
  );
}
