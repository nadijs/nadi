# @nadi/prerender

Static pre-rendering system for Nadi with hybrid SSR/SSG support.

## Installation

```bash
npm install @nadi/prerender
```

## Basic Usage

### Vite Plugin

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import nadi from '@nadi/vite-plugin';
import { prerender } from '@nadi/prerender';

export default defineConfig({
  plugins: [
    nadi(),
    prerender({
      routes: ['/', '/about', '/blog'],
      staticDir: 'dist',
      hydration: 'islands',
    }),
  ],
});
```

### Dynamic Routes

```typescript
prerender({
  routes: async () => {
    // Fetch routes from API or filesystem
    const posts = await fetchBlogPosts();
    return ['/', '/about', ...posts.map((p) => `/blog/${p.slug}`)];
  },
  exclude: ['/admin/*'],
});
```

## Configuration

```typescript
interface PrerenderConfig {
  routes: string[] | (() => Promise<string[]>);
  exclude?: string[];
  staticDir?: string;
  hydration?: 'all' | 'islands' | 'none';
  hydrateSelectors?: string[];
  fallback?: 'client' | '404' | { redirect: string };
}
```

## Hydration Strategies

### Islands Architecture

```typescript
prerender({
  hydration: 'islands',
  hydrateSelectors: ['[data-interactive]', 'button', 'form'],
});
```

Mark interactive components:

```nadi
<div data-interactive>
  <button onClick={handleClick}>Interactive</button>
</div>
```

### Full Hydration

```typescript
prerender({
  hydration: 'all',
});
```

### No Hydration (Fully Static)

```typescript
prerender({
  hydration: 'none',
});
```

## CLI

```bash
# Prerender all routes
npx nadi prerender

# Preview prerendered site
npx nadi prerender --preview

# Specific routes
npx nadi prerender --routes /,/about,/blog
```

## API

### prerenderRoute()

```typescript
import { prerenderRoute } from '@nadi/prerender';

const result = await prerenderRoute('/about', {
  hydration: 'islands',
  hydrateSelectors: ['[data-interactive]'],
});

console.log(result.html);
console.log(result.interactive); // List of interactive components
```

### analyzeComponents()

```typescript
import { analyzeComponents } from '@nadi/prerender';

const analysis = await analyzeComponents('src/**/*.nadi', {
  detectInteractive: true,
  extractDependencies: true,
});

console.log(analysis.static); // ['Header', 'Footer']
console.log(analysis.interactive); // ['SearchBar', 'CommentForm']
```

## Examples

See:

- [sample_apps/nextjs-ecommerce](../../sample_apps/nextjs-ecommerce)
- [sample_apps/nuxt-portfolio](../../sample_apps/nuxt-portfolio)

## License

MIT
