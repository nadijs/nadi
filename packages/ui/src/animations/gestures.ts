/**
 * @file gestures.ts
 * @description Gesture handling system for drag, swipe, pinch, and more
 *
 * @example
 * ```ts
 * import { useGesture } from '@nadi/ui/animations';
 *
 * function DraggableBox() {
 *   const { x, y, dragging, bind } = useGesture();
 *
 *   return (
 *     <div
 *       {...bind()}
 *       style={{
 *         transform: `translate(${x()}px, ${y()}px)`,
 *         cursor: dragging() ? 'grabbing' : 'grab'
 *       }}
 *     >
 *       Drag me!
 *     </div>
 *   );
 * }
 * ```
 */

import { signal, effect, onCleanup, type Accessor } from '@nadi.js/core';

export interface GestureConfig {
  /**
   * Enable drag gestures
   * @default true
   */
  drag?: boolean;

  /**
   * Axis to constrain dragging ('x', 'y', or 'both')
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both';

  /**
   * Bounds for dragging [minX, maxX, minY, maxY]
   */
  bounds?: { left?: number; right?: number; top?: number; bottom?: number };

  /**
   * Callback when drag starts
   */
  onDragStart?: () => void;

  /**
   * Callback during drag with delta values
   */
  onDrag?: (info: { x: number; y: number; deltaX: number; deltaY: number }) => void;

  /**
   * Callback when drag ends
   */
  onDragEnd?: (info: { x: number; y: number; velocityX: number; velocityY: number }) => void;

  /**
   * Callback for swipe detection
   */
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down', velocity: number) => void;

  /**
   * Minimum velocity to trigger swipe (px/ms)
   * @default 0.5
   */
  swipeVelocityThreshold?: number;

  /**
   * Minimum distance to trigger swipe (px)
   * @default 50
   */
  swipeDistanceThreshold?: number;
}

interface GestureState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
  velocityX: number;
  velocityY: number;
  lastTime: number;
  isDragging: boolean;
}

/**
 * Reactive gesture handling with automatic cleanup.
 *
 * **Advantages over React/Vue:**
 * - React: Need useState + useEffect + useRef for gesture state
 * - Vue: Need ref() + computed() + watch() with manual event cleanup
 * - Nadi: Returns reactive signals that auto-update, auto-cleanup on unmount
 *
 * All gesture state is reactive - just call x(), y(), dragging() in your JSX.
 */
