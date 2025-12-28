# Nuxt Integration

Nadi integrates seamlessly with Nuxt 3, combining Nadi's reactive primitives with Nuxt's powerful auto-imports, server routes, and SSR capabilities.

## Installation

```bash
npm install @nadi/core @nadi/adapter-nuxt @nadi/router
```

## Quick Start

### 1. Configure Nuxt

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nadi/adapter-nuxt'],

  nadi: {
    autoImport: true,
    ssr: true,
  },
});
```

### 2. App Component

```vue
<!-- app.vue -->
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

### 3. Page Component

```typescript
// pages/index.tsx
import { signal } from '@nadi/core'

export default function HomePage() {
  const count = signal(0)

  return (
    <div>
      <h1>Count: {count()}</h1>
      <button onclick={() => count.set(count() + 1)}>
        Increment
      </button>
    </div>
  )
}
```

## Pages & Routing

### File-Based Routing

```
pages/
├── index.tsx           # /
├── about.tsx           # /about
├── posts/
│   ├── index.tsx       # /posts
│   └── [id].tsx        # /posts/:id
└── [...slug].tsx       # Catch-all route
```

### Dynamic Routes

```typescript
// pages/posts/[id].tsx
import { signal, effect } from '@nadi/core'

export default function PostPage() {
  const route = useRoute()
  const post = signal<Post | null>(null)

  effect(() => {
    fetch(`/api/posts/${route.params.id}`)
      .then(res => res.json())
      .then(data => post.set(data))
  })

  if (!post()) return <div>Loading...</div>

  return (
    <article>
      <h1>{post()!.title}</h1>
      <div>{post()!.content}</div>
    </article>
  )
}
```

### Nested Routes

```typescript
// pages/dashboard.tsx
export default function DashboardLayout({ children }: { children: JSX.Element }) {
  return (
    <div>
      <nav>
        <NuxtLink to="/dashboard">Overview</NuxtLink>
        <NuxtLink to="/dashboard/settings">Settings</NuxtLink>
      </nav>
      <main>{children}</main>
    </div>
  )
}

// pages/dashboard/index.tsx
export default function DashboardIndex() {
  return <div>Dashboard Overview</div>
}

// pages/dashboard/settings.tsx
export default function DashboardSettings() {
  return <div>Settings</div>
}
```

### Navigation

```typescript
function Navigation() {
  const router = useRouter()

  return (
    <nav>
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About</NuxtLink>
      <button onclick={() => router.push('/posts')}>
        View Posts
      </button>
    </nav>
  )
}
```

## Server Routes

### API Routes

```typescript
// server/api/posts/index.get.ts
export default defineEventHandler(async (event) => {
  const posts = await db.posts.findAll();
  return posts;
});

// server/api/posts/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const post = await db.posts.create(body);
  return post;
});

// server/api/posts/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const post = await db.posts.findById(id);

  if (!post) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    });
  }

  return post;
});

// server/api/posts/[id].put.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const post = await db.posts.update(id, body);
  return post;
});

// server/api/posts/[id].delete.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  await db.posts.delete(id);
  return { success: true };
});
```

### Frontend API Calls

```typescript
function PostList() {
  const posts = signal<Post[]>([])

  effect(() => {
    $fetch('/api/posts')
      .then(data => posts.set(data))
  })

  return (
    <ul>
      {posts().map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## Data Fetching

### useFetch Composable

```typescript
function PostList() {
  const { data, pending, error, refresh } = useFetch('/api/posts')

  if (pending.value) return <div>Loading...</div>
  if (error.value) return <div>Error: {error.value.message}</div>

  return (
    <div>
      <button onclick={refresh}>Refresh</button>
      <ul>
        {data.value?.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

### useAsyncData Composable

```typescript
function PostDetail({ id }: { id: string }) {
  const { data: post } = useAsyncData(
    `post-${id}`,
    () => $fetch(`/api/posts/${id}`)
  )

  if (!post.value) return <div>Loading...</div>

  return (
    <article>
      <h1>{post.value.title}</h1>
      <div>{post.value.content}</div>
    </article>
  )
}
```

### Server-Side Data Fetching

```typescript
// pages/posts/[id].tsx
export default function PostPage() {
  const route = useRoute()

  const { data: post } = useAsyncData(
    `post-${route.params.id}`,
    () => $fetch(`/api/posts/${route.params.id}`),
    { server: true } // Fetch on server
  )

  if (!post.value) return <div>Loading...</div>

  return (
    <article>
      <h1>{post.value.title}</h1>
      <div>{post.value.content}</div>
    </article>
  )
}
```

## State Management

### useState Composable

```typescript
// composables/useCounter.ts
export const useCounter = () => {
  const count = useState('counter', () => signal(0))

  const increment = () => count.value.set(count.value() + 1)
  const decrement = () => count.value.set(count.value() - 1)

  return { count, increment, decrement }
}

// Usage in component
function Counter() {
  const { count, increment, decrement } = useCounter()

  return (
    <div>
      <h1>{count.value()}</h1>
      <button onclick={decrement}>-</button>
      <button onclick={increment}>+</button>
    </div>
  )
}
```

### Global State

```typescript
// composables/useAuth.ts
const user = signal<User | null>(null);

export const useAuth = () => {
  const login = async (credentials: Credentials) => {
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: credentials,
    });
    user.set(response.user);
  };

  const logout = async () => {
    await $fetch('/api/logout', { method: 'POST' });
    user.set(null);
  };

  return { user, login, logout };
};
```

## Middleware

### Route Middleware

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();

  if (!user.value() && to.path.startsWith('/dashboard')) {
    return navigateTo('/login');
  }
});

// Apply to specific pages
// pages/dashboard.tsx
definePageMeta({
  middleware: 'auth',
});
```

### Global Middleware

```typescript
// middleware/logging.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  console.log('Navigating to:', to.path);
});
```

## Layouts

### Default Layout

```typescript
// layouts/default.tsx
export default function DefaultLayout({ children }: { children: JSX.Element }) {
  return (
    <div>
      <header>
        <nav>
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer>© 2024</footer>
    </div>
  )
}
```

### Custom Layout

```typescript
// layouts/dashboard.tsx
export default function DashboardLayout({ children }: { children: JSX.Element }) {
  return (
    <div class="dashboard">
      <aside>
        <nav>
          <NuxtLink to="/dashboard">Overview</NuxtLink>
          <NuxtLink to="/dashboard/settings">Settings</NuxtLink>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  )
}

