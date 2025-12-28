/** @jsxImportSource @nadi.js/core */
/**
 * @file Textarea.tsx
 * @description Multi-line text input with auto-resize and character count
 */

import { type JSX, type Accessor, signal, effect } from '@nadi.js/core';
import type { Field } from '@nadi/forms';

export interface TextareaProps {
  value?: string | Accessor<string>;
  onInput?: (event: InputEvent & { currentTarget: HTMLTextAreaElement }) => void;
  onBlur?: (event: FocusEvent & { currentTarget: HTMLTextAreaElement }) => void;
  field?: Field<string>;
  rows?: number;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
  label?: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  error?: string | Accessor<string | null>;
  disabled?: boolean | Accessor<boolean>;
  fullWidth?: boolean;
  class?: string;
  style?: JSX.CSSProperties | string;
  id?: string;
  name?: string;
  ref?: (el: HTMLTextAreaElement) => void;
}

export function Textarea(props: TextareaProps): JSX.Element {
  const resolveValue = (value: any) => typeof value === 'function' ? value() : value;
  const inputId = props.id || `nadi-textarea-${Math.random().toString(36).substr(2, 9)}`;

  const getValue = (): string => {
    if (props.field) return props.field.value();
    return resolveValue(props.value) || '';
  };

  const getError = (): string | null => {
    if (props.error) return resolveValue(props.error);
    if (props.field) return props.field.error();
    return null;
  };

  const isDisabled = () => resolveValue(props.disabled) || false;
  const hasError = () => !!getError();
  const charCount = () => getValue().length;

  let textareaRef: HTMLTextAreaElement | undefined;

  const handleInput = (event: InputEvent & { currentTarget: HTMLTextAreaElement }) => {
    const newValue = event.currentTarget.value;
    if (props.field) props.field.setValue(newValue);
    props.onInput?.(event);

    if (props.autoResize && textareaRef) {
      textareaRef.style.height = 'auto';
      textareaRef.style.height = `${textareaRef.scrollHeight}px`;
    }
  };

  const handleBlur = (event: FocusEvent & { currentTarget: HTMLTextAreaElement }) => {
    if (props.field) props.field.setTouched(true);
    props.onBlur?.(event);
  };

  return (
    <div data-nadi-component="textarea-wrapper" style={props.fullWidth !== false ? { width: '100%' } : {}}>
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

      <textarea
        ref={(el) => {
          textareaRef = el;
          props.ref?.(el);
        }}
        id={inputId}
        name={props.name}
        value={getValue()}
        onInput={handleInput}
        onBlur={handleBlur}
        placeholder={props.placeholder}
        disabled={isDisabled()}
        required={props.required}
        rows={props.rows || 3}
        maxLength={props.maxLength}
        aria-invalid={hasError()}
        aria-describedby={hasError() ? `${inputId}-error` : props.helperText ? `${inputId}-helper` : undefined}
        class={props.class}
        style={{
          width: '100%',
          fontFamily: 'var(--nadi-font-sans)',
          fontSize: 'var(--nadi-font-size-base)',
          color: 'var(--nadi-color-text-primary)',
          background: 'var(--nadi-color-background)',
          border: `1px solid ${hasError() ? 'var(--nadi-color-error)' : 'var(--nadi-color-border)'}`,
          borderRadius: 'var(--nadi-radius-base)',
          padding: 'var(--nadi-space-3)',
          resize: props.autoResize ? 'none' : 'vertical',
          transition: 'all var(--nadi-duration-fast)',
          outline: 'none',
          ...(typeof props.style === 'object' ? props.style : {})
        }}
      />

      {(props.showCount || props.helperText || hasError()) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--nadi-space-1)' }}>
          <div>
            {props.helperText && !hasError() && (
              <span id={`${inputId}-helper`} style={{ fontSize: 'var(--nadi-font-size-xs)', color: 'var(--nadi-color-text-secondary)' }}>
                {props.helperText}
              </span>
            )}
            {hasError() && (
              <span id={`${inputId}-error`} role="alert" style={{ fontSize: 'var(--nadi-font-size-xs)', color: 'var(--nadi-color-error)' }}>
                {getError()}
              </span>
            )}
          </div>
          {props.showCount && (
            <span style={{ fontSize: 'var(--nadi-font-size-xs)', color: 'var(--nadi-color-text-tertiary)' }}>
              {charCount()}{props.maxLength ? `/${props.maxLength}` : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
