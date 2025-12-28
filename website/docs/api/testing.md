# @nadi/testing API Reference

Complete API reference for `@nadi/testing` - testing utilities for Nadi applications.

## Installation

```bash
npm install -D @nadi/testing vitest @testing-library/user-event
```

## Rendering

### render()

Render component for testing.

```typescript
function render(component: () => JSX.Element, options?: RenderOptions): RenderResult;
```

**Parameters:**

```typescript
interface RenderOptions {
  container?: HTMLElement;
  baseElement?: HTMLElement;
  wrapper?: Component;
  initialState?: any;
}
```

**Returns:** `RenderResult` object

**Example:**

```typescript
import { render } from '@nadi/testing'

test('renders counter', () => {
  const { getByText } = render(() => <Counter />)

  expect(getByText('Count: 0')).toBeInTheDocument()
})
```

### RenderResult

Object returned by `render()`.

```typescript
interface RenderResult {
  container: HTMLElement;
  baseElement: HTMLElement;
  debug: (element?: HTMLElement) => void;
  rerender: (component: () => JSX.Element) => void;
  unmount: () => void;
  asFragment: () => DocumentFragment;

  // Queries
  getBy: Queries;
  getAllBy: AllQueries;
  queryBy: Queries;
  queryAllBy: AllQueries;
  findBy: AsyncQueries;
  findAllBy: AsyncAllQueries;
}
```

### render() with Wrapper

```typescript
const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider theme="dark">
      <RouterProvider>
        {children}
      </RouterProvider>
    </ThemeProvider>
  )
}

const { getByText } = render(() => <Component />, {
  wrapper: AllTheProviders
})
```

## Queries

### getBy Queries

Get element, throw if not found.

```typescript
getByRole(role: string, options?: Options): HTMLElement
getByLabelText(text: string, options?: Options): HTMLElement
getByPlaceholderText(text: string, options?: Options): HTMLElement
getByText(text: string | RegExp, options?: Options): HTMLElement
getByDisplayValue(value: string, options?: Options): HTMLElement
getByAltText(text: string, options?: Options): HTMLElement
getByTitle(title: string, options?: Options): HTMLElement
getByTestId(testId: string, options?: Options): HTMLElement
```

**Example:**

```typescript
const button = getByRole('button', { name: 'Submit' });
const input = getByLabelText('Email');
const heading = getByText(/welcome/i);
```

### getAllBy Queries

Get all matching elements, throw if none found.

```typescript
getAllByRole(role: string, options?: Options): HTMLElement[]
getAllByLabelText(text: string, options?: Options): HTMLElement[]
getAllByText(text: string | RegExp, options?: Options): HTMLElement[]
// ... all getAllBy variants
```

**Example:**

```typescript
const buttons = getAllByRole('button');
const listItems = getAllByRole('listitem');
```

### queryBy Queries

Get element, return `null` if not found.

```typescript
queryByRole(role: string, options?: Options): HTMLElement | null
queryByLabelText(text: string, options?: Options): HTMLElement | null
queryByText(text: string | RegExp, options?: Options): HTMLElement | null
// ... all queryBy variants
```

**Example:**

```typescript
const button = queryByRole('button');
expect(button).toBeNull();
```

### queryAllBy Queries

Get all matching elements, return `[]` if none found.

```typescript
queryAllByRole(role: string, options?: Options): HTMLElement[]
// ... all queryAllBy variants
```

### findBy Queries

Async query, wait for element to appear.

```typescript
findByRole(role: string, options?: Options): Promise<HTMLElement>
findByLabelText(text: string, options?: Options): Promise<HTMLElement>
findByText(text: string | RegExp, options?: Options): Promise<HTMLElement>
// ... all findBy variants
```

**Example:**

```typescript
const message = await findByText('Data loaded');
```

### findAllBy Queries

Async query for multiple elements.

```typescript
findAllByRole(role: string, options?: Options): Promise<HTMLElement[]>
// ... all findAllBy variants
```

### Query Options

```typescript
interface Options {
  exact?: boolean; // Default: true
  normalizer?: (text: string) => string;
  selector?: string;
  suggest?: boolean;
  timeout?: number; // For findBy queries (default: 1000ms)
}
```

**Example:**

