/** @jsxImportSource @nadi.js/core */
/**
 * @file Container.ts
 * @description Responsive container for consistent max-width layouts
 *
 * @example
 * ```tsx
 * import { Container } from '@nadi/ui';
 *
 * // Standard container
 * <Container size="lg">
 *   <h1>Page Title</h1>
 *   <p>Content goes here</p>
 * </Container>
 *
 * // Centered container
 * <Container size="md" centered>
 *   <h1>Centered Content</h1>
 * </Container>
 *
 * // Reactive size
 * const [size, setSize] = signal('lg');
 * <Container size={size()}>
 *   Content
 * </Container>
 * ```
 */

import { type JSX, type Accessor } from '@nadi.js/core';

export interface ContainerProps {
  /**
   * Maximum width of container
   * @default 'lg'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | Accessor<string>;

  /**
   * Center content vertically and horizontally
   * @default false
   */
  centered?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Inline styles
   */
  style?: JSX.CSSProperties | string;

  /**
   * Container children
   */
  children?: JSX.Element;
}

/**
 * Container Component
 *
 * Provides consistent max-width and horizontal padding for content.
 * Perfect for creating centered, responsive layouts.
 */
export function Container(props: ContainerProps): JSX.Element {
  const resolveValue = (value: any) =>
    typeof value === 'function' ? value() : value;

  const size = () => resolveValue(props.size) || 'lg';

  return (
    <div
      data-nadi-component="container"
      data-nadi-container
      data-size={size()}
      data-centered={props.centered || false}
      class={props.class}
      style={props.style}
    >
      {props.children}
    </div>
  );
}
