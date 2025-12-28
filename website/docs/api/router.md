# @nadi/router API Reference

Complete API reference for `@nadi/router` - client-side routing for Nadi applications.

## Installation

```bash
npm install @nadi/router
```

## Router Creation

### createRouter()

Create a router instance with route definitions.

```typescript
function createRouter(config: RouterConfig): Router;
```

**Parameters:**

```typescript
interface RouterConfig {
  routes: RouteDefinition[];
  mode?: 'hash' | 'history'; // Default: 'history'
  base?: string; // Default: '/'
  scrollBehavior?: ScrollBehavior;
  fallback?: () => JSX.Element;
}
```

**Returns:** `Router` instance

**Example:**

```typescript
import { createRouter } from '@nadi/router';

const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/users/:id', component: UserProfile },
  ],
  mode: 'history',
  base: '/app/',
});
```

## Route Definition

### RouteDefinition

Configuration for a single route.

```typescript
interface RouteDefinition {
  path: string;
  component: Component;
  name?: string;
  meta?: RouteMeta;
  beforeEnter?: NavigationGuard;
  children?: RouteDefinition[];
  redirect?: string | RedirectFunction;
}
```

**Properties:**

- `path`: Route path with optional parameters (`:id`, `*`)
- `component`: Component to render for this route
- `name`: Optional route name for programmatic navigation
- `meta`: Custom metadata for the route
- `beforeEnter`: Route-specific navigation guard
- `children`: Nested child routes
- `redirect`: Redirect to another route

**Example:**

```typescript
const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
    name: 'home',
    meta: { title: 'Home' },
  },
  {
    path: '/users/:id',
    component: UserProfile,
    name: 'user',
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next('/login');
      }
    },
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome },
      { path: 'settings', component: Settings },
    ],
  },
];
```

## Router Instance

### router.push()

Navigate to a new route.

```typescript
router.push(to: string | RouteLocation): Promise<void>
```

**Parameters:**

```typescript
interface RouteLocation {
  path?: string;
  name?: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  hash?: string;
}
```

**Example:**

```typescript
// String path
router.push('/users/123');

// Object with path
router.push({ path: '/users/123' });

// Named route
router.push({ name: 'user', params: { id: '123' } });

// With query
router.push({ path: '/search', query: { q: 'nadi' } });
```

### router.replace()

Replace current route without adding to history.

```typescript
router.replace(to: string | RouteLocation): Promise<void>
```

**Example:**

```typescript
router.replace('/login');
```

### router.go()

Navigate through history.

```typescript
router.go(delta: number): void
```

**Parameters:**

- `delta`: Number of steps to move (negative for back)

**Example:**

```typescript
router.go(-1); // Back
router.go(1); // Forward
router.go(-2); // Two steps back
```

### router.back()

Navigate back one step.

```typescript
router.back(): void
```

**Example:**

```typescript
router.back();
```

### router.forward()

Navigate forward one step.

```typescript
router.forward(): void
```

**Example:**

```typescript
router.forward();
```

### router.beforeEach()

Register global navigation guard.

```typescript
router.beforeEach(guard: NavigationGuard): Unsubscribe
```

**Parameters:**

```typescript
type NavigationGuard = (to: Route, from: Route, next: NavigationNext) => void;

type NavigationNext = (to?: string | false) => void;
```

**Example:**

```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});
```

### router.afterEach()

Register post-navigation hook.

```typescript
router.afterEach(hook: NavigationHook): Unsubscribe
```

**Parameters:**

```typescript
type NavigationHook = (to: Route, from: Route) => void;
```

**Example:**

```typescript
router.afterEach((to, from) => {
  document.title = to.meta.title || 'My App';
  analytics.trackPageView(to.path);
});
```

### router.currentRoute

Get current route as a signal.

```typescript
router.currentRoute: Signal<Route>
```

**Example:**

```typescript
effect(() => {
  console.log('Current route:', router.currentRoute().path);
});
```

## Composables

### useRouter()

Access router instance in component.

```typescript
function useRouter(): Router;
```

**Example:**

```typescript
import { useRouter } from '@nadi/router'

function Navigation() {
  const router = useRouter()

  return (
    <button onclick={() => router.push('/about')}>
      Go to About
    </button>
  )
}
```

### useRoute()

Access current route in component.

```typescript
function useRoute(): Signal<Route>;
```

**Returns:** Signal containing current route

**Example:**

```typescript
import { useRoute } from '@nadi/router'

function UserProfile() {
  const route = useRoute()

  return <h1>User ID: {route().params.id}</h1>
}
```

### useParams()

Access route parameters.

```typescript
function useParams<T = Record<string, string>>(): Signal<T>;
```

**Example:**

```typescript
import { useParams } from '@nadi/router'

function PostDetail() {
  const params = useParams<{ id: string }>()

  return <h1>Post {params().id}</h1>
}
```

### useQuery()

Access query parameters.

```typescript
function useQuery<T = Record<string, string>>(): Signal<T>;
```

**Example:**

```typescript
import { useQuery } from '@nadi/router'

function SearchPage() {
  const query = useQuery<{ q: string; page: string }>()

  return <h1>Search: {query().q}</h1>
}
```