```typescript
// Case-insensitive search
getByText('hello', { exact: false });

// Custom timeout
await findByText('Loading...', { timeout: 3000 });
```

## User Interactions

### fireEvent

Dispatch DOM events.

```typescript
fireEvent.click(element: Element): boolean
fireEvent.change(element: Element, options: { target: { value: string } }): boolean
fireEvent.input(element: Element, options: { target: { value: string } }): boolean
fireEvent.submit(element: Element): boolean
fireEvent.focus(element: Element): boolean
fireEvent.blur(element: Element): boolean
fireEvent.keyDown(element: Element, options: { key: string }): boolean
fireEvent.keyUp(element: Element, options: { key: string }): boolean
```

**Example:**

```typescript
import { render, fireEvent } from '@nadi/testing'

test('button click', () => {
  const { getByRole } = render(() => <Counter />)
  const button = getByRole('button', { name: 'Increment' })

  fireEvent.click(button)

  expect(getByText('Count: 1')).toBeInTheDocument()
})
```

### userEvent

More realistic user interactions (recommended).

```typescript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

await user.click(element);
await user.type(element, 'text');
await user.clear(element);
await user.selectOptions(element, ['option1']);
await user.upload(element, file);
await user.hover(element);
await user.unhover(element);
await user.keyboard('{Enter}');
await user.paste('text');
```

**Example:**

```typescript
import { render } from '@nadi/testing'
import userEvent from '@testing-library/user-event'

test('form submission', async () => {
  const user = userEvent.setup()
  const { getByLabelText, getByRole } = render(() => <LoginForm />)

  await user.type(getByLabelText('Email'), 'user@example.com')
  await user.type(getByLabelText('Password'), 'password123')
  await user.click(getByRole('button', { name: 'Login' }))

  expect(await findByText('Welcome!')).toBeInTheDocument()
})
```

## Async Utilities

### waitFor()

Wait for assertion to pass.

```typescript
function waitFor<T>(callback: () => T | Promise<T>, options?: WaitOptions): Promise<T>;
```

**Options:**

```typescript
interface WaitOptions {
  timeout?: number; // Default: 1000ms
  interval?: number; // Default: 50ms
  onTimeout?: (error: Error) => Error;
}
```

**Example:**

```typescript
import { render, waitFor } from '@nadi/testing'

test('async data loading', async () => {
  const { getByText } = render(() => <DataComponent />)

  await waitFor(() => {
    expect(getByText('Data loaded')).toBeInTheDocument()
  })
})
```

### waitForElementToBeRemoved()

Wait for element to be removed from DOM.

```typescript
function waitForElementToBeRemoved<T>(callback: () => T, options?: WaitOptions): Promise<void>;
```

**Example:**

```typescript
const loader = getByText('Loading...');

await waitForElementToBeRemoved(() => getByText('Loading...'));

expect(getByText('Content')).toBeInTheDocument();
```

## Signal Testing

### renderSignal()

Render signal value for testing.

```typescript
function renderSignal<T>(signal: Signal<T>): RenderResult;
```

**Example:**

```typescript
import { signal } from '@nadi/core';
import { renderSignal } from '@nadi/testing';

test('signal reactivity', () => {
  const count = signal(0);
  const { container } = renderSignal(count);

  expect(container.textContent).toBe('0');

  count.set(5);
  expect(container.textContent).toBe('5');
});
```

### renderComputed()

Render computed value for testing.

```typescript
function renderComputed<T>(computed: ComputedSignal<T>): RenderResult;
```

**Example:**

```typescript
import { signal, computed } from '@nadi/core';
import { renderComputed } from '@nadi/testing';

test('computed reactivity', () => {
  const count = signal(5);
  const doubled = computed(() => count() * 2);

  const { container } = renderComputed(doubled);

  expect(container.textContent).toBe('10');

  count.set(10);
  expect(container.textContent).toBe('20');
});
```

## Mocking

### mockRouter()

Create mock router for testing.

```typescript
function mockRouter(options?: MockRouterOptions): Router;
```

**Options:**

```typescript
interface MockRouterOptions {
  currentRoute?: Partial<Route>;
  push?: jest.Mock;
  replace?: jest.Mock;
  go?: jest.Mock;
}
```

**Example:**

