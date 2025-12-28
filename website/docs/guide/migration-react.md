# Migration from React to Nadi

A comprehensive guide for migrating your React applications to Nadi.

## Overview

Nadi shares many concepts with React but with simpler, more direct APIs. This guide will help you understand the differences and migrate your React code.

## State Management

### useState → signal

React's `useState` becomes `signal` in Nadi:

```typescript
// React
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}

// Nadi
import { signal } from '@nadi/core'

function Counter() {
  const count = signal(0)

  return (
    <button onclick={() => count.set(count() + 1)}>
      Count: {count()}
    </button>
  )
}
```

Key differences:

- Signal is a function that holds the value
- Use `count()` to read, `count.set()` to write
- No need to import hooks
- Works outside components

### useMemo → computed

React's `useMemo` becomes `computed`:

```typescript
// React
import { useMemo } from 'react'

function TodoList({ todos }) {
  const completedCount = useMemo(
    () => todos.filter(t => t.completed).length,
    [todos]
  )

  return <div>Completed: {completedCount}</div>
}

// Nadi
import { signal, computed } from '@nadi/core'

function TodoList() {
  const todos = signal<Todo[]>([])
  const completedCount = computed(() =>
    todos().filter(t => t.completed).length
  )

  return <div>Completed: {completedCount()}</div>
}
```

Key differences:

- No dependency array needed
- Automatically tracks dependencies
- Can be created outside components
- More efficient tracking

### useEffect → effect

React's `useEffect` becomes `effect`:

```typescript
// React
import { useEffect } from 'react';

function Component({ userId }) {
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then(setUser);
  }, [userId]);
}

// Nadi
import { signal, effect } from '@nadi/core';

function Component() {
  const userId = signal(1);
  const user = signal(null);

  effect(() => {
    fetch(`/api/users/${userId()}`)
      .then((r) => r.json())
      .then((data) => user.set(data));
  });
}
```

Key differences:

- No dependency array
- Automatically tracks reactive reads
- Cleanup via return function
- More predictable execution

## Component Patterns

### Function Components

Components work similarly:

```typescript
// React
interface Props {
  name: string
  age: number
}

function UserCard({ name, age }: Props) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  )
}

// Nadi
interface Props {
  name: string
  age: number
}

function UserCard({ name, age }: Props) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  )
}
```

### Props and Children

```typescript
// React
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}

// Nadi
function Card({ title, children }) {
  return (
    <div class="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}
```

## Context API

### Context

```typescript
// React
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function Button() {
  const { theme } = useContext(ThemeContext)
  return <button className={theme}>Click</button>
}

// Nadi
import { createContext, useContext, signal } from '@nadi/core'

const ThemeContext = createContext<{ theme: Signal<string> }>()

function ThemeProvider({ children }) {
  const theme = signal('light')

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function Button() {
  const { theme } = useContext(ThemeContext)
  return <button class={theme()}>Click</button>
}
```

## Custom Hooks → Composables

React hooks become regular functions:

```typescript
// React
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [url]);

  return { data, loading };
}

// Nadi
import { signal, effect } from '@nadi/core';

function useFetch(url: Signal<string>) {
  const data = signal(null);
  const loading = signal(true);

  effect(() => {
    loading.set(true);
    fetch(url())
      .then((r) => r.json())
      .then((result) => {
        data.set(result);
        loading.set(false);
      });
  });

  return { data, loading };
}
```

## Event Handling

```typescript
// React - camelCase events
<button onClick={handleClick}>Click</button>
<input onChange={handleChange} />

// Nadi - lowercase events
<button onclick={handleClick}>Click</button>
<input oninput={handleChange} />
```

## Conditional Rendering

Same patterns work:

```typescript
// Both React and Nadi
function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    return <Dashboard />
  }

  return <Login />
}

// Or with ternary
function Component({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <Dashboard /> : <Login />}
    </div>
  )
}
```

## Lists and Keys

```typescript
// React
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}

// Nadi - same!
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}
```

## Forms

