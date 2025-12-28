# Signals

Signals are the foundation of Nadi's reactivity system. They represent **reactive values** that automatically notify dependents when they change.

## What are Signals?

A signal is like a container for a value that can change over time. Unlike regular variables, signals automatically track who's using them and notify those dependents when the value changes.

```typescript
import { signal } from '@nadi/core';

const [count, setCount] = signal(0);

console.log(count()); // 0
setCount(5);
console.log(count()); // 5
```

## Creating Signals

The `signal()` function returns a tuple: `[getter, setter]`

```typescript
// Primitive values
const [name, setName] = signal('John');
const [age, setAge] = signal(25);
const [isActive, setActive] = signal(true);

// Objects and arrays
const [user, setUser] = signal({ name: 'John', email: 'john@example.com' });
const [items, setItems] = signal([1, 2, 3]);

// Undefined or null
const [data, setData] = signal<string | null>(null);
```

## Reading Signal Values

To read a signal's value, **call it as a function**:

```typescript
const [count, setCount] = signal(0);

// ✅ Correct - call as function
console.log(count()); // 0

// ❌ Wrong - don't use directly
console.log(count); // This returns the function, not the value
```

## Updating Signal Values

Use the setter function to update a signal:

```typescript
const [count, setCount] = signal(0);

// Direct value
setCount(5);

// Using previous value
setCount((prev) => prev + 1);

// With objects - create new reference
const [user, setUser] = signal({ name: 'John', age: 25 });
setUser({ ...user(), age: 26 });

// With arrays - create new reference
const [items, setItems] = signal([1, 2, 3]);
setItems([...items(), 4]);
```

## Immutability

Signals work best with **immutable updates**. Always create new objects/arrays instead of mutating:

```typescript
const [user, setUser] = signal({ name: 'John', age: 25 });

// ✅ Correct - creates new object
setUser({ ...user(), age: 26 });

// ❌ Wrong - mutates existing object (won't trigger updates)
user().age = 26;
setUser(user());

const [items, setItems] = signal([1, 2, 3]);

// ✅ Correct - creates new array
setItems([...items(), 4]);

// ❌ Wrong - mutates existing array
items().push(4);
setItems(items());
```

## Batch Updates

Multiple signal updates in the same synchronous execution are automatically batched:

```typescript
const [firstName, setFirstName] = signal('John');
const [lastName, setLastName] = signal('Doe');
const fullName = computed(() => `${firstName()} ${lastName()}`);

// Only triggers one re-render
setFirstName('Jane');
setLastName('Smith');
console.log(fullName()); // "Jane Smith"
```

## Signal Equality

By default, signals use `===` to check if a value changed:

```typescript
const [count, setCount] = signal(0);

setCount(5); // Triggers update
setCount(5); // No update (same value)
setCount(5); // No update (same value)
setCount(10); // Triggers update
```

For objects/arrays, create new references to trigger updates:

```typescript
const [user, setUser] = signal({ name: 'John' });

// Triggers update (new reference)
setUser({ ...user(), name: 'Jane' });

// No update (same reference)
const currentUser = user();
currentUser.name = 'Bob';
setUser(currentUser);
```

## Advanced: Custom Equality

You can implement custom equality checks if needed:

```typescript
function createSignalWithCustomEquality<T>(initialValue: T, equals: (a: T, b: T) => boolean) {
  const [value, setValue] = signal(initialValue);

  const customSetValue = (newValue: T | ((prev: T) => T)) => {
    const computed =
      typeof newValue === 'function' ? (newValue as (prev: T) => T)(value()) : newValue;

    if (!equals(value(), computed)) {
      setValue(computed);
    }
  };

  return [value, customSetValue] as const;
}

// Deep equality for objects
const [user, setUser] = createSignalWithCustomEquality(
  { name: 'John', age: 25 },
  (a, b) => JSON.stringify(a) === JSON.stringify(b)
);
```

## Signal Arrays

Working with arrays in signals:

```typescript
const [todos, setTodos] = signal<string[]>([]);

// Add item
setTodos([...todos(), 'New todo']);

// Remove item
setTodos(todos().filter((_, i) => i !== index));

// Update item
setTodos(todos().map((item, i) => (i === index ? 'Updated todo' : item)));

// Clear all
setTodos([]);

// Sort
setTodos([...todos()].sort());
```

## Signal Objects

Working with objects in signals:

