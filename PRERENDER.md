# Static Pre-rendering System

Nadi's hybrid SSR/SSG approach for zero Node.js runtime deployment.

## Overview

The static pre-rendering system generates HTML at build time for known routes, with selective hydration for interactive components.

## Architecture

```
Build Time                    Runtime
┌─────────────┐              ┌──────────────┐
│   .nadi     │              │   Browser    │
│   files     │──compile──>  │              │
└─────────────┘              │ 1. Load HTML │
       │                     │ 2. Hydrate   │
       ↓                     │    (minimal) │
┌─────────────┐              └──────────────┘
│  Vite SSR   │
│  Renderer   │
└─────────────┘
       │
       ↓
┌─────────────┐
│Static HTML  │
│+ Hydration  │
│  Manifest   │
└─────────────┘
```

## Configuration

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import nadi from '@nadi/vite-plugin';
import { prerender } from '@nadi/prerender';

export default defineConfig({
  plugins: [
    nadi(),
    prerender({
      routes: [
        '/',
        '/about',
        '/blog',
        '/blog/*', // Dynamic routes
      ],
      exclude: ['/admin/*'],
      staticDir: 'dist',
      // Only hydrate components with these markers
      hydrateSelectors: ['[data-interactive]'],
    }),
  ],
});
```

### nadi.config.ts

```typescript
export default {
  prerender: {
    // Generate static pages at build time
    enabled: true,

    // Routes to prerender
    routes: async () => {
      // Can fetch from API or filesystem
      const posts = await fetchBlogPosts();
      return ['/', '/about', ...posts.map((p) => `/blog/${p.slug}`)];
    },

    // Selective hydration
    hydration: {
      strategy: 'islands', // 'all' | 'islands' | 'none'
      include: ['form', 'button[data-interactive]'],
      exclude: ['.static'],
    },

    // Fallback for dynamic routes
    fallback: 'client', // 'client' | '404' | 'redirect'
  },
};
```

## Usage

### Mark Interactive Components

```nadi
<script lang="ts">
import { signal } from '@nadi/core';

export default function Counter(props) {
  const [count, setCount] = signal(props.initialCount || 0);

  return { count, setCount };
}
</script>

<template>
  <div data-interactive>
    <p>Count: {count()}</p>
    <button onClick={() => setCount(count() + 1)}>
      Increment
    </button>
  </div>
</template>
```

### Static vs Interactive

```typescript
// Static component (no hydration needed)
export function StaticHeader() {
  return (
    <header>
      <h1>My Site</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
  );
}

