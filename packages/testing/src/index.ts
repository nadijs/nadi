/**
 * @nadi/testing - Testing utilities for Nadi framework
 */

import { createRoot, batch } from '@nadi.js/core';
import { fireEvent as domFireEvent, getQueriesForElement } from '@testing-library/dom';

export interface RenderResult {
  container: HTMLElement;
  unmount: () => void;
  rerender: (component: () => any) => void;
}

export interface RenderOptions {
  container?: HTMLElement;
  baseElement?: HTMLElement;
}

/**
 * Render a Nadi component for testing
 */
export function renderComponent(component: () => any, options: RenderOptions = {}): RenderResult {
  const { container = document.createElement('div'), baseElement = document.body } = options;

  if (!container.parentElement) {
    baseElement.appendChild(container);
  }

  let dispose: (() => void) | undefined;

  const render = (comp: () => any) => {
    if (dispose) {
      dispose();
    }

    dispose = createRoot((rootDispose) => {
      const result = comp();

      // Clear container
      container.innerHTML = '';

      // Append result to container
      if (result instanceof Node) {
        container.appendChild(result);
      } else if (Array.isArray(result)) {
        result.forEach((node) => {
          if (node instanceof Node) {
            container.appendChild(node);
          }
        });
      }

      return rootDispose;
    });
  };

  render(component);

  return {
    container,
    unmount: () => {
      if (dispose) {
        dispose();
      }
      if (container.parentElement) {
        container.parentElement.removeChild(container);
      }
    },
    rerender: render,
  };
}

/**
 * Fire DOM events
 */
export const fireEvent = domFireEvent;

/**
 * Wait for a condition to be true
 */
export async function waitFor<T>(
  callback: () => T | Promise<T>,
  options: {
    timeout?: number;
    interval?: number;
  } = {}
): Promise<T> {
  const { timeout = 1000, interval = 50 } = options;
  const startTime = Date.now();

  while (true) {
    try {
      const result = await callback();
      return result;
    } catch (error) {
      if (Date.now() - startTime >= timeout) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
}

/**
 * Wait for an element to be removed
 */
export async function waitForElementToBeRemoved<T>(
  callback: () => T,
  options: {
    timeout?: number;
    interval?: number;
  } = {}
): Promise<void> {
  await waitFor(() => {
    const result = callback();
    if (result) {
      throw new Error('Element still present');
    }
  }, options);
}

/**
 * Screen queries for the document
 */
export const screen = {
  ...getQueriesForElement(document.body),
  debug: (element?: HTMLElement) => {
    console.log((element || document.body).innerHTML);
  },
};

/**
 * Create a mock signal with spy capabilities
 */
export function mockSignal<T>(initialValue: T) {
  const calls: T[][] = [];
  let callCount = 0;
  let value = initialValue;

  const getter = () => value;
  const setter = (newValue: T | ((prev: T) => T)) => {
    const nextValue =
      typeof newValue === 'function' ? (newValue as (prev: T) => T)(value) : newValue;
    value = nextValue;
    calls.push([nextValue]);
    callCount++;
  };

  const spy = {
    calls,
    get callCount() {
      return callCount;
    },
    reset: () => {
      calls.length = 0;
      callCount = 0;
    },
  };

  return [getter, setter, spy] as const;
}

/**
 * Flush all pending effects synchronously
 */
export function flushEffects(): void {
  batch(() => {
    // Batching forces synchronous execution of queued effects
  });
}

/**
 * Create a test root for isolated testing
 */
export function createTestRoot<T>(fn: (dispose: () => void) => T): () => void {
  return createRoot(fn);
}

/**
 * Act utility for batching updates
 */
export async function act(callback: () => void | Promise<void>): Promise<void> {
  const result = callback();
  if (result instanceof Promise) {
    await result;
  }
  flushEffects();
}

// Re-export common testing utilities
export { cleanup } from '@testing-library/dom';
