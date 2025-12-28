# Migration from Svelte to Nadi

A comprehensive guide for migrating your Svelte applications to Nadi.

## Overview

Nadi and Svelte both use reactive programming, but with different approaches. Svelte uses a compiler for reactivity while Nadi uses runtime signals. This guide helps you transition.

## Reactive State

### Svelte Variables → Signals

```svelte
<!-- Svelte -->
<script>
  let count = 0

  function increment() {
    count += 1
  }
</script>

<button on:click={increment}>
  Count: {count}
</button>
```

```typescript
// Nadi
import { signal } from '@nadi/core'

function Counter() {
  const count = signal(0)

  function increment() {
    count.set(count() + 1)
  }

  return (
    <button onclick={increment}>
      Count: {count()}
    </button>
  )
}
```

### Reactive Declarations ($:) → Computed

```svelte
<!-- Svelte -->
<script>
  let count = 0
  $: doubled = count * 2
  $: console.log(`Count is ${count}`)
</script>

<div>
  Count: {count}, Doubled: {doubled}
</div>
```

```typescript
// Nadi
import { signal, computed, effect } from '@nadi/core'

function Component() {
  const count = signal(0)
  const doubled = computed(() => count() * 2)

  effect(() => {
    console.log(`Count is ${count()}`)
  })

  return (
    <div>
      Count: {count()}, Doubled: {doubled()}
    </div>
  )
}
```

### Stores → Signals

```typescript
// Svelte
import { writable, derived } from 'svelte/store';

const count = writable(0);
const doubled = derived(count, ($count) => $count * 2);

// Subscribe
count.subscribe((value) => {
  console.log(value);
});

// Update
count.set(1);
count.update((n) => n + 1);

// Nadi
import { signal, computed, effect } from '@nadi/core';

const count = signal(0);
const doubled = computed(() => count() * 2);

// Subscribe
effect(() => {
  console.log(count());
});

// Update
count.set(1);
count.set(count() + 1);
```

## Component Props

```svelte
<!-- Svelte -->
<script>
  export let title
  export let count = 0
</script>

<div>
  <h2>{title}</h2>
  <p>Count: {count}</p>
</div>
```

```typescript
// Nadi
interface Props {
  title: string
  count?: number
}

function Component({ title, count = 0 }: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
    </div>
  )
}
```

## Event Handling

```svelte
<!-- Svelte -->
<script>
  function handleClick() {
    console.log('clicked')
  }

  function handleInput(event) {
    console.log(event.target.value)
  }
</script>

<button on:click={handleClick}>Click</button>
<input on:input={handleInput} />
```

```typescript
// Nadi
function Component() {
  function handleClick() {
    console.log('clicked')
  }

  function handleInput(event: Event) {
    console.log((event.target as HTMLInputElement).value)
  }

  return (
    <>
      <button onclick={handleClick}>Click</button>
      <input oninput={handleInput} />
    </>
  )
}
```

## Two-Way Binding

```svelte
<!-- Svelte - built-in bind -->
<script>
  let name = ''
</script>

<input bind:value={name} />
<p>Hello {name}!</p>
```

```typescript
// Nadi - manual binding
import { signal } from '@nadi/core'

function Component() {
  const name = signal('')

  return (
    <>
      <input
        value={name()}
        oninput={e => name.set((e.target as HTMLInputElement).value)}
      />
      <p>Hello {name()}!</p>
    </>
  )
}
```

## Conditional Rendering

```svelte
<!-- Svelte -->
<script>
  let show = true
</script>

{#if show}
  <p>Visible</p>
{:else}
  <p>Hidden</p>
{/if}
```

```typescript
// Nadi
function Component() {
  const show = signal(true)

  return (
    <>
      {show() ? <p>Visible</p> : <p>Hidden</p>}
    </>
  )
}
```

## Lists

```svelte
<!-- Svelte -->
<script>
  let items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]
</script>

<ul>
  {#each items as item (item.id)}
    <li>{item.name}</li>
  {/each}
</ul>
```

