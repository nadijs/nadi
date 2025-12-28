# Bundle Size Guide

Optimize your Nadi application's bundle size for faster load times.

## Framework Comparison

Nadi is designed to be lightweight with minimal overhead:

```
Nadi Core:        ~3.5 KB (minified + gzipped)
React:           ~42 KB
Vue 3:           ~34 KB
Svelte:          ~2 KB (compile time)
Solid:           ~7 KB
```

With common features:

```
Nadi (Core + Router + Forms):  ~12 KB
React + React Router + Formik: ~65 KB
Vue 3 + Vue Router + VeeValidate: ~55 KB
```

## Package Sizes

Individual Nadi packages:

```
@nadi/core:        3.5 KB
@nadi/router:      2.8 KB
@nadi/forms:       3.2 KB
@nadi/meta:        1.5 KB
@nadi/echo:        2.1 KB
@nadi/testing:     4.8 KB (dev only)
```

## Analyzing Bundle Size

### Using Vite

Add the visualizer plugin:

```bash
npm install -D rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

Build and view:

```bash
npm run build
# Opens bundle visualization in browser
```

### Using Webpack

```bash
npm install -D webpack-bundle-analyzer
```

```javascript
// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};
```

## Tree Shaking

Import only what you need:

```typescript
// ❌ Bad: Imports everything
import * as Nadi from '@nadi/core';

// ✅ Good: Import specific functions
import { signal, computed, effect } from '@nadi/core';

// ❌ Bad: Imports entire utility library
import _ from 'lodash';

// ✅ Good: Import specific utilities
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

### Configure Tree Shaking

```json
// package.json
{
  "sideEffects": false
}
```

```javascript
// vite.config.ts
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
};
```

## Code Splitting

### Route-Based Splitting

```typescript
import { createRouter } from '@nadi/router';

const router = createRouter({
  routes: [
    {
      path: '/',
      component: Home, // Bundled immediately
    },
    {
      path: '/admin',
      // Lazy loaded when route accessed
      component: () => import('./pages/Admin'),
    },
    {
      path: '/dashboard',
      component: () => import('./pages/Dashboard'),
    },
  ],
});
```

### Component-Based Splitting

```typescript
import { signal, effect } from '@nadi/core'

function App() {
  const HeavyComponent = signal<Component | null>(null)
  const showHeavy = signal(false)

  effect(() => {
    if (showHeavy()) {
      import('./HeavyComponent').then(module => {
        HeavyComponent.set(module.default)
      })
    }
  })

  return (
    <div>
      <button onclick={() => showHeavy.set(true)}>
        Load Heavy Component
      </button>

      {HeavyComponent() && <HeavyComponent() />}
    </div>
  )
}
```

### Feature-Based Splitting

```typescript
// Load features on demand
async function loadFeature(name: string) {
  switch (name) {
    case 'charts':
      return import('./features/charts')
    case 'editor':
      return import('./features/editor')
    case 'video':
      return import('./features/video')
  }
}

function Dashboard() {
  const activeFeature = signal<string | null>(null)
  const Feature = signal<Component | null>(null)

  effect(() => {
    const feature = activeFeature()
    if (feature) {
      loadFeature(feature).then(module => {
        Feature.set(module.default)
      })
    }
  })

  return (
    <div>
      <nav>
        <button onclick={() => activeFeature.set('charts')}>Charts</button>
        <button onclick={() => activeFeature.set('editor')}>Editor</button>
      </nav>

      {Feature() && <Feature() />}
    </div>
  )
}
```

## Minimize Dependencies

### Replace Large Libraries

```typescript
// ❌ Bad: 70 KB (moment.js)
import moment from 'moment';
const date = moment().format('YYYY-MM-DD');

// ✅ Good: 2 KB (date-fns)
import { format } from 'date-fns';
const date = format(new Date(), 'yyyy-MM-dd');

// ✅ Better: 0 KB (native)
const date = new Date().toISOString().split('T')[0];
```

### Avoid Polyfills

Use native features when possible:

```typescript
// ❌ Bad: Includes polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// ✅ Good: Target modern browsers
// vite.config.ts
export default {
  build: {
    target: 'es2020', // Modern browsers only
  },
};
```

## Production Optimizations

