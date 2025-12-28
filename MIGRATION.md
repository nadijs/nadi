# Migrating to Nadi

Complete migration guides from popular frameworks to Nadi.

## Table of Contents

- [From Vue.js](#from-vuejs)
- [From React](#from-react)
- [From Svelte](#from-svelte)
- [From Solid.js](#from-solidjs)
- [From Angular](#from-angular)

---

## From Vue.js

### Concepts Mapping

| Vue 3                       | Nadi                               | Notes                              |
| --------------------------- | ---------------------------------- | ---------------------------------- |
| `ref()`                     | `signal()`                         | Similar API, returns getter/setter |
| `computed()`                | `computed()`                       | Identical concept                  |
| `watch()` / `watchEffect()` | `effect()`                         | Auto-tracking, no deps array       |
| `onMounted()`               | `onMount()`                        | Same lifecycle hook                |
| `onUnmounted()`             | `onCleanup()`                      | Similar cleanup                    |
| `provide()` / `inject()`    | `createContext()` / `useContext()` | Context API                        |
| SFC (`<template>`)          | JSX in `.nadi` files               | JSX instead of templates           |
| `<style scoped>`            | `<style scoped>`                   | Same scoped styles                 |

### Code Comparison

**Vue 3 Component:**

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const count = ref(0);
const title = computed(() => `Counter: ${count.value}`);

function increment() {
  count.value++;
}

watch(count, (newVal) => {
  console.log('Count changed:', newVal);
});

onMounted(() => {
  console.log('Component mounted');
});
</script>

<style scoped>
button {
  padding: 8px 16px;
}
</style>
```

**Nadi Equivalent:**

```nadi
<script lang="ts">
import { signal, computed, effect, onMount } from '@nadi/core';

export default function Counter() {
  const [count, setCount] = signal(0);
  const title = computed(() => `Counter: ${count()}`);

  function increment() {
    setCount(count() + 1);
  }

  effect(() => {
    console.log('Count changed:', count());
  });

  onMount(() => {
    console.log('Component mounted');
  });

  return { count, title, increment };
}
</script>

<template>
  <div>
    <h1>{title()}</h1>
    <p>Count: {count()}</p>
    <button onClick={increment}>Increment</button>
  </div>
</template>

<style scoped>
button {
  padding: 8px 16px;
}
</style>
```

### Key Differences

1. **Signals vs Refs**: Call as function `count()` instead of `.value`
2. **No dependency arrays**: Effects auto-track
3. **JSX**: Use `{}` for expressions instead of `{{}}`
4. **Events**: `onClick` instead of `@click`

### Migration Steps

1. **Install Nadi**:

```bash
npm uninstall vue
npm install @nadi/core @nadi/compiler @nadi/vite-plugin
```

2. **Update vite.config.ts**:

```typescript
import { defineConfig } from 'vite';
import nadi from '@nadi/vite-plugin';

export default defineConfig({
  plugins: [nadi()],
});
```

3. **Convert components**:
   - Rename `.vue` → `.nadi`
   - Replace `<template>` with JSX
   - Update reactive syntax

4. **Update router** (if using Vue Router):

```bash
npm uninstall vue-router
npm install @nadi/router
```

---

## From React

### Concepts Mapping

| React 18        | Nadi           | Notes                            |
| --------------- | -------------- | -------------------------------- |
| `useState()`    | `signal()`     | No setter function, direct call  |
| `useMemo()`     | `computed()`   | Auto-tracks dependencies         |
| `useEffect()`   | `effect()`     | No dependency array needed       |
| `useContext()`  | `useContext()` | Same API                         |
| `useCallback()` | Not needed     | Functions don't need memoization |
| `memo()`        | Not needed     | Fine-grained reactivity          |
| JSX             | JSX            | Same syntax!                     |

### Code Comparison

**React Component:**

```typescript
import { useState, useMemo, useEffect, useCallback } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  const filteredTodos = useMemo(() => {
    return todos.filter(t =>
      filter === 'all' ||
      (filter === 'completed' ? t.done : !t.done)
    );
  }, [todos, filter]);

  const addTodo = useCallback((text) => {
    setTodos([...todos, { text, done: false }]);
  }, [todos]);

  useEffect(() => {
    console.log('Todos changed:', todos);
  }, [todos]);

  return (
    <div>
      {filteredTodos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
```

**Nadi Equivalent:**

```typescript
import { signal, computed, effect } from '@nadi/core';

export default function TodoList() {
  const [todos, setTodos] = signal([]);
  const [filter, setFilter] = signal('all');

  const filteredTodos = computed(() =>
    todos().filter(t =>
      filter() === 'all' ||
      (filter() === 'completed' ? t.done : !t.done)
    )
  );

  function addTodo(text) {
    setTodos([...todos(), { text, done: false }]);
  }

  effect(() => {
    console.log('Todos changed:', todos());
  });

  return (
    <div>
      {filteredTodos().map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
}
```

### Key Differences

1. **No hooks rules**: Call anywhere, in any order
2. **No deps arrays**: Automatic dependency tracking
3. **No re-renders**: Updates only affected DOM nodes
4. **Smaller bundle**: ~85% smaller than React

### Migration Checklist

- [ ] Replace `useState` → `signal`
- [ ] Replace `useMemo` → `computed`
- [ ] Replace `useEffect` → `effect` (remove deps array)
- [ ] Remove `useCallback` (not needed)
- [ ] Remove `React.memo` (not needed)
- [ ] Update event handlers (keep `onClick`, etc.)
- [ ] Test and verify behavior

---

## From Svelte

### Concepts Mapping

| Svelte                   | Nadi                          | Notes                       |
| ------------------------ | ----------------------------- | --------------------------- |
| `let count = 0`          | `signal(0)`                   | Explicit reactive variables |
| `$: doubled = count * 2` | `computed(() => count() * 2)` | Computed values             |
| `$: { ... }`             | `effect(() => { ... })`       | Side effects                |
| `onMount`                | `onMount`                     | Same API                    |
| Stores                   | Signals + Context             | Similar pattern             |
| `{#if}`                  | `<Show>`                      | Conditional rendering       |
| `{#each}`                | `<For>` or `.map()`           | List rendering              |

### Code Comparison

**Svelte Component:**

```svelte
<script>
  let count = 0;
  $: doubled = count * 2;

  $: {
    console.log('Count:', count);
  }

  function increment() {
    count += 1;
  }
</script>

<div>
  <p>{count} × 2 = {doubled}</p>
  <button on:click={increment}>+1</button>
</div>

<style>
  button {
    padding: 8px 16px;
  }
</style>
```

**Nadi Equivalent:**

```nadi
<script lang="ts">
import { signal, computed, effect } from '@nadi/core';

export default function Counter() {
  const [count, setCount] = signal(0);
  const doubled = computed(() => count() * 2);

  effect(() => {
    console.log('Count:', count());
  });

  function increment() {
    setCount(count() + 1);
  }

  return { count, doubled, increment };
}
</script>

<template>
  <div>
    <p>{count()} × 2 = {doubled()}</p>
    <button onClick={increment}>+1</button>
  </div>
</template>

<style scoped>
button {
  padding: 8px 16px;
}
</style>
```

### Migration Tips

1. **Reactive statements**: Convert `$:` to `computed()` or `effect()`
2. **Stores**: Use signals + context API
3. **Two-way binding**: Use explicit `value` + `onInput`
4. **Transitions**: Use CSS or animation libraries

---

## Automated Migration Tools

### Codemod CLI

```bash
# Install codemod
npm install -g @nadi/codemod

# Migrate Vue components
npx @nadi/codemod vue-to-nadi src/**/*.vue

# Migrate React components
npx @nadi/codemod react-to-nadi src/**/*.tsx

# Migrate Svelte components
npx @nadi/codemod svelte-to-nadi src/**/*.svelte
```

### Manual Migration Script

```javascript
// migrate.js
import { migrate } from '@nadi/codemod';
import glob from 'glob';

const files = glob.sync('src/**/*.vue');
files.forEach((file) => {
  migrate(file, {
    from: 'vue',
    to: 'nadi',
    autoFix: true,
  });
});
```

---

## Common Patterns

### Forms

**Before (React + Formik):**

```typescript
<Formik
  initialValues={{ email: '' }}
  validate={values => {
    const errors = {};
    if (!values.email) errors.email = 'Required';
    return errors;
  }}
  onSubmit={values => console.log(values)}
>
  {({ values, errors, handleChange, handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <span>{errors.email}</span>}
    </form>
  )}
</Formik>
```

**After (Nadi + @nadi/forms):**

```typescript
import { createForm } from '@nadi/forms';
import { required, email } from '@nadi/forms/validators';

const form = createForm({
  initialValues: { email: '' },
  validationRules: {
    email: [required(), email()],
  },
  onSubmit: values => console.log(values),
});

<form onSubmit={form.handleSubmit}>
  <input
    value={form.fields.email.value()}
    onInput={(e) => form.fields.email.setValue(e.target.value)}
  />
  {form.fields.email.error() && <span>{form.fields.email.error()}</span>}
</form>
```

---

## FAQ

**Q: Can I mix Nadi with React/Vue?**
A: Not recommended. Choose one framework per project.

**Q: How do I migrate my state management (Vuex/Redux)?**
A: Use signals + context. See [State Management Guide](./STATE_MANAGEMENT.md).

**Q: What about my component library?**
A: Either rebuild components or use adapters (experimental).

**Q: Performance differences?**
A: Nadi is typically faster due to fine-grained reactivity and smaller bundle.

---

## Need Help?

- 📖 [Documentation](https://nadi.dev/docs)
- 💬 [Discord Community](https://discord.gg/nadi)
- 🐛 [GitHub Issues](https://github.com/nadiframework/nadi/issues)
- 📧 [Email Support](mailto:support@nadi.dev)

---

**Next Steps:**

1. Read the [Getting Started Guide](./GETTING_STARTED.md)
2. Follow a [Tutorial](./TUTORIAL.md)
3. Check out [Examples](../examples/)
4. Join the community!
