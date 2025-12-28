# @nadi/testing

Testing utilities for Nadi framework components.

## Installation

```bash
npm install -D @nadi/testing vitest @vitest/ui
```

## Features

- 🧪 Component mounting and rendering
- 🔍 Query utilities for finding elements
- 🎭 Event simulation
- ⏱️ Async utilities (waitFor, waitForElementToBeRemoved)
- 🎯 Signal mocking and spying
- 🧹 Automatic cleanup

## Usage

```typescript
import { describe, it, expect } from 'vitest';
import { renderComponent, fireEvent, waitFor, screen } from '@nadi/testing';
import { signal } from '@nadi/core';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders and updates on signal change', async () => {
    const [count, setCount] = signal(0);

    const { container, unmount } = renderComponent(() => (
      <div>
        <span data-testid="count">{count()}</span>
        <button onClick={() => setCount(count() + 1)}>Increment</button>
      </div>
    ));

    expect(screen.getByTestId('count').textContent).toBe('0');

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('1');
    });

    unmount();
  });
});
```

## API

### `renderComponent(component, options?)`

Renders a component in a test environment.

**Returns:**

- `container`: The DOM container element
- `unmount()`: Function to unmount and cleanup
- `rerender(newComponent)`: Function to re-render with new component

### `fireEvent`

Simulate DOM events:

- `fireEvent.click(element)`
- `fireEvent.input(element, { target: { value: 'text' } })`
- `fireEvent.submit(form)`
- `fireEvent.keyDown(element, { key: 'Enter' })`

### `waitFor(callback, options?)`

Wait for an assertion to pass.

```typescript
await waitFor(
  () => {
    expect(screen.getByText('Loaded')).toBeTruthy();
  },
  { timeout: 3000 }
);
```

### `screen`

Query utilities from @testing-library/dom:

- `screen.getByText(text)`
- `screen.getByRole(role)`
- `screen.getByTestId(testId)`
- `screen.queryByText(text)` (returns null if not found)
- `screen.findByText(text)` (async, waits for element)

### `mockSignal(initialValue)`

Create a mock signal for testing:

```typescript
import { mockSignal } from '@nadi/testing';

const [count, setCount, spy] = mockSignal(0);

setCount(5);
expect(spy.calls).toEqual([[5]]);
expect(spy.callCount).toBe(1);
```

### `flushEffects()`

Synchronously flush all pending effects:

```typescript
import { flushEffects } from '@nadi/testing';

effect(() => console.log('will run'));
flushEffects(); // Forces immediate execution
```

### `createTestRoot(fn)`

Create an isolated reactive scope for testing:

```typescript
import { createTestRoot } from '@nadi/testing';

const dispose = createTestRoot(() => {
  const [state] = signal(0);
  // ... test code
});

dispose(); // Cleanup all effects
```

## Best Practices

1. **Always cleanup**: Call `unmount()` or use `afterEach`
2. **Use data-testid**: For reliable element selection
3. **Wait for async updates**: Use `waitFor` for signal-driven updates
4. **Mock external dependencies**: Use `mockSignal` for props
5. **Test behavior, not implementation**: Focus on user interactions

## Example: Testing a Form

```typescript
import { describe, it, expect } from 'vitest';
import { renderComponent, fireEvent, waitFor, screen } from '@nadi/testing';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('submits form with valid credentials', async () => {
    const onSubmit = vi.fn();

    renderComponent(() => <LoginForm onSubmit={onSubmit} />);

    fireEvent.input(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });

    fireEvent.input(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

## License

MIT
