# Testing

Nadi provides a comprehensive testing library that makes it easy to test components, signals, and application logic with utilities for rendering, querying, and simulating user interactions.

## Installation

```bash
npm install --save-dev @nadi/testing vitest @testing-library/jest-dom
```

## Setup

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
  },
});
```

### Setup File

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@nadi/testing';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## Basic Testing

### Testing Components

```typescript
import { render, screen } from '@nadi/testing'
import { describe, test, expect } from 'vitest'

function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

describe('Greeting', () => {
  test('renders greeting message', () => {
    render(<Greeting name="John" />)

    expect(screen.getByText('Hello, John!')).toBeInTheDocument()
  })

  test('renders with different name', () => {
    render(<Greeting name="Jane" />)

    expect(screen.getByText('Hello, Jane!')).toBeInTheDocument()
  })
})
```

### Testing Signals

```typescript
import { signal } from '@nadi/core';
import { renderHook } from '@nadi/testing';

test('signal updates value', () => {
  const { result } = renderHook(() => signal(0));
  const [count, setCount] = result.current;

  expect(count()).toBe(0);

  setCount(5);
  expect(count()).toBe(5);

  setCount((prev) => prev + 1);
  expect(count()).toBe(6);
});
```

## Rendering Components

### render()

Renders a component and returns testing utilities:

```typescript
import { render } from '@nadi/testing'

test('renders component', () => {
  const { container, getByText, queryByText } = render(
    <div>
      <h1>Hello</h1>
      <p>World</p>
    </div>
  )

  expect(container).toBeTruthy()
  expect(getByText('Hello')).toBeInTheDocument()
  expect(queryByText('Goodbye')).toBeNull()
})
```

### With Props

```typescript
function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onclick={onClick}>{label}</button>
}

test('renders button with label', () => {
  const handleClick = vi.fn()

  const { getByText } = render(
    <Button label="Click me" onClick={handleClick} />
  )

  expect(getByText('Click me')).toBeInTheDocument()
})
```

### Rerender

Update props and rerender:

```typescript
test('rerenders with new props', () => {
  const { rerender, getByText } = render(
    <Greeting name="John" />
  )

  expect(getByText('Hello, John!')).toBeInTheDocument()

  rerender(<Greeting name="Jane" />)

  expect(getByText('Hello, Jane!')).toBeInTheDocument()
})
```

## Querying Elements

### getBy\* Queries

Throw error if not found:

```typescript
const { getByText, getByRole, getByLabelText } = render(<Component />)

getByText('Submit')              // By text content
getByRole('button')              // By ARIA role
getByLabelText('Email')          // By label text
getByPlaceholderText('Enter...')  // By placeholder
getByAltText('Avatar')           // By alt text
getByTitle('Close')              // By title
getByTestId('submit-btn')        // By data-testid
```

### queryBy\* Queries

Return null if not found:

```typescript
const { queryByText } = render(<Component />)

const element = queryByText('Optional Text')

if (element) {
  expect(element).toBeVisible()
} else {
  // Element doesn't exist
}
```

### findBy\* Queries

Async queries that wait for element:

```typescript
test('finds async element', async () => {
  const { findByText } = render(<AsyncComponent />)

  // Waits up to 1000ms (default)
  const element = await findByText('Loaded')

  expect(element).toBeInTheDocument()
})
```

### getAllBy\* Queries

Find multiple elements:

```typescript
test('finds all items', () => {
  const { getAllByRole } = render(
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  )

  const items = getAllByRole('listitem')
  expect(items).toHaveLength(3)
})
```

## User Interactions

### fireEvent

Simulate DOM events:

```typescript
import { render, fireEvent } from '@nadi/testing'