```typescript
// Nadi
function Component() {
  const items = signal([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ])

  return (
    <ul>
      {items().map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

## Await Blocks → Async Effects

```svelte
<!-- Svelte -->
<script>
  let promise = fetchData()

  async function fetchData() {
    const response = await fetch('/api/data')
    return response.json()
  }
</script>

{#await promise}
  <p>Loading...</p>
{:then data}
  <p>Data: {data}</p>
{:catch error}
  <p>Error: {error.message}</p>
{/await}
```

```typescript
// Nadi
import { signal, effect } from '@nadi/core'

function Component() {
  const data = signal(null)
  const loading = signal(true)
  const error = signal(null)

  effect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(result => {
        data.set(result)
        loading.set(false)
      })
      .catch(err => {
        error.set(err)
        loading.set(false)
      })
  })

  if (loading()) return <p>Loading...</p>
  if (error()) return <p>Error: {error().message}</p>
  return <p>Data: {data()}</p>
}
```

## Lifecycle

```svelte
<!-- Svelte -->
<script>
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte'

  onMount(() => {
    console.log('Component mounted')
    return () => {
      console.log('Cleanup')
    }
  })

  onDestroy(() => {
    console.log('Component destroyed')
  })
</script>
```

```typescript
// Nadi
import { effect } from '@nadi/core'

function Component() {
  effect(() => {
    console.log('Component mounted/updated')

    return () => {
      console.log('Cleanup/destroyed')
    }
  })

  return <div>Content</div>
}
```

## Slots → Children

```svelte
<!-- Svelte -->
<!-- Card.svelte -->
<div class="card">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>

<!-- Usage -->
<Card>
  <h2 slot="header">Title</h2>
  <p>Content</p>
  <button slot="footer">Close</button>
</Card>
```

```typescript
// Nadi
interface Props {
  header?: JSX.Element
  children?: JSX.Element
  footer?: JSX.Element
}

function Card({ header, children, footer }: Props) {
  return (
    <div class="card">
      <header>{header}</header>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  )
}

// Usage
<Card
  header={<h2>Title</h2>}
  footer={<button>Close</button>}
>
  <p>Content</p>
</Card>
```

## Context

```svelte
<!-- Svelte -->
<script>
  import { setContext, getContext } from 'svelte'

  // Provider
  setContext('theme', 'dark')

  // Consumer
  const theme = getContext('theme')
</script>
```

```typescript
// Nadi
import { createContext, useContext, signal } from '@nadi/core'

const ThemeContext = createContext<Signal<string>>()

