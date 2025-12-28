/**
 * @file scroll.ts
 * @description Scroll-based animations with intersection observers and scroll progress
 *
 * @example
 * ```ts
 * import { useFadeIn, useScrollProgress, useParallax } from '@nadi/ui/animations';
 *
 * // Fade in when element enters viewport
 * function FadeInBox() {
 *   const { ref, visible, progress } = useFadeIn();
 *
 *   return (
 *     <div ref={ref} style={{ opacity: progress() }}>
 *       I fade in on scroll!
 *     </div>
 *   );
 * }
 *
 * // Parallax scrolling effect
 * function ParallaxImage() {
 *   const { ref, offset } = useParallax({ speed: 0.5 });
 *
 *   return (
 *     <div ref={ref}>
 *       <img style={{ transform: `translateY(${offset()}px)` }} />
 *     </div>
 *   );
 * }
 * ```
 */

import { signal, effect, onCleanup, type Accessor } from '@nadi/core';

export interface ScrollObserverConfig {
  /**
   * Root element for intersection observer. Defaults to viewport.
   */
  root?: HTMLElement | null;

  /**
   * Margin around root for triggering visibility.
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * Threshold(s) for triggering intersection (0 to 1).
   * @default 0.1
   */
  threshold?: number | number[];
}

/**
 * Track when an element enters/exits the viewport.
 *
 * **Why this is better:**
 * - React: Need useRef + useEffect + useState with manual observer setup
 * - Vue: Need ref() + onMounted/onUnmounted with manual cleanup
 * - Nadi: Returns reactive signals, auto-cleanup via onCleanup()
 */
export function useIntersectionObserver(config: ScrollObserverConfig = {}) {
  const { root = null, rootMargin = '0px', threshold = 0.1 } = config;

  const [visible, setVisible] = signal(false);
  const [intersectionRatio, setIntersectionRatio] = signal(0);
  const [element, setElement] = signal<HTMLElement | null>(null);

  // Create observer when element is set
  effect(() => {
    const el = element();
    if (!el || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
          setIntersectionRatio(entry.intersectionRatio);
        });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);

    onCleanup(() => {
      observer.disconnect();
    });
  });

  return {
    /** Element ref to attach to DOM node */
    ref: setElement,
    /** Reactive visibility signal */
    visible,
    /** Reactive intersection ratio (0 to 1) */
    intersectionRatio,
  };
}

/**
 * Fade in animation when element enters viewport.
 *
 * @example
 * ```ts
 * const { ref, visible, progress } = useFadeIn({ threshold: 0.2 });
 *
 * <div ref={ref} style={{ opacity: progress() }}>
 *   Fades in smoothly!
 * </div>
 * ```
 */
export function useFadeIn(config: ScrollObserverConfig = {}) {
  const { visible, intersectionRatio, ref } = useIntersectionObserver({
    ...config,
    threshold: config.threshold || [0, 0.25, 0.5, 0.75, 1],
  });

  const [progress, setProgress] = signal(0);

  effect(() => {
    if (visible()) {
      setProgress(intersectionRatio());
    }
  });

  return { ref, visible, progress };
}

/**
 * Get scroll progress of the page (0 to 1).
 *
 * @example
 * ```ts
 * const progress = useScrollProgress();
 *
 * <div style={{
 *   width: `${progress() * 100}%`,
 *   position: 'fixed',
 *   top: 0,
 *   height: '3px',
 *   background: 'blue'
 * }}>
 *   Scroll progress bar
 * </div>
 * ```
 */
export function useScrollProgress(): Accessor<number> {
  const [progress, setProgress] = signal(0);

  if (typeof window === 'undefined') return progress;

  const updateProgress = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollableHeight = documentHeight - windowHeight;
    const scrollProgress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;
    setProgress(Math.max(0, Math.min(1, scrollProgress)));
  };

  updateProgress();

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  onCleanup(() => {
    window.removeEventListener('scroll', updateProgress);
    window.removeEventListener('resize', updateProgress);
  });

  return progress;
}

/**
 * Parallax scrolling effect.
 * Element moves at a different speed than scroll.
 *
 * @example
 * ```ts
 * const { ref, offset } = useParallax({ speed: 0.5 });
 *
 * <div ref={ref}>
 *   <img style={{
 *     transform: `translateY(${offset()}px)`,
 *     willChange: 'transform'
 *   }} />
 * </div>
 * ```
 */
