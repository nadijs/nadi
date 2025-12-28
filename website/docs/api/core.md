# @nadi/core API Reference

Complete API reference for `@nadi/core` - the foundational package providing reactive primitives and rendering capabilities.

## Installation

```bash
npm install @nadi/core
```

## Reactivity

### signal()

Creates a reactive signal that can hold and notify changes to a value.

```typescript
function signal<T>(initialValue: T): Signal<T>;
```

**Parameters:**

- `initialValue`: The initial value of the signal

**Returns:** A `Signal<T>` object

**Example:**

```typescript
import { signal } from '@nadi/core';

const count = signal(0);
const name = signal('John');
const user = signal({ id: 1, name: 'Jane' });
```

### Signal Methods

#### get() / ()

Read the current value of a signal.

```typescript
signal.get(): T
signal(): T
```

**Example:**

```typescript
const count = signal(5);
console.log(count()); // 5
console.log(count.get()); // 5
```

#### set()

Update the signal's value and notify all dependents.

```typescript
signal.set(newValue: T): void
```

**Parameters:**

- `newValue`: The new value to set

**Example:**

```typescript
const count = signal(0);
count.set(5);
console.log(count()); // 5
```

#### update()

Update the signal's value based on the current value.

```typescript
signal.update(updater: (current: T) => T): void
```

**Parameters:**

- `updater`: Function that receives current value and returns new value

**Example:**

```typescript
const count = signal(0);
count.update((n) => n + 1);
console.log(count()); // 1
```

#### subscribe()

Subscribe to changes in the signal.

```typescript
signal.subscribe(listener: (value: T) => void): Unsubscribe
```

**Parameters:**

- `listener`: Function called when signal changes

**Returns:** Function to unsubscribe

**Example:**

```typescript
const count = signal(0);

const unsubscribe = count.subscribe((value) => {
  console.log('Count changed:', value);
});

count.set(5); // Logs: Count changed: 5

unsubscribe(); // Stop listening
```

### computed()

Creates a computed signal that automatically updates when dependencies change.

```typescript
function computed<T>(computation: () => T): ComputedSignal<T>;
```

**Parameters:**

- `computation`: Function that computes the value

**Returns:** A read-only `ComputedSignal<T>`

**Example:**

```typescript
import { signal, computed } from '@nadi/core';

const count = signal(5);
const doubled = computed(() => count() * 2);

console.log(doubled()); // 10

count.set(10);
console.log(doubled()); // 20
```

### ComputedSignal Methods

#### get() / ()

Read the current computed value.

```typescript
computed.get(): T
computed(): T
```

#### subscribe()

Subscribe to changes in the computed value.

```typescript
computed.subscribe(listener: (value: T) => void): Unsubscribe
```

### effect()

Creates a side effect that runs when dependencies change.

```typescript
function effect(effectFn: () => void | (() => void)): Unsubscribe;
```

**Parameters:**

- `effectFn`: Function to run as effect, optionally returns cleanup function

**Returns:** Function to stop the effect

**Example:**

```typescript
import { signal, effect } from '@nadi/core';

const count = signal(0);

const stop = effect(() => {
  console.log('Count is:', count());

  // Optional cleanup
  return () => {
    console.log('Cleaning up');
  };
});

count.set(5); // Logs: Count is: 5

stop(); // Stop effect and run cleanup
```

### batch()

Batch multiple signal updates to prevent unnecessary re-renders.

```typescript
function batch(updates: () => void): void;
```

**Parameters:**

- `updates`: Function containing signal updates

**Example:**

```typescript
import { signal, batch } from '@nadi/core';

const firstName = signal('John');
const lastName = signal('Doe');

batch(() => {
  firstName.set('Jane');
  lastName.set('Smith');
});
// Only triggers one update
```

### untrack()

Run code without tracking dependencies.

```typescript
function untrack<T>(fn: () => T): T;
```

**Parameters:**

- `fn`: Function to run without tracking

**Returns:** Result of the function

**Example:**

```typescript
import { signal, computed, untrack } from '@nadi/core';

const count = signal(0);
const other = signal(10);

const result = computed(() => {
  const c = count();
  // This won't be tracked as a dependency
  const o = untrack(() => other());
  return c + o;
});
```

## Rendering

### render()

Render a component tree to a DOM element.

```typescript
function render(component: () => JSX.Element, container: HTMLElement): void;
```

**Parameters:**

- `component`: Root component function
- `container`: DOM element to render into

**Example:**

```typescript
import { render } from '@nadi/core'

function App() {
  return <div>Hello World</div>
}

render(() => <App />, document.getElementById('app')!)
```

### hydrate()

Hydrate server-rendered HTML with interactivity.

```typescript
function hydrate(component: () => JSX.Element, container: HTMLElement, initialState?: any): void;
```

**Parameters:**

- `component`: Root component function
- `container`: DOM element containing server-rendered HTML
- `initialState`: Optional initial state from server

**Example:**

```typescript
import { hydrate } from '@nadi/core'

const initialState = window.__INITIAL_STATE__

hydrate(
  () => <App />,
  document.getElementById('app')!,
  initialState
)
```

## Server-Side Rendering

### renderToString()

Render component to HTML string (server-only).

```typescript
function renderToString(component: JSX.Element, initialState?: any): string;
```

**Parameters:**

- `component`: Component to render
- `initialState`: Optional state to serialize

**Returns:** HTML string

**Example:**

```typescript
import { renderToString } from '@nadi/core/server'

const html = renderToString(<App />, { user: { id: 1 } })
```

### renderToStream()

Render component to stream (server-only).

