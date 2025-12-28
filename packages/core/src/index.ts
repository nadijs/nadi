/**
 * Nadi Core - Signals-based Reactive System
 *
 * Fine-grained reactivity with automatic dependency tracking
 * ~2KB minified and gzipped
 */

export { signal, computed, effect, batch, untrack } from './reactive/signals';
export type { Signal, Computed, EffectFunction, SignalOptions } from './reactive/signals';

export { onMount, onCleanup, getOwner, runWithOwner, createRoot } from './reactive/lifecycle';
export type { Owner } from './reactive/lifecycle';

export { createContext, useContext } from './reactive/context';
export type { Context } from './reactive/context';

export { Show, For, Portal, ErrorBoundary } from './components/control-flow';
export type {
  ShowProps,
  ForProps,
  PortalProps,
  ErrorBoundaryProps,
} from './components/control-flow';

export type { JSX } from './jsx-types';

// SSR/Hydration exports
export { hydrate, isHydrating, clearHydrationData } from './hydration';
export {
  renderToString,
  renderToStaticMarkup,
  renderToHtml,
  getHydrationData,
} from './jsx-ssr-runtime';

// Version
export const VERSION = '0.2.0';
