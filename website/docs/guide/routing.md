# Routing

The Nadi Router provides client-side routing with path parameters, nested routes, navigation guards, and seamless integration with backend frameworks like Laravel.

## Installation

```bash
npm install @nadi/router
```

## Quick Start

```typescript
import { createRouter, Route, Link } from '@nadi/router'

// Define routes
const router = createRouter({
  routes: [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
    { path: '/users/:id', component: UserPage },
  ]
})

// App component
function App() {
  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/users/123">User 123</Link>
      </nav>

      <main>
        <Route router={router} />
      </main>
    </div>
  )
}

// Start router
router.start()
```

## Creating a Router

### Basic Configuration

```typescript
import { createRouter } from '@nadi/router';

const router = createRouter({
  routes: [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
    { path: '/contact', component: ContactPage },
  ],
});

// Start listening to URL changes
router.start();
```

### With Base Path

```typescript
const router = createRouter({
  basePath: '/app',
  routes: [
    { path: '/', component: HomePage }, // Matches /app/
    { path: '/about', component: AboutPage }, // Matches /app/about
  ],
});
```

### With 404 Handler

```typescript
const router = createRouter({
  routes: [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage },
    { path: '*', component: NotFoundPage }, // Catch-all route
  ],
});
```

## Route Definitions

### Basic Routes

```typescript
const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/contact', component: ContactPage },
];
```

### Routes with Parameters

```typescript
const routes = [
  { path: '/users/:id', component: UserPage },
  { path: '/posts/:slug', component: PostPage },
  { path: '/categories/:category/posts/:id', component: PostDetailPage },
];
```

### Optional Parameters

```typescript
const routes = [
  { path: '/posts/:id/:slug?', component: PostPage },
  { path: '/search/:query?', component: SearchPage },
];
```

### Wildcard Routes

```typescript
const routes = [
  { path: '/docs/*', component: DocsPage },
  { path: '*', component: NotFoundPage }, // Must be last
];
```

### Named Routes

```typescript
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/users/:id',
    name: 'user.show',
    component: UserPage,
  },
];

// Navigate by name
router.push({ name: 'user.show', params: { id: '123' } });
```

## Navigation

### Programmatic Navigation

```typescript
import { useNavigate } from '@nadi/router'

function Component() {
  const navigate = useNavigate()

  const goToAbout = () => {
    navigate('/about')
  }

  const goToUser = (id: number) => {
    navigate(`/users/${id}`)
  }

  const goBack = () => {
    navigate(-1) // Go back one page
  }

  return (
    <div>
      <button onclick={goToAbout}>About</button>
      <button onclick={() => goToUser(123)}>User 123</button>
      <button onclick={goBack}>Back</button>
    </div>
  )
}
```

### Link Component

```typescript
import { Link } from '@nadi/router'

function Navigation() {
  return (
    <nav>
      {/* Basic link */}
      <Link href="/">Home</Link>

      {/* Link with active class */}
      <Link href="/about" activeClass="active">
        About
      </Link>

      {/* Link with exact matching */}
      <Link href="/" exact activeClass="active">
        Home
      </Link>

      {/* Link with custom styling */}
      <Link
        href="/contact"
        class="nav-link"
        activeClass="nav-link-active"
      >
        Contact
      </Link>

      {/* Prefetch on hover */}
      <Link href="/dashboard" prefetch>
        Dashboard
      </Link>
    </nav>
  )
}
```

### Router Methods

```typescript
const router = createRouter({ ... })

// Navigate to a path
router.push('/about')

// Replace current history entry
router.replace('/login')

// Go back/forward
router.back()
router.forward()
router.go(-2) // Go back 2 pages

// Get current location
const location = router.location()

// Check if a route is active
const isActive = router.isActive('/about')
```

## Route Parameters

### Accessing Parameters

```typescript
import { useParams } from '@nadi/router'

function UserPage() {
  const params = useParams<{ id: string }>()

  const [user, setUser] = signal(null)

  effect(() => {
    const userId = params().id
    fetchUser(userId).then(setUser)
  })

  return (
    <div>
      <h1>User {params().id}</h1>
      {user() && <UserProfile user={user()} />}
    </div>
  )
}
```

