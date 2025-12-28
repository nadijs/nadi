/** @jsxImportSource @nadi.js/core */
/**
 * @file Flex.ts
 * @description Flexible flexbox layout component with full control
 *
 * @example
 * ```tsx
 * import { Flex } from '@nadi/ui';
 *
 * // Simple row with gap
 * <Flex gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Flex>
 *
 * // Centered column
 * <Flex direction="column" align="center" justify="center">
 *   <h1>Title</h1>
 *   <p>Centered content</p>
 * </Flex>
 *
 * // Space between with wrapping
 * <Flex justify="between" wrap="wrap" gap="sm">
 *   {items().map(item => <Card>{item}</Card>)}
 * </Flex>
 * ```
 */

import { type JSX, type Accessor } from '@nadi.js/core';

export interface FlexProps {
  /**
   * Flex direction
   * @default 'row'
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse' | Accessor<string>;

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
   * Flex wrap behavior
   * @default 'nowrap'
   */
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';

  /**
   * Gap between items
   */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | Accessor<string>;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Inline styles
   */
  style?: JSX.CSSProperties | string;

  /**
   * Flex children
   */
  children?: JSX.Element;
}

/**
 * Flex Layout Component
 *
 * Lower-level flexbox primitive for custom layouts.
 * Use Stack for simple vertical/horizontal spacing patterns.
 */
export function Flex(props: FlexProps): JSX.Element {
  const resolveValue = (value: any) =>
    typeof value === 'function' ? value() : value;

  const direction = () => resolveValue(props.direction) || 'row';
  const gap = () => resolveValue(props.gap);

  return (
    <div
      data-nadi-component="flex"
      data-nadi-flex
      data-direction={direction()}
      data-align={props.align || 'stretch'}
      data-justify={props.justify || 'start'}
      data-wrap={props.wrap || 'nowrap'}
      data-gap={gap()}
      class={props.class}
      style={props.style}
    >
      {props.children}
    </div>
  );
}