export function useParallax(
  config: {
    /**
     * Speed multiplier for parallax effect.
     * 0 = no movement, 1 = normal scroll speed, 0.5 = half speed
     * @default 0.5
     */
    speed?: number;

    /**
     * Direction of parallax ('vertical' or 'horizontal')
     * @default 'vertical'
     */
    direction?: 'vertical' | 'horizontal';
  } = {}
) {
  const { speed = 0.5, direction = 'vertical' } = config;

  const [offset, setOffset] = signal(0);
  const [element, setElement] = signal<HTMLElement | null>(null);

  if (typeof window === 'undefined') {
    return { ref: setElement, offset };
  }

  const updateOffset = () => {
    const el = element();
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const scrollProgress = (windowHeight - elementCenter) / windowHeight;

    if (direction === 'vertical') {
      setOffset(scrollProgress * 100 * speed);
    } else {
      setOffset(scrollProgress * 100 * speed);
    }
  };

  effect(() => {
    if (!element()) return;

    updateOffset();
    window.addEventListener('scroll', updateOffset, { passive: true });
    window.addEventListener('resize', updateOffset, { passive: true });

    onCleanup(() => {
      window.removeEventListener('scroll', updateOffset);
      window.removeEventListener('resize', updateOffset);
    });
  });

  return { ref: setElement, offset };
}

/**
 * Reveal animation with customizable direction.
 *
 * @example
 * ```ts
 * const { ref, visible } = useReveal({ direction: 'up', threshold: 0.3 });
 *
 * <div
 *   ref={ref}
 *   data-visible={visible()}
 *   class="reveal-up"
 * >
 *   Slides up and fades in!
 * </div>
 * ```
 */
export function useReveal(
  config: {
    direction?: 'up' | 'down' | 'left' | 'right';
    threshold?: number;
    rootMargin?: string;
  } = {}
) {
  const { direction = 'up', threshold = 0.2, rootMargin = '0px' } = config;

  const { ref, visible } = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  return { ref, visible, direction };
}

/**
 * Stagger children animations when they enter viewport.
 *
 * @example
 * ```ts
 * const { ref, visibleCount } = useStagger({ staggerDelay: 100 });
 *
 * <div ref={ref}>
 *   {items().map((item, i) => (
 *     <div
 *       style={{
 *         animationDelay: `${i * 100}ms`,
 *         opacity: i < visibleCount() ? 1 : 0
 *       }}
 *     >
 *       {item}
 *     </div>
 *   ))}
 * </div>
 * ```
 */
export function useStagger(
  config: {
    staggerDelay?: number;
    childSelector?: string;
  } = {}
) {
  const { staggerDelay = 100, childSelector = '*' } = config;

  const [element, setElement] = signal<HTMLElement | null>(null);
  const [visibleCount, setVisibleCount] = signal(0);
  const { visible } = useIntersectionObserver({ threshold: 0.1 });

  effect(() => {
    const el = element();
    if (!el || !visible()) return;

    const children = el.querySelectorAll(childSelector);
    let count = 0;

    const revealNext = () => {
      if (count < children.length) {
        count++;
        setVisibleCount(count);
        setTimeout(revealNext, staggerDelay);
      }
    };

    revealNext();
  });

  return { ref: setElement, visibleCount };
}

/**
 * Smooth scroll to element with optional offset.
 *
 * @example
 * ```ts
 * const scrollTo = useScrollTo({ offset: -100 });
 *
 * <button onClick={() => scrollTo(targetElement)}>
 *   Scroll to section
 * </button>
 * ```
 */
export function useScrollTo(
  config: {
    offset?: number;
    behavior?: ScrollBehavior;
  } = {}
) {
  const { offset = 0, behavior = 'smooth' } = config;

  const scrollTo = (element: HTMLElement | string) => {
    if (typeof window === 'undefined') return;

    const target =
      typeof element === 'string' ? (document.querySelector(element) as HTMLElement) : element;

    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.scrollY + offset;

    window.scrollTo({
      top: targetPosition,
      behavior,
    });
  };

  return scrollTo;
}