```typescript
import { mockRouter } from '@nadi/testing'

test('navigation', () => {
  const router = mockRouter({
    currentRoute: {
      path: '/home',
      params: {},
      query: {}
    }
  })

  const { getByRole } = render(() => <Navigation />, {
    wrapper: ({ children }) => (
      <RouterProvider router={router}>
        {children}
      </RouterProvider>
    )
  })

  const link = getByRole('link', { name: 'About' })
  fireEvent.click(link)

  expect(router.push).toHaveBeenCalledWith('/about')
})
```

### mockFetch()

Mock fetch API.

```typescript
function mockFetch(url: string | RegExp, response: any, options?: MockFetchOptions): void;
```

**Options:**

```typescript
interface MockFetchOptions {
  status?: number; // Default: 200
  statusText?: string;
  headers?: Record<string, string>;
  delay?: number; // Delay in ms
}
```

**Example:**

```typescript
import { mockFetch } from '@nadi/testing'

test('data fetching', async () => {
  mockFetch('/api/users', [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ])

  const { findByText } = render(() => <UserList />)

  expect(await findByText('John')).toBeInTheDocument()
  expect(await findByText('Jane')).toBeInTheDocument()
})
```

## Testing Hooks

### renderHook()

Test custom hooks.

```typescript
function renderHook<T>(hook: () => T, options?: RenderHookOptions): RenderHookResult<T>;
```

**Returns:**

```typescript
interface RenderHookResult<T> {
  result: { current: T };
  rerender: (hook?: () => T) => void;
  unmount: () => void;
}
```

**Example:**

```typescript
import { renderHook } from '@nadi/testing';

function useCounter(initial = 0) {
  const count = signal(initial);
  const increment = () => count.set(count() + 1);
  return { count, increment };
}

test('custom hook', () => {
  const { result } = renderHook(() => useCounter(5));

  expect(result.current.count()).toBe(5);

  result.current.increment();
  expect(result.current.count()).toBe(6);
});
```

## Debugging

### debug()

Print DOM structure to console.

```typescript
debug(element?: HTMLElement): void
```

**Example:**

```typescript
const { debug, getByRole } = render(() => <Component />)

debug()  // Print entire container

const button = getByRole('button')
debug(button)  // Print specific element
```

### screen

Global queries on document.body.

```typescript
import { screen } from '@nadi/testing'

test('component', () => {
  render(() => <Component />)

  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### prettyDOM()

Format DOM element as string.

```typescript
function prettyDOM(element: Element, maxLength?: number): string;
```

**Example:**

```typescript
import { prettyDOM } from '@nadi/testing';

const html = prettyDOM(element, 1000);
console.log(html);
```

## Custom Matchers

### toBeInTheDocument()

Check if element is in the document.

```typescript
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();
```

### toHaveTextContent()

Check element text content.

```typescript
expect(element).toHaveTextContent('Hello');
expect(element).toHaveTextContent(/hello/i);
```

### toHaveAttribute()

Check element attribute.

```typescript
expect(element).toHaveAttribute('href', '/home');
expect(element).toHaveAttribute('disabled');
```

### toHaveClass()

Check element CSS class.

```typescript
expect(element).toHaveClass('active');
expect(element).toHaveClass('btn', 'primary');
```

### toBeDisabled() / toBeEnabled()

Check if element is disabled/enabled.

```typescript
expect(button).toBeDisabled();
expect(input).toBeEnabled();
```

### toBeVisible()

Check if element is visible.

```typescript
expect(element).toBeVisible();
expect(element).not.toBeVisible();
```

### toHaveValue()

Check input value.

```typescript
expect(input).toHaveValue('john@example.com');
expect(input).toHaveValue(42);
```

## Best Practices

✅ **Do:**

- Query by role/label when possible
- Use userEvent over fireEvent
- Wait for async updates with waitFor
- Test user behavior, not implementation
- Use semantic queries (role, label)
- Clean up after tests
- Mock external dependencies

❌ **Don't:**

- Query by class names or IDs
- Test implementation details
- Use long timeouts
- Forget to await async operations
- Test signal internals
- Skip accessibility testing
- Rely on snapshot tests alone

## Next Steps

- Learn about [Testing](/guide/testing)
- Explore [Testing Best Practices](/guide/testing#best-practices)
- Understand [Async Testing](/guide/testing#async-testing)
- Read about [Component Testing](/guide/testing#component-testing)
