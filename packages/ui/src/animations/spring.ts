/**
 * @file spring.ts
 * @description Spring physics animation system using damped harmonic oscillator
 *
 * @example
 * ```ts
 * import { useSpring } from '@nadi/ui/animations';
 *
 * const [x, setX] = signal(0);
 * const animatedX = useSpring(x, { tension: 170, friction: 26 });
 *
 * // Change target - animation happens automatically!
 * setX(100);
 *
 * // Use in your component
 * <div style={{ transform: `translateX(${animatedX()}px)` }}>
 *   Smooth spring animation!
 * </div>
 * ```
 */

import { signal, effect, onCleanup, type Accessor } from '@nadi.js/core';

export interface SpringConfig {
  /**
   * Spring tension (stiffness). Higher values create faster animations.
   * @default 170
   */
  tension?: number;

  /**
   * Spring friction (damping). Higher values reduce oscillation.
   * @default 26
   */
  friction?: number;

  /**
   * Mass of the spring. Higher values create slower animations.
   * @default 1
   */
  mass?: number;

  /**
   * Velocity threshold to consider the animation complete.
   * @default 0.01
   */
  velocity?: number;

  /**
   * Position threshold to consider the animation complete.
   * @default 0.01
   */
  precision?: number;
}

export const springPresets = {
  /**
   * Gentle spring with minimal bounce (friction: 26, tension: 170)
   */
  gentle: { tension: 120, friction: 14 },

  /**
   * Wobbly spring with noticeable bounce (friction: 7, tension: 180)
   */
  wobbly: { tension: 180, friction: 12 },

  /**
   * Stiff spring with quick movement (friction: 26, tension: 210)
   */
  stiff: { tension: 210, friction: 20 },

  /**
   * Slow spring with smooth movement (friction: 14, tension: 120)
   */
  slow: { tension: 120, friction: 14 },

  /**
   * Molasses-like very slow spring (friction: 10, tension: 80)
   */
  molasses: { tension: 80, friction: 10 },
} as const;

interface SpringState {
  position: number;
  velocity: number;
}

/**
 * Create a spring-animated value that smoothly follows a target signal.
 *
 * **Why this is revolutionary:**
 * - React's framer-motion: Requires useSpring + useEffect boilerplate
 * - Vue's transitions: Limited to CSS, no physics-based springs
 * - Nadi UI: Just pass a signal, animation happens automatically!
 *
 * The spring automatically tracks the target signal and animates on every change.
 * No manual effect setup, no dependency arrays, no stale closures.
 */
export function useSpring(
  target: Accessor<number> | number,
  config: SpringConfig = {}
): Accessor<number> {
  const {
    tension = 170,
    friction = 26,
    mass = 1,
    velocity: velocityThreshold = 0.01,
    precision = 0.01,
  } = config;

  // Get initial value
  const initialValue = typeof target === 'function' ? target() : target;

  // Create animated value signal
  const [animatedValue, setAnimatedValue] = signal(initialValue);

  // Spring state
  let state: SpringState = {
    position: initialValue,
    velocity: 0,
  };

  let rafId: number | null = null;
  let lastTime = Date.now();

  // Spring physics calculation (damped harmonic oscillator)
  const tick = () => {
    const currentTime = Date.now();
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.064); // Cap at ~15fps min
    lastTime = currentTime;

    const targetValue = typeof target === 'function' ? target() : target;

    // Calculate spring force
    const springForce = -tension * (state.position - targetValue);
    const dampingForce = -friction * state.velocity;
    const acceleration = (springForce + dampingForce) / mass;

    // Update velocity and position
    state.velocity += acceleration * deltaTime;
    state.position += state.velocity * deltaTime;

    // Check if animation is complete
    const isAtRest =
      Math.abs(state.velocity) < velocityThreshold &&
      Math.abs(targetValue - state.position) < precision;

    if (isAtRest) {
      state.position = targetValue;
      state.velocity = 0;
      setAnimatedValue(targetValue);
      rafId = null;
    } else {
      setAnimatedValue(state.position);
      rafId = requestAnimationFrame(tick);
    }
  };

  // Effect: Start animation when target changes
  effect(() => {
    const targetValue = typeof target === 'function' ? target() : target;

    // If already animating, the next tick will pick up the new target
    // If not animating, start a new animation
    if (rafId === null) {
      lastTime = Date.now();
      rafId = requestAnimationFrame(tick);
    }
  });

  // Cleanup
  onCleanup(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  return animatedValue;
}

/**
 * Create multiple spring-animated values from an object of targets.
 *
 * @example
 * ```ts
 * const [position, setPosition] = signal({ x: 0, y: 0 });
 * const animated = useSprings(position, { tension: 180, friction: 12 });
 *
 * // Use animated.x() and animated.y() in your component
 * <div style={{
 *   transform: `translate(${animated.x()}px, ${animated.y()}px)`
 * }}>
 *   2D spring animation!
 * </div>
 * ```
 */
export function useSprings<T extends Record<string, number>>(
  targets: Accessor<T> | T,
  config: SpringConfig = {}
): { [K in keyof T]: Accessor<number> } {
  const initialValues = typeof targets === 'function' ? targets() : targets;

  const springs = {} as { [K in keyof T]: Accessor<number> };

  for (const key in initialValues) {
    const targetAccessor = () => {
      const current = typeof targets === 'function' ? targets() : targets;
      return current[key];
    };
    springs[key] = useSpring(targetAccessor, config);
  }

  return springs;
}

/**
 * Interpolate a spring value through a range mapping.
 *
 * @example
 * ```ts
 * const [progress, setProgress] = signal(0);
 * const springProgress = useSpring(progress);
 *
 * // Map 0-100 to 0-360 degrees for rotation
 * const rotation = useSpringInterpolate(springProgress, {
 *   inputRange: [0, 100],
 *   outputRange: [0, 360],
 * });
 *
 * <div style={{ transform: `rotate(${rotation()}deg)` }} />
 * ```
 */
export function useSpringInterpolate(
  springValue: Accessor<number>,
  config: {
    inputRange: [number, number];
    outputRange: [number, number];
    clamp?: boolean;
  }
): Accessor<number> {
  const { inputRange, outputRange, clamp = false } = config;

  const [interpolated, setInterpolated] = signal(outputRange[0]);

  effect(() => {
    const value = springValue();
    const [inMin, inMax] = inputRange;
    const [outMin, outMax] = outputRange;

    let normalized = (value - inMin) / (inMax - inMin);

    if (clamp) {
      normalized = Math.max(0, Math.min(1, normalized));
    }

    const result = outMin + normalized * (outMax - outMin);
    setInterpolated(result);
  });

  return interpolated;
}