// Interactive component (will be hydrated)
export function SearchBar() {
  const [query, setQuery] = signal('');

  return (
    <div data-interactive>
      <input
        value={query()}
        onInput={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
}
```

## Build Process

### 1. Analyze Components

```typescript
// build/prerender.ts
import { analyzeComponents } from '@nadi/prerender';

const analysis = await analyzeComponents('src/**/*.nadi', {
  detectInteractive: true,
  extractDependencies: true,
});

console.log(analysis);
// {
//   static: ['Header', 'Footer', 'Article'],
//   interactive: ['SearchBar', 'CommentForm', 'LikeButton'],
//   dependencies: { ... }
// }
```

### 2. Generate Static HTML

```typescript
import { renderToStaticMarkup } from '@nadi/core';
import { collectMeta } from '@nadi/meta';

for (const route of routes) {
  const Component = await loadComponent(route);
  const html = renderToStaticMarkup(() => <Component />);
  const meta = collectMeta();

  await writeFile(`dist${route}/index.html`, `
    <!DOCTYPE html>
    <html>
      <head>
        ${meta.title}
        ${meta.links.join('\n')}
        ${meta.styles.join('\n')}
      </head>
      <body>
        <div id="app">${html}</div>
        ${generateHydrationScript(route)}
      </body>
    </html>
  `);
}
```

### 3. Generate Hydration Manifest

```json
{
  "/": {
    "interactive": ["search-bar", "newsletter-form"],
    "chunks": ["chunk-abc123.js"]
  },
  "/blog/post-1": {
    "interactive": ["comment-form", "share-buttons"],
    "chunks": ["chunk-def456.js"]
  }
}
```

### 4. Selective Hydration Script

```typescript
// dist/_hydration.js
(async function () {
  const manifest = await fetch('/_hydration-manifest.json').then((r) => r.json());
  const route = window.location.pathname;
  const config = manifest[route];

  if (!config) return; // Fully static page

  // Load only necessary chunks
  for (const chunk of config.chunks) {
    await import(`/${chunk}`);
  }

  // Hydrate only interactive components
  for (const selector of config.interactive) {
    const elements = document.querySelectorAll(`[data-component="${selector}"]`);
    elements.forEach((el) => hydrateComponent(el));
  }
})();
```

## CLI Commands

```bash
# Preview prerendered site
npx nadi prerender --preview

# Build with prerendering
npx nadi build --prerender

# Generate specific routes
npx nadi prerender --routes /,/about,/blog

# Skip prerendering (client-only)
npx nadi build --no-prerender
```

## Deployment

### Static Hosting (Netlify, Vercel)

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### CDN with Dynamic Fallback

```nginx
# nginx.conf
location / {
  try_files $uri $uri/index.html /index.html;
}
```

### Hybrid (Static + SSR)

```typescript
// server.ts
import express from 'express';
import { renderToString } from '@nadi/core';

const app = express();

// Serve prerendered pages
app.use(express.static('dist'));

// SSR fallback for dynamic routes
app.get('*', async (req, res) => {
  const Component = await loadComponent(req.path);
  const html = renderToString(() => <Component />);
  res.send(html);
});
```

## Performance Benefits

### Bundle Size Comparison

| Approach                | JavaScript | HTML  | Total     |
| ----------------------- | ---------- | ----- | --------- |
| **Full CSR**            | 50 KB      | 2 KB  | 52 KB     |
| **Full SSR**            | 50 KB      | 15 KB | 65 KB     |
| **Prerender + Islands** | **8 KB**   | 15 KB | **23 KB** |

### Loading Timeline

```
Traditional SSR:
├─ HTML (15KB) ─────────────┐
├─ JS Bundle (50KB) ────────────────┐
└─ Hydration ─────────────────────────┐
                                       └─ Interactive (2000ms)

Nadi Prerendered:
├─ HTML (15KB) ──────┐
├─ Minimal JS (8KB) ─────┐
└─ Islands Hydrate ──────────┐
                              └─ Interactive (400ms)
```

## Islands Architecture

```nadi
<template>
  <!-- Static header (no hydration) -->
  <header>
    <h1>My Blog</h1>
  </header>

  <!-- Static content -->
  <article class="static">
    <h2>{post.title}</h2>
    <div innerHTML={post.content}></div>
  </article>

  <!-- Interactive island -->
  <div data-interactive data-component="comment-form">
    <CommentForm postId={post.id} />
  </div>

  <!-- Static footer -->
  <footer>
    <p>© 2025</p>
  </footer>
</template>
```

## Advanced Patterns

### Incremental Static Regeneration

```typescript
export default {
  prerender: {
    // Regenerate every 60 seconds
    revalidate: 60,

    // Fallback to stale content while regenerating
    fallback: 'blocking', // or 'stale-while-revalidate'
  },
};
```

### Dynamic Route Parameters

```typescript
export default {
  prerender: {
    routes: async () => {
      const products = await db.products.findMany();
      return products.map((p) => `/product/${p.id}`);
    },

    // Generate routes on-demand
    onDemand: true,
  },
};
```

### Partial Prerendering

```typescript
export default {
  prerender: {
    // Prerender above-the-fold only
    partial: true,
    viewport: { width: 1920, height: 1080 },

    // Lazy-load below-the-fold
    lazyLoad: true,
  },
};
```

## Best Practices

1. **Mark interactive components explicitly**

   ```html
   <div data-interactive>...</div>
   ```

2. **Use static components when possible**
   - Headers, footers, navigation
   - Article content, documentation
   - Landing pages

3. **Minimize JavaScript**
   - Only ship code for interactive features
   - Tree-shake unused components

4. **Optimize images**

   ```html
   <img loading="lazy" decoding="async" ... />
   ```

5. **Cache aggressively**
   - Prerendered HTML: 1 year
   - JS chunks: immutable with content hash
   - API responses: short TTL

## Troubleshooting

### Issue: "Component not hydrating"

Check:

- Component has `data-interactive` attribute
- Component is in hydration manifest
- JavaScript chunk is loaded

### Issue: "Hydration mismatch"

Ensure:

- Server and client render same content
- No client-only code in SSR
- Date/time formatting is consistent

## Examples

See:

- [sample_apps/nextjs-ecommerce](../sample_apps/nextjs-ecommerce) - Full e-commerce with SSG
- [sample_apps/nuxt-portfolio](../sample_apps/nuxt-portfolio) - Portfolio with islands
- [examples/blog](../examples/blog) - Static blog

## Learn More

- [SSR Guide](./SSR.md)
- [Performance Guide](./PERFORMANCE.md)
- [Deployment Guide](./DEPLOYMENT.md)
