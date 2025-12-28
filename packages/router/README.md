# @nadi/router

Lightweight client-side router for Nadi framework (~1.3KB gzipped).

## Features

- 🎯 **Path pattern matching** with parameters (`:id`)
- 🌳 **Nested routes** support
- 🔒 **Navigation guards** for route protection
- 🎨 **Active link styling**
- ⚡ **History API** integration
- 📦 **Type-safe** route definitions
- 🪶 **Tiny bundle size** (~1.3KB gzipped)

## Installation

```bash
pnpm add @nadi/router
```

## Quick Start

### 1. Define Your Routes

```typescript
import { createRouter } from '@nadi/router';

const router = createRouter({
  routes: [
    {
      path: '/',
      component: Home,
      name: 'home',
    },
    {
      path: '/about',
      component: About,
      name: 'about',
    },
    {
      path: '/users/:id',
      component: UserProfile,
      name: 'user-profile',
    },
    {
      path: '/admin',
      component: AdminLayout,
      beforeEnter: (to, from) => {
        // Check authentication
        if (!isAuthenticated()) {
          return '/login'; // Redirect
        }
        return true; // Allow navigation
      },
      children: [
        {
          path: '/dashboard',
          component: Dashboard,
        },
      ],
    },
  ],
  scrollBehavior: (to, from) => {
    return { top: 0, behavior: 'smooth' };
  },
});
```

### 2. Use Router in Your App

```tsx
import { useRoute } from '@nadi/router';

function App() {
  const route = useRoute();

  return (
    <div>
      <nav>
        <Link to="/" activeClass="active">
          Home
        </Link>
        <Link to="/about" activeClass="active">
          About
        </Link>
      </nav>

      <main>
        {route.path === '/' && <Home />}
        {route.path === '/about' && <About />}
      </main>
    </div>
  );
}
```

### 3. Navigate Programmatically

```typescript
import { useNavigate, useParams } from '@nadi/router';

function UserProfile() {
  const navigate = useNavigate();
  const params = useParams();

  const goToSettings = () => {
    navigate.push(`/users/${params.id}/settings`);
  };

  return (
    <div>
      <h1>User {params.id}</h1>
      <button onClick={goToSettings}>Settings</button>
    </div>
  );
}
```

## API Reference

### `createRouter(config)`

Creates a router instance.

**Config options:**

- `routes`: Array of route definitions
- `base`: Base URL for the app (default: `''`)
- `scrollBehavior`: Function to control scroll position on navigation
- `beforeEach`: Global navigation guard
- `afterEach`: Global hook called after navigation

### `useRouter()`

Returns the router instance.

```typescript
const router = useRouter();
router.push('/about'); // Navigate to /about
router.replace('/home'); // Replace current route
router.back(); // Go back
router.forward(); // Go forward
router.go(-2); // Go back 2 steps
```

### `useRoute()`

Returns the current route match.

```typescript
const route = useRoute();
console.log(route.path); // '/users/123'
console.log(route.params); // { id: '123' }
console.log(route.query); // { tab: 'profile' }
console.log(route.hash); // '#section'
```

### `useParams()`

Returns route parameters.

```typescript
const params = useParams();
console.log(params.id); // '123'
```

### `useNavigate()`

Returns navigation functions.

```typescript
const navigate = useNavigate();
navigate.push('/about');
navigate.replace('/home');
navigate.back();
navigate.forward();
navigate.go(-2);
```

### `<Link>` Component

Link component for client-side navigation.

```tsx
<Link
  to="/about"
  class="nav-link"
  activeClass="active"
  replace={false}
  onClick={(e) => console.log('clicked')}
>
  About
</Link>
```

**Props:**

- `to`: Target path
- `class`: CSS class
- `activeClass`: CSS class when route is active
- `replace`: Use replace instead of push (default: `false`)
- `onClick`: Click handler

### `<Route>` Component

Conditional rendering based on current route.

```tsx
<Route path="/about" component={About} />
```

## Navigation Guards

### Global Guards

```typescript
const router = createRouter({
  routes: [...],
  beforeEach: (to, from) => {
    // Return false to cancel navigation
    if (to.path === '/admin' && !isAdmin()) {
      return false;
    }

    // Return string to redirect
    if (!isAuthenticated()) {
      return '/login';
    }

    // Return true to allow navigation
    return true;
  },
  afterEach: (to, from) => {
    // Track page views
    analytics.track(to.path);
  }
});
```

### Route-Specific Guards

```typescript
{
  path: '/admin',
  component: Admin,
  beforeEnter: (to, from) => {
    if (!isAdmin()) {
      return '/'; // Redirect to home
    }
    return true;
  }
}
```

## Nested Routes

```typescript
{
  path: '/dashboard',
  component: DashboardLayout,
  children: [
    {
      path: '/overview',
      component: Overview
    },
    {
      path: '/settings',
      component: Settings
    }
  ]
}
```

## Route Parameters

```typescript
// Route definition
{
  path: '/users/:userId/posts/:postId',
  component: Post
}

// Access parameters
const params = useParams();
console.log(params.userId); // '123'
console.log(params.postId); // '456'
```

## Query Parameters

```typescript
// URL: /search?q=nadi&page=2
const route = useRoute();
console.log(route.query.q); // 'nadi'
console.log(route.query.page); // '2'
```

## Scroll Behavior

```typescript
const router = createRouter({
  routes: [...],
  scrollBehavior: (to, from) => {
    // Scroll to top
    return { top: 0, behavior: 'smooth' };

    // Scroll to anchor
    if (to.hash) {
      return { top: 0, behavior: 'smooth' };
    }
  }
});
```

## TypeScript Support

Full TypeScript support with type-safe route definitions and parameters.

```typescript
import type { RouteDefinition, RouterConfig } from '@nadi/router';

const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
];

const config: RouterConfig = {
  routes,
};
```

## License

MIT
