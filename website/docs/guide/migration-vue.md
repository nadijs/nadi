# Migration from Vue to Nadi

A comprehensive guide for migrating your Vue applications to Nadi.

## Overview

Nadi shares many reactive concepts with Vue but with a more explicit API. This guide will help you transition from Vue 3's Composition API to Nadi.

## Reactive State

### ref → signal

Vue's `ref` becomes `signal` in Nadi:

```typescript
// Vue
import { ref } from 'vue';

const count = ref(0);

// Access value
console.log(count.value);
count.value++;

// Nadi
import { signal } from '@nadi/core';

const count = signal(0);

// Access value
console.log(count());
count.set(count() + 1);
```

### reactive → signal

Vue's `reactive` can use signals too:

```typescript
// Vue
import { reactive } from 'vue';

const state = reactive({
  name: 'John',
  age: 30,
});

state.name = 'Jane';

// Nadi
import { signal } from '@nadi/core';

const state = signal({
  name: 'John',
  age: 30,
});

state.set({ ...state(), name: 'Jane' });
```

### computed → computed

Very similar APIs:

```typescript
// Vue
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// Nadi
import { signal, computed } from '@nadi/core';

const firstName = signal('John');
const lastName = signal('Doe');

const fullName = computed(() => `${firstName()} ${lastName()}`);
```

### watch → effect

Vue's `watch` becomes `effect`:

```typescript
// Vue
import { ref, watch } from 'vue';

const count = ref(0);

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// Nadi
import { signal, effect } from '@nadi/core';

const count = signal(0);

effect(() => {
  console.log(`Count is now ${count()}`);
});
```

### watchEffect → effect

Direct equivalent:

```typescript
// Vue
import { ref, watchEffect } from 'vue';

const userId = ref(1);

watchEffect(() => {
  fetch(`/api/users/${userId.value}`)
    .then((r) => r.json())
    .then(console.log);
});

// Nadi
import { signal, effect } from '@nadi/core';

const userId = signal(1);

effect(() => {
  fetch(`/api/users/${userId()}`)
    .then((r) => r.json())
    .then(console.log);
});
```

## Component Setup

### setup() Function

```vue
<!-- Vue -->
<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<template>
  <button @click="increment">Count: {{ count }}, Doubled: {{ doubled }}</button>
</template>
```

```typescript
// Nadi
import { signal, computed } from '@nadi/core'

function Counter() {
  const count = signal(0)
  const doubled = computed(() => count() * 2)

  function increment() {
    count.set(count() + 1)
  }

  return (
    <button onclick={increment}>
      Count: {count()}, Doubled: {doubled()}
    </button>
  )
}
```

## Template Syntax

### Directives

```vue
<!-- Vue -->
<template>
  <!-- v-if -->
  <div v-if="show">Visible</div>

  <!-- v-for -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <!-- v-model -->
  <input v-model="text" />

  <!-- v-bind -->
  <div :class="className" :style="styles">Content</div>

  <!-- v-on -->
  <button @click="handleClick">Click</button>
</template>
```

```typescript
// Nadi
function Component() {
  const show = signal(true)
  const items = signal([{ id: 1, name: 'Item 1' }])
  const text = signal('')
  const className = signal('active')
  const styles = signal({ color: 'red' })

  return (
    <>
      {/* Conditional */}
      {show() && <div>Visible</div>}

      {/* List */}
      {items().map(item => (
        <li key={item.id}>{item.name}</li>
      ))}

      {/* Two-way binding */}
      <input
        value={text()}
        oninput={e => text.set((e.target as HTMLInputElement).value)}
      />

      {/* Attributes */}
      <div class={className()} style={styles()}>
        Content
      </div>

      {/* Events */}
      <button onclick={handleClick}>Click</button>
    </>
  )
}
```

## Props and Emits

```vue
<!-- Vue -->
<script setup>
defineProps<{
  title: string
  count: number
}>()

const emit = defineEmits<{
  update: [count: number]
}>()

function increment() {
  emit('update', count + 1)
}
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <button @click="increment">{{ count }}</button>
  </div>
</template>
```

```typescript
// Nadi
interface Props {
  title: string
  count: number
  onUpdate?: (count: number) => void
}

function Counter({ title, count, onUpdate }: Props) {
  function increment() {
    onUpdate?.(count + 1)
  }

  return (
    <div>
      <h2>{title}</h2>
      <button onclick={increment}>{count}</button>
    </div>
  )
}
```

## Composables

Very similar to Vue composables:

