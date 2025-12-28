/**
 * @nadi/router - Lightweight client-side router
 *
 * Features:
 * - Path pattern matching with parameters
 * - Nested routes
 * - Navigation guards
 * - Link prefetching
 * - Laravel route() helper integration
 * - History API integration
 * - Type-safe route definitions
 */

export { createRouter, useRouterInstance } from './router';
export { Link } from './components/Link';
export { Route } from './components/Route';
export { useRouter, useRoute, useParams, useNavigate } from './hooks';
export type {
  RouterConfig,
  RouteDefinition,
  RouteMatch,
  NavigationGuard,
  RouteParams,
  Router,
} from './types';
