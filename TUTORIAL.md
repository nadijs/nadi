# Interactive Tutorial: Building Your First Nadi App

Learn Nadi by building a real-world Todo application step by step.

## Prerequisites

- Node.js 18+ installed
- Basic JavaScript knowledge
- Familiarity with HTML/CSS

## Setup (5 minutes)

### Step 1: Create Project

```bash
npm create nadi@latest my-todo-app
cd my-todo-app
npm install
npm run dev
```

Your app is now running at `http://localhost:5173`!

## Part 1: Your First Component (10 minutes)

### Step 2: Create a Counter Component

Create `src/Counter.nadi`:

```nadi
<script lang="ts">
import { signal } from '@nadi/core';

export default function Counter() {
  const [count, setCount] = signal(0);

  function increment() {
    setCount(count() + 1);
  }

  return { count, increment };
}
</script>

<template>
  <div class="counter">
    <h2>Count: {count()}</h2>
    <button onClick={increment}>Increment</button>
  </div>
</template>

<style scoped>
.counter {
  padding: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
```

### Step 3: Use the Component

Update `src/main.ts`:

```typescript
import { createRoot } from '@nadi/core';
import Counter from './Counter.nadi';

createRoot(document.getElementById('app')!, () => <Counter />);
```

**Try it!** Click the button and watch the count increase.

### 💡 What You Learned

- `signal()` creates reactive state
- Call signals as functions: `count()`
- Update with setter: `setCount(newValue)`
- Scoped styles are automatically namespaced

## Part 2: Computed Values (10 minutes)

### Step 4: Add Computed Values

Update `Counter.nadi`:

```nadi
<script lang="ts">
import { signal, computed } from '@nadi/core';

export default function Counter() {
  const [count, setCount] = signal(0);

  // Computed value - automatically updates
  const doubled = computed(() => count() * 2);
  const isEven = computed(() => count() % 2 === 0);

  function increment() {
    setCount(count() + 1);
  }

  function decrement() {
    setCount(count() - 1);
  }

  return { count, doubled, isEven, increment, decrement };
}
</script>

<template>
  <div class="counter">
    <h2>Count: {count()}</h2>
    <p>Doubled: {doubled()}</p>
    <p>Is Even: {isEven() ? 'Yes' : 'No'}</p>

    <div class="buttons">
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </div>
  </div>
</template>
```

**Try it!** Notice how `doubled` and `isEven` update automatically.

### 💡 What You Learned

- `computed()` creates derived state
- Computeds automatically track dependencies
- No need to specify what to watch
- Computeds are cached and only recalculate when dependencies change

## Part 3: Side Effects (10 minutes)

### Step 5: Add Side Effects

```nadi
<script lang="ts">
import { signal, computed, effect } from '@nadi/core';

export default function Counter() {
  const [count, setCount] = signal(0);
  const doubled = computed(() => count() * 2);

  // Effect runs whenever count changes
  effect(() => {
    console.log('Count changed to:', count());

    // Update document title
    document.title = `Count: ${count()}`;
  });

  // ...rest of code
}
</script>
```

**Try it!** Open DevTools console and increment the counter.

### 💡 What You Learned

- `effect()` runs side effects when signals change
- Effects automatically track dependencies
- No dependency array needed (unlike React's useEffect)
- Effects clean up and re-run automatically

## Part 4: Building a Todo App (20 minutes)

### Step 6: Create Todo Component

Create `src/TodoApp.nadi`:

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
  const [input, setInput] = signal('');

  const remaining = computed(() =>
    todos().filter(t => !t.done).length
  );

  function addTodo() {
    if (input().trim()) {
      setTodos([
        ...todos(),
        { id: Date.now(), text: input(), done: false }
      ]);
      setInput('');
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

  return { todos, input, setInput, remaining, addTodo, toggleTodo, deleteTodo };
}
</script>

<template>
  <div class="todo-app">
    <h1>Todo App</h1>

    <div class="input-section">
      <input
        type="text"
        value={input()}
        onInput={(e) => setInput(e.target.value)}
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
          <button class="delete" onClick={() => deleteTodo(todo.id)}>
            ×
          </button>
        </li>
      ))}
    </ul>

    <div class="footer">
      {remaining()} item{remaining() !== 1 ? 's' : ''} remaining
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
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
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

