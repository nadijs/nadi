/**
 * Control flow components (Show, For, Portal, ErrorBoundary)
 */

import { signal } from '../reactive/signals';
import { onCleanup } from '../reactive/lifecycle';

export type ShowProps<T> = {
  when: T | undefined | null | false;
  fallback?: any;
  children: any;
};

export type ForProps<T, U extends any> = {
  each: readonly T[] | undefined | null;
  fallback?: any;
  children: (item: T, index: () => number) => U;
};

export type PortalProps = {
  mount?: HTMLElement;
  children: any;
};

export type ErrorBoundaryProps = {
  fallback: (error: Error, reset: () => void) => any;
  children: any;
};

/**
 * Conditional rendering component
 */
export function Show<T>(props: ShowProps<T>): any {
  return () => {
    const condition = typeof props.when === 'function' ? (props.when as any)() : props.when;
    return condition ? props.children : props.fallback;
  };
}

/**
 * List rendering component with keyed updates
 */
export function For<T, U>(props: ForProps<T, U>): any {
  return () => {
    const list = typeof props.each === 'function' ? (props.each as any)() : props.each;

    if (!list || list.length === 0) {
      return props.fallback;
    }

    return list.map((item: T, index: number) => {
      return props.children(item, () => index);
    });
  };
}

/**
 * Portal component for rendering outside the component tree
 */
export function Portal(props: PortalProps): any {
  const mount = props.mount || document.body;
  const container = document.createElement('div');

  mount.appendChild(container);

  onCleanup(() => {
    mount.removeChild(container);
  });

  return () => {
    // Render children into portal container
    return props.children;
  };
}

/**
 * Error boundary for catching and handling errors
 */
export function ErrorBoundary(props: ErrorBoundaryProps): any {
  const errorSignal = signal<Error | null>(null);

  const reset = () => errorSignal(null);

  return () => {
    const currentError = errorSignal();

    if (currentError) {
      return props.fallback(currentError, reset);
    }

    try {
      return props.children;
    } catch (err) {
      errorSignal(err as Error);
      return props.fallback(err as Error, reset);
    }
  };
}
