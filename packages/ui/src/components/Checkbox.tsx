/** @jsxImportSource @nadi.js/core */
/**
 * @file Checkbox.tsx
 * @description Checkbox input component
 */

import { type JSX, type Accessor } from '@nadi.js/core';

export interface CheckboxProps {
  checked?: boolean | Accessor<boolean>;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string | Accessor<string | null>;
  required?: boolean;
  value?: string;
  name?: string;
  id?: string;
  class?: string;
}

export function Checkbox(props: CheckboxProps): JSX.Element {
  const resolveValue = (value: any) => typeof value === 'function' ? value() : value;
  const isChecked = () => resolveValue(props.checked) || false;
  const getError = () => resolveValue(props.error);
  const inputId = props.id || `nadi-checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const handleChange = (event: Event & { currentTarget: HTMLInputElement }) => {
    if (!props.disabled) {
      props.onChange?.(event.currentTarget.checked);
    }
  };

  return (
    <div data-nadi-component="checkbox-wrapper" class={props.class}>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--nadi-space-2)',
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          opacity: props.disabled ? 0.6 : 1
        }}
      >
        <input
          type="checkbox"
          id={inputId}
          name={props.name}
          value={props.value}
          checked={isChecked()}
          disabled={props.disabled}
          required={props.required}
          onChange={handleChange}
          aria-invalid={!!getError()}
          style={{
            width: '18px',
            height: '18px',
            cursor: props.disabled ? 'not-allowed' : 'pointer',
            accentColor: 'var(--nadi-color-primary-600)'
          }}
        />
        {props.label && (
          <span style={{ fontSize: 'var(--nadi-font-size-base)', color: 'var(--nadi-color-text-primary)' }}>
            {props.label}
            {props.required && <span style={{ color: 'var(--nadi-color-error)', marginLeft: 'var(--nadi-space-1)' }}>*</span>}
          </span>
        )}
      </label>
      {getError() && (
        <div style={{ fontSize: 'var(--nadi-font-size-xs)', color: 'var(--nadi-color-error)', marginTop: 'var(--nadi-space-1)' }} role="alert">
          {getError()}
        </div>
      )}
    </div>
  );
}