### Multiple Parameters

```typescript
// Route: /categories/:category/posts/:id
function PostPage() {
  const params = useParams<{ category: string; id: string }>()

  return (
    <div>
      <h1>Post {params().id}</h1>
      <p>Category: {params().category}</p>
    </div>
  )
}
```

### Query Parameters

```typescript
import { useRoute } from '@nadi/router'

function SearchPage() {
  const route = useRoute()

  // Get query params from URL
  const searchParams = computed(() =>
    new URLSearchParams(route().search)
  )

  const query = computed(() =>
    searchParams().get('q') || ''
  )

  const page = computed(() =>
    parseInt(searchParams().get('page') || '1')
  )

  return (
    <div>
      <h1>Search Results for "{query()}"</h1>
      <p>Page: {page()}</p>
    </div>
  )
}
```

## Navigation Guards

### Global Guards

```typescript
const router = createRouter({
  routes: [...],

  // Before navigation
  beforeEach: (to, from) => {
    console.log('Navigating from', from, 'to', to)

    // Check authentication
    if (to.path.startsWith('/admin') && !isAuthenticated()) {
      return '/login' // Redirect
    }

    // Allow navigation
    return true
  },

  // After navigation
  afterEach: (to, from) => {
    // Track page views
    analytics.pageView(to.path)

    // Update document title
    document.title = to.name || 'My App'
  }
})
```

### Route-Level Guards

```typescript
const routes = [
  {
    path: '/admin',
    component: AdminPage,
    beforeEnter: (to, from) => {
      if (!isAdmin()) {
        return '/403'; // Forbidden
      }
      return true;
    },
  },
  {
    path: '/checkout',
    component: CheckoutPage,
    beforeEnter: (to, from) => {
      if (!hasItemsInCart()) {
        return '/cart';
      }
      return true;
    },
  },
];
```

### Async Guards

```typescript
const router = createRouter({
  routes: [...],
  beforeEach: async (to, from) => {
    // Check authentication asynchronously
    const isAuthed = await checkAuth()

    if (to.meta?.requiresAuth && !isAuthed) {
      return '/login'
    }

    return true
  }
})
```

## Nested Routes

### Configuration

```typescript
const routes = [
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      { path: '', component: DashboardHome },
      { path: 'profile', component: ProfilePage },
      { path: 'settings', component: SettingsPage },
      {
        path: 'posts',
        component: PostsLayout,
        children: [
          { path: '', component: PostsList },
          { path: ':id', component: PostDetail },
          { path: 'new', component: PostCreate },
        ],
      },
    ],
  },
];
```

### Layout Component

```typescript
function DashboardLayout() {
  return (
    <div class="dashboard">
      <aside>
        <Link href="/dashboard">Home</Link>
        <Link href="/dashboard/profile">Profile</Link>
        <Link href="/dashboard/settings">Settings</Link>
        <Link href="/dashboard/posts">Posts</Link>
      </aside>

      <main>
        {/* Renders child routes */}
        <Route />
      </main>
    </div>
  )
}
```

## Route Metadata

### Adding Metadata

```typescript
const routes = [
  {
    path: '/',
    component: HomePage,
    meta: {
      title: 'Home',
      requiresAuth: false,
    },
  },
  {
    path: '/admin',
    component: AdminPage,
    meta: {
      title: 'Admin Dashboard',
      requiresAuth: true,
      roles: ['admin'],
    },
  },
];
```

### Using Metadata

```typescript
import { useRoute } from '@nadi/router'

function Component() {
  const route = useRoute()

  effect(() => {
    const meta = route().meta
    if (meta?.title) {
      document.title = meta.title
    }
  })

  return <div>...</div>
}
```

## Laravel Integration

Nadi Router integrates seamlessly with Laravel's `route()` helper:

### Backend (Laravel)