test('handles button click', () => {
  const handleClick = vi.fn()

  const { getByText } = render(
    <button onclick={handleClick}>Click me</button>
  )

  const button = getByText('Click me')
  fireEvent.click(button)

  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Input Events

```typescript
test('handles input change', () => {
  const [value, setValue] = signal('')

  const { getByRole } = render(
    <input
      value={value()}
      oninput={(e) => setValue((e.target as HTMLInputElement).value)}
    />
  )

  const input = getByRole('textbox')

  fireEvent.input(input, { target: { value: 'test' } })

  expect(value()).toBe('test')
})
```

### Form Submission

```typescript
test('handles form submission', () => {
  const handleSubmit = vi.fn((e) => e.preventDefault())

  const { getByRole } = render(
    <form onsubmit={handleSubmit}>
      <input name="email" />
      <button type="submit">Submit</button>
    </form>
  )

  const form = getByRole('form')
  fireEvent.submit(form)

  expect(handleSubmit).toHaveBeenCalled()
})
```

### userEvent

More realistic user interactions:

```typescript
import { render } from '@nadi/testing'
import userEvent from '@testing-library/user-event'

test('types in input', async () => {
  const user = userEvent.setup()
  const [value, setValue] = signal('')

  const { getByRole } = render(
    <input
      value={value()}
      oninput={(e) => setValue((e.target as HTMLInputElement).value)}
    />
  )

  await user.type(getByRole('textbox'), 'Hello World')

  expect(value()).toBe('Hello World')
})
```

## Async Testing

### waitFor

Wait for assertions to pass:

```typescript
import { render, waitFor } from '@nadi/testing'

test('loads data', async () => {
  const { getByText } = render(<AsyncComponent />)

  await waitFor(() => {
    expect(getByText('Loaded')).toBeInTheDocument()
  })
})
```

### waitForElementToBeRemoved

Wait for element to disappear:

```typescript
test('removes loading spinner', async () => {
  const { getByText, queryByText } = render(<Component />)

  expect(getByText('Loading...')).toBeInTheDocument()

  await waitForElementToBeRemoved(() => queryByText('Loading...'))

  expect(queryByText('Loading...')).toBeNull()
})
```

### Testing Effects

```typescript
test('runs effect on mount', async () => {
  const effect = vi.fn()

  function Component() {
    onMount(() => {
      effect()
    })
    return <div>Content</div>
  }

  render(<Component />)

  await waitFor(() => {
    expect(effect).toHaveBeenCalled()
  })
})
```

## Testing Forms

### Form Validation

```typescript
import { createForm } from '@nadi/forms'

test('validates email field', async () => {
  const form = createForm({
    initialValues: { email: '' },
    validationRules: { email: ['required', 'email'] }
  })

  const { getByLabelText, getByText } = render(
    <FormComponent form={form} />
  )

  const input = getByLabelText('Email')

  fireEvent.input(input, { target: { value: 'invalid' } })
  fireEvent.blur(input)

  await waitFor(() => {
    expect(getByText(/valid email/i)).toBeInTheDocument()
  })
})
```

### Form Submission

```typescript
test('submits form', async () => {
  const onSubmit = vi.fn()

  const form = createForm({
    initialValues: { email: '', password: '' },
    onSubmit
  })

  const { getByLabelText, getByText } = render(
    <LoginForm form={form} />
  )

  fireEvent.input(getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  })
  fireEvent.input(getByLabelText('Password'), {
    target: { value: 'password123' }
  })

  fireEvent.click(getByText('Submit'))

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })
})
```

## Testing Router

### With Router

```typescript
import { createRouter } from '@nadi/router'
import { render } from '@nadi/testing'

test('navigates to route', async () => {
  const router = createRouter({
    routes: [
      { path: '/', component: HomePage },
      { path: '/about', component: AboutPage }
    ]
  })

  const { getByText } = render(<App router={router} />)

  fireEvent.click(getByText('About'))

  await waitFor(() => {
    expect(getByText('About Page')).toBeInTheDocument()
  })
})
```

### Testing Navigation

```typescript
test('changes route on navigation', () => {
  const router = createRouter({
    routes: [
      { path: '/', component: HomePage },
      { path: '/users/:id', component: UserPage },
    ],
  });

  router.push('/users/123');

  expect(router.location().path).toBe('/users/123');
  expect(router.params()).toEqual({ id: '123' });
});
```

## Mocking

### Mocking Functions

```typescript
import { vi } from 'vitest'

test('calls onClick handler', () => {
  const handleClick = vi.fn()

  const { getByText } = render(
    <button onclick={handleClick}>Click</button>
  )

  fireEvent.click(getByText('Click'))

  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### Mocking API Calls

```typescript
global.fetch = vi.fn()

test('fetches data', async () => {
  const mockData = { name: 'John', email: 'john@example.com' }

  (fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => mockData
  })

  const { findByText } = render(<UserProfile userId="123" />)

  expect(fetch).toHaveBeenCalledWith('/api/users/123')

  await findByText('John')
})
```

### Mocking Modules

```typescript
vi.mock('@/api/users', () => ({
  fetchUser: vi.fn().mockResolvedValue({
    id: 1,
    name: 'John'
  })
}))

test('uses mocked API', async () => {
  const { findByText } = render(<UserProfile userId="1" />)

  await findByText('John')
})
```

## Testing Hooks

### renderHook

Test custom hooks:

```typescript
import { renderHook } from '@nadi/testing';

function useCounter(initial = 0) {
  const [count, setCount] = signal(initial);

  const increment = () => setCount(count() + 1);
  const decrement = () => setCount(count() - 1);

  return { count, increment, decrement };
}

test('useCounter hook', () => {
  const { result } = renderHook(() => useCounter(5));

  expect(result.current.count()).toBe(5);

  result.current.increment();
  expect(result.current.count()).toBe(6);

  result.current.decrement();
  expect(result.current.count()).toBe(5);
});
```

### Hook with Dependencies

```typescript
test('updates hook with new props', () => {
  const { result, rerender } = renderHook(({ initial }) => useCounter(initial), {
    initialProps: { initial: 0 },
  });

  expect(result.current.count()).toBe(0);

  rerender({ initial: 10 });

  expect(result.current.count()).toBe(10);
});
```

## Snapshot Testing

```typescript
test('matches snapshot', () => {
  const { container } = render(
    <Card title="Test" description="Description" />
  )

  expect(container).toMatchSnapshot()
})
```

## Coverage

### Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '*.config.ts'],
    },
  },
});
```

### Run with Coverage

```bash
vitest run --coverage
```

## Integration Testing

### Full App Test

```typescript
test('full user flow', async () => {
  const { getByLabelText, getByText, findByText } = render(<App />)

  // Login
  fireEvent.input(getByLabelText('Email'), {
    target: { value: 'user@example.com' }
  })
  fireEvent.input(getByLabelText('Password'), {
    target: { value: 'password' }
  })
  fireEvent.click(getByText('Login'))

  // Wait for dashboard
  await findByText('Dashboard')

  // Navigate to profile
  fireEvent.click(getByText('Profile'))

  await findByText('User Profile')
})
```

## E2E Testing

### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
});
```

### E2E Test

```typescript
import { test, expect } from '@playwright/test';

