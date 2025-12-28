# DevTools

The Nadi DevTools browser extension provides powerful debugging capabilities for inspecting component trees, tracking signal updates, monitoring performance, and debugging your Nadi applications.

## Installation

### Chrome Web Store

```
Coming soon: Search for "Nadi DevTools" in the Chrome Web Store
```

### Firefox Add-ons

```
Coming soon: Search for "Nadi DevTools" in Firefox Add-ons
```

### Manual Installation

1. Clone the repository:

```bash
git clone https://github.com/nadiframework/nadi
cd nadi/devtools/extension
```

2. Install dependencies:

```bash
npm install
npm run build
```

3. Load in browser:
   - **Chrome**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select `dist/` folder
   - **Firefox**: Go to `about:debugging`, click "Load Temporary Add-on", select `manifest.json`

## Features

### Component Tree Inspector

View the complete component hierarchy of your application:

- **Tree View** - Hierarchical display of all components
- **Component Details** - Props, state, and computed values
- **Component Highlighting** - Hover to highlight in page
- **Search & Filter** - Find components quickly

### Signal Tracking

Monitor all signals and their values in real-time:

- **Signal List** - All signals with current values
- **Value History** - Track changes over time
- **Update Source** - See what triggered updates
- **Dependency Graph** - Visualize signal relationships

### Performance Profiler

Analyze rendering performance:

- **Render Timeline** - When components render
- **Update Frequency** - How often signals change
- **Render Duration** - Time spent rendering
- **Bottleneck Detection** - Find slow components

### Time Travel Debugging

Step through application state changes:

- **State History** - Record all state changes
- **Replay Actions** - Go back/forward in time
- **State Snapshots** - Save and restore states
- **Action Log** - See all state modifications

### Network Monitor

Track API calls and WebSocket connections:

- **Request List** - All HTTP requests
- **Response Preview** - View response data
- **WebSocket Messages** - Real-time message log
- **Request Timing** - Performance metrics

## Using DevTools

### Opening DevTools

1. Open your Nadi application in Chrome/Firefox
2. Open browser DevTools (F12 or Cmd+Option+I on Mac)
3. Click the "Nadi" tab

### Component Inspector

#### Selecting Components

- **Click in page** - Inspect element mode
- **Click in tree** - Select from component tree
- **Search** - Find by name or prop

#### Viewing Component Details

```typescript
// Selected component
{
  name: "TodoItem",
  props: {
    todo: { id: 1, text: "Learn Nadi", done: false },
    onToggle: Function,
    onDelete: Function
  },
  signals: {
    isHovered: false,
    isEditing: false
  },
  computed: {
    className: "todo-item"
  }
}
```

#### Editing Props/State

Right-click on any value to edit:

- **Edit Value** - Change prop or state
- **Copy Value** - Copy to clipboard
- **Copy Path** - Copy property path
- **Store as Global** - Save to `window.$nadi0`, `$nadi1`, etc.

### Signal Inspector

#### Viewing Signals

```typescript
// All signals in application
[
  {
    name: 'count',
    value: 5,
    updates: 12,
    subscribers: 3,
    source: 'Counter.tsx:10',
  },
  {
    name: 'user',
    value: { name: 'John', email: 'john@example.com' },
    updates: 1,
    subscribers: 5,
    source: 'App.tsx:25',
  },
];
```

#### Signal Details

- **Current Value** - Real-time value display
- **Update Count** - How many times updated
- **Subscribers** - What's watching this signal
- **Source Location** - Where signal was created
- **Update History** - Timeline of value changes

#### Dependency Graph

Visualize how signals depend on each other:

```
count (signal)
  └─> doubled (computed)
      └─> display (effect)
```

### Performance Profiler

#### Recording a Profile

1. Click "Record" button
2. Interact with your application
3. Click "Stop" to view results

#### Analyzing Results

- **Flame Chart** - Visual representation of render times
- **Component List** - Sorted by render duration
- **Update Count** - How many times each component rendered
- **Total Time** - Cumulative render time

#### Identifying Bottlenecks

Look for:

- Components with long render times
- Components that render too frequently
- Unnecessary re-renders
- Heavy computed values

### Time Travel

#### Recording State

Click "Enable Time Travel" to start recording:

- All signal updates are recorded
- Component renders are tracked
- Actions are logged

#### Navigating History

- **Previous/Next** - Step through changes
- **Jump to Change** - Click on timeline
- **Replay from Point** - Restart from any state

#### State Snapshots

Save and restore application state:

- **Save Snapshot** - Capture current state
- **Load Snapshot** - Restore saved state
- **Export/Import** - Share snapshots as JSON

## Integration

### Enabling DevTools Support

DevTools are automatically enabled in development. To disable:

```typescript
// main.ts
import { render } from '@nadi/core'

render(() => <App />, document.getElementById('app'), {
  devtools: false // Disable DevTools
})
```

### Custom Component Names

Add display names for better debugging:

```typescript
function MyComponent() {
  return <div>Content</div>
}

// Add display name
MyComponent.displayName = 'MyComponent'

// Or use function name
export function TodoItem() { // Automatically uses "TodoItem"
  return <li>...</li>
}
```

