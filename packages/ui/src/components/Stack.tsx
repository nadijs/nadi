/** @jsxImportSource @nadi.js/core */
/**
 * @file Stack.ts
 * @description Flexible stack layout for vertical or horizontal spacing
 *
 * @example
 * ```tsx
 * import { Stack } from '@nadi/ui';
 *
 * // Vertical stack with spacing
 * <Stack spacing="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Stack>
 *
 * // Horizontal stack with center alignment
 * <Stack direction="horizontal" align="center" spacing="sm">
 *   <Button>Cancel</Button>
 *   <Button variant="primary">Save</Button>
 * </Stack>
 *
 * // Reactive direction
 * const [isVertical, setIsVertical] = signal(true);
 * <Stack direction={isVertical() ? 'vertical' : 'horizontal'}>
 *   Content
 * </Stack>
 * ```
 */

import { type JSX, type Accessor } from '@nadi.js/core';

export interface StackProps {
  /**
   * Stack direction
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal' | Accessor<'vertical' | 'horizontal'>;

  /**
   * Spacing between items
   * @default 'md'
   */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | Accessor<string>;

  /**
   * Align items on cross axis
   * @default 'stretch'
   */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';

  /**
   * Justify content on main axis
   * @default 'start'
   */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

  /**
   * Enable flex wrap
   * @default false
   */
  wrap?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Inline styles
   */
  style?: JSX.CSSProperties | string;

  /**
   * Stack children
   */
  children?: JSX.Element;
}

/**
 * Stack Layout Component
 *
 * Perfect for creating consistent spacing between elements without manual margins.
 * Uses the "lobotomized owl selector" (> * + *) for automatic spacing.
 */
export function Stack(props: StackProps): JSX.Element {
  const resolveValue = (value: any) =>
    typeof value === 'function' ? value() : value;

  const direction = () => resolveValue(props.direction) || 'vertical';
  const spacing = () => resolveValue(props.spacing) || 'md';

  return (
    <div
      data-nadi-component="stack"
      data-nadi-stack
      data-direction={direction()}
      data-spacing={spacing()}
      data-align={props.align || 'stretch'}
      data-justify={props.justify || 'start'}
      data-wrap={props.wrap || false}
      class={props.class}
      style={props.style}
    >
      {props.children}
    </div>
  );
}