// Provider
function ThemeProvider({ children }) {
  const theme = signal('dark')

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

// Consumer
function Component() {
  const theme = useContext(ThemeContext)
  return <div>{theme()}</div>
}
```

## Animations

```svelte
<!-- Svelte -->
<script>
  import { fade, slide } from 'svelte/transition'

  let visible = true
</script>

{#if visible}
  <div transition:fade>Fades in and out</div>
{/if}
```

```typescript
// Nadi - CSS transitions
import { signal } from '@nadi/core'

function Component() {
  const visible = signal(true)

  return (
    <>
      {visible() && (
        <div class="fade-in">
          Fades in and out
        </div>
      )}

      <style>{`
        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}
```

## Actions → Effects

```svelte
<!-- Svelte -->
<script>
  function tooltip(node, text) {
    const tooltip = document.createElement('div')
    tooltip.textContent = text

    function handleMouseEnter() {
      document.body.appendChild(tooltip)
    }

    function handleMouseLeave() {
      tooltip.remove()
    }

    node.addEventListener('mouseenter', handleMouseEnter)
    node.addEventListener('mouseleave', handleMouseLeave)

    return {
      destroy() {
        node.removeEventListener('mouseenter', handleMouseEnter)
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }
</script>

<button use:tooltip="Tooltip text">Hover me</button>
```

```typescript
// Nadi
import { signal, effect } from '@nadi/core'

function Button() {
  const buttonRef = signal<HTMLElement | null>(null)

  effect(() => {
    const node = buttonRef()
    if (!node) return

    const tooltip = document.createElement('div')
    tooltip.textContent = 'Tooltip text'

    const handleMouseEnter = () => {
      document.body.appendChild(tooltip)
    }

    const handleMouseLeave = () => {
      tooltip.remove()
    }

    node.addEventListener('mouseenter', handleMouseEnter)
    node.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter)
      node.removeEventListener('mouseleave', handleMouseLeave)
    }
  })

  return <button ref={buttonRef}>Hover me</button>
}
```

## Store Auto-Subscription

```svelte
<!-- Svelte - auto $ prefix -->
<script>
  import { writable } from 'svelte/store'

  const count = writable(0)
  // Auto-subscribed with $
  console.log($count)
</script>

<p>Count: {$count}</p>
```

```typescript
// Nadi - explicit signal calls
import { signal } from '@nadi/core'

function Component() {
  const count = signal(0)

  // Explicit call
  console.log(count())

  return <p>Count: {count()}</p>
}
```

## SvelteKit → Nadi with Adapters

```typescript
// SvelteKit routes
// src/routes/+page.svelte
// src/routes/about/+page.svelte
// src/routes/blog/[slug]/+page.svelte

// Nadi Router
import { createRouter } from '@nadi/router';

const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/blog/:slug', component: BlogPost },
  ],
});
```

## Migration Strategy

### 1. Start with State

Convert Svelte stores to signals:

```typescript
// Svelte store
import { writable } from 'svelte/store';
export const count = writable(0);

// Nadi signal
import { signal } from '@nadi/core';
export const count = signal(0);
```

### 2. Convert Components

Work from simple to complex:

```typescript
// 1. Presentational components
function Button({ label, onclick }) {
  return <button onclick={onclick}>{label}</button>
}

// 2. Components with state
function Counter() {
  const count = signal(0)
  return <button onclick={() => count.set(count() + 1)}>{count()}</button>
}

// 3. Complex containers
function TodoList() {
  // ...
}
```

### 3. Replace Reactive Statements

Convert `$:` to `computed` or `effect`:

```typescript
// Svelte
let count = 0;
$: doubled = count * 2;
$: console.log(count);

// Nadi
const count = signal(0);
const doubled = computed(() => count() * 2);
effect(() => console.log(count()));
```

## Common Pitfalls

### Forgetting Signal Calls

```typescript
// ❌ Wrong
const count = signal(0);
console.log(count); // Signal object

// ✅ Correct
const count = signal(0);
console.log(count()); // Value
```

### Direct Mutation

```typescript
// ❌ Wrong (works in Svelte)
const items = signal([1, 2, 3]);
items().push(4); // Mutates

// ✅ Correct
const items = signal([1, 2, 3]);
items.set([...items(), 4]);
```

### Missing Return in Effects

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

## Benefits of Migration

✅ **TypeScript**: First-class TypeScript support
✅ **No Compiler**: Runtime reactivity
✅ **Explicit**: Clear reactivity boundaries
✅ **Fine-grained**: Precise updates
✅ **Flexible**: Use signals anywhere

## Comparison

| Feature    | Svelte              | Nadi            |
| ---------- | ------------------- | --------------- |
| Reactivity | Compile-time        | Runtime signals |
| State      | Variables           | Signals         |
| Computed   | `$:`                | `computed()`    |
| Effects    | `$:`                | `effect()`      |
| Stores     | `writable/readable` | `signal`        |
| Components | `.svelte` files     | Functions       |
| Templates  | Svelte syntax       | JSX             |
| Binding    | `bind:`             | Manual          |

## Next Steps

- Read [Signals Guide](/guide/signals)
- Learn [Computed Values](/guide/computed)
- Understand [Effects](/guide/effects)
- Explore [Components](/guide/components)
- Check [JSX Guide](/guide/jsx)
