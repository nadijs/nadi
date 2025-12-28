/** @jsxImportSource @nadi.js/core */
/**
 * @file Grid.ts
 * @description Responsive grid layout component with signal-based reactivity
 *
 * @example
 * ```tsx
 * import { Grid } from '@nadi/ui';
 *
 * // Simple 3-column grid
 * <Grid cols={3} gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 *
 * // Responsive grid: 1 col mobile, 2 tablet, 4 desktop
 * <Grid cols={1} colsSm={2} colsMd={4} gap="lg">
 *   {items().map(item => <Card>{item}</Card>)}
 * </Grid>
 *
 * // With reactive columns
 * const [columns, setColumns] = signal(3);
 * <Grid cols={columns()}>
 *   Content
 * </Grid>
 * ```
 */

import { type JSX, type Accessor } from '@nadi.js/core';

export interface GridProps {
  /**
   * Number of columns (default breakpoint - mobile)
   * Can be a number or reactive signal
   */
  cols?: number | Accessor<number>;

  /**
   * Columns for small screens (≥640px)
   */
  colsSm?: number;

  /**
   * Columns for medium screens (≥768px)
   */
  colsMd?: number;

  /**
   * Columns for large screens (≥1024px)
   */
  colsLg?: number;

  /**
   * Columns for extra large screens (≥1280px)
   */
  colsXl?: number;

  /**
   * Gap between grid items
   * @default 'md'
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
   * Grid items
   */
  children?: JSX.Element;

  /**
   * Custom data attributes
   */
  [key: `data-${string}`]: any;
}

/**
 * Responsive Grid Layout Component
 *
 * **Why this beats React/Vue grids:**
 * - React: Need useState + useMemo for responsive columns, causes re-renders
 * - Vue: Need computed() + watch() for reactivity, template-heavy
 * - Nadi: Pass signals directly, automatic reactivity with zero overhead
 *
 * Uses CSS Grid with data attributes for performance. No JavaScript
 * calculations for layout - pure CSS with signal-driven updates.
 */
export function Grid(props: GridProps): JSX.Element {
  const resolveValue = (value: any) =>
    typeof value === 'function' ? value() : value;

  const cols = () => resolveValue(props.cols) || 1;
  const gap = () => resolveValue(props.gap) || 'md';

  return (
    <div
      data-nadi-component="grid"
      data-nadi-grid
      data-cols={cols()}
      data-cols-sm={props.colsSm}
      data-cols-md={props.colsMd}
      data-cols-lg={props.colsLg}
      data-cols-xl={props.colsXl}
      data-gap={gap()}
      class={props.class}
      style={props.style}
    >
      {props.children}
    </div>
  );
}
