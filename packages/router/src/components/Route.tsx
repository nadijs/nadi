import type { JSX } from '@nadi/core';
import { useRoute } from '../hooks';

export interface RouteProps {
  path: string;
  component: () => JSX.Element;
}

/**
 * Route component for conditional rendering based on current route
 */
export function Route(props: RouteProps): JSX.Element | null {
  const route = useRoute();

  // Simple path matching
  const matches = () => {
    return route.path === props.path;
  };

  return matches() ? props.component() : null;
}
