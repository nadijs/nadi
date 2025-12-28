# Effects

Effects are functions that **run automatically** when their reactive dependencies change. They're perfect for side effects like logging, API calls, DOM manipulation, and more.

## What are Effects?

An effect is a function that automatically re-runs whenever any signal or computed value it accesses changes. Unlike computed values, effects are for **side effects**, not deriving values.

```typescript
import { signal, effect } from '@nadi/core';

const [count, setCount] = signal(0);

effect(() => {
  console.log('Count is now:', count());
});
// Logs: "Count is now: 0"

setCount(5);
// Logs: "Count is now: 5"
```

## Creating Effects

Use the `effect()` function with a callback:

```typescript
import { effect } from '@nadi/core';

// Simple effect
effect(() => {
  console.log('Count changed:', count());
});

// Multiple dependencies
effect(() => {
  console.log(`${firstName()} ${lastName()}`);
});

// With side effects
effect(() => {
  document.title = `Count: ${count()}`;
});
```

## Automatic Dependency Tracking

Effects automatically track which signals they depend on:

```typescript
const [name, setName] = signal('John');
const [age, setAge] = signal(25);
const [city, setCity] = signal('NYC');

effect(() => {
  console.log(`${name()} is ${age()} years old`);
  // Only tracks 'name' and 'age', not 'city'
});

setName('Jane'); // Triggers effect
setAge(26); // Triggers effect
setCity('LA'); // Doesn't trigger effect
```

## Effect Cleanup

Effects can return a **cleanup function** that runs before the next execution or when the effect is disposed:

```typescript
const [userId, setUserId] = signal(1);

effect(() => {
  const id = userId();
  console.log('Fetching user:', id);

  const controller = new AbortController();

  fetch(`/api/users/${id}`, { signal: controller.signal })
    .then((res) => res.json())
    .then((data) => console.log('User data:', data));

  // Cleanup - abort fetch if userId changes
  return () => {
    console.log('Cleaning up:', id);
    controller.abort();
  };
});

setUserId(2); // Aborts previous fetch, starts new one
```

## Common Use Cases

### 1. Console Logging

```typescript
const [count, setCount] = signal(0);

effect(() => {
  console.log('Count:', count());
});
```

### 2. Document Title

```typescript
const [pageName, setPageName] = signal('Home');

effect(() => {
  document.title = `${pageName()} | My App`;
});
```

### 3. LocalStorage Sync

```typescript
const [theme, setTheme] = signal<'light' | 'dark'>('light');

// Load from localStorage
const stored = localStorage.getItem('theme');
if (stored) setTheme(stored as 'light' | 'dark');

// Sync to localStorage
effect(() => {
  localStorage.setItem('theme', theme());
});
```

### 4. API Calls

```typescript
const [userId, setUserId] = signal<number | null>(null);
const [userData, setUserData] = signal(null);
const [loading, setLoading] = signal(false);

effect(() => {
  const id = userId();
  if (!id) return;

  setLoading(true);

  fetch(`/api/users/${id}`)
    .then((res) => res.json())
    .then((data) => {
      setUserData(data);
      setLoading(false);
    });
});
```

### 5. DOM Manipulation

```typescript
const [isOpen, setIsOpen] = signal(false);

effect(() => {
  if (isOpen()) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
```

### 6. Event Listeners

```typescript
const [element, setElement] = signal<HTMLElement | null>(null);

effect(() => {
  const el = element();
  if (!el) return;

  const handleClick = () => console.log('Clicked!');
  el.addEventListener('click', handleClick);

  return () => {
    el.removeEventListener('click', handleClick);
  };
});
```

### 7. Timers

```typescript
const [delay, setDelay] = signal(1000);

effect(() => {
  const timer = setInterval(() => {
    console.log('Tick!');
  }, delay());

  return () => clearInterval(timer);
});
```

### 8. WebSocket Connections

```typescript
const [socketUrl, setSocketUrl] = signal('ws://localhost:3000');

effect(() => {
  const ws = new WebSocket(socketUrl());

  ws.onmessage = (event) => {
    console.log('Message:', event.data);
  };

  return () => {
    ws.close();
  };
});
```

## Effect Disposal

Effects run automatically and continue until explicitly disposed:

```typescript
// Create effect and get dispose function
const dispose = effect(() => {
  console.log('Count:', count());
});

// Later... stop the effect
dispose();

// Effect will no longer run when count changes
setCount(10); // No log
```

## Conditional Effects

Effects can conditionally track dependencies:

```typescript
const [showDetails, setShowDetails] = signal(false);
const [user, setUser] = signal({ name: 'John', age: 25 });

effect(() => {
  console.log('Name:', user().name);

  if (showDetails()) {
    console.log('Age:', user().age);
  }
});

// Only tracks user.name initially
setUser({ name: 'Jane', age: 25 }); // Runs effect

// Now tracks both name and age
setShowDetails(true);
setUser({ name: 'Jane', age: 26 }); // Runs effect
```

## Nested Effects

Effects can create other effects:

```typescript
const [parentValue, setParentValue] = signal(0);
const [childValue, setChildValue] = signal(0);

effect(() => {
  console.log('Parent:', parentValue());

  // Create nested effect
  effect(() => {
    console.log('Child:', childValue());
  });
});
```

⚠️ **Warning:** Be careful with nested effects - they can lead to memory leaks if not properly cleaned up.

## TypeScript Support

Effects work seamlessly with TypeScript:

```typescript
// Simple effect
effect(() => {
  const value: number = count();
  console.log(value);
});

// With typed signals
interface User {
  name: string;
  email: string;
}

const [user, setUser] = signal<User>({ name: 'John', email: 'john@example.com' });

effect(() => {
  const currentUser: User = user();
  console.log(currentUser.name);
});
```

