/** @jsxImportSource @nadi/core */
/**
 * @file Select.tsx
 * @description Select dropdown component
 */

import { type JSX, type Accessor, For } from '@nadi/core';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string | Accessor<string>;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | Accessor<string | null>;
  helperText?: string;
  fullWidth?: boolean;
  name?: string;
  id?: string;
  class?: string;
}

export function Select(props: SelectProps): JSX.Element {
  const resolveValue = (value: any) => typeof value === 'function' ? value() : value;
  const getValue = () => resolveValue(props.value) || '';
  const getError = () => resolveValue(props.error);
  const inputId = props.id || `nadi-select-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (event: Event & { currentTarget: HTMLSelectElement }) => {
    if (!props.disabled) {
      props.onChange?.(event.currentTarget.value);
    }
  };

  return (
    <div data-nadi-component="select-wrapper" style={props.fullWidth !== false ? { width: '100%' } : {}}>
      {props.label && (
        <label htmlFor={inputId} style={{
          fontSize: 'var(--nadi-font-size-sm)',
          fontWeight: 'var(--nadi-font-weight-medium)',
          color: 'var(--nadi-color-text-primary)',
          display: 'block',
          marginBottom: 'var(--nadi-space-1)'
        }}>
          {props.label}
          {props.required && <span style={{ color: 'var(--nadi-color-error)', marginLeft: 'var(--nadi-space-1)' }}>*</span>}
        </label>
      )}

      <select
        id={inputId}
        name={props.name}
        value={getValue()}
        onChange={handleChange}
        disabled={props.disabled}
        required={props.required}
        aria-invalid={!!getError()}
        class={props.class}
        style={{
          width: '100%',
          fontFamily: 'var(--nadi-font-sans)',
          fontSize: 'var(--nadi-font-size-base)',
          color: 'var(--nadi-color-text-primary)',
          background: 'var(--nadi-color-background)',
          border: `1px solid ${getError() ? 'var(--nadi-color-error)' : 'var(--nadi-color-border)'}`,
          borderRadius: 'var(--nadi-radius-base)',
          padding: 'var(--nadi-space-3)',
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          transition: 'all var(--nadi-duration-fast)',
          outline: 'none'
        }}
      >
        {props.placeholder && (
          <option value="" disabled>{props.placeholder}</option>
        )}
        <For each={props.options}>
          {(option) => (
            <option value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          )}
        </For>
      </select>

      {(props.helperText || getError()) && (
        <div style={{ marginTop: 'var(--nadi-space-1)' }}>
          {props.helperText && !getError() && (
            <span style={{ fontSize: 'var(--nadi-font-size-xs)', color: 'var(--nadi-color-text-secondary)' }}>
              {props.helperText}
            </span>
          )}
          {getError() && (
            <span style={{ fontSize: 'var(--nadi-font-size-xs)', color: 'var(--nadi-color-error)' }} role="alert">
              {getError()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

