# Quick Start

Get started with Nadi in less than 5 minutes. This guide will walk you through creating your first Nadi application.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** installed
- **pnpm**, **npm**, or **yarn** package manager
- Basic knowledge of JavaScript/TypeScript
- A code editor (VS Code recommended)

## Installation

### Option 1: Create New Project (Recommended)

The fastest way to start is using the official starter template:

```bash
# Using npm
npm create nadi@latest my-app

# Using pnpm
pnpm create nadi my-app

# Using yarn
yarn create nadi my-app
```

Follow the prompts:

```bash
✔ Project name: my-app
✔ Select a template: › Vite + TypeScript
✔ Add router? … Yes
✔ Add forms? … Yes
✔ Add UI components? … Yes
✔ Add meta/SEO? … Yes
✔ Package manager: › pnpm
```

Then start the dev server:

```bash
cd my-app
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. You should see your Nadi app running!

### Option 2: Manual Setup

If you prefer to set up manually:

```bash
# Create project directory
mkdir my-nadi-app
cd my-nadi-app

# Initialize package.json
npm init -y

# Install dependencies
npm install @nadi/core @nadi/compiler @nadi/vite-plugin

# Optional packages (recommended)
npm install @nadi/router @nadi/forms @nadi/ui @nadi/meta

# Install dev dependencies
npm install -D vite typescript
```

Create `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import nadi from '@nadi/vite-plugin';

