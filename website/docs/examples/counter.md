# Counter Example

A simple interactive counter demonstrating Nadi's reactive primitives.

## Live Demo

<div class="demo-container">
  <iframe src="/examples/counter.html" width="100%" height="200px"></iframe>
</div>

## Basic Counter

The simplest possible Nadi application - a counter with increment and decrement buttons.

```typescript
import { signal, render } from '@nadi/core'

function Counter() {
  const count = signal(0)

  return (
    <div class="counter">
      <h1>Count: {count()}</h1>
      <button onclick={() => count.set(count() - 1)}>-</button>
      <button onclick={() => count.set(count() + 1)}>+</button>
    </div>
  )
}

render(() => <Counter />, document.getElementById('app')!)
```

## Counter with Step

Add a step input to control increment/decrement amount.

```typescript
import { signal } from '@nadi/core'

function StepCounter() {
  const count = signal(0)
  const step = signal(1)

  const increment = () => count.set(count() + step())
  const decrement = () => count.set(count() - step())

  return (
    <div class="counter">
      <h1>Count: {count()}</h1>

      <div class="controls">
        <button onclick={decrement}>- {step()}</button>
        <button onclick={increment}>+ {step()}</button>
      </div>

      <div class="step-control">
        <label>Step: </label>
        <input
          type="number"
          value={step()}
          oninput={(e) => step.set(Number((e.target as HTMLInputElement).value))}
          min="1"
        />
      </div>
    </div>
  )
}
```

## Counter with History

Track counter history with undo/redo functionality.

```typescript
import { signal, computed } from '@nadi/core'

function HistoryCounter() {
  const history = signal<number[]>([0])
  const currentIndex = signal(0)

  const count = computed(() => history()[currentIndex()])

  const increment = () => {
    const newHistory = history().slice(0, currentIndex() + 1)
    newHistory.push(count() + 1)
    history.set(newHistory)
    currentIndex.set(newHistory.length - 1)
  }

  const decrement = () => {
    const newHistory = history().slice(0, currentIndex() + 1)
    newHistory.push(count() - 1)
    history.set(newHistory)
    currentIndex.set(newHistory.length - 1)
  }

  const undo = () => {
    if (currentIndex() > 0) {
      currentIndex.set(currentIndex() - 1)
    }
  }

  const redo = () => {
    if (currentIndex() < history().length - 1) {
      currentIndex.set(currentIndex() + 1)
    }
  }

  const canUndo = computed(() => currentIndex() > 0)
  const canRedo = computed(() => currentIndex() < history().length - 1)

  return (
    <div class="counter">
      <h1>Count: {count()}</h1>

      <div class="controls">
        <button onclick={decrement}>-</button>
        <button onclick={increment}>+</button>
      </div>

      <div class="history-controls">
        <button onclick={undo} disabled={!canUndo()}>
          Undo
        </button>
        <button onclick={redo} disabled={!canRedo()}>
          Redo
        </button>
      </div>

      <div class="history">
        History: {history().join(' → ')}
      </div>
    </div>
  )
}
```

## Counter with Auto-Save

Persist counter value to localStorage.

```typescript
import { signal, effect } from '@nadi/core'

function PersistentCounter() {
  // Load from localStorage
  const saved = localStorage.getItem('counter')
  const count = signal(saved ? Number(saved) : 0)

  // Save to localStorage on change
  effect(() => {
    localStorage.setItem('counter', String(count()))
  })

  const increment = () => count.set(count() + 1)
  const decrement = () => count.set(count() - 1)
  const reset = () => count.set(0)

  return (
    <div class="counter">
      <h1>Count: {count()}</h1>

      <div class="controls">
        <button onclick={decrement}>-</button>
        <button onclick={increment}>+</button>
        <button onclick={reset}>Reset</button>
      </div>

      <p class="info">Counter is automatically saved</p>
    </div>
  )
}
```

## Multi-Counter

Multiple independent counters.