```php
// routes/web.php
Route::get('/users/{id}', function ($id) {
    return view('app');
})->name('users.show');

Route::get('/posts/{slug}', function ($slug) {
    return view('app');
})->name('posts.show');
```

### Frontend (Nadi)

```typescript
// Pass Laravel routes to router
const router = createRouter({
  routes: [
    {
      path: '/users/:id',
      name: 'users.show',
      component: UserPage
    },
    {
      path: '/posts/:slug',
      name: 'posts.show',
      component: PostPage
    },
  ],
  laravelRoutes: window.laravelRoutes // Provided by Laravel
})

// Use Laravel route() helper in components
function Navigation() {
  return (
    <div>
      <Link href={route('users.show', { id: 123 })}>
        User 123
      </Link>
      <Link href={route('posts.show', { slug: 'hello-world' })}>
        Hello World Post
      </Link>
    </div>
  )
}
```

## Advanced Features

### Lazy Loading Routes

```typescript
const routes = [
  {
    path: '/admin',
    component: () => import('./pages/Admin'),
  },
  {
    path: '/dashboard',
    component: () => import('./pages/Dashboard'),
  },
];
```

### Scroll Behavior

```typescript
const router = createRouter({
  routes: [...],
  scrollBehavior: (to, from) => {
    // Scroll to top on navigation
    return { top: 0, left: 0 }
  }
})

// Scroll to element
const router = createRouter({
  routes: [...],
  scrollBehavior: (to, from) => {
    if (to.hash) {
      return { selector: to.hash }
    }
    return { top: 0 }
  }
})
```

### Route Transitions

```typescript
function App() {
  const route = useRoute()
  const [transitioning, setTransitioning] = signal(false)

  effect(() => {
    setTransitioning(true)
    setTimeout(() => setTransitioning(false), 300)
  })

  return (
    <div class={transitioning() ? 'page-transition' : ''}>
      <Route router={router} />
    </div>
  )
}
```

## TypeScript Support

### Typed Routes

```typescript
interface AppRoutes {
  'home': {}
  'user.show': { id: string }
  'post.show': { slug: string }
  'search': { q: string; page?: string }
}

const router = createRouter<AppRoutes>({
  routes: [...]
})

// Type-safe navigation
router.push({
  name: 'user.show',
  params: { id: '123' } // ✅ Type-checked
})

router.push({
  name: 'user.show',
  params: { slug: 'test' } // ❌ Type error
})
```

### Typed Parameters

```typescript
function UserPage() {
  const params = useParams<{ id: string }>();

  // params() is typed as { id: string }
  const userId: string = params().id;
}
```

## Testing

### Testing Router

```typescript
import { createRouter } from '@nadi/router'
import { render } from '@nadi/testing'

test('navigates to about page', async () => {
  const router = createRouter({
    routes: [
      { path: '/', component: HomePage },
      { path: '/about', component: AboutPage },
    ]
  })

  const { getByText } = render(<App router={router} />)

  await router.push('/about')

  expect(getByText('About Page')).toBeInTheDocument()
})
```

### Testing Navigation

```typescript
test('navigates on button click', async () => {
  const router = createRouter({ routes: [...] })
  const { getByText } = render(<App router={router} />)

  const button = getByText('Go to About')
  button.click()

  await waitFor(() => {
    expect(router.location().path).toBe('/about')
  })
})
```

## Best Practices

✅ **Do:**

- Use named routes for important pages
- Add navigation guards for authentication
- Implement proper 404 handling
- Use TypeScript for type safety
- Prefetch important routes

❌ **Don't:**

- Create circular navigation
- Forget to handle errors
- Ignore accessibility (use proper links)
- Hardcode URLs everywhere
- Skip route validation

## Performance Tips

1. **Lazy load routes** for code splitting
2. **Prefetch links** on hover
3. **Use named routes** for better optimization
4. **Cache route data** with signals
5. **Implement route guards** efficiently

## Next Steps

- Learn about [Forms](/guide/forms) for form handling
- Understand [Meta](/guide/meta) for SEO
- Explore [SSR](/guide/ssr) for server rendering
- Read the [Router API Reference](/api/router)
