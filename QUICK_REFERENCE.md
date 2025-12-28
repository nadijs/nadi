# Nadi Quick Reference

## Core API

### Signals

```typescript
import { signal, computed, effect, batch, untrack } from '@nadi/core';

// Create signal
const [count, setCount] = signal(0);
// or
const count = signal(0);
count();      // Read
count(5);     // Write

// Computed values
const doubled = computed(() => count() * 2);

// Side effects
effect(() => {
  console.log('Count:', count());
});

// Batch updates
batch(() => {
  count(1);
  count(2);
  count(3);
}); // Only one update triggered

// Untracked reads
untrack(() => count()); // Won't create dependency
```

### Lifecycle

```typescript
import { onMount, onCleanup, createRoot } from '@nadi/core';

function MyComponent() {
  onMount(() => {
    console.log('Mounted');
  });

  onCleanup(() => {
    console.log('Cleaning up');
  });
}

// Create reactive root
createRoot((dispose) => {
  // Reactive code here
  dispose(); // Clean up
});
```

### Context

```typescript
import { createContext, useContext } from '@nadi/core';

const ThemeContext = createContext('light');

function Parent() {
  provideContext(ThemeContext, 'dark');
}

function Child() {
  const theme = useContext(ThemeContext); // 'dark'
}
```

### Control Flow

```typescript
import { Show, For, Portal, ErrorBoundary } from '@nadi/core';

// Conditional rendering
<Show when={condition()} fallback={<div>Loading...</div>}>
  <div>Content</div>
</Show>

// List rendering
<For each={items()}>
  {(item, index) => <div>{item.name}</div>}
</For>

// Portal
<Portal mount={document.getElementById('modal-root')}>
  <div>Modal content</div>
</Portal>

// Error boundary
<ErrorBoundary fallback={(error, reset) => <div>Error: {error.message}</div>}>
  <App />
</ErrorBoundary>
```

## Single-File Components

### Basic Structure

```html
<template>
  <div class="my-component">
    <h1>{title()}</h1>
    <button onClick={handleClick}>Click me</button>
  </div>
</template>

<script lang="ts">
import { signal } from '@nadi/core';

interface Props {
  initialTitle: string;
}

export default function MyComponent(props: Props) {
  const [title, setTitle] = signal(props.initialTitle);

  const handleClick = () => {
    setTitle('Clicked!');
  };

  return { title, handleClick };
}
</script>

<style scoped>
.my-component {
  padding: 1rem;
}

h1 {
  color: #42b883;
}
</style>
```

### Props & Events

```typescript
// Props with TypeScript
interface Props {
  message: string;
  count?: number;
  onUpdate?: (value: number) => void;
}

export default function Component(props: Props) {
  // Access props
  const msg = props.message;

  // Call event handlers
  props.onUpdate?.(42);
}
```

### Reactive State

```typescript
import { signal, computed } from '@nadi/core';

export default function Component() {
  // Basic signal
  const [count, setCount] = signal(0);

  // Computed value
  const doubled = computed(() => count() * 2);

  // Multiple signals
  const [name, setName] = signal('');
  const [age, setAge] = signal(0);

  return { count, setCount, doubled, name, setName, age, setAge };
}
```

## JSX Syntax

### Elements

```jsx
// Basic element
<div>Hello</div>

// With props
<div className="container" id="app">Content</div>

// Self-closing
<img src="/logo.png" alt="Logo" />

// Dynamic attributes
<div className={isActive() ? 'active' : ''}>
  {message()}
</div>
```

### Event Handlers

```jsx
// Click events
<button onClick={() => count(count() + 1)}>Increment</button>

// With event object
<input onInput={(e) => setValue(e.target.value)} />

// Multiple events
<div
  onClick={handleClick}
  onMouseEnter={handleEnter}
  onMouseLeave={handleLeave}
>
  Hover me
</div>
```

### Conditional Rendering

```jsx
// Ternary
<div>
  {isLoggedIn() ? <UserPanel /> : <LoginForm />}
</div>

// Show component
<Show when={user()} fallback={<Loading />}>
  <Profile user={user()} />
</Show>

// Logical AND
<div>
  {hasError() && <ErrorMessage />}
</div>
```

### Lists

```jsx
// For component (recommended)
<For each={todos()}>
  {(todo, index) => (
    <div key={todo.id}>
      {index()}: {todo.title}
    </div>
  )}
</For>

// Map (simple cases)
<ul>
  {items().map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>
```

## Styling

### Scoped Styles

```css
<style scoped>
/* Applies only to this component */
.container {
  padding: 1rem;
}

h1 {
  color: blue;
}
</style>
```

### Global Styles

```css
<style>
/* Applies globally */
body {
  font-family: sans-serif;
}
</style>
```

### Dynamic Styles

```jsx
<div style={{
  color: isActive() ? 'red' : 'blue',
  fontSize: size() + 'px'
}}>
  Styled content
</div>

// Or with className
<div className={isActive() ? 'active' : 'inactive'}>
  Content
</div>
```

## TypeScript

### Component Types

```typescript
// Props interface
interface Props {
  title: string;
  count?: number;
  onSubmit: (data: FormData) => void;
}

// Component return type
type ComponentReturn = {
  state: Signal<number>;
  handler: () => void;
};

export default function Component(props: Props): ComponentReturn {
  // ...
}
```

### Signal Types

```typescript
// Typed signal
const [count, setCount] = signal<number>(0);

// Complex types
interface User {
  id: number;
  name: string;
}

const [user, setUser] = signal<User | null>(null);

// Array signal
const [todos, setTodos] = signal<Todo[]>([]);
```

## Compiler API

### Compile .nadi Files

```typescript
import { compile } from '@nadi/compiler';

const result = compile(source, {
  filename: 'Component.nadi',
  sourceMap: true,
  isProduction: true,
});

console.log(result.code);
console.log(result.errors);
console.log(result.warnings);
```

### Parse Only

```typescript
import { parse } from '@nadi/compiler';

const descriptor = parse(source, 'Component.nadi');

console.log(descriptor.template?.content);
console.log(descriptor.script?.content);
console.log(descriptor.styles);
```

## Build Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development mode
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format
```

## Package Sizes

| Package | Size (min+gzip) |
|---------|-----------------|
| @nadi/core | ~2KB |
| @nadi/compiler | Build-time only |
| @nadi/router | ~1.3KB (planned) |
| **Total Runtime** | **~3.5KB** |

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+
- No IE11

## Resources

- [GitHub Repository](https://github.com/your-org/nadi)
- [Documentation](https://nadi.dev) (coming soon)
- [Examples](./examples/)
- [Contributing Guide](./CONTRIBUTING.md)

---

**Need help?** Open an issue on GitHub or check the examples folder!
