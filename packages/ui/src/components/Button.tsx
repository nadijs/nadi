/** @jsxImportSource @nadi.js/core */
/**
 * @file Button.ts
 * @description Accessible button component with variants, sizes, and ripple animation
 *
 * @example
 * ```tsx
 * import { Button } from '@nadi/ui';
 *
 * // Basic button
 * <Button onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 *
 * // Primary button with loading state
 * const [loading, setLoading] = signal(false);
 * <Button variant="primary" loading={loading()}>
 *   Save
 * </Button>
 *
 * // Button with icon
 * <Button variant="outline">
 *   <IconSave />
 *   Save File
 * </Button>
 *
 * // Disabled button
 * <Button disabled>
 *   Can't click me
 * </Button>
 * ```
 */

import { type JSX, type Accessor, signal } from '@nadi.js/core';
import { usePress } from '../animations/gestures';

export interface ButtonProps {
  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';

  /**
   * Button size
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Disabled state (can be reactive signal)
   */
  disabled?: boolean | Accessor<boolean>;

  /**
   * Loading state (can be reactive signal)
   */
  loading?: boolean | Accessor<boolean>;

  /**
   * Make button full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Button type for forms
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Click handler
   */
  onClick?: (event: MouseEvent) => void;

  /**
   * Enable ripple animation on click
   * @default true
   */
  ripple?: boolean;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Inline styles
   */
  style?: JSX.CSSProperties | string;

  /**
   * Button content (text, icons, etc.)
   */
  children?: JSX.Element;

  /**
   * HTML button element ref
   */
  ref?: (el: HTMLButtonElement) => void;
}

/**
 * Button Component
 *
 * **Why this is superior:**
 * - React: useState for loading causes re-render of entire component tree
 * - Vue: v-if/v-show for loading adds template complexity
 * - Nadi: Pass loading signal directly, only button icon updates
 *
 * Includes built-in ripple effect using pointer events (no synthetic events).
 * Fully accessible with ARIA attributes and keyboard support.
 */
export function Button(props: ButtonProps): JSX.Element {
  const resolveValue = (value: any) =>
    typeof value === 'function' ? value() : value;

  const disabled = () => resolveValue(props.disabled) || false;
  const loading = () => resolveValue(props.loading) || false;

  let buttonRef: HTMLButtonElement | undefined;

  // Ripple effect on click
  const createRipple = (event: MouseEvent) => {
    if (!props.ripple && props.ripple !== undefined) return;
    if (!buttonRef) return;

    const button = buttonRef;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'nadi-button-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  const handleClick = (event: MouseEvent) => {
    if (disabled() || loading()) {
      event.preventDefault();
      return;
    }

    createRipple(event);
    props.onClick?.(event);
  };

  return (
    <button
      ref={(el) => {
        buttonRef = el;
        props.ref?.(el);
      }}
      type={props.type || 'button'}
      data-nadi-component="button"
      data-nadi-button
      data-variant={props.variant || 'primary'}
      data-size={props.size || 'md'}
      data-disabled={disabled()}
      data-loading={loading()}
      data-full-width={props.fullWidth || false}
      disabled={disabled()}
      aria-label={props.ariaLabel}
      aria-busy={loading()}
      aria-disabled={disabled()}
      class={props.class}
      style={props.style}
      onClick={handleClick}
    >
      {loading() && <span class="nadi-button-spinner" role="status" aria-label="Loading" />}
      {props.children}
    </button>
  );
}

/**
 * Icon Button - Button with only an icon (circular)
 *
 * @example
 * ```tsx
 * <IconButton ariaLabel="Close">
 *   <IconX />
 * </IconButton>
 * ```
 */
export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  /**
   * Icon element
   */
  icon: JSX.Element;

  /**
   * Required ARIA label for accessibility
   */
  ariaLabel: string;
}

export function IconButton(props: IconButtonProps): JSX.Element {
  const { icon, ...buttonProps } = props;

  return (
    <Button
      {...buttonProps}
      style={{
        aspectRatio: '1',
        padding: '0',
        borderRadius: 'var(--nadi-radius-full)',
        ...(typeof props.style === 'object' ? props.style : {}),
      }}
    >
      {icon}
    </Button>
  );
}