```typescript
// Vue
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event: MouseEvent) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => {
    window.addEventListener('mousemove', update);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', update);
  });

  return { x, y };
}

// Nadi
import { signal, effect } from '@nadi/core';

export function useMouse() {
  const x = signal(0);
  const y = signal(0);

  effect(() => {
    function update(event: MouseEvent) {
      x.set(event.pageX);
      y.set(event.pageY);
    }

    window.addEventListener('mousemove', update);

    return () => {
      window.removeEventListener('mousemove', update);
    };
  });

  return { x, y };
}
```

## Provide/Inject → Context

```typescript
// Vue
import { provide, inject } from 'vue'

// Provider
const theme = ref('light')
provide('theme', theme)

// Consumer
const theme = inject('theme')

// Nadi
import { createContext, useContext, signal } from '@nadi/core'

const ThemeContext = createContext<Signal<string>>()

// Provider
function ThemeProvider({ children }) {
  const theme = signal('light')

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

## Lifecycle Hooks

```typescript
// Vue
import { onMounted, onUnmounted, onBeforeUpdate, onUpdated } from 'vue';

onMounted(() => {
  console.log('Component mounted');
});

onUnmounted(() => {
  console.log('Component unmounted');
});

// Nadi - use effects
import { effect } from '@nadi/core';

function Component() {
  // Runs after mount and on updates
  effect(() => {
    console.log('Component rendered');

    // Cleanup runs before next effect and on unmount
    return () => {
      console.log('Cleanup');
    };
  });
}
```

## Slots → Children

```vue
<!-- Vue -->
<template>
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
</template>
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

## Computed Setters

```typescript
// Vue
const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value) => {
    const parts = value.split(' ');
    firstName.value = parts[0];
    lastName.value = parts[1];
  },
});

// Nadi - use separate signals
const firstName = signal('John');
const lastName = signal('Doe');

const fullName = computed(() => `${firstName()} ${lastName()}`);

function setFullName(value: string) {
  const parts = value.split(' ');
  firstName.set(parts[0]);
  lastName.set(parts[1]);
}
```

## Teleport → Portal

```vue
<!-- Vue -->
<Teleport to="#modal">
  <div class="modal">
    Modal content
  </div>
</Teleport>
```

```typescript
// Nadi
import { Portal } from '@nadi/core'

function Component() {
  return (
    <Portal target="#modal">
      <div class="modal">
        Modal content
      </div>
    </Portal>
  )
}
```

## Routing

```typescript
// Vue Router
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/users/:id', component: User },
  ],
});

// Nadi Router
import { createRouter } from '@nadi/router';

const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/users/:id', component: User },
  ],
});
```

## State Management

```typescript
// Pinia
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, doubled, increment };
});

// Nadi - just use signals
import { signal, computed } from '@nadi/core';

export const counterStore = (() => {
  const count = signal(0);
  const doubled = computed(() => count() * 2);

  function increment() {
    count.set(count() + 1);
  }

  return { count, doubled, increment };
})();
```

## Migration Strategy

### 1. Start with Composables

Convert Vue composables to Nadi composables:

```typescript
// They're almost identical!
export function useCounter() {
  const count = signal(0);
  const increment = () => count.set(count() + 1);
  return { count, increment };
}
```

### 2. Convert Components

Work from leaf components up:

```typescript
// 1. Simple presentational components
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

### 3. Migrate State

Replace Pinia/Vuex with signals:

```typescript
// Global state
export const todos = signal<Todo[]>([]);
export const filter = signal<Filter>('all');
export const filteredTodos = computed(() => filterTodos(todos(), filter()));
```

## Common Pitfalls

### Forgetting to Call Signals

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
// ❌ Wrong (works in Vue)
const state = signal({ count: 0 });
state().count++; // Mutates

// ✅ Correct
const state = signal({ count: 0 });
state.set({ ...state(), count: state().count + 1 });
```

### Missing Cleanup

```typescript
// ❌ Wrong
effect(() => {
  const timer = setInterval(() => {}, 1000);
});

// ✅ Correct
effect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);
});
```

## Benefits of Migration

✅ **Explicit**: No magic, clear reactivity boundaries
✅ **Simpler**: No template compiler needed
✅ **TypeScript**: Better type inference
✅ **Performance**: Fine-grained updates
✅ **Flexible**: Use signals anywhere

## Next Steps

- Read [Signals Guide](/guide/signals)
- Learn [Computed Values](/guide/computed)
- Understand [Effects](/guide/effects)
- Explore [Components](/guide/components)
- Check [JSX Guide](/guide/jsx)