### Signal Labels

Label signals for easier identification:

```typescript
import { signal } from '@nadi/core';

const [count, setCount] = signal(0, {
  label: 'counter',
  debugValue: (value) => `Count: ${value}`,
});
```

### Component Tags

Add metadata for DevTools:

```typescript
function UserProfile({ user }: { user: User }) {
  // DevTools will show this component with user.id
  return <div data-nadi-id={user.id}>...</div>
}
```

## Debugging Techniques

### Logging Signal Changes

```typescript
import { effect } from '@nadi/core';

const [count, setCount] = signal(0);

if (import.meta.env.DEV) {
  effect(() => {
    console.log('Count changed:', count());
  });
}
```

### Breakpoint on Update

Set breakpoints in DevTools when signals change:

1. Right-click signal in DevTools
2. Select "Break on update"
3. Debugger will pause when signal changes

### Component Boundaries

Add error boundaries for better debugging:

```typescript
import { ErrorBoundary } from '@nadi/core'

function App() {
  return (
    <ErrorBoundary fallback={(error, reset) => (
      <div>
        <h1>Error: {error.message}</h1>
        <button onclick={reset}>Retry</button>
      </div>
    )}>
      <Main />
    </ErrorBoundary>
  )
}
```

## Production Debugging

### Source Maps

Enable source maps for production debugging:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true,
  },
});
```

### Error Reporting

Integrate with error tracking services:

```typescript
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: 'your-dsn',
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
})

// Catch Nadi errors
function App() {
  return (
    <ErrorBoundary fallback={(error) => {
      Sentry.captureException(error)
      return <ErrorPage />
    }}>
      <Main />
    </ErrorBoundary>
  )
}
```

### Remote DevTools

Enable DevTools in production for debugging:

```typescript
// Only for authorized users
const enableDevTools =
  import.meta.env.PROD &&
  localStorage.getItem('debug') === 'true'

render(() => <App />, root, {
  devtools: enableDevTools
})
```

## DevTools API

### Accessing DevTools Programmatically

```typescript
// Get DevTools instance
const devtools = window.__NADI_DEVTOOLS__;

// Log to DevTools console
devtools.log('Custom message');

// Highlight component
devtools.highlightComponent(componentId);

// Get component tree
const tree = devtools.getComponentTree();

// Get signal list
const signals = devtools.getSignals();
```

### Custom DevTools Panels

Create custom panels for your application:

```typescript
// devtools-panel.ts
import { createDevToolsPanel } from '@nadi/devtools'

createDevToolsPanel({
  name: 'Custom Panel',
  icon: '⚙️',
  render: () => (
    <div>
      <h2>Custom Debug Panel</h2>
      {/* Your custom debugging UI */}
    </div>
  )
})
```

## Keyboard Shortcuts

| Shortcut               | Action                 |
| ---------------------- | ---------------------- |
| `Cmd/Ctrl + Shift + D` | Toggle DevTools        |
| `Cmd/Ctrl + Shift + C` | Inspect element        |
| `Cmd/Ctrl + [`         | Previous state         |
| `Cmd/Ctrl + ]`         | Next state             |
| `Cmd/Ctrl + Shift + R` | Reset to initial state |
| `Cmd/Ctrl + K`         | Clear console          |

## Tips & Tricks

### Finding Memory Leaks

1. Open DevTools
2. Go to "Signals" tab
3. Look for signals that never cleanup
4. Check "Subscribers" count growing over time

### Performance Optimization

1. Record profile while interacting
2. Find components with high render count
3. Look for unnecessary re-renders
4. Memoize expensive computations

### Debugging State Updates

1. Enable Time Travel
2. Reproduce the bug
3. Step backwards to find when state broke
4. Examine signal values at each step

### Component Debugging

1. Select component in tree
2. Right-click → "Store as global variable"
3. Interact with component in console:

```javascript
$nadi0.props; // View props
$nadi0.signals; // View signals
```

## Troubleshooting

### DevTools Not Appearing

- Check that you're in development mode
- Ensure extension is enabled
- Refresh the page
- Check browser console for errors

### Component Tree Empty

- Verify Nadi app is running
- Check that components are mounted
- Look for initialization errors

### Signal Updates Not Showing

- Ensure signals are created with `signal()`
- Check that you're calling signal as function: `count()`
- Verify DevTools hook is installed

### Performance Issues

- DevTools can slow down app in development
- Disable Time Travel if not needed
- Close DevTools when not debugging
- Use Production build for benchmarks

## Best Practices

✅ **Do:**

- Use DevTools to understand component behavior
- Profile before optimizing
- Label signals for clarity
- Add display names to components
- Use Time Travel for bug reproduction

❌ **Don't:**

- Leave DevTools enabled in production
- Rely solely on console.log
- Ignore performance warnings
- Modify state directly in DevTools
- Use DevTools for automated testing

## Next Steps

- Learn about [Testing](/guide/testing) your application
- Understand [Performance](/guide/performance) optimization
- Explore [Error Handling](/guide/errors)
- Read the [DevTools API Reference](/api/devtools)