## Performance Considerations

### 1. Avoid Expensive Operations

```typescript
// ❌ Bad - expensive operation in effect
effect(() => {
  const sorted = items()
    .sort()
    .map(...)
    .filter(...)
  doSomething(sorted)
})

// ✅ Good - use computed for expensive operations
const sorted = computed(() =>
  items().sort().map(...).filter(...)
)

effect(() => {
  doSomething(sorted())
})
```

### 2. Debounce Frequent Updates

```typescript
const [searchQuery, setSearchQuery] = signal('');

effect(() => {
  const query = searchQuery();

  const timer = setTimeout(() => {
    // API call after 300ms of no changes
    fetch(`/api/search?q=${query}`);
  }, 300);

  return () => clearTimeout(timer);
});
```

### 3. Batch Updates

```typescript
// Updates are automatically batched
setFirstName('Jane');
setLastName('Smith');
setAge(30);
// Effect runs only once
```

## Common Patterns

### Derived Side Effects

```typescript
const isValid = computed(() => email().length > 0);

effect(() => {
  if (isValid()) {
    console.log('Email is valid!');
  }
});
```

### Conditional Execution

```typescript
effect(() => {
  if (!isLoggedIn()) return;

  // Only runs when logged in
  fetchUserData();
});
```

### Multiple Dependencies

```typescript
effect(() => {
  console.log('User info:', {
    name: name(),
    age: age(),
    email: email(),
  });
});
```

### Error Handling

```typescript
effect(() => {
  try {
    const data = riskyOperation(value());
    console.log('Success:', data);
  } catch (error) {
    console.error('Effect error:', error);
  }
});
```

## Effects vs Computed

When to use what?

| Feature          | Computed      | Effect       |
| ---------------- | ------------- | ------------ |
| Purpose          | Derive values | Side effects |
| Returns value    | ✅ Yes        | ❌ No        |
| Has side effects | ❌ No         | ✅ Yes       |
| Memoized         | ✅ Yes        | ❌ No        |
| Runs eagerly     | ❌ No (lazy)  | ✅ Yes       |
| Cleanup          | ❌ No         | ✅ Yes       |

```typescript
// ✅ Computed - deriving a value
const doubled = computed(() => count() * 2);

// ✅ Effect - side effect (logging)
effect(() => {
  console.log('Count:', count());
});

// ❌ Don't use computed for side effects
const bad = computed(() => {
  console.log('Bad!'); // Side effect!
  return count() * 2;
});

// ❌ Don't use effect to derive values
effect(() => {
  doubled = count() * 2; // Use computed instead!
});
```

## Comparison with Other Frameworks

### React (useEffect)

```typescript
// React - needs dependency array
useEffect(() => {
  console.log('Count:', count);
}, [count]);

// Nadi - automatic tracking
effect(() => {
  console.log('Count:', count());
});
```

### Vue (watchEffect)

```typescript
// Vue
watchEffect(() => {
  console.log('Count:', count.value);
});

// Nadi
effect(() => {
  console.log('Count:', count());
});
```

### Svelte (reactive statements)

```typescript
// Svelte
$: console.log('Count:', count);

// Nadi
effect(() => {
  console.log('Count:', count());
});
```

## Advanced: Effect Context

Effects run in a tracking context that records dependencies:

```typescript
import { effect, untrack } from '@nadi/core';

const [a, setA] = signal(1);
const [b, setB] = signal(2);

effect(() => {
  console.log('A:', a()); // Tracked

  untrack(() => {
    console.log('B:', b()); // Not tracked
  });
});

setA(10); // Triggers effect
setB(20); // Doesn't trigger effect
```

## Debugging Effects

### Track Effect Runs

```typescript
let runs = 0;

effect(() => {
  runs++;
  console.log(`Effect run #${runs}`);
  console.log('Count:', count());
});
```

### Log Dependencies

```typescript
effect(() => {
  console.log('Dependencies accessed:', {
    firstName: firstName(),
    lastName: lastName(),
    age: age(),
  });
});
```

### Identify Effect Source

```typescript
effect(() => {
  console.trace('Effect running');
  console.log('Value:', value());
});
```

## Best Practices

✅ **Do:**

- Use for side effects only
- Return cleanup functions
- Keep effects focused
- Handle errors gracefully

❌ **Don't:**

- Derive values (use computed)
- Create infinite loops
- Forget cleanup
- Make effects too complex

## Common Pitfalls

### 1. Infinite Loops

```typescript
// ❌ Bad - creates infinite loop
const [count, setCount] = signal(0);

effect(() => {
  setCount(count() + 1); // Don't update dependencies!
});
```

### 2. Missing Cleanup

```typescript
// ❌ Bad - memory leak
effect(() => {
  setInterval(() => console.log('Tick'), 1000);
});

// ✅ Good - cleanup
effect(() => {
  const timer = setInterval(() => console.log('Tick'), 1000);
  return () => clearInterval(timer);
});
```

### 3. Stale Closures

```typescript
// ❌ Bad - captures old value
effect(() => {
  setTimeout(() => {
    console.log(count()); // May be stale
  }, 1000);
});

// ✅ Good - captures current value
effect(() => {
  const currentCount = count();
  setTimeout(() => {
    console.log(currentCount);
  }, 1000);
});
```

## Next Steps

- Learn about [Components](/guide/components) to use effects in UI
- Understand [Lifecycle](/guide/lifecycle) hooks
- Explore [Testing](/guide/testing) effects
- Read the [Core API Reference](/api/core)