### Enable Compression

```typescript
// vite.config.ts
import viteCompression from 'vite-plugin-compression';

export default {
  plugins: [
    viteCompression({
      algorithm: 'brotli',
      ext: '.br',
      threshold: 10240, // Only compress files > 10KB
    }),
  ],
};
```

### Remove Development Code

```typescript
// Automatically removed in production
if (import.meta.env.DEV) {
  enableDevTools();
  console.log('Development mode');
}
```

### Minification

```typescript
// vite.config.ts
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
      mangle: {
        safari10: true,
      },
    },
  },
};
```

## Asset Optimization

### Images

```typescript
// Use WebP format
<img src="/images/photo.webp" alt="Photo" />

// Lazy load images
<img
  src="/placeholder.jpg"
  data-src="/images/large-photo.jpg"
  loading="lazy"
  alt="Photo"
/>
```

### Fonts

```css
/* Subset fonts to only needed characters */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-subset.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0020-007F; /* Basic Latin only */
}
```

### Icons

```typescript
// ❌ Bad: Load entire icon library
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)  // ~1 MB

// ✅ Good: Import specific icons
import { faUser, faHome } from '@fortawesome/free-solid-svg-icons'

// ✅ Better: Use SVG sprites
function Icon({ name }) {
  return (
    <svg>
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}
```

## Monitoring Bundle Size

### CI/CD Integration

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### Size Limits

```json
// package.json
{
  "size-limit": [
    {
      "path": "dist/index.js",
      "limit": "15 KB"
    },
    {
      "path": "dist/index.css",
      "limit": "5 KB"
    }
  ]
}
```

### Budget Monitoring

```javascript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@nadi/core', '@nadi/router'],
          utils: ['./src/utils'],
        },
      },
    },
  },
};
```

## Best Practices

### Component Organization

```typescript
// ❌ Bad: Everything in one file
export default function App() {
  // 1000+ lines of code
}

// ✅ Good: Split into modules
// App.tsx
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Content } from './components/Content'

export default function App() {
  return (
    <div>
      <Header />
      <Sidebar />
      <Content />
    </div>
  )
}
```

### Conditional Imports

```typescript
// Load features based on user role
async function loadAdminPanel() {
  if (user.role === 'admin') {
    const { AdminPanel } = await import('./AdminPanel');
    return AdminPanel;
  }
  return null;
}
```

### External Dependencies

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'], // Don't bundle these
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
};
```

## Measuring Impact

### Before Optimization

```
Total bundle size: 245 KB
- Vendor: 180 KB
- App code: 65 KB
First Load JS: 245 KB
```

### After Optimization

```
Total bundle size: 45 KB (-82%)
- Vendor: 15 KB (-92%)
- App code: 30 KB (-54%)
First Load JS: 45 KB (-82%)

Performance improvements:
- Load time: 3.2s → 0.8s (-75%)
- Time to Interactive: 4.5s → 1.2s (-73%)
```

## Real-World Examples

### Todo App

```
Before optimization: 180 KB
After:
- Code splitting: 95 KB (-47%)
- Tree shaking: 65 KB (-32%)
- Compression: 18 KB (-72%)
Total: -90% reduction
```

### Dashboard App

```
Before: 520 KB
After:
- Route splitting: 280 KB (-46%)
- Lazy features: 145 KB (-48%)
- Image optimization: 95 KB (-35%)
- Tree shaking: 58 KB (-39%)
Total: -89% reduction
```

## Tools

### Analysis

- [Bundlephobia](https://bundlephobia.com/) - Check package sizes
- [Bundle Buddy](https://bundle-buddy.com/) - Visualize dependencies
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Rollup Plugin Visualizer](https://github.com/btd/rollup-plugin-visualizer)

### Optimization

- [Terser](https://terser.org/) - JavaScript minification
- [cssnano](https://cssnano.co/) - CSS minification
- [Imagemin](https://github.com/imagemin/imagemin) - Image optimization
- [Brotli](https://github.com/google/brotli) - Compression

## Next Steps

- Read [Performance Guide](/guide/performance)
- Learn about [Code Splitting](/guide/code-splitting)
- Explore [SSR](/guide/ssr)
- Check [Production Deployment](/guide/deployment)
