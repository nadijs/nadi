/** @jsxImportSource @nadi/core */
/**
 * @file Card.ts
 * @description Flexible card component for content containers
 * 
 * @example
 * ```tsx
 * import { Card } from '@nadi/ui';
 * 
 * // Simple card
 * <Card>
 *   <h3>Title</h3>
 *   <p>Content goes here</p>
 * </Card>
 * 
 * // Hoverable card with click handler
 * <Card hoverable onClick={() => navigate('/details')}>
 *   <h3>Clickable Card</h3>
 * </Card>
 * 
 * // Outlined variant
 * <Card variant="outlined" padding="lg">
 *   <p>Large padding outlined card</p>
 * </Card>
 * ```
 */

import { type JSX } from '@nadi/core';

export interface CardProps {
  /**
   * Card visual variant
   * @default 'elevated'
   */
  variant?: 'elevated' | 'outlined' | 'flat';
  
  /**
   * Internal padding
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Enable hover effect
   * @default false
   */
  hoverable?: boolean;
  
  /**
   * Click handler
   */
  onClick?: (event: MouseEvent) => void;
  
  /**
   * Additional CSS classes
   */
  class?: string;
  
  /**
   * Inline styles
   */
  style?: JSX.CSSProperties | string;
  
  /**
   * Card content
   */
  children?: JSX.Element;
  
  /**
   * HTML element ref
   */
  ref?: (el: HTMLDivElement) => void;
}

/**
 * Card Component
 * 
 * Simple, flexible container for grouping related content.
 * Includes hover animations with GPU-accelerated transforms.
 */
export function Card(props: CardProps): JSX.Element {
  return (
    <div
      ref={props.ref}
      data-nadi-component="card"
      data-nadi-card
      data-variant={props.variant || 'elevated'}
      data-padding={props.padding || 'md'}
      data-hoverable={props.hoverable || false}
      class={props.class}
      style={props.style}
      onClick={props.onClick}
      role={props.onClick ? 'button' : undefined}
      tabIndex={props.onClick ? 0 : undefined}
    >
      {props.children}
    </div>
  );
}