.delete:hover {
  background: #c82333;
}

.footer {
  margin-top: 20px;
  text-align: center;
  color: #666;
}
</style>
```

### Step 7: Use TodoApp

Update `src/main.ts`:

```typescript
import { createRoot } from '@nadi/core';
import TodoApp from './TodoApp.nadi';

createRoot(document.getElementById('app')!, () => <TodoApp />);
```

**Try it!** Add, toggle, and delete todos.

### 💡 What You Learned

- Working with arrays in signals
- Mapping over signal values
- Event handlers with parameters
- Conditional CSS classes
- Keyboard event handling

## Part 5: Component Lifecycle (10 minutes)

### Step 8: Add Persistence

```nadi
<script lang="ts">
import { signal, computed, onMount, onCleanup } from '@nadi/core';

export default function TodoApp() {
  const [todos, setTodos] = signal<Todo[]>([]);

  // Load from localStorage on mount
  onMount(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  });

  // Save to localStorage whenever todos change
  effect(() => {
    localStorage.setItem('todos', JSON.stringify(todos()));
  });

  // Clean up
  onCleanup(() => {
    console.log('Component unmounted');
  });

  // ...rest of code
}
</script>
```

**Try it!** Refresh the page - your todos persist!

### 💡 What You Learned

- `onMount()` runs when component mounts
- `onCleanup()` runs when component unmounts
- `effect()` can be used for persistence
- localStorage integration is simple

## Part 6: Control Flow (10 minutes)

### Step 9: Add Filtering

```nadi
<script lang="ts">
import { signal, computed } from '@nadi/core';
import { Show, For } from '@nadi/core';

export default function TodoApp() {
  const [todos, setTodos] = signal<Todo[]>([]);
  const [filter, setFilter] = signal<'all' | 'active' | 'completed'>('all');

  const filteredTodos = computed(() => {
    switch (filter()) {
      case 'active':
        return todos().filter(t => !t.done);
      case 'completed':
        return todos().filter(t => t.done);
      default:
        return todos();
    }
  });

  // ...rest of code

  return {
    todos,
    filteredTodos,
    filter,
    setFilter,
    // ...other functions
  };
}
</script>

<template>
  <div class="todo-app">
    {/* ...input section */}

    <div class="filters">
      <button
        class={filter() === 'all' ? 'active' : ''}
        onClick={() => setFilter('all')}
      >
        All
      </button>
      <button
        class={filter() === 'active' ? 'active' : ''}
        onClick={() => setFilter('active')}
      >
        Active
      </button>
      <button
        class={filter() === 'completed' ? 'active' : ''}
        onClick={() => setFilter('completed')}
      >
        Completed
      </button>
    </div>

    <Show when={() => filteredTodos().length > 0}>
      <For each={filteredTodos}>
        {(todo) => (
          <li key={todo.id}>
            {/* ...todo item */}
          </li>
        )}
      </For>
    </Show>

    <Show when={() => filteredTodos().length === 0}>
      <p class="empty">No todos to show</p>
    </Show>
  </div>
</template>
```

### 💡 What You Learned

- `<Show>` for conditional rendering
- `<For>` for optimized list rendering
- Filtering computed values
- Dynamic CSS classes

## Part 7: Forms with Validation (15 minutes)

### Step 10: Add Form Validation

```nadi
<script lang="ts">
import { signal } from '@nadi/core';
import { createForm } from '@nadi/forms';
import { required, minLength, maxLength } from '@nadi/forms/validators';

export default function TodoApp() {
  const form = createForm({
    initialValues: {
      todo: '',
    },
    validationRules: {
      todo: [
        required('Todo is required'),
        minLength(3, 'Too short (min 3 chars)'),
        maxLength(100, 'Too long (max 100 chars)'),
      ],
    },
    onSubmit: (values) => {
      addTodo(values.todo);
      form.reset();
    },
  });

  // ...rest of code
}
</script>

