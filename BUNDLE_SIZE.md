# Bundle Size Optimization Guide

Nadi framework is designed to be ultra-lightweight. This guide explains how we achieve and maintain small bundle sizes.

## Current Bundle Sizes

| Package                | Size (gzipped) | Limit  |
| ---------------------- | -------------- | ------ |
| @nadi/core             | ~2.8 KB        | 3 KB   |
| @nadi/core/jsx-runtime | ~2.2 KB        | 2.5 KB |
| @nadi/router           | ~1.3 KB        | 1.5 KB |
| @nadi/forms            | ~1.8 KB        | 2 KB   |
| @nadi/meta             | ~800 bytes     | 1 KB   |
| @nadi/echo             | ~1.2 KB        | 1.5 KB |

**Total for typical app**: ~4-5 KB (core + jsx-runtime + router)

## Optimization Techniques

### 1. Tree-Shaking

All packages are built with aggressive tree-shaking:

```typescript
// tsup.config.ts
export default defineConfig({
  treeshake: {
    preset: 'smallest',
    propertyReadSideEffects: false,
  },
  esbuildOptions(options) {
    options.mangleProps = /^_/; // Mangle private properties
    options.pure = ['console.log']; // Mark as pure for removal
  },
});
```

### 2. Separate Entry Points

Only import what you need:

```typescript
// ❌ Imports everything
import { signal, computed, Show, For, Portal } from '@nadi/core';

// ✅ Imports only what's used (tree-shaken)
import { signal, computed } from '@nadi/core';
```

### 3. Client vs Server Builds

SSR runtime is only included in server builds:

```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    conditions: ['import', 'module', 'browser', 'default'],
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Exclude SSR runtime from client builds
        return id.includes('jsx-ssr-runtime');
      },
    },
  },
});
```

### 4. Minification

All production builds use:

- Terser for aggressive minification
- Mangle properties starting with `_`
- Remove console.log statements
- Compress whitespace and comments

### 5. No Dependencies

Core packages have ZERO runtime dependencies:

- `@nadi/core`: 0 deps
- `@nadi/router`: 0 deps
- `@nadi/forms`: 0 deps (only peer dep on core)
- `@nadi/meta`: 0 deps (only peer dep on core)

### 6. Shared Code Elimination

Common utilities are inlined rather than imported:

```typescript
// ❌ Creates separate chunk
import { isFunction } from './utils';

// ✅ Inlined, no extra bytes
const isFunction = (x: any): x is Function => typeof x === 'function';
```

## Monitoring Bundle Size

### CI/CD Integration

```yaml
# .github/workflows/size-check.yml
- name: Check bundle size
  run: pnpm size

- name: Fail if size limit exceeded
  run: pnpm size --json > size-report.json
```

### Local Checking

```bash
# Check all packages
pnpm size

# Analyze why bundle is large
pnpm size:why

# Check specific package
npx size-limit packages/core/dist/index.js
```

### Size Limits

Configured in root `package.json`:

```json
{
  "size-limit": [
    {
      "name": "@nadi/core",
      "path": "packages/core/dist/index.js",
      "limit": "3 KB"
    }
  ]
}
```

## Best Practices for Contributors

### 1. Lazy Load Large Features

```typescript
// ❌ Always loaded
import { DevTools } from './devtools';

// ✅ Loaded only when needed
const loadDevTools = () => import('./devtools');
if (isDev) {
  loadDevTools().then(({ DevTools }) => {
    // Use DevTools
  });
}
```

### 2. Avoid Large Dependencies

Before adding a dependency, check its size:

```bash
npx bundle-phobia <package-name>
```

Consider alternatives:

- `date-fns` → Native `Intl.DateTimeFormat`
- `lodash` → Native array methods
- `axios` → Native `fetch`

### 3. Use Dynamic Imports for Routes

```typescript
// ❌ All routes loaded upfront
import Home from './Home.nadi';
import About from './About.nadi';
import Contact from './Contact.nadi';

// ✅ Routes loaded on demand
const routes = [
  { path: '/', component: () => import('./Home.nadi') },
  { path: '/about', component: () => import('./About.nadi') },
  { path: '/contact', component: () => import('./Contact.nadi') },
];
```

### 4. Optimize Compilation

```typescript
// nadi.config.ts
export default {
  compiler: {
    removeComments: true,
    minifyCSS: true,
    inlineSmallAssets: true, // < 4KB inlined as data URLs
  },
};
```

### 5. Analyze Your App

```bash
# Build with analysis
npm run build -- --analyze

# Check what's in your bundle
npx vite-bundle-visualizer
```

## Performance Budget

Set performance budgets in your app:

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'nadi-core': ['@nadi/core'],
          'nadi-forms': ['@nadi/forms'],
        },
      },
    },
    chunkSizeWarningLimit: 50, // Warn if chunk > 50KB
  },
});
```

## Comparison with Other Frameworks

| Framework  | Min Size (gzipped) |
| ---------- | ------------------ |
| **Nadi**   | **~3.5 KB**        |
| Svelte     | ~2 KB              |
| Solid.js   | ~7 KB              |
| Preact     | ~4 KB              |
| Vue 3      | ~34 KB             |
| React 18   | ~44 KB             |
| Angular 16 | ~72 KB             |

## Future Optimizations

Planned improvements:

1. **Automatic code splitting** by route
2. **Prepack integration** for ahead-of-time optimization
3. **Custom minifier** specifically for Nadi output
4. **Partial hydration** - only hydrate interactive components
5. **Islands architecture** support

## Resources

- [Bundle size tracking](https://bundlephobia.com/)
- [Webpack analyzer](https://webpack.github.io/analyse/)
- [Size Limit documentation](https://github.com/ai/size-limit)

## Questions?

- Open an issue on GitHub
- Join our Discord community
- Check the documentation

Remember: **Every byte counts!** 🚀
