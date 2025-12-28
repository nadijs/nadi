# Computed Values

Computed values are **derived reactive values** that automatically recalculate when their dependencies change. They're memoized and only recompute when needed.

## What are Computed Values?

A computed value is a function that derives its value from one or more signals. It automatically tracks which signals it depends on and updates when those signals change.

```typescript
import { signal, computed } from '@nadi/core';

const [firstName, setFirstName] = signal('John');
const [lastName, setLastName] = signal('Doe');

const fullName = computed(() => `${firstName()} ${lastName()}`);

console.log(fullName()); // "John Doe"

setFirstName('Jane');
console.log(fullName()); // "Jane Doe"
```

## Creating Computed Values

Use the `computed()` function with a callback that returns the derived value:

```typescript
import { computed } from '@nadi/core';

// Simple computation
const doubled = computed(() => count() * 2);

// Multiple dependencies
const fullName = computed(() => `${firstName()} ${lastName()}`);

// Complex computation
const summary = computed(() => ({
  total: items().length,
  completed: items().filter((i) => i.done).length,
  pending: items().filter((i) => !i.done).length,
}));
```

## Reading Computed Values

Like signals, computed values are **called as functions**:

```typescript
const doubled = computed(() => count() * 2);

// ✅ Correct - call as function
console.log(doubled()); // 0

// ❌ Wrong - don't use directly
console.log(doubled); // This returns the function, not the value
```

## Automatic Dependency Tracking

Computed values automatically track which signals they depend on:

```typescript
const [a, setA] = signal(1);
const [b, setB] = signal(2);
const [c, setC] = signal(3);

const sum = computed(() => {
  if (a() > 0) {
    return a() + b(); // Only depends on 'a' and 'b'
  }
  return c(); // Only depends on 'a' and 'c'
});

console.log(sum()); // 3

setC(10); // Won't trigger recalculation (c not used)
setB(5); // Will trigger recalculation
```

## Memoization

Computed values are **memoized** - they only recalculate when dependencies change:

```typescript
const [count, setCount] = signal(0);

let calculations = 0;
const doubled = computed(() => {
  calculations++;
  return count() * 2;
});

console.log(doubled()); // 0 (calculations: 1)
console.log(doubled()); // 0 (calculations: 1 - cached!)
console.log(doubled()); // 0 (calculations: 1 - cached!)

setCount(5);
console.log(doubled()); // 10 (calculations: 2 - recalculated!)
console.log(doubled()); // 10 (calculations: 2 - cached!)
```

## Chaining Computed Values

Computed values can depend on other computed values:

```typescript
const [radius, setRadius] = signal(5);

const diameter = computed(() => radius() * 2);
const circumference = computed(() => Math.PI * diameter());
const area = computed(() => Math.PI * radius() ** 2);

console.log(diameter()); // 10
console.log(circumference()); // 31.41...
console.log(area()); // 78.53...

setRadius(10);

console.log(diameter()); // 20
console.log(circumference()); // 62.83...
console.log(area()); // 314.15...
```

## Complex Computations

### Array Operations

```typescript
const [todos, setTodos] = signal([
  { id: 1, text: 'Learn Nadi', done: true },
  { id: 2, text: 'Build app', done: false },
  { id: 3, text: 'Deploy', done: false },
]);

// Filter
const completedTodos = computed(() => todos().filter((todo) => todo.done));

const pendingTodos = computed(() => todos().filter((todo) => !todo.done));

// Count
const completedCount = computed(() => todos().filter((todo) => todo.done).length);

const totalCount = computed(() => todos().length);

// Progress percentage
const progress = computed(() => (totalCount() === 0 ? 0 : (completedCount() / totalCount()) * 100));
```

### Object Transformations

```typescript
const [user, setUser] = signal({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  age: 25,
});

const displayName = computed(() => `${user().firstName} ${user().lastName}`);

const isAdult = computed(() => user().age >= 18);

const userSummary = computed(() => ({
  name: displayName(),
  email: user().email,
  adult: isAdult(),
}));
```

### Search and Filtering

```typescript
const [items, setItems] = signal([...])
const [searchQuery, setSearchQuery] = signal('')
const [filter, setFilter] = signal<'all' | 'active' | 'completed'>('all')

const filteredItems = computed(() => {
  let result = items()

  // Apply search
  if (searchQuery()) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(searchQuery().toLowerCase())
    )
  }

  // Apply filter
  if (filter() === 'active') {
    result = result.filter(item => !item.completed)
  } else if (filter() === 'completed') {
    result = result.filter(item => item.completed)
  }

  return result
})

const itemCount = computed(() => filteredItems().length)
```

## TypeScript Support

Computed values have full TypeScript support with type inference:

```typescript
const [count, setCount] = signal(0);

// Type inferred as number
const doubled = computed(() => count() * 2);

// Explicit type
const tripled = computed<number>(() => count() * 3);

// Complex types
interface Summary {
  total: number;
  completed: number;
  pending: number;
}

const summary = computed<Summary>(() => ({
  total: todos().length,
  completed: todos().filter((t) => t.done).length,
  pending: todos().filter((t) => !t.done).length,
}));

// Union types
const status = computed<'empty' | 'partial' | 'complete'>(() => {
  const done = completedCount();
  const total = totalCount();
  if (done === 0) return 'empty';
  if (done === total) return 'complete';
  return 'partial';
});
```

## Performance Considerations

### 1. Expensive Computations