```typescript
// React
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}

// Nadi
import { signal } from '@nadi/core'

function LoginForm() {
  const email = signal('')
  const password = signal('')

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    login(email(), password())
  }

  return (
    <form onsubmit={handleSubmit}>
      <input
        value={email()}
        oninput={e => email.set((e.target as HTMLInputElement).value)}
      />
      <input
        type="password"
        value={password()}
        oninput={e => password.set((e.target as HTMLInputElement).value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

## Routing

```typescript
// React Router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

// Nadi Router
import { createRouter, RouterView, RouterLink } from '@nadi/router'

const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About }
  ]
})

function App() {
  return (
    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>

      <RouterView />
    </div>
  )
}
```

## Side Effects and Cleanup

```typescript
// React
useEffect(() => {
  const timer = setInterval(() => {
    setCount((c) => c + 1);
  }, 1000);

  return () => clearInterval(timer);
}, []);

// Nadi
effect(() => {
  const timer = setInterval(() => {
    count.set(count() + 1);
  }, 1000);

  return () => clearInterval(timer);
});
```

## Refs

```typescript
// React
import { useRef, useEffect } from 'react'

function Component() {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} />
}

// Nadi
import { signal, effect } from '@nadi/core'

function Component() {
  const inputRef = signal<HTMLInputElement | null>(null)

  effect(() => {
    inputRef()?.focus()
  })

  return <input ref={inputRef} />
}
```

## Performance Optimization

### React.memo → Computed

```typescript
// React
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{expensiveCalculation(data)}</div>
})

// Nadi
function Component({ data }: { data: Signal<Data> }) {
  const result = computed(() => expensiveCalculation(data()))

  return <div>{result()}</div>
}
```

### useCallback → Regular Functions

```typescript
// React - need useCallback
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);

// Nadi - just use regular functions
const handleClick = () => {
  doSomething(value());
};
```

## Migration Strategy

### 1. Start Small

Begin with a new feature or small component:

```typescript
// Convert one component at a time
import { signal } from '@nadi/core';

function NewFeature() {
  const state = signal(initialValue);
  // New code in Nadi
}
```

### 2. Coexist with React

You can run Nadi alongside React during migration:

```typescript
// Mount Nadi component in React
import { render } from '@nadi/core'
import { useEffect, useRef } from 'react'

function ReactWrapper() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      render(() => <NadiComponent />, containerRef.current)
    }
  }, [])

  return <div ref={containerRef} />
}
```

### 3. Migrate State Management First

Convert Redux/MobX to signals:

```typescript
// Redux
const store = createStore(reducer);

// Nadi
const todos = signal<Todo[]>([]);
const filter = signal<Filter>('all');
const filteredTodos = computed(() => filterTodos(todos(), filter()));
```

### 4. Convert Components

Work from leaf components up:

```typescript
// 1. Start with presentational components
function Button({ label, onClick }) {
  return <button onclick={onClick}>{label}</button>
}

// 2. Then container components
function TodoContainer() {
  const todos = signal<Todo[]>([])
  // ...
}

// 3. Finally app structure
function App() {
  // ...
}
```

## Common Pitfalls

### Forgetting to Call Signals

```typescript
// ❌ Wrong
const count = signal(0);
console.log(count); // Logs the signal object

// ✅ Correct
const count = signal(0);
console.log(count()); // Logs the value: 0
```

### Missing Cleanup

```typescript
// ❌ Wrong
effect(() => {
  const timer = setInterval(() => {}, 1000);
  // Memory leak!
});

// ✅ Correct
effect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
});
```

### Mutating Signal Values

```typescript
// ❌ Wrong
const todos = signal([]);
todos().push(newTodo); // Mutates array

// ✅ Correct
const todos = signal([]);
todos.set([...todos(), newTodo]);
```

## Benefits of Migration

✅ **Simpler**: No hook rules, no dependency arrays
✅ **Faster**: Fine-grained reactivity, no virtual DOM diffing
✅ **Smaller**: Smaller bundle size
✅ **TypeScript**: Better type inference
✅ **Flexible**: Use signals anywhere, not just in components

## Next Steps

- Read [Signals Guide](/guide/signals)
- Learn [Computed Values](/guide/computed)
- Understand [Effects](/guide/effects)
- Explore [Components](/guide/components)
- Check [Testing Guide](/guide/testing)