```typescript
import { signal } from '@nadi/core'

function CounterItem({ id, onRemove }: { id: number; onRemove: () => void }) {
  const count = signal(0)

  return (
    <div class="counter-item">
      <span>Counter #{id}: {count()}</span>
      <button onclick={() => count.set(count() - 1)}>-</button>
      <button onclick={() => count.set(count() + 1)}>+</button>
      <button onclick={onRemove}>Remove</button>
    </div>
  )
}

function MultiCounter() {
  const counters = signal<number[]>([1])
  const nextId = signal(2)

  const addCounter = () => {
    counters.set([...counters(), nextId()])
    nextId.set(nextId() + 1)
  }

  const removeCounter = (id: number) => {
    counters.set(counters().filter(c => c !== id))
  }

  const totalCounters = computed(() => counters().length)

  return (
    <div class="multi-counter">
      <h2>Total Counters: {totalCounters()}</h2>

      <button onclick={addCounter}>Add Counter</button>

      <div class="counters">
        {counters().map(id => (
          <CounterItem
            key={id}
            id={id}
            onRemove={() => removeCounter(id)}
          />
        ))}
      </div>
    </div>
  )
}
```

## Animated Counter

Counter with smooth animation.

```typescript
import { signal, effect } from '@nadi/core'

function AnimatedCounter() {
  const targetCount = signal(0)
  const displayCount = signal(0)

  effect(() => {
    const target = targetCount()
    const current = displayCount()

    if (current === target) return

    const duration = 500  // ms
    const steps = 50
    const stepValue = (target - current) / steps
    const stepTime = duration / steps

    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++

      if (currentStep >= steps) {
        displayCount.set(target)
        clearInterval(timer)
      } else {
        displayCount.set(Math.round(current + stepValue * currentStep))
      }
    }, stepTime)

    return () => clearInterval(timer)
  })

  const increment = () => targetCount.set(targetCount() + 1)
  const decrement = () => targetCount.set(targetCount() - 1)

  return (
    <div class="counter animated">
      <h1 class="count-display">{displayCount()}</h1>

      <div class="controls">
        <button onclick={decrement}>-</button>
        <button onclick={increment}>+</button>
      </div>
    </div>
  )
}
```

## Styling

```css
.counter {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.counter h1 {
  font-size: 3rem;
  margin: 0 0 1rem;
  color: #333;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.controls button {
  padding: 0.75rem 1.5rem;
  font-size: 1.5rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.controls button:hover {
  background: #0056b3;
}

.controls button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.step-control {
  margin-top: 1rem;
}

.step-control input {
  width: 60px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.history {
  margin-top: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  font-family: monospace;
}

.counter-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.count-display {
  font-size: 4rem;
  font-weight: bold;
  transition: transform 0.2s;
}

.animated .count-display {
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}
```

## Testing

```typescript
import { render, fireEvent } from '@nadi/testing'

describe('Counter', () => {
  test('increments and decrements', () => {
    const { getByText, getByRole } = render(() => <Counter />)

    expect(getByText('Count: 0')).toBeInTheDocument()

    const incrementBtn = getByRole('button', { name: '+' })
    const decrementBtn = getByRole('button', { name: '-' })

    fireEvent.click(incrementBtn)
    expect(getByText('Count: 1')).toBeInTheDocument()

    fireEvent.click(incrementBtn)
    expect(getByText('Count: 2')).toBeInTheDocument()

    fireEvent.click(decrementBtn)
    expect(getByText('Count: 1')).toBeInTheDocument()
  })

  test('supports custom step', () => {
    const { getByText, getByRole, getByLabelText } = render(() => <StepCounter />)

    const stepInput = getByLabelText('Step:')
    const incrementBtn = getByRole('button', { name: /\+/ })

    // Change step to 5
    fireEvent.input(stepInput, { target: { value: '5' } })

    // Click increment
    fireEvent.click(incrementBtn)
    expect(getByText('Count: 5')).toBeInTheDocument()

    fireEvent.click(incrementBtn)
    expect(getByText('Count: 10')).toBeInTheDocument()
  })
})
```

## Key Concepts

- **Signals**: Reactive state management with `signal()`
- **Updates**: Direct updates with `set()` or functional updates with `update()`
- **Effects**: Side effects with `effect()` for persistence, animations
- **Computed**: Derived values with `computed()`
- **Event Handling**: Direct event listeners with `onclick`

## Try It Yourself

1. Add a reset button
2. Implement min/max limits
3. Add keyboard shortcuts
4. Create a countdown timer
5. Add sound effects on click

## Next Steps

- Learn about [Signals](/guide/signals)
- Explore [Effects](/guide/effects)
- Build a [Todo App](/examples/todo)
- Read [Testing Guide](/guide/testing)
