# @nadi/core

> Core signals runtime for the Nadi framework

## 🚀 Features

- **~2KB minified + gzipped** - Minimal runtime footprint
- **Fine-grained reactivity** - Only updates what changed
- **Automatic dependency tracking** - No manual subscriptions
- **TypeScript-first** - Full type safety with generics
- **Memory efficient** - Automatic cleanup and disposal

## 📦 Installation

```bash
npm install @nadi/core
```

## 🎯 Quick Start

### Creating Signals

```typescript
import { signal } from '@nadi/core';

const count = signal(0);

// Read
console.log(count()); // 0

// Write
count(5);
console.log(count()); // 5
```

### Computed Values

```typescript
import { signal, computed } from '@nadi/core';

const count = signal(2);
const doubled = computed(() => count() * 2);

console.log(doubled()); // 4

count(3);
console.log(doubled()); // 6
```

### Effects (Side Effects)

```typescript
import { signal, effect } from '@nadi/core';

const count = signal(0);

effect(() => {
  console.log('Count is:', count());
});
// Logs: "Count is: 0"

count(5);
// Logs: "Count is: 5"
```

### Batching Updates

```typescript
import { signal, batch } from '@nadi/core';

const a = signal(1);
const b = signal(2);

effect(() => {
  console.log('Sum:', a() + b());
});

// Update both signals in one batch
batch(() => {
  a(5);
  b(10);
});
// Only logs once: "Sum: 15"
```

### Lifecycle Hooks

```typescript
import { onMount, onCleanup } from '@nadi/core';

function MyComponent() {
  onMount(() => {
    console.log('Component mounted');
  });

  onCleanup(() => {
    console.log('Component will unmount');
  });
}
```

### Context API

```typescript
import { createContext, useContext } from '@nadi/core';

const ThemeContext = createContext('light');

function App() {
  provideContext(ThemeContext, 'dark');
  return <Child />;
}

function Child() {
  const theme = useContext(ThemeContext);
  console.log(theme); // 'dark'
}
```

## 🛠️ API Reference

### `signal<T>(initialValue: T, options?): Signal<T>`

Creates a reactive signal.

**Options:**
- `equals`: Custom equality function or `false` to disable equality check

**Returns:** Signal getter/setter function

### `computed<T>(fn: () => T): Computed<T>`

Creates a computed signal (derived state).

### `effect(fn: EffectFunction): () => void`

Creates an effect that automatically tracks dependencies.

**Returns:** Dispose function

### `batch<T>(fn: () => T): T`

Batches multiple updates into a single update cycle.

### `untrack<T>(fn: () => T): T`

Reads signals without tracking dependencies.

### Control Flow Components

- `Show` - Conditional rendering
- `For` - List rendering
- `Portal` - Render outside component tree
- `ErrorBoundary` - Error handling

## 📖 Documentation

Visit [nadi.dev](https://nadi.dev) for full documentation.

## 📄 License

MIT