test('user can sign up', async ({ page }) => {
  await page.goto('/');

  await page.click('text=Sign Up');

  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toHaveText('Welcome');
});
```

## Best Practices

### ✅ Do

- Test user behavior, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Wait for async operations
- Clean up after tests
- Mock external dependencies
- Test edge cases and errors

### ❌ Don't

- Test implementation details
- Use getByTestId as first choice
- Access component internals directly
- Forget to wait for async updates
- Write tests that depend on each other
- Mock everything

## Testing Patterns

### Arrange-Act-Assert

```typescript
test('increments counter', () => {
  // Arrange
  const { getByText, getByRole } = render(<Counter />)

  // Act
  fireEvent.click(getByText('Increment'))

  // Assert
  expect(getByRole('status')).toHaveTextContent('1')
})
```

### Custom Render

```typescript
function renderWithProviders(
  ui: JSX.Element,
  { initialRoute = '/', ...options } = {}
) {
  const router = createRouter({ routes: [...] })
  router.push(initialRoute)

  return render(
    <RouterProvider router={router}>
      {ui}
    </RouterProvider>,
    options
  )
}

test('with custom render', () => {
  const { getByText } = renderWithProviders(
    <App />,
    { initialRoute: '/dashboard' }
  )

  expect(getByText('Dashboard')).toBeInTheDocument()
})
```

### Test Utilities

```typescript
// tests/utils.ts
export function fillForm(
  container: HTMLElement,
  values: Record<string, string>
) {
  Object.entries(values).forEach(([name, value]) => {
    const input = container.querySelector(`[name="${name}"]`) as HTMLInputElement
    fireEvent.input(input, { target: { value } })
  })
}

// Usage
test('submits form', () => {
  const { container, getByText } = render(<LoginForm />)

  fillForm(container, {
    email: 'user@example.com',
    password: 'password123'
  })

  fireEvent.click(getByText('Submit'))
})
```

## Debugging Tests

### debug()

Print DOM structure:

```typescript
test('debugging', () => {
  const { debug } = render(<Component />)

  debug() // Prints entire DOM
})
```

### screen.logTestingPlaygroundURL()

Get Testing Playground URL:

```typescript
import { screen } from '@nadi/testing'

test('find queries', () => {
  render(<Component />)

  screen.logTestingPlaygroundURL()
  // Opens browser with query suggestions
})
```

## Performance Testing

```typescript
test('renders large list efficiently', () => {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
  }))

  const start = performance.now()

  render(<LargeList items={items} />)

  const duration = performance.now() - start

  expect(duration).toBeLessThan(1000) // Should render in < 1s
})
```

## Next Steps

- Learn about [DevTools](/guide/devtools) for debugging
- Understand [Performance](/guide/performance) optimization
- Explore [E2E Testing](/guide/e2e) with Playwright
- Read the [Testing API Reference](/api/testing)
