/**
 * Context API for passing data through the component tree
 */

import { currentOwner, type Owner } from './signals';

export type Context<T> = {
  id: symbol;
  defaultValue: T;
};

/**
 * Creates a context for dependency injection
 */
export function createContext<T>(defaultValue: T): Context<T> {
  return {
    id: Symbol('context'),
    defaultValue,
  };
}

/**
 * Provides a context value to child components
 */
export function provideContext<T>(context: Context<T>, value: T): void {
  if (!currentOwner) {
    throw new Error('provideContext must be called within a component');
  }

  currentOwner.context.set(context.id, value);
}

/**
 * Consumes a context value from parent components
 */
export function useContext<T>(context: Context<T>): T {
  let owner: Owner | null = currentOwner;

  while (owner) {
    if (owner.context.has(context.id)) {
      return owner.context.get(context.id);
    }
    owner = owner.parent;
  }

  return context.defaultValue;
}