## Components

### RouterView

Render the matched route component.

```typescript
function RouterView(props?: { name?: string }): JSX.Element;
```

**Props:**

- `name`: Named view identifier (optional)

**Example:**

```typescript
import { RouterView } from '@nadi/router'

function App() {
  return (
    <div>
      <nav>{/* Navigation */}</nav>
      <RouterView />
    </div>
  )
}
```

### RouterLink

Navigation link component.

```typescript
function RouterLink(props: RouterLinkProps): JSX.Element;
```

**Props:**

```typescript
interface RouterLinkProps {
  to: string | RouteLocation;
  activeClass?: string;
  exactActiveClass?: string;
  replace?: boolean;
  custom?: boolean;
  children?: ComponentChildren;
}
```

**Example:**

```typescript
import { RouterLink } from '@nadi/router'

function Navigation() {
  return (
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink
        to={{ name: 'user', params: { id: '123' } }}
        activeClass="active"
      >
        Profile
      </RouterLink>
    </nav>
  )
}
```

## Route Object

### Route

Current route information.

```typescript
interface Route {
  path: string;
  fullPath: string;
  name?: string;
  params: Record<string, string>;
  query: Record<string, string>;
  hash: string;
  meta: RouteMeta;
  matched: RouteDefinition[];
}
```

**Properties:**

- `path`: Current path without query/hash
- `fullPath`: Complete URL path
- `name`: Route name if defined
- `params`: Route parameters object
- `query`: Query parameters object
- `hash`: URL hash
- `meta`: Route metadata
- `matched`: Array of matched route records

**Example:**

```typescript
// For URL: /users/123?tab=posts#comments
{
  path: '/users/123',
  fullPath: '/users/123?tab=posts#comments',
  name: 'user',
  params: { id: '123' },
  query: { tab: 'posts' },
  hash: '#comments',
  meta: { requiresAuth: true },
  matched: [/* route definitions */]
}
```

## Navigation Guards

### Global Guards

```typescript
// Before navigation
router.beforeEach((to, from, next) => {
  // Validate navigation
  next();
});

// After navigation
router.afterEach((to, from) => {
  // Analytics, title updates, etc.
});
```

### Route-Level Guards

```typescript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (isAdmin()) {
        next();
      } else {
        next('/unauthorized');
      }
    },
  },
];
```

### Navigation Next Options

```typescript
// Continue navigation
next();

// Cancel navigation
next(false);

// Redirect to different location
next('/login');
next({ name: 'login' });

// Error
next(new Error('Navigation failed'));
```

## Scroll Behavior

### ScrollBehavior

Configure scroll behavior on navigation.

```typescript
interface ScrollBehavior {
  (to: Route, from: Route, savedPosition: ScrollPosition | null): ScrollPosition | void;
}

interface ScrollPosition {
  left: number;
  top: number;
  behavior?: 'auto' | 'smooth';
}
```

**Example:**

```typescript
const router = createRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return { left: 0, top: 0, behavior: 'smooth' };
    } else {
      return { left: 0, top: 0 };
    }
  },
});
```

## Route Matching

### Path Patterns

```typescript
// Static path
{
  path: '/about';
}

// Dynamic parameter
{
  path: '/users/:id';
}

// Multiple parameters
{
  path: '/posts/:year/:month/:slug';
}

// Optional parameter
{
  path: '/users/:id?';
}

// Catch-all / wildcard
{
  path: '/docs/*';
}
{
  path: '*';
} // 404 route
```

## Advanced Features

### Lazy Loading

```typescript
const routes = [
  {
    path: '/admin',
    component: () => import('./views/Admin'),
  },
];
```

### Named Views

```typescript
const routes = [
  {
    path: '/',
    components: {
      default: Home,
      sidebar: Sidebar,
      header: Header
    }
  }
]

// In component
<RouterView />
<RouterView name="sidebar" />
<RouterView name="header" />
```

### Nested Routes

```typescript
const routes = [
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome },
      { path: 'analytics', component: Analytics },
      { path: 'settings', component: Settings },
    ],
  },
];
```

## TypeScript

### Type Definitions

```typescript
import type {
  Router,
  Route,
  RouteDefinition,
  RouteLocation,
  NavigationGuard,
  NavigationNext,
  RouterLinkProps,
} from '@nadi/router';
```

### Custom Route Meta

```typescript
declare module '@nadi/router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    title?: string;
    roles?: string[];
  }
}
```

## Best Practices

✅ **Do:**

- Use named routes for type safety
- Implement navigation guards
- Handle 404 routes with catch-all
- Use lazy loading for code splitting
- Clean up guard subscriptions
- Type route params and query

❌ **Don't:**

- Create circular redirects
- Forget to call `next()` in guards
- Use synchronous navigation in effects
- Ignore navigation errors
- Skip route validation
- Hardcode paths in links

## Next Steps

- Learn about [Routing](/guide/routing)
- Explore [Navigation Guards](/guide/routing#navigation-guards)
- Understand [Nested Routes](/guide/routing#nested-routes)
- Read [Laravel Integration](/guide/laravel)