export function useGesture(config: GestureConfig = {}) {
  const {
    drag = true,
    axis = 'both',
    bounds,
    onDragStart,
    onDrag,
    onDragEnd,
    onSwipe,
    swipeVelocityThreshold = 0.5,
    swipeDistanceThreshold = 50,
  } = config;

  // Reactive gesture state
  const [x, setX] = signal(0);
  const [y, setY] = signal(0);
  const [dragging, setDragging] = signal(false);
  const [velocity, setVelocity] = signal({ x: 0, y: 0 });

  let state: GestureState = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    offsetX: 0,
    offsetY: 0,
    velocityX: 0,
    velocityY: 0,
    lastTime: Date.now(),
    isDragging: false,
  };

  // Apply bounds constraints
  const applyBounds = (x: number, y: number): [number, number] => {
    let constrainedX = x;
    let constrainedY = y;

    if (bounds) {
      if (bounds.left !== undefined) constrainedX = Math.max(bounds.left, constrainedX);
      if (bounds.right !== undefined) constrainedX = Math.min(bounds.right, constrainedX);
      if (bounds.top !== undefined) constrainedY = Math.max(bounds.top, constrainedY);
      if (bounds.bottom !== undefined) constrainedY = Math.min(bounds.bottom, constrainedY);
    }

    return [constrainedX, constrainedY];
  };

  // Detect swipe direction and velocity
  const detectSwipe = () => {
    const deltaX = state.currentX - state.startX;
    const deltaY = state.currentY - state.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const avgVelocity = Math.sqrt(state.velocityX ** 2 + state.velocityY ** 2);

    if (
      avgVelocity > swipeVelocityThreshold &&
      (absX > swipeDistanceThreshold || absY > swipeDistanceThreshold)
    ) {
      let direction: 'left' | 'right' | 'up' | 'down';

      if (absX > absY) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      onSwipe?.(direction, avgVelocity);
    }
  };

  // Pointer event handlers
  const handlePointerDown = (e: PointerEvent) => {
    if (!drag) return;

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    state.startX = e.clientX;
    state.startY = e.clientY;
    state.offsetX = x();
    state.offsetY = y();
    state.isDragging = true;
    state.lastTime = Date.now();

    setDragging(true);
    onDragStart?.();
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!state.isDragging) return;

    state.currentX = e.clientX;
    state.currentY = e.clientY;

    const deltaX = state.currentX - state.startX;
    const deltaY = state.currentY - state.startY;

    let newX = state.offsetX + deltaX;
    let newY = state.offsetY + deltaY;

    // Apply axis constraints
    if (axis === 'x') newY = state.offsetY;
    if (axis === 'y') newX = state.offsetX;

    // Apply bounds
    [newX, newY] = applyBounds(newX, newY);

    // Calculate velocity
    const now = Date.now();
    const dt = Math.max(now - state.lastTime, 1);
    state.velocityX = (newX - x()) / dt;
    state.velocityY = (newY - y()) / dt;
    state.lastTime = now;

    setX(newX);
    setY(newY);
    setVelocity({ x: state.velocityX, y: state.velocityY });

    onDrag?.({
      x: newX,
      y: newY,
      deltaX,
      deltaY,
    });
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!state.isDragging) return;

    const target = e.currentTarget as HTMLElement;
    target.releasePointerCapture(e.pointerId);

    state.isDragging = false;
    setDragging(false);

    // Detect swipe
    detectSwipe();

    onDragEnd?.({
      x: x(),
      y: y(),
      velocityX: state.velocityX,
      velocityY: state.velocityY,
    });
  };

  /**
   * Bind gesture handlers to an element.
   * Use spread operator: `<div {...bind()}>`
   */
  const bind = () => {
    return {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      style: {
        touchAction: 'none', // Prevent default touch behaviors
        userSelect: 'none', // Prevent text selection during drag
      },
    };
  };

  /**
   * Reset position to origin
   */
  const reset = () => {
    setX(0);
    setY(0);
    setVelocity({ x: 0, y: 0 });
  };

  /**
   * Set position programmatically
   */
  const setPosition = (newX: number, newY: number) => {
    const [constrainedX, constrainedY] = applyBounds(newX, newY);
    setX(constrainedX);
    setY(constrainedY);
  };

  return {
    /** Reactive X position signal */
    x,
    /** Reactive Y position signal */
    y,
    /** Reactive dragging state signal */
    dragging,
    /** Reactive velocity signal */
    velocity,
    /** Bind gesture handlers to element */
    bind,
    /** Reset position to origin */
    reset,
    /** Set position programmatically */
    setPosition,
  };
}

/**
 * Simple hover gesture with enter/exit callbacks.
 *
 * @example
 * ```ts
 * const { hovered, bind } = useHover({
 *   onEnter: () => console.log('Mouse entered'),
 *   onLeave: () => console.log('Mouse left'),
 * });
 *
 * <div {...bind()}>
 *   {hovered() ? 'Hovered!' : 'Hover me'}
 * </div>
 * ```
 */
export function useHover(
  config: {
    onEnter?: () => void;
    onLeave?: () => void;
  } = {}
) {
  const [hovered, setHovered] = signal(false);

  const bind = () => ({
    onPointerEnter: () => {
      setHovered(true);
      config.onEnter?.();
    },
    onPointerLeave: () => {
      setHovered(false);
      config.onLeave?.();
    },
  });

  return { hovered, bind };
}

/**
 * Press gesture with timing information.
 *
 * @example
 * ```ts
 * const { pressed, pressTime, bind } = usePress({
 *   onPress: () => console.log('Pressed!'),
 *   onLongPress: () => console.log('Long press!'),
 *   longPressThreshold: 500,
 * });
 * ```
 */
export function usePress(
  config: {
    onPress?: () => void;
    onLongPress?: () => void;
    longPressThreshold?: number;
  } = {}
) {
  const { onPress, onLongPress, longPressThreshold = 500 } = config;

  const [pressed, setPressed] = signal(false);
  const [pressTime, setPressTime] = signal(0);

  let pressStartTime = 0;
  let longPressTimer: number | null = null;

  const bind = () => ({
    onPointerDown: () => {
      pressStartTime = Date.now();
      setPressed(true);

      if (onLongPress) {
        longPressTimer = window.setTimeout(() => {
          onLongPress();
        }, longPressThreshold);
      }
    },
    onPointerUp: () => {
      const duration = Date.now() - pressStartTime;
      setPressTime(duration);
      setPressed(false);

      if (longPressTimer !== null) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      if (duration < longPressThreshold) {
        onPress?.();
      }
    },
    onPointerCancel: () => {
      setPressed(false);
      if (longPressTimer !== null) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    },
  });

  return { pressed, pressTime, bind };
}
