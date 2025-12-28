/** @jsxImportSource @nadi.js/core */
/**
 * @file Radio.tsx
 * @description Radio button and radio group components
 */

import { type JSX, type Accessor, For } from '@nadi.js/core';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string | Accessor<string>;
  onChange?: (value: string) => void;
  options: RadioOption[];
  name: string;
  direction?: 'vertical' | 'horizontal';
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string | Accessor<string | null>;
  class?: string;
}

export function RadioGroup(props: RadioGroupProps): JSX.Element {
  const resolveValue = (value: any) => typeof value === 'function' ? value() : value;
  const getValue = () => resolveValue(props.value) || '';
  const getError = () => resolveValue(props.error);

  const handleChange = (value: string) => {
    if (!props.disabled) {
      props.onChange?.(value);
    }
  };

  return (
    <div data-nadi-component="radio-group-wrapper" class={props.class}>
      {props.label && (
        <label style={{
          fontSize: 'var(--nadi-font-size-sm)',
          fontWeight: 'var(--nadi-font-weight-medium)',
          color: 'var(--nadi-color-text-primary)',
          display: 'block',
          marginBottom: 'var(--nadi-space-2)'
        }}>
          {props.label}
          {props.required && <span style={{ color: 'var(--nadi-color-error)', marginLeft: 'var(--nadi-space-1)' }}>*</span>}
        </label>
      )}

      <div
        data-nadi-radio-group
        data-direction={props.direction || 'vertical'}
        role="radiogroup"
        aria-required={props.required}
        aria-invalid={!!getError()}
      >
        <For each={props.options}>
          {(option) => (
            <label
              data-nadi-radio
              data-disabled={props.disabled || option.disabled || false}
            >
              <input
                type="radio"
                name={props.name}
                value={option.value}
                checked={getValue() === option.value}
                disabled={props.disabled || option.disabled}
                onChange={() => handleChange(option.value)}
                class="nadi-radio-input"
              />
              <span class="nadi-radio-circle">
                <span class="nadi-radio-dot" />
              </span>
              <span class="nadi-radio-label">{option.label}</span>
            </label>
          )}
        </For>
      </div>

      {getError() && (
        <div style={{ fontSize: 'var(--nadi-font-size-xs)', color: 'var(--nadi-color-error)', marginTop: 'var(--nadi-space-1)' }} role="alert">
          {getError()}
        </div>
      )}
    </div>
  );
}
