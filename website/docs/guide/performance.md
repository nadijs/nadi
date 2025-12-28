# Performance Optimization Guide

Learn how to optimize your Nadi applications for maximum performance.

## Signal Optimization

### Avoid Unnecessary Computations

```typescript
// ❌ Bad: Recomputes on every access
function BadComponent() {
  const items = signal([1, 2, 3, 4, 5])

  return (
    <div>
      {/* This runs filter on every render */}
      {items().filter(i => i > 2).map(i => <div>{i}</div>)}
    </div>
  )
}

// ✅ Good: Use computed for memoization
function GoodComponent() {
  const items = signal([1, 2, 3, 4, 5])
  const filteredItems = computed(() => items().filter(i => i > 2))

  return (
    <div>
      {filteredItems().map(i => <div>{i}</div>)}
    </div>
  )
}
```

### Batch Signal Updates

```typescript
// ❌ Bad: Multiple separate updates
function updateUser(user: User) {
  firstName.set(user.firstName); // Triggers update
  lastName.set(user.lastName); // Triggers update
  email.set(user.email); // Triggers update
}

// ✅ Good: Batch all updates
import { batch } from '@nadi/core';

function updateUser(user: User) {
  batch(() => {
    firstName.set(user.firstName);
    lastName.set(user.lastName);
    email.set(user.email);
  });
  // Only triggers one update
}
```

### Use Signal Equality

```typescript
import { signal } from '@nadi/core';

// Custom equality check for objects
const user = signal({ id: 1, name: 'John' }, (a, b) => a.id === b.id && a.name === b.name);

// This won't trigger updates if values are the same
user.set({ id: 1, name: 'John' });
```

## Component Optimization

### Memoize Expensive Computations

```typescript
function DataTable({ data }: { data: Item[] }) {
  // ❌ Bad: Recalculates on every render
  const sortedData = data.sort((a, b) => a.name.localeCompare(b.name))

  // ✅ Good: Memoize with computed
  const items = signal(data)
  const sortedData = computed(() =>
    [...items()].sort((a, b) => a.name.localeCompare(b.name))
  )

  return (
    <table>
      {sortedData().map(item => (
        <tr key={item.id}>
          <td>{item.name}</td>
        </tr>
      ))}
    </table>
  )
}
```

### Avoid Inline Functions

```typescript
// ❌ Bad: Creates new function on every render
function List({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        <li onclick={() => handleClick(item.id)}>{item.name}</li>
      ))}
    </ul>
  )
}

// ✅ Good: Use stable references
function List({ items }: { items: Item[] }) {
  const handleClick = (id: number) => {
    console.log('Clicked:', id)
  }

  return (
    <ul>
      {items.map(item => (
        <li onclick={() => handleClick(item.id)}>{item.name}</li>
      ))}
    </ul>
  )
}
```

### Virtualize Long Lists

```typescript
function VirtualList({ items }: { items: any[] }) {
  const containerRef = signal<HTMLElement | null>(null)
  const scrollTop = signal(0)
  const itemHeight = 50
  const visibleCount = 20

  const visibleItems = computed(() => {
    const start = Math.floor(scrollTop() / itemHeight)
    const end = start + visibleCount
    return items.slice(start, end)
  })

  const offsetY = computed(() => Math.floor(scrollTop() / itemHeight) * itemHeight)

  const handleScroll = (e: Event) => {
    scrollTop.set((e.target as HTMLElement).scrollTop)
  }

  return (
    <div
      ref={containerRef}
      class="virtual-list"
      style="height: 1000px; overflow-y: auto"
      onscroll={handleScroll}
    >
      <div style={`height: ${items.length * itemHeight}px; position: relative`}>
        <div style={`transform: translateY(${offsetY()}px)`}>
          {visibleItems().map(item => (
            <div key={item.id} style={`height: ${itemHeight}px`}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## Effect Optimization

### Limit Effect Dependencies

```typescript
// ❌ Bad: Too many dependencies
function Component() {
  const user = signal({ id: 1, name: 'John', email: 'john@example.com' });

  effect(() => {
    // Runs whenever ANY user property changes
    console.log('User changed:', user());
  });
}

// ✅ Good: Track specific values
function Component() {
  const user = signal({ id: 1, name: 'John', email: 'john@example.com' });
  const userName = computed(() => user().name);

  effect(() => {
    // Only runs when name changes
    console.log('Name changed:', userName());
  });
}
```

### Debounce Frequent Updates

```typescript
function SearchInput() {
  const query = signal('');
  const results = signal<Result[]>([]);

  // ❌ Bad: Searches on every keystroke
  effect(() => {
    search(query()).then((data) => results.set(data));
  });

  // ✅ Good: Debounce search
  effect(() => {
    const q = query();
    const timer = setTimeout(() => {
      search(q).then((data) => results.set(data));
    }, 300);

    return () => clearTimeout(timer);
  });
}
```

### Use untrack for Non-Reactive Reads

```typescript
import { untrack } from '@nadi/core';

function Component() {
  const count = signal(0);
  const multiplier = signal(2);

  const result = computed(() => {
    const c = count();
    // Don't track multiplier as dependency
    const m = untrack(() => multiplier());
    return c * m;
  });
}
```

## Rendering Optimization

### Use Keys for Lists

```typescript
// ❌ Bad: No keys
function List({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => <li>{item.name}</li>)}
    </ul>
  )
}