```typescript
const [user, setUser] = signal({
  name: 'John',
  age: 25,
  address: {
    city: 'New York',
    country: 'USA',
  },
});

// Update top-level property
setUser({ ...user(), age: 26 });

// Update nested property
setUser({
  ...user(),
  address: {
    ...user().address,
    city: 'Los Angeles',
  },
});

// Add new property
setUser({ ...user(), email: 'john@example.com' });

// Remove property
const { age, ...rest } = user();
setUser(rest);
```

## TypeScript Support

Signals have full TypeScript support:

```typescript
// Inferred type
const [count, setCount] = signal(0); // number

// Explicit type
const [name, setName] = signal<string>('John');

// Union types
const [status, setStatus] = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

// Optional/nullable
const [data, setData] = signal<Data | null>(null);

// Generic interfaces
interface User {
  id: number;
  name: string;
  email: string;
}

const [user, setUser] = signal<User>({
  id: 1,
  name: 'John',
  email: 'john@example.com',
});
```

## Common Patterns

### Toggle Boolean

```typescript
const [isOpen, setIsOpen] = signal(false);

const toggle = () => setIsOpen(!isOpen());
```

### Counter

```typescript
const [count, setCount] = signal(0);

const increment = () => setCount(count() + 1);
const decrement = () => setCount(count() - 1);
const reset = () => setCount(0);
```

### Loading State

```typescript
const [isLoading, setIsLoading] = signal(false);
const [data, setData] = signal<Data | null>(null);
const [error, setError] = signal<Error | null>(null);

async function fetchData() {
  setIsLoading(true);
  setError(null);

  try {
    const result = await api.getData();
    setData(result);
  } catch (e) {
    setError(e as Error);
  } finally {
    setIsLoading(false);
  }
}
```

### Form State

```typescript
const [formData, setFormData] = signal({
  username: '',
  email: '',
  password: '',
});

const updateField = (field: string, value: string) => {
  setFormData({ ...formData(), [field]: value });
};

const resetForm = () => {
  setFormData({ username: '', email: '', password: '' });
};
```

## Performance Tips

### 1. Avoid Creating Signals in Loops

```typescript
// ❌ Bad - creates new signals on every render
function TodoList({ todos }) {
  return todos.map(todo => {
    const [done, setDone] = signal(false) // Wrong!
    return <TodoItem done={done} />
  })
}

// ✅ Good - signals managed at component level
function TodoItem({ todo }) {
  const [done, setDone] = signal(todo.done)
  return <div>...</div>
}
```

### 2. Use Computed for Derived Values

```typescript
// ❌ Bad - recalculates every time
function expensiveCalculation() {
  return items().reduce((sum, item) => sum + item.price, 0);
}

// ✅ Good - only recalculates when items change
const total = computed(() => items().reduce((sum, item) => sum + item.price, 0));
```

### 3. Batch Related Updates

```typescript
// Updates are automatically batched in the same tick
setFirstName('Jane');
setLastName('Smith');
setAge(30); // Only one re-render
```

## Debugging Signals

### Log Signal Changes

```typescript
const [count, setCount] = signal(0);

// Wrap setter to log changes
const setCountWithLog = (value: number | ((prev: number) => number)) => {
  const newValue = typeof value === 'function' ? value(count()) : value;
  console.log('Count changed:', count(), '->', newValue);
  setCount(value);
};
```

### Track Signal Access

```typescript
import { effect } from '@nadi/core';

const [count, setCount] = signal(0);

effect(() => {
  console.log('count was accessed:', count());
});
```

## Comparison with Other Frameworks

### React (useState)

```typescript
// React
const [count, setCount] = useState(0);
console.log(count); // Direct value

// Nadi
const [count, setCount] = signal(0);
console.log(count()); // Call as function
```

### Vue (ref)

```typescript
// Vue
const count = ref(0);
console.log(count.value); // Use .value

// Nadi
const [count, setCount] = signal(0);
console.log(count()); // Call as function
```

### Svelte (writable)

```typescript
// Svelte
const count = writable(0);
count.subscribe((value) => console.log(value));

// Nadi
const [count, setCount] = signal(0);
effect(() => console.log(count()));
```

## Next Steps

- Learn about [Computed Values](/guide/computed) for derived state
- Understand [Effects](/guide/effects) for side effects
- Explore [Components](/guide/components) to use signals in UI
- Read the [Core API Reference](/api/core) for advanced features

## Further Reading

- [Reactivity in Depth](/guide/reactivity)
- [Performance Optimization](/guide/performance)
- [TypeScript Guide](/guide/typescript)