```typescript
function renderToStream(component: JSX.Element): ReadableStream;
```

**Parameters:**

- `component`: Component to render

**Returns:** ReadableStream of HTML

**Example:**

```typescript
import { renderToStream } from '@nadi/core/server'

const stream = renderToStream(<App />)
```

## JSX

### JSX.Element

Type for JSX elements.

```typescript
type JSX.Element = VNode | string | number | boolean | null | undefined
```

### JSX.IntrinsicElements

Type definitions for HTML elements.

```typescript
namespace JSX {
  interface IntrinsicElements {
    div: HTMLAttributes<HTMLDivElement>;
    span: HTMLAttributes<HTMLSpanElement>;
    button: ButtonHTMLAttributes<HTMLButtonElement>;
    input: InputHTMLAttributes<HTMLInputElement>;
    // ... all HTML elements
  }
}
```

### HTMLAttributes

Common HTML attributes.

```typescript
interface HTMLAttributes<T = HTMLElement> {
  class?: string;
  className?: string;
  id?: string;
  style?: CSSProperties | string;
  title?: string;
  role?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  'data-*'?: string;

  // Event handlers
  onclick?: (event: MouseEvent) => void;
  oninput?: (event: InputEvent) => void;
  onchange?: (event: Event) => void;
  onsubmit?: (event: Event) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  onkeyup?: (event: KeyboardEvent) => void;
  onfocus?: (event: FocusEvent) => void;
  onblur?: (event: FocusEvent) => void;

  // Children
  children?: JSX.Element | JSX.Element[];
}
```

### CSSProperties

CSS style properties.

```typescript
interface CSSProperties {
  display?: string;
  position?: string;
  top?: string | number;
  left?: string | number;
  width?: string | number;
  height?: string | number;
  margin?: string | number;
  padding?: string | number;
  color?: string;
  backgroundColor?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  // ... all CSS properties
}
```

## Component Types

### FunctionComponent

Type for function components.

```typescript
type FunctionComponent<P = {}> = (props: P) => JSX.Element;
```

**Example:**

```typescript
type ButtonProps = {
  label: string
  onClick: () => void
}

const Button: FunctionComponent<ButtonProps> = ({ label, onClick }) => {
  return <button onclick={onClick}>{label}</button>
}
```

### ComponentChildren

Type for component children.

```typescript
type ComponentChildren = JSX.Element | JSX.Element[];
```

## Utilities

### createContext()

Create a context for passing data through component tree.

```typescript
function createContext<T>(defaultValue: T): Context<T>;
```

**Parameters:**

- `defaultValue`: Default context value

**Returns:** Context object with Provider and Consumer

**Example:**

```typescript
import { createContext } from '@nadi/core'

const ThemeContext = createContext<'light' | 'dark'>('light')

function App() {
  const theme = signal<'light' | 'dark'>('dark')

  return (
    <ThemeContext.Provider value={theme()}>
      <Content />
    </ThemeContext.Provider>
  )
}

function Content() {
  const theme = useContext(ThemeContext)

  return <div class={theme}>Content</div>
}
```

### useContext()

Access context value in component.

```typescript
function useContext<T>(context: Context<T>): T;
```

**Parameters:**

- `context`: Context object

**Returns:** Current context value

### Fragment

Component for grouping elements without wrapper.

```typescript
const Fragment: FunctionComponent<{ children: ComponentChildren }>;
```

**Example:**

```typescript
import { Fragment } from '@nadi/core'

function List() {
  return (
    <Fragment>
      <li>Item 1</li>
      <li>Item 2</li>
    </Fragment>
  )
}

// Or use shorthand
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  )
}
```

### Portal

Render children into different DOM node.

```typescript
function Portal(props: { children: ComponentChildren; container: HTMLElement }): JSX.Element;
```

**Example:**

```typescript
import { Portal } from '@nadi/core'

function Modal({ children }) {
  return (
    <Portal container={document.body}>
      <div class="modal">{children}</div>
    </Portal>
  )
}
```

## Type Guards

### isSignal()

Check if value is a signal.

```typescript
function isSignal<T>(value: any): value is Signal<T>;
```

**Example:**

```typescript
import { signal, isSignal } from '@nadi/core';

const count = signal(0);
const value = 5;

console.log(isSignal(count)); // true
console.log(isSignal(value)); // false
```

## Constants

### VERSION

Current version of @nadi/core.

```typescript
const VERSION: string;
```

**Example:**

```typescript
import { VERSION } from '@nadi/core';

console.log('Nadi version:', VERSION);
```

## TypeScript

### Generic Types

```typescript
// Signal type
type Signal<T> = {
  (): T;
  get(): T;
  set(value: T): void;
  update(updater: (current: T) => T): void;
  subscribe(listener: (value: T) => void): Unsubscribe;
};

// Computed signal type
type ComputedSignal<T> = {
  (): T;
  get(): T;
  subscribe(listener: (value: T) => void): Unsubscribe;
};

// Unsubscribe function
type Unsubscribe = () => void;

// Component type
type Component<P = {}> = FunctionComponent<P>;
```

## Best Practices

✅ **Do:**

- Use signals for reactive state
- Use computed for derived values
- Use effects for side effects
- Batch related updates
- Clean up effects properly
- Type your components with TypeScript

❌ **Don't:**

- Mutate signal values directly
- Create effects inside loops
- Forget to unsubscribe from signals
- Use signals for constant values
- Create circular dependencies
- Access signals without calling them

## Next Steps

- Learn about [Signals](/guide/signals)
- Understand [Computed Values](/guide/computed)
- Explore [Effects](/guide/effects)
- Read about [Components](/guide/components)
