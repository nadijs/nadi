import { useRouterInstance } from './router';
import type { RouteMatch, RouteParams, Router } from './types';

/**
 * Get the router instance
 */
export function useRouter(): Router {
  return useRouterInstance();
}

/**
 * Get the current route
 */
export function useRoute(): RouteMatch {
  const router = useRouterInstance();
  return router.currentRoute;
}

/**
 * Get route parameters
 */
export function useParams(): RouteParams {
  const route = useRoute();
  return route.params;
}

/**
 * Get navigation function
 */
export function useNavigate() {
  const router = useRouterInstance();

  return {
    push: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
    back: () => router.back(),
    forward: () => router.forward(),
    go: (delta: number) => router.go(delta),
  };
}
