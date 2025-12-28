/**
 * @nadi/ui - Professional UI Component Library for Nadi
 *
 * A signal-native, animation-rich component library with zero boilerplate.
 * Built specifically for Nadi's fine-grained reactivity system.
 *
 * @example
 * ```tsx
 * import { Button, Input, Grid, showToast } from '@nadi/ui';
 * import '@nadi/ui/styles.css';
 *
 * function App() {
 *   const [name, setName] = signal('');
 *
 *   return (
 *     <Grid cols={2} gap="md">
 *       <Input
 *         value={name()}
 *         onInput={(e) => setName(e.target.value)}
 *         label="Name"
 *       />
 *       <Button onClick={() => showToast({ message: `Hello ${name()}!` })}>
 *         Greet
 *       </Button>
 *     </Grid>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

export { Grid } from './components/Grid.tsx';
export type { GridProps } from './components/Grid';

export { Stack } from './components/Stack.tsx';
export type { StackProps } from './components/Stack';

export { Container } from './components/Container.tsx';
export type { ContainerProps } from './components/Container';

export { Flex } from './components/Flex.tsx';
export type { FlexProps } from './components/Flex';

// ============================================================================
// FORM COMPONENTS
// ============================================================================

export { Input } from './components/Input.tsx';
export type { InputProps } from './components/Input';

export { Textarea } from './components/Textarea.tsx';
export type { TextareaProps } from './components/Textarea';

export { Checkbox } from './components/Checkbox.tsx';
export type { CheckboxProps } from './components/Checkbox';

export { Radio, RadioGroup } from './components/Radio.tsx';
export type { RadioGroupProps, RadioOption } from './components/Radio';

export { Select } from './components/Select.tsx';
export type { SelectProps, SelectOption } from './components/Select';

// ============================================================================
// BUTTON COMPONENTS
// ============================================================================

export { Button, IconButton } from './components/Button.tsx';
export type { ButtonProps, IconButtonProps } from './components/Button';

// ============================================================================
// FEEDBACK COMPONENTS
// ============================================================================

export { showToast, dismissToast, clearToasts, ToastContainer } from './components/Toast.tsx';
export type { ToastOptions, ToastPosition } from './components/Toast';

// ============================================================================
// DATA DISPLAY COMPONENTS
// ============================================================================

export { Card } from './components/Card.tsx';
export type { CardProps } from './components/Card';

export { Badge } from './components/Badge.tsx';
export type { BadgeProps } from './components/Badge';

export { Avatar } from './components/Avatar.tsx';
export type { AvatarProps } from './components/Avatar';

export { Timeline } from './components/Timeline.tsx';
export type { TimelineProps, TimelineItem } from './components/Timeline';

export { Skeleton } from './components/Skeleton.tsx';
export type { SkeletonProps } from './components/Skeleton';

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

export { Breadcrumb } from './components/Breadcrumb.tsx';
export type { BreadcrumbProps, BreadcrumbItem } from './components/Breadcrumb';

export { Pagination } from './components/Pagination.tsx';
export type { PaginationProps } from './components/Pagination';

export { Steps } from './components/Steps.tsx';
export type { StepsProps, StepItem } from './components/Steps';

// ============================================================================
// OVERLAY COMPONENTS
// ============================================================================

export { Popover } from './components/Popover.tsx';
export type { PopoverProps } from './components/Popover';

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

export { Divider } from './components/Divider.tsx';
export type { DividerProps } from './components/Divider';

export { Rating } from './components/Rating.tsx';
export type { RatingProps } from './components/Rating';

// ============================================================================
// THEME SYSTEM
// ============================================================================

export { ThemeProvider, useTheme, getCSSVariable, setCSSVariable } from './theme';
export type { Theme, ThemeConfig } from './theme';

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

// Spring animations
export { useSpring, useSprings, useSpringInterpolate, springPresets } from './animations';
export type { SpringConfig } from './animations';

// Gesture handling
export { useGesture, useHover, usePress } from './animations';
export type { GestureConfig } from './animations';

// Scroll animations
export {
  useIntersectionObserver,
  useFadeIn,
  useScrollProgress,
  useParallax,
  useReveal,
  useStagger,
  useScrollTo,
} from './animations';
export type { ScrollObserverConfig } from './animations';

// ============================================================================
// VERSION
// ============================================================================

export const VERSION = '0.1.0';
