/** @jsxImportSource @nadi.js/core */
/**
 * @file Badge.tsx
 * @description Status badge component
 */

import { type JSX } from '@nadi.js/core';

export interface BadgeProps {
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties | string;
}

export function Badge(props: BadgeProps): JSX.Element {
  return (
    <span
      data-nadi-component="badge"
      data-nadi-badge
      data-variant={props.variant || 'neutral'}
      data-size={props.size || 'md'}
      data-dot={props.dot || false}
      class={props.class}
      style={props.style}
    >
      {!props.dot && props.children}
    </span>
  );
}