<template>
  <form onSubmit={form.handleSubmit}>
    <input
      type="text"
      value={form.fields.todo.value()}
      onInput={(e) => form.fields.todo.setValue(e.target.value)}
      onBlur={() => form.fields.todo.validate()}
      placeholder="What needs to be done?"
    />

    <Show when={() => form.fields.todo.error()}>
      <span class="error">{form.fields.todo.error()}</span>
    </Show>

    <button type="submit" disabled={!form.isValid()}>
      Add
    </button>
  </form>
</template>

<style scoped>
.error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}
</style>
```

### 💡 What You Learned

- `@nadi/forms` for reactive forms
- Built-in validators
- Field-level validation
- Form submission handling
- Error display

## Part 8: Routing (15 minutes)

### Step 11: Add Multiple Pages

Install router:

```bash
npm install @nadi/router
```

Create `src/pages/Home.nadi`:

```nadi
<script lang="ts">
import { Link } from '@nadi/router';

export default function Home() {
  return {};
}
</script>

<template>
  <div>
    <h1>Welcome to Nadi!</h1>
    <Link to="/todos">Go to Todos</Link>
  </div>
</template>
```

Update `src/main.ts`:

```typescript
import { createRoot } from '@nadi/core';
import { Router, Route } from '@nadi/router';
import Home from './pages/Home.nadi';
import TodoApp from './TodoApp.nadi';

createRoot(document.getElementById('app')!, () => (
  <Router>
    <Route path="/" component={Home} />
    <Route path="/todos" component={TodoApp} />
  </Router>
));
```

### 💡 What You Learned

- `@nadi/router` for client-side routing
- `<Route>` for route definition
- `<Link>` for navigation
- Multiple pages

## Part 9: API Integration (15 minutes)

### Step 12: Fetch Todos from API

```nadi
<script lang="ts">
import { signal, computed, effect } from '@nadi/core';

export default function TodoApp() {
  const [todos, setTodos] = signal<Todo[]>([]);
  const [loading, setLoading] = signal(true);
  const [error, setError] = signal<string | null>(null);

  async function fetchTodos() {
    try {
      setLoading(true);
      const res = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await res.json();
      setTodos(data.slice(0, 10));
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }

  onMount(() => {
    fetchTodos();
  });

  async function addTodo(text: string) {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify({ title: text, completed: false }),
      headers: { 'Content-Type': 'application/json' },
    });
    const newTodo = await res.json();
    setTodos([...todos(), newTodo]);
  }

  return { todos, loading, error, addTodo };
}
</script>

<template>
  <div class="todo-app">
    <Show when={() => loading()}>
      <div class="loading">Loading...</div>
    </Show>

    <Show when={() => error()}>
      <div class="error">{error()}</div>
    </Show>

    <Show when={() => !loading() && !error()}>
      {/* Todo list */}
    </Show>
  </div>
</template>
```

### 💡 What You Learned

- Async data fetching
- Loading states
- Error handling
- POST requests

## Part 10: Deployment (10 minutes)

### Step 13: Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized assets.

### Step 14: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

Or use the Netlify UI:

1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your `dist/` folder
3. Done!

### 💡 What You Learned

- Building for production
- Deploying to Netlify
- Static hosting

## 🎉 Congratulations!

You've built a complete Todo app with:

- ✅ Reactive state management
- ✅ Computed values
- ✅ Side effects
- ✅ Component lifecycle
- ✅ Forms with validation
- ✅ Routing
- ✅ API integration
- ✅ Production deployment

## Next Steps

1. **Add more features**:
   - Todo categories
   - Due dates
   - Priority levels
   - Search functionality

2. **Explore packages**:
   - `@nadi/meta` for SEO
   - `@nadi/echo` for real-time updates
   - `@nadi/testing` for unit tests

3. **Join the community**:
   - Discord: [discord.gg/nadi](https://discord.gg/nadi)
   - GitHub: [github.com/nadiframework/nadi](https://github.com/nadiframework/nadi)

4. **Read docs**:
   - [API Reference](./API.md)
   - [Best Practices](./BEST_PRACTICES.md)
   - [Advanced Patterns](./ADVANCED.md)

Happy coding! 🚀