Computed values are perfect for expensive operations:

```typescript
const [largeDataset, setLargeDataset] = signal([...])

// ❌ Bad - recalculates every render
function Component() {
  const sorted = largeDataset().sort()
  const filtered = sorted.filter(...)
  const mapped = filtered.map(...)
  return <div>{mapped}</div>
}

// ✅ Good - only recalculates when dataset changes
const processed = computed(() => {
  return largeDataset()
    .sort()
    .filter(...)
    .map(...)
})

function Component() {
  return <div>{processed()}</div>
}
```

### 2. Avoid Side Effects

Computed values should be **pure functions** - no side effects:

```typescript
// ❌ Bad - has side effects
const impure = computed(() => {
  console.log('Computing...'); // Side effect!
  fetch('/api/data'); // Side effect!
  return count() * 2;
});

// ✅ Good - pure computation
const pure = computed(() => count() * 2);

// Use effects for side effects
effect(() => {
  console.log('Count changed:', count());
});
```

### 3. Split Complex Computations

Break complex computations into smaller computed values:

```typescript
// ❌ Harder to optimize
const everything = computed(() => {
  const filtered = items().filter(...)
  const sorted = filtered.sort(...)
  const grouped = sorted.reduce(...)
  const mapped = grouped.map(...)
  return mapped
})

// ✅ Better - can be individually optimized
const filtered = computed(() => items().filter(...))
const sorted = computed(() => filtered().sort(...))
const grouped = computed(() => sorted().reduce(...))
const mapped = computed(() => grouped().map(...))
```

## Common Patterns

### Derived State

```typescript
const [items, setItems] = signal<Item[]>([]);

const isEmpty = computed(() => items().length === 0);
const hasItems = computed(() => items().length > 0);
const firstItem = computed(() => items()[0]);
const lastItem = computed(() => items()[items().length - 1]);
```

### Statistics

```typescript
const [numbers, setNumbers] = signal([1, 2, 3, 4, 5]);

const sum = computed(() => numbers().reduce((a, b) => a + b, 0));

const average = computed(() => sum() / numbers().length);

const min = computed(() => Math.min(...numbers()));

const max = computed(() => Math.max(...numbers()));
```

### Validation

```typescript
const [email, setEmail] = signal('');
const [password, setPassword] = signal('');

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email()));

const isPasswordValid = computed(() => password().length >= 8);

const isFormValid = computed(() => isEmailValid() && isPasswordValid());
```

### Conditional Logic

```typescript
const [score, setScore] = signal(0);

const grade = computed(() => {
  const s = score();
  if (s >= 90) return 'A';
  if (s >= 80) return 'B';
  if (s >= 70) return 'C';
  if (s >= 60) return 'D';
  return 'F';
});

const isPassing = computed(() => score() >= 60);
```

## Computed vs Functions

Why use computed instead of regular functions?

```typescript
const [count, setCount] = signal(0);

// Regular function - recalculates every time
function getDoubled() {
  console.log('Calculating...');
  return count() * 2;
}

// Computed - memoized, only recalculates when count changes
const doubled = computed(() => {
  console.log('Calculating...');
  return count() * 2;
});

// Call multiple times
getDoubled(); // Logs "Calculating..."
getDoubled(); // Logs "Calculating..." (again!)
getDoubled(); // Logs "Calculating..." (again!)

doubled(); // Logs "Calculating..."
doubled(); // No log (cached!)
doubled(); // No log (cached!)
```

## Comparison with Other Frameworks

### React (useMemo)

```typescript
// React
const doubled = useMemo(() => count * 2, [count]);

// Nadi - no dependency array needed
const doubled = computed(() => count() * 2);
```

### Vue (computed)

```typescript
// Vue
const doubled = computed(() => count.value * 2);

// Nadi
const doubled = computed(() => count() * 2);
```

### Svelte (derived)

```typescript
// Svelte
const doubled = derived(count, ($count) => $count * 2);

// Nadi
const doubled = computed(() => count() * 2);
```

## Advanced: Computed with Equality

Create computed values with custom equality checks:

```typescript
function computedWithEquality<T>(fn: () => T, equals: (a: T, b: T) => boolean) {
  let cache: T;
  let hasCache = false;

  return computed(() => {
    const value = fn();

    if (!hasCache || !equals(cache, value)) {
      cache = value;
      hasCache = true;
    }

    return cache;
  });
}

// Deep equality for objects
const userSummary = computedWithEquality(
  () => ({ name: name(), age: age() }),
  (a, b) => JSON.stringify(a) === JSON.stringify(b)
);
```

## Debugging Computed Values

### Track Recalculations

```typescript
let recalculations = 0;

const doubled = computed(() => {
  recalculations++;
  console.log(`Recalculation #${recalculations}`);
  return count() * 2;
});
```

### Log Dependencies

```typescript
const result = computed(() => {
  console.log('Dependencies:', {
    firstName: firstName(),
    lastName: lastName(),
  });
  return `${firstName()} ${lastName()}`;
});
```

## Best Practices

✅ **Do:**

- Use for derived values
- Keep computations pure
- Chain computed values
- Use for expensive operations

❌ **Don't:**

- Include side effects
- Call async functions
- Mutate external state
- Create in loops/renders

## Next Steps

- Learn about [Effects](/guide/effects) for side effects
- Understand [Components](/guide/components) to use computed in UI
- Explore [Performance](/guide/performance) optimization
- Read the [Core API Reference](/api/core)
