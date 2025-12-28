/** @jsxImportSource @nadi/core */
/**
 * @file Divider.tsx
 * @description Divider/separator component
 */

import { type JSX } from '@nadi/core';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  label?: string;
  class?: string;
  style?: JSX.CSSProperties | string;
}

export function Divider(props: DividerProps): JSX.Element {
  if (props.label) {
    return (
      <div data-nadi-component="divider-with-text" data-nadi-divider-with-text class={props.class} style={props.style}>
        {props.label}
      </div>
    );
  }

  return (
    <hr
      data-nadi-component="divider"
      data-nadi-divider
      data-orientation={props.orientation || 'horizontal'}
      data-variant={props.variant || 'solid'}
      class={props.class}
      style={props.style}
    />
  );
}
