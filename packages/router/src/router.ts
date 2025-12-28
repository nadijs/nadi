import { signal } from '@nadi.js/core';
import type {
  RouterConfig,
  RouteDefinition,
  RouteMatch,
  NavigationGuard,
  RouteParams,
  Router,
} from './types';

/**
 * Path pattern matcher
 */
function matchPath(pattern: string, path: string): { matches: boolean; params: RouteParams } {
  const paramNames: string[] = [];
  const regexPattern = pattern
    .replace(/\//g, '\\/')
    .replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    })
    .replace(/\*/g, '(.*)');

  const regex = new RegExp(`^${regexPattern}$`);
  const match = path.match(regex);

  if (!match) {
    return { matches: false, params: {} };
  }

  const params: RouteParams = {};
  paramNames.forEach((name, index) => {
    const value = match[index + 1];
    if (value !== undefined) {
      params[name] = value;
    }
  });

  return { matches: true, params };
}

/**
 * Find matching route from route definitions
 */
function findRoute(
  routes: RouteDefinition[],
  path: string,
  parentPath = ''
): {
  route: RouteDefinition | null;
  params: RouteParams;
} {
  for (const route of routes) {
    const fullPath = parentPath + route.path;
    const { matches, params } = matchPath(fullPath, path);

    if (matches) {
      return { route, params };
    }

    // Check nested routes
    if (route.children) {
      const childResult = findRoute(route.children, path, fullPath);
      if (childResult.route) {
        return childResult;
      }
    }
  }

  return { route: null, params: {} };
}

/**
 * Parse query string
 */
function parseQuery(search: string): Record<string, string> {
  const query: Record<string, string> = {};
  const params = new URLSearchParams(search);
  params.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}

/**
 * Create route match object from URL
 */
function createRouteMatch(
  url: URL,
  route: RouteDefinition | null,
  params: RouteParams
): RouteMatch {
  return {
    path: url.pathname,
    params,
    query: parseQuery(url.search),
    hash: url.hash,
    meta: route?.meta,
    name: route?.name,
  };
}

let routerInstance: Router | null = null;

/**
 * Create router instance
 */
export function createRouter(config: RouterConfig): Router {
  const { routes, beforeEach: globalBeforeEach, afterEach: globalAfterEach } = config;

  const beforeEachGuards: NavigationGuard[] = [];
  const afterEachHooks: Array<(to: RouteMatch, from: RouteMatch | null) => void> = [];

  if (globalBeforeEach) {
    beforeEachGuards.push(globalBeforeEach);
  }

  if (globalAfterEach) {
    afterEachHooks.push(globalAfterEach);
  }

  // Initialize current route
  const currentURL = new URL(window.location.href);
  const { route: initialRoute, params: initialParams } = findRoute(routes, currentURL.pathname);
  const currentRoute = signal<RouteMatch>(
    createRouteMatch(currentURL, initialRoute, initialParams)
  );

  /**
   * Navigate to a new path
   */
  async function navigate(path: string, replace = false): Promise<void> {
    const url = new URL(path, window.location.origin);
    const { route, params } = findRoute(routes, url.pathname);
    const to = createRouteMatch(url, route, params);
    const from = currentRoute();

    // Run before guards
    for (const guard of beforeEachGuards) {
      const result = await guard(to, from);

      if (result === false) {
        return; // Navigation cancelled
      }

      if (typeof result === 'string') {
        // Redirect to different path
        return navigate(result, replace);
      }
    }

    // Run route-specific guard
    if (route?.beforeEnter) {
      const result = await route.beforeEnter(to, from);

      if (result === false) {
        return;
      }

      if (typeof result === 'string') {
        return navigate(result, replace);
      }
    }

    // Update history
    if (replace) {
      window.history.replaceState({ path }, '', url.href);
    } else {
      window.history.pushState({ path }, '', url.href);
    }

    // Update current route
    currentRoute(to);

    // Handle scroll behavior
    if (config.scrollBehavior) {
      const scrollOptions = config.scrollBehavior(to, from);
      if (scrollOptions) {
        window.scrollTo(scrollOptions);
      }
    } else {
      window.scrollTo(0, 0);
    }

    // Run after hooks
    for (const hook of afterEachHooks) {
      hook(to, from);
    }
  }

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    const url = new URL(window.location.href);
    const { route, params } = findRoute(routes, url.pathname);
    const to = createRouteMatch(url, route, params);
    const from = currentRoute();

    currentRoute(to);

    // Run after hooks
    for (const hook of afterEachHooks) {
      hook(to, from);
    }
  });

  const router: Router = {
    get currentRoute() {
      return currentRoute();
    },

    push(path: string): Promise<void> {
      return navigate(path, false);
    },

    replace(path: string): Promise<void> {
      return navigate(path, true);
    },

    back(): void {
      window.history.back();
    },

    forward(): void {
      window.history.forward();
    },

    go(delta: number): void {
      window.history.go(delta);
    },

    beforeEach(guard: NavigationGuard): () => void {
      beforeEachGuards.push(guard);
      return () => {
        const index = beforeEachGuards.indexOf(guard);
        if (index > -1) {
          beforeEachGuards.splice(index, 1);
        }
      };
    },

    afterEach(hook: (to: RouteMatch, from: RouteMatch | null) => void): () => void {
      afterEachHooks.push(hook);
      return () => {
        const index = afterEachHooks.indexOf(hook);
        if (index > -1) {
          afterEachHooks.splice(index, 1);
        }
      };
    },
  };

  routerInstance = router;
  return router;
}

/**
 * Get the current router instance
 */
export function useRouterInstance(): Router {
  if (!routerInstance) {
    throw new Error('Router not initialized. Call createRouter() first.');
  }
  return routerInstance;
}

export { Router };
