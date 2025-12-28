/**
 * @file index.ts
 * @description Animation system exports for Nadi UI
 */

// Spring animations
export { useSpring, useSprings, useSpringInterpolate, springPresets } from './spring';
export type { SpringConfig } from './spring';

// Gesture handling
export { useGesture, useHover, usePress } from './gestures';
export type { GestureConfig } from './gestures';

// Scroll animations
export {
  useIntersectionObserver,
  useFadeIn,
  useScrollProgress,
  useParallax,
  useReveal,
  useStagger,
  useScrollTo,
} from './scroll';
export type { ScrollObserverConfig } from './scroll';