// Use in page
// pages/dashboard.tsx
definePageMeta({
  layout: 'dashboard'
})
```

## Plugins

### Create Plugin

```typescript
// plugins/nadi.ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      nadi: {
        version: '0.2.0'
      }
    }
  }
})

// Usage
function App() {
  const { $nadi } = useNuxtApp()

  return <div>Nadi v{$nadi.version}</div>
}
```

## Authentication

### Server-Side Auth

```typescript
// server/api/login.post.ts
export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const user = await verifyCredentials(email, password);

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    });
  }

  await setUserSession(event, { user });

  return { user };
});

// server/api/logout.post.ts
export default defineEventHandler(async (event) => {
  await clearUserSession(event);
  return { success: true };
});

// server/api/user.get.ts
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    });
  }

  return session.user;
});
```

### Client-Side Auth

```typescript
function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const email = signal('')
  const password = signal('')
  const error = signal('')

  const handleLogin = async (e: Event) => {
    e.preventDefault()

    try {
      await login({
        email: email(),
        password: password()
      })

      router.push('/dashboard')
    } catch (err: any) {
      error.set(err.message)
    }
  }

  return (
    <form onsubmit={handleLogin}>
      {error() && <div class="error">{error()}</div>}

      <input
        type="email"
        value={email()}
        oninput={(e) => email.set((e.target as HTMLInputElement).value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password()}
        oninput={(e) => password.set((e.target as HTMLInputElement).value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

## Server Middleware

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/protected')) {
    const session = await getUserSession(event);

    if (!session?.user) {
      throw createError({
        statusCode: 401,
        message: 'Not authenticated',
      });
    }
  }
});
```

## Environment Variables

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Private keys (server-only)
    apiSecret: process.env.API_SECRET,

    // Public keys (exposed to client)
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000',
    },
  },
});

// Usage
function App() {
  const config = useRuntimeConfig();

  effect(() => {
    fetch(`${config.public.apiBase}/api/data`).then((res) => res.json());
  });
}
```

## Static Site Generation

### Generate Static Pages

```bash
npm run generate
```

### Pre-render Specific Routes

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml'],
    },
  },
});
```

### Dynamic Route Generation

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      async routes() {
        const posts = await $fetch('/api/posts');
        return posts.map((post) => `/posts/${post.id}`);
      },
    },
  },
});
```

## Best Practices

✅ **Do:**

- Use auto-imports for better DX
- Leverage server routes for APIs
- Use composables for reusable logic
- Implement proper middleware
- Use layouts for consistent UI
- Enable SSR for better SEO
- Use environment variables correctly

❌ **Don't:**

- Import everything manually
- Skip error handling
- Ignore loading states
- Mix server and client logic
- Expose sensitive data to client
- Skip route middleware
- Hardcode API URLs

## Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

```bash
vercel
```

### Deploy to Netlify

```bash
netlify deploy
```

### Node.js Server

```bash
node .output/server/index.mjs
```

### Environment Variables

```bash
# .env
DATABASE_URL=postgresql://...
API_SECRET=your-secret
```

## Next Steps

- Learn about [SSR](/guide/ssr) concepts
- Explore [Routing](/guide/routing) in Nadi
- Understand [Forms](/guide/forms) handling
- Read the [Nuxt Adapter API](/api/adapter-nuxt)