export default defineConfig({
  plugins: [nadi()],
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "@nadi/core",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Your First Component

Create `src/App.nadi`:

```nadi
<script lang="ts">
import { signal } from '@nadi/core';
import { Button } from '@nadi/ui';
import '@nadi/ui/styles.css';

export default function App() {
  const [count, setCount] = signal(0);

  function increment() {
    setCount(count() + 1);
  }

  function decrement() {
    setCount(count() - 1);
  }

  return { count, increment, decrement };
}
</script>

<template>
  <div class="app">
    <h1>Welcome to Nadi!</h1>

    <div class="counter">
      <Button onClick={decrement} variant="secondary">-</Button>
      <span class="count">{count()}</span>
      <Button onClick={increment} variant="primary">+</Button>
    </div>

    <p class="info">
      Edit <code>src/App.nadi</code> and save to test HMR
    </p>
  </div>
</template>

<style scoped>
.app {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  font-family: system-ui, sans-serif;
}

h1 {
  color: #5d64c4;
  margin-bottom: 40px;
}

.counter {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
}

button {
  padding: 10px 20px;
  font-size: 18px;
  background: #5d64c4;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #535bf2;
}

.count {
  font-size: 48px;
  font-weight: bold;
  min-width: 80px;
}

.info {
  margin-top: 40px;
  color: #666;
}

code {
  background: #f3f3f3;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
```

Create `src/main.ts`:

```typescript
import { createRoot } from '@nadi/core';
import App from './App.nadi';

// Mount the app
createRoot(document.getElementById('app')!, () => <App />);
```

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nadi App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Run the dev server:

```bash
npm run dev
```

🎉 **Congratulations!** Your first Nadi app is running!

## Understanding the Code

Let's break down what we just created:

### 1. The `<script>` Block

```typescript
<script lang="ts">
import { signal } from '@nadi/core';

export default function App() {
  // Reactive state
  const [count, setCount] = signal(0);

  // Regular functions
  function increment() {
    setCount(count() + 1);
  }

  // Return what the template needs
  return { count, increment };
}
</script>
```

**Key Points:**

- ✅ Export a default function (your component)
- ✅ Use `signal()` for reactive state
- ✅ Return values/functions that template needs
- ✅ Full TypeScript support

### 2. The `<template>` Block

```typescript
<template>
  <div class="app">
    <h1>Welcome to Nadi!</h1>
    <button onClick={increment}>+</button>
    <span>{count()}</span>
  </div>
</template>
```

**Key Points:**

- ✅ JSX syntax (not template strings like Vue)
- ✅ Call signals as functions: `{count()}`
- ✅ Event handlers: `onClick`, `onInput`, etc.
- ✅ Type-safe (TypeScript checks your JSX)

### 3. The `<style>` Block

```css
<style scoped>
.app {
  padding: 20px;
}
</style>
```

**Key Points:**

- ✅ `scoped` means styles only apply to this component
- ✅ Regular CSS, SCSS, or PostCSS supported
- ✅ Auto-prefixed for browser compatibility

## Adding Reactivity

Let's add computed values and effects:

```nadi
<script lang="ts">
import { signal, computed, effect } from '@nadi/core';

export default function Counter() {
  const [count, setCount] = signal(0);

  // Computed value - automatically updates when count changes
  const doubled = computed(() => count() * 2);
  const isEven = computed(() => count() % 2 === 0);

  // Effect - runs whenever dependencies change
  effect(() => {
    document.title = `Count: ${count()}`;
    console.log('Count changed to:', count());
  });

  return {
    count,
    setCount,
    doubled,
    isEven
  };
}
</script>

<template>
  <div>
    <h2>Count: {count()}</h2>
    <p>Doubled: {doubled()}</p>
    <p>Is Even: {isEven() ? 'Yes' : 'No'}</p>

    <button onClick={() => setCount(count() + 1)}>
      Increment
    </button>
  </div>
</template>
```

**What's happening:**

1. `computed()` creates derived state (cached, only recalculates when dependencies change)
2. `effect()` runs side effects (like updating document title)
3. Both **automatically track dependencies** - no manual arrays!

## Building a Todo App

Let's create something more practical:

```nadi
<script lang="ts">
import { signal, computed } from '@nadi/core';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = signal<Todo[]>([]);
  const [newTodoText, setNewTodoText] = signal('');

  const remainingCount = computed(() =>
    todos().filter(t => !t.done).length
  );

  function addTodo() {
    const text = newTodoText().trim();
    if (text) {
      setTodos([
        ...todos(),
        { id: Date.now(), text, done: false }
      ]);
      setNewTodoText('');
    }
  }

  function toggleTodo(id: number) {
    setTodos(
      todos().map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  }

  function deleteTodo(id: number) {
    setTodos(todos().filter(t => t.id !== id));
  }

  return {
    todos,
    newTodoText,
    setNewTodoText,
    remainingCount,
    addTodo,
    toggleTodo,
    deleteTodo
  };
}
</script>

<template>
  <div class="todo-app">
    <h1>My Todos</h1>

    <div class="input-section">
      <input
        type="text"
        value={newTodoText()}
        onInput={(e) => setNewTodoText(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        placeholder="What needs to be done?"
      />
      <button onClick={addTodo}>Add</button>
    </div>

    <ul class="todo-list">
      {todos().map(todo => (
        <li key={todo.id} class={todo.done ? 'done' : ''}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span>{todo.text}</span>
          <button
            class="delete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>

    <div class="footer">
      {remainingCount()} item{remainingCount() !== 1 ? 's' : ''} remaining
    </div>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input[type="text"] {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  background: #5d64c4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-list li.done span {
  text-decoration: line-through;
  color: #999;
}

.delete {
  margin-left: auto;
  padding: 5px 10px;
  background: #dc3545;
}

.footer {
  margin-top: 20px;
  text-align: center;
  color: #666;
}
</style>
```

## Next Steps

Now that you have a working Nadi app, here's what to explore next:

### Essential Features

1. **[Routing](/guide/routing)** - Add multiple pages with client-side routing
2. **[Forms & Validation](/guide/forms)** - Build forms with reactive validation
3. **[Head & SEO](/guide/meta)** - Manage page titles and meta tags
4. **[Testing](/guide/testing)** - Write tests for your components

### Framework Integration

5. **[Laravel Integration](/guide/laravel)** - Use Nadi with Laravel
6. **[Django Integration](/guide/django)** - Use Nadi with Django
7. **[Express Integration](/guide/express)** - Use Nadi with Express

### Advanced Topics

8. **[SSR & SSG](/guide/ssr)** - Server-side rendering and static generation
9. **[Performance](/guide/performance)** - Optimize your app
10. **[DevTools](/guide/devtools)** - Debug with browser extension

## Common Patterns

### Conditional Rendering

```typescript
import { Show } from '@nadi/core';

<Show when={() => isLoggedIn()}>
  <Dashboard />
</Show>

<Show when={() => !isLoggedIn()}>
  <Login />
</Show>
```

### List Rendering

```typescript
import { For } from '@nadi/core';

<For each={todos()}>
  {(todo) => (
    <li key={todo.id}>{todo.text}</li>
  )}
</For>
```

### Component Props

```nadi
<script lang="ts">
interface Props {
  name: string;
  age?: number;
}

export default function Greeting(props: Props) {
  return { props };
}
</script>

<template>
  <div>
    <h1>Hello, {props.name}!</h1>
    {props.age && <p>Age: {props.age}</p>}
  </div>
</template>
```

### Event Handling

```typescript
// Simple click
<button onClick={handleClick}>Click</button>

// With parameters
<button onClick={() => handleClick('value')}>Click</button>

// Multiple events
<input
  onInput={(e) => handleInput(e)}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
/>
```

## Tips & Best Practices

### ✅ DO

```typescript
// Use signals for reactive state
const [count, setCount] = signal(0);

// Use computed for derived values
const doubled = computed(() => count() * 2);

// Call signals as functions
<span>{count()}</span>

// Return only what template needs
return { count, setCount, doubled };
```

### ❌ DON'T

```typescript
// Don't use let/const for reactive values
let count = 0; // ❌ Won't update UI

// Don't forget to call signals
<span>{count}</span> // ❌ Shows function, not value

// Don't return everything
return { ...everything }; // ❌ Exposes internals
```

## Getting Help

If you're stuck:

1. **[Check the docs](/guide/introduction)** - Comprehensive guides for everything
2. **[Join Discord](https://discord.gg/nadi)** - Ask the community
3. **[Search GitHub Issues](https://github.com/nadiframework/nadi/issues)** - Someone may have had the same problem
4. **[Open an issue](https://github.com/nadiframework/nadi/issues/new)** - Report bugs or request features

## What's Next?

Continue learning with these guides:

- **[Core Concepts](/guide/signals)** - Deep dive into signals, computed, and effects
- **[Component Guide](/guide/components)** - Learn component patterns
- **[Why Nadi?](/guide/why-nadi)** - Understand the philosophy and advantages

Happy coding! 🚀
