/**
 * Type definitions for the router
 */

export type RouteParams = Record<string, string>;

export interface RouteDefinition {
  path: string;
  component?: any;
  children?: RouteDefinition[];
  name?: string;
  meta?: Record<string, any>;
  beforeEnter?: NavigationGuard;
}

export interface RouteMatch {
  path: string;
  params: RouteParams;
  query: Record<string, string>;
  hash: string;
  meta: Record<string, any> | undefined;
  name: string | undefined;
}

export type NavigationGuard = (
  to: RouteMatch,
  from: RouteMatch | null
) => boolean | Promise<boolean> | string | Promise<string>;

export interface RouterConfig {
  routes: RouteDefinition[];
  base?: string;
  scrollBehavior?: (to: RouteMatch, from: RouteMatch | null) => ScrollToOptions | void;
  beforeEach?: NavigationGuard;
  afterEach?: (to: RouteMatch, from: RouteMatch | null) => void;
}

export interface Router {
  currentRoute: RouteMatch;
  push(path: string): Promise<void>;
  replace(path: string): Promise<void>;
  back(): void;
  forward(): void;
  go(delta: number): void;
  beforeEach(guard: NavigationGuard): () => void;
  afterEach(hook: (to: RouteMatch, from: RouteMatch | null) => void): () => void;
}