// ✅ Good: Stable keys
function List({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

### Conditional Rendering

```typescript
// ❌ Bad: Always renders both branches
function Component({ loading, data }: Props) {
  return (
    <div>
      {loading && <Spinner />}
      {!loading && <Data data={data} />}
    </div>
  )
}

// ✅ Good: Only renders one branch
function Component({ loading, data }: Props) {
  if (loading) return <Spinner />
  return <Data data={data} />
}
```

## Code Splitting

### Lazy Load Routes

```typescript
import { createRouter } from '@nadi/router';

const router = createRouter({
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/admin',
      // Lazy load admin page
      component: () => import('./pages/Admin'),
    },
    {
      path: '/dashboard',
      component: () => import('./pages/Dashboard'),
    },
  ],
});
```

### Dynamic Imports

```typescript
function FeatureToggle({ enabled }: { enabled: boolean }) {
  const Feature = signal<Component | null>(null)

  effect(() => {
    if (enabled) {
      import('./HeavyFeature').then(module => {
        Feature.set(module.default)
      })
    }
  })

  if (!Feature()) return null

  const FeatureComponent = Feature()!
  return <FeatureComponent />
}
```

## Memory Management

### Clean Up Effects

```typescript
function Component() {
  const count = signal(0);

  effect(() => {
    // Set up subscription
    const timer = setInterval(() => {
      count.set(count() + 1);
    }, 1000);

    // ✅ Clean up on unmount
    return () => clearInterval(timer);
  });
}
```

### Remove Event Listeners

```typescript
function Component() {
  const handleResize = () => {
    // Handle resize
  };

  effect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
}
```

### Avoid Memory Leaks

```typescript
// ❌ Bad: Holds references
const cache = new Map();

function Component({ id }: { id: number }) {
  effect(() => {
    const data = fetchData(id);
    cache.set(id, data); // Memory leak!
  });
}

// ✅ Good: Use WeakMap or limit cache size
const cache = new Map();
const MAX_CACHE_SIZE = 100;

function Component({ id }: { id: number }) {
  effect(() => {
    const data = fetchData(id);

    if (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(id, data);
  });
}
```

## Network Optimization

### Request Deduplication

```typescript
const pendingRequests = new Map<string, Promise<any>>();

async function fetchWithCache(url: string) {
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url);
  }

  const promise = fetch(url).then((r) => r.json());
  pendingRequests.set(url, promise);

  try {
    const data = await promise;
    return data;
  } finally {
    pendingRequests.delete(url);
  }
}
```

### Prefetch Data

```typescript
import { useRouter } from '@nadi/router'

function Navigation() {
  const router = useRouter()

  const prefetchPage = (path: string) => {
    // Prefetch data for route
    fetch(`/api${path}`).then(r => r.json())
  }

  return (
    <nav>
      <a
        href="/about"
        onmouseenter={() => prefetchPage('/about')}
      >
        About
      </a>
    </nav>
  )
}
```

### Cache Responses

```typescript
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache(url: string) {
  const cached = responseCache.get(url);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetch(url).then((r) => r.json());
  responseCache.set(url, { data, timestamp: Date.now() });

  return data;
}
```

## Bundle Size Optimization

### Tree Shaking

```typescript
// ❌ Bad: Imports entire library
import _ from 'lodash';

// ✅ Good: Import only what you need
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

### Dynamic Imports

```typescript
// ❌ Bad: Imports large library upfront
import Chart from 'chart.js'

function Dashboard() {
  return <Chart data={data} />
}

// ✅ Good: Load on demand
function Dashboard() {
  const ChartComponent = signal<Component | null>(null)

  effect(() => {
    import('chart.js').then(module => {
      ChartComponent.set(module.default)
    })
  })

  if (!ChartComponent()) return <Loading />
  return <ChartComponent() data={data} />
}
```

## Profiling

### Measure Performance

```typescript
function Component() {
  effect(() => {
    const start = performance.now();

    // Expensive operation
    heavyComputation();

    const end = performance.now();
    console.log(`Computation took ${end - start}ms`);
  });
}
```

### Use DevTools

```typescript
import { enableDevTools } from '@nadi/devtools';

if (import.meta.env.DEV) {
  enableDevTools();
}

// Open DevTools to:
// - Track signal updates
// - Profile component renders
// - Analyze performance bottlenecks
```

## Best Practices Summary

✅ **Do:**

- Use computed for derived values
- Batch related signal updates
- Memoize expensive computations
- Use keys in lists
- Clean up effects
- Lazy load heavy features
- Cache API responses
- Profile performance regularly

❌ **Don't:**

- Create signals in loops
- Forget to clean up subscriptions
- Render huge lists without virtualization
- Use inline functions unnecessarily
- Skip key attributes
- Import entire libraries
- Make unnecessary API calls
- Ignore memory leaks

## Next Steps

- Learn about [Signals](/guide/signals)
- Understand [Computed Values](/guide/computed)
- Explore [Effects](/guide/effects)
- Read [Bundle Size Guide](/guide/bundle-size)
