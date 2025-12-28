/**
 * Signal: Reactive primitive for state management
 *
 * Signals provide fine-grained reactivity with automatic dependency tracking.
 * They are getter/setter functions that notify dependents when changed.
 */

type Computation = {
  execute: () => void;
  dependencies: Set<Signal<any>>;
  owner: Owner | null;
};

type Owner = {
  computations: Set<Computation>;
  cleanups: Array<() => void>;
  context: Map<symbol, any>;
  parent: Owner | null;
};

// Global reactive context
let currentComputation: Computation | null = null;
let currentOwner: Owner | null = null;
let batchDepth = 0;
let batchedUpdates = new Set<Computation>();

// Setter functions for external modification
export function setCurrentOwner(owner: Owner | null): void {
  currentOwner = owner;
}

export function setCurrentComputation(computation: Computation | null): void {
  currentComputation = computation;
}

export type SignalOptions = {
  equals?: boolean | ((prev: any, next: any) => boolean);
};

export type Signal<T> = {
  (): T;
  (value: T): T;
  peek(): T;
};

export type Computed<T> = {
  (): T;
  peek(): T;
};

export type EffectFunction = () => void | (() => void);

/**
 * Creates a reactive signal
 */
export function signal<T>(initialValue: T, options?: SignalOptions): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<Computation>();

  const equals =
    options?.equals === false
      ? () => false
      : typeof options?.equals === 'function'
        ? options.equals
        : (a: T, b: T) => a === b;

  const read = () => {
    // Track dependency if we're inside a computation
    if (currentComputation) {
      subscribers.add(currentComputation);
      currentComputation.dependencies.add(read as any);
    }
    return value;
  };

  const write = (nextValue: T) => {
    // Skip update if value hasn't changed
    if (equals(value, nextValue)) {
      return value;
    }

    value = nextValue;

    // Notify all subscribers
    if (batchDepth > 0) {
      subscribers.forEach((comp) => batchedUpdates.add(comp));
    } else {
      subscribers.forEach((comp) => comp.execute());
    }

    return value;
  };

  const peek = () => value;

  const accessor: any = (arg?: T) => {
    return arguments.length === 0 ? read() : write(arg!);
  };

  accessor.peek = peek;

  return accessor as Signal<T>;
}

/**
 * Creates a computed signal (derived state)
 */
export function computed<T>(fn: () => T): Computed<T> {
  const s = signal<T>(undefined as T, { equals: false });

  effect(() => {
    s(fn());
  });

  return s as Computed<T>;
}

/**
 * Creates an effect that automatically tracks dependencies and re-runs when they change
 */
export function effect(fn: EffectFunction): () => void {
  const computation: Computation = {
    execute: () => {
      // Clean up previous dependencies
      computation.dependencies.forEach((dep) => {
        const signal = dep as any;
        if (signal.subscribers) {
          signal.subscribers.delete(computation);
        }
      });
      computation.dependencies.clear();

      // Run the effect and track new dependencies
      const prevComputation = currentComputation;
      const prevOwner = currentOwner;
      currentComputation = computation;
      currentOwner = computation.owner;

      try {
        const cleanup = fn();

        // Register cleanup function
        if (typeof cleanup === 'function' && computation.owner) {
          computation.owner.cleanups.push(cleanup);
        }
      } finally {
        currentComputation = prevComputation;
        currentOwner = prevOwner;
      }
    },
    dependencies: new Set(),
    owner: currentOwner,
  };

  // Register with current owner
  if (currentOwner) {
    currentOwner.computations.add(computation);
  }

  // Run the effect initially
  computation.execute();

  // Return dispose function
  return () => {
    computation.dependencies.forEach((dep) => {
      const signal = dep as any;
      if (signal.subscribers) {
        signal.subscribers.delete(computation);
      }
    });
    computation.dependencies.clear();

    if (computation.owner) {
      computation.owner.computations.delete(computation);
    }
  };
}

/**
 * Batches multiple signal updates into a single update cycle
 */
export function batch<T>(fn: () => T): T {
  batchDepth++;
  try {
    return fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      const updates = Array.from(batchedUpdates);
      batchedUpdates.clear();
      updates.forEach((comp) => comp.execute());
    }
  }
}

/**
 * Reads a signal without tracking it as a dependency
 */
export function untrack<T>(fn: () => T): T {
  const prevComputation = currentComputation;
  currentComputation = null;
  try {
    return fn();
  } finally {
    currentComputation = prevComputation;
  }
}

// Export for lifecycle hooks
export { currentOwner, currentComputation };
export type { Owner, Computation };
