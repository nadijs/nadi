/**
 * Lifecycle hooks for components
 */

import { currentOwner, setCurrentOwner, type Owner } from './signals';

/**
 * Runs a callback when the component mounts
 */
export function onMount(fn: () => void): void {
  if (!currentOwner) {
    throw new Error('onMount must be called within a component');
  }

  // Execute immediately during component setup
  fn();
}

/**
 * Registers a cleanup function to run when component unmounts
 */
export function onCleanup(fn: () => void): void {
  if (!currentOwner) {
    throw new Error('onCleanup must be called within a component');
  }

  currentOwner.cleanups.push(fn);
}

/**
 * Gets the current owner (component scope)
 */
export function getOwner(): Owner | null {
  return currentOwner;
}

/**
 * Runs a function with a specific owner context
 */
export function runWithOwner<T>(owner: Owner | null, fn: () => T): T {
  const prevOwner = currentOwner;
  setCurrentOwner(owner);
  try {
    return fn();
  } finally {
    setCurrentOwner(prevOwner);
  }
}

/**
 * Creates a new reactive root (component scope)
 */
export function createRoot<T>(fn: (dispose: () => void) => T): T {
  const owner: Owner = {
    computations: new Set(),
    cleanups: [],
    context: new Map(),
    parent: currentOwner,
  };

  const dispose = () => {
    // Run all cleanup functions
    owner.cleanups.forEach((cleanup) => cleanup());
    owner.cleanups = [];

    // Dispose all computations
    owner.computations.forEach((comp) => {
      comp.dependencies.clear();
    });
    owner.computations.clear();

    // Clear context
    owner.context.clear();
  };

  return runWithOwner(owner, () => fn(dispose));
}

export type { Owner };
