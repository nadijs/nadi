# @nadi/ui

> **Professional UI Component Library for Nadi**
> Signal-native, animation-rich components with zero boilerplate.

[![npm version](https://img.shields.io/npm/v/@nadi/ui.svg)](https://www.npmjs.com/package/@nadi/ui)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@nadi/ui)](https://bundlephobia.com/package/@nadi/ui)
[![License](https://img.shields.io/npm/l/@nadi/ui.svg)](https://github.com/nadi/nadi/blob/main/LICENSE)

## 🚀 Why Nadi UI?

Nadi UI is **fundamentally different** from React and Vue component libraries:

### The Problem with React/Vue

```tsx
// React: Complex state management, causes re-renders
function ReactButton() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  // Entire component re-renders on every state change!
  return <button disabled={loading}>{count}</button>;
}

// Vue: Template-heavy, manual reactivity
<template>
  <button :disabled="loading">{{ count }}</button>
</template>
<script setup>
const loading = ref(false);
const count = ref(0);
// Need watch() for side effects
</script>
```

### The Nadi UI Solution

```tsx
// Nadi UI: Pass signals directly, automatic fine-grained updates
import { Button } from '@nadi/ui';

const [loading, setLoading] = signal(false);
const [count, setCount] = signal(0);

// Only the affected DOM nodes update, not the whole component!
<Button loading={loading()}>{count()}</Button>;
```

**Key Advantages:**

- ✅ **Zero Boilerplate**: No `useState`, `useEffect`, `useMemo`, or `ref()` needed
- ✅ **Fine-Grained Reactivity**: Only affected DOM nodes update, not entire components
- ✅ **Automatic Cleanup**: No manual `useEffect` cleanups or `onUnmounted` hooks
- ✅ **Smaller Bundle**: ~5KB core + ~1KB per component (vs 40KB+ for React libraries)
- ✅ **Better Performance**: No virtual DOM diffing, direct signal-to-DOM updates

## 📦 Installation

```bash
pnpm add @nadi/ui @nadi/core
# or
npm install @nadi/ui @nadi/core
# or
yarn add @nadi/ui @nadi/core
```

## 🎨 Quick Start

```tsx
import { Button, Input, Grid, showToast, ThemeProvider } from '@nadi/ui';
import '@nadi/ui/styles.css';
import { signal } from '@nadi/core';

function App() {
  // Setup theme (dark/light mode)
  const { theme, toggleTheme } = ThemeProvider();

  // Create reactive state
  const [name, setName] = signal('');
  const [loading, setLoading] = signal(false);

  const handleSubmit = async () => {
    setLoading(true);
    await saveData(name());
    setLoading(false);
    showToast({ message: 'Saved!', variant: 'success' });
  };

  return (
    <Grid cols={1} colsMd={2} gap="lg">
      <Input
        value={name()}
        onInput={(e) => setName(e.target.value)}
        label="Your Name"
        placeholder="Enter your name..."
      />

      <Button variant="primary" loading={loading()} onClick={handleSubmit}>
        Save
      </Button>

      <Button variant="ghost" onClick={toggleTheme}>
        Current: {theme()}
      </Button>
    </Grid>
  );
}
```

## 🎯 Core Concepts

### 1. Signal-Native Components

Pass signals directly to components - no wrapper functions needed:

```tsx
const [value, setValue] = signal('hello');

// ✅ Nadi UI - Direct signal binding
<Input value={value()} onInput={(e) => setValue(e.target.value)} />;

// ❌ React - Need state + onChange boilerplate
const [value, setValue] = useState('hello');
<input value={value} onChange={(e) => setValue(e.target.value)} />;
```

### 2. Automatic @nadi/forms Integration

```tsx
import { createField } from '@nadi/forms';
import { Input } from '@nadi/ui';

// Create field with validation
const emailField = createField({
  initialValue: '',
  validationRules: [{ validator: (v) => v.includes('@'), message: 'Invalid email' }],
});

// Just pass the field - value, errors, touched all auto-bound!
<Input field={emailField} label="Email" />;

// Compare to React:
// - Need value={field.value}
// - Need onChange={field.handleChange}
// - Need error={field.error}
// - Need onBlur={field.handleBlur}
```

### 3. Global State Without Context

```tsx
import { showToast, ToastContainer } from '@nadi/ui';

// In your app root
<ToastContainer position="top-right" />;

// Anywhere in your app - no context needed!
showToast({ message: 'Hello!', variant: 'success' });

// React equivalent needs:
// - Context Provider wrapper
// - useContext hook in every component
// - Complex state management
```

### 4. Physics-Based Animations

```tsx
import { useSpring, springPresets } from '@nadi/ui/animations';

const [x, setX] = signal(0);

// Automatically animates to new values with spring physics!
const animatedX = useSpring(x, springPresets.wobbly);

<div style={{ transform: `translateX(${animatedX()}px)` }}>Smooth!</div>;

// Change x anywhere - animation happens automatically
setX(100); // Springs to 100 with wobbly physics
```

## 📚 Component Library

### Layout Components

- **Grid** - Responsive CSS Grid with signal-based columns
- **Stack** - Vertical/horizontal spacing container
- **Container** - Max-width responsive container
- **Flex** - Flexible flexbox layout

```tsx
<Grid cols={1} colsSm={2} colsMd={4} gap="lg">
  {items().map(item => <Card>{item}</Card>)}
</Grid>

<Stack spacing="md" direction="vertical">
  <h1>Title</h1>
  <p>Content</p>
</Stack>
```

### Form Components

- **Input** - Text input with validation
- **Select** - Dropdown select (coming soon)
- **Checkbox** - Checkbox input (coming soon)
- **Switch** - Toggle switch (coming soon)
- **Slider** - Range slider (coming soon)

```tsx
// With @nadi/forms integration
const form = createForm({
  initialValues: { email: '', password: '' },
  onSubmit: async (values) => {
    await login(values);
  }
});

<Input field={form.fields.email} label="Email" type="email" />
<Input field={form.fields.password} label="Password" type="password" />
<Button onClick={form.handleSubmit}>Login</Button>
```

### Button Components

- **Button** - Primary action button with variants
- **IconButton** - Circular icon-only button

```tsx
<Button variant="primary" size="lg" loading={saving()}>
  Save Changes
</Button>

<IconButton icon={<CloseIcon />} ariaLabel="Close" />
```

### Feedback Components

- **Toast** - Notification toasts
- **Modal** - Modal dialogs (coming soon)
- **Alert** - Alert messages (coming soon)
- **Drawer** - Side drawer (coming soon)
- **Progress** - Progress indicators (coming soon)

```tsx
showToast({
  title: 'Success!',
  message: 'Your changes have been saved.',
  variant: 'success',
  duration: 3000,
});
```

### Data Display

- **Card** - Content container with hover effects
- **Table** - Data table (coming soon)
- **Badge** - Status badge (coming soon)
- **Avatar** - User avatar (coming soon)
- **Tooltip** - Hover tooltip (coming soon)
- **Accordion** - Collapsible content (coming soon)

```tsx
<Card variant="elevated" hoverable onClick={() => navigate('/details')}>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

## 🎭 Animation System

### Spring Physics

```tsx
import { useSpring, springPresets } from '@nadi/ui/animations';

const [progress, setProgress] = signal(0);
const animatedProgress = useSpring(progress, springPresets.stiff);

// Progress bar that springs to new values
<div style={{ width: `${animatedProgress()}%` }} />;
```

### Gesture Handling

```tsx
import { useGesture } from '@nadi/ui/animations';

const { x, y, dragging, bind } = useGesture();

<div
  {...bind()}
  style={{
    transform: `translate(${x()}px, ${y()}px)`,
    cursor: dragging() ? 'grabbing' : 'grab',
  }}
>
  Drag me!
</div>;
```

### Scroll Animations

```tsx
import { useFadeIn, useParallax } from '@nadi/ui/animations';

// Fade in on scroll
const { ref, progress } = useFadeIn();
<div ref={ref} style={{ opacity: progress() }}>
  Fades in!
</div>;

// Parallax effect
const { ref, offset } = useParallax({ speed: 0.5 });
<div ref={ref}>
  <img style={{ transform: `translateY(${offset()}px)` }} />
</div>;
```

## 🎨 Theming

```tsx
import { ThemeProvider } from '@nadi/ui/theme';

function App() {
  const { theme, setTheme, toggleTheme } = ThemeProvider({
    defaultTheme: 'system', // 'light' | 'dark' | 'system'
    storageKey: 'my-app-theme',
    customVariables: {
      '--nadi-color-primary-500': '#ff0000',
    },
  });

  return (
    <>
      <Button onClick={toggleTheme}>Current theme: {theme()}</Button>
      <YourApp />
    </>
  );
}
```

### Custom CSS Variables

Override any design token:

```css
:root {
  --nadi-color-primary-500: #your-brand-color;
  --nadi-radius-base: 12px;
  --nadi-font-sans: 'Your Font', sans-serif;
}
```

## 📊 Performance Comparison

| Metric                     | Nadi UI              | React MUI        | Vue Vuetify |
| -------------------------- | -------------------- | ---------------- | ----------- |
| Bundle Size (min+gzip)     | ~5KB                 | ~40KB            | ~35KB       |
| Initial Render             | Fast                 | Moderate         | Moderate    |
| Update Performance         | **Instant**          | Slow (VDOM diff) | Moderate    |
| Memory Usage               | Low                  | High             | Moderate    |
| Re-renders on State Change | **0** (fine-grained) | Many             | Few         |

## 🌟 Bundle Size

Nadi UI is designed to be tree-shakeable. Import only what you need:

```tsx
// Import full library (~5KB + components used)
import { Button, Input, Grid } from '@nadi/ui';

// Or import individual components (~1KB each)
import { Button } from '@nadi/ui/button';
import { Input } from '@nadi/ui/input';
```

## 🔒 Accessibility

All components follow WAI-ARIA guidelines:

- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Semantic HTML

```tsx
<Button ariaLabel="Save document" disabled={saving()}>
  {saving() ? 'Saving...' : 'Save'}
</Button>
```

## 🧪 Testing

```tsx
import { render } from '@nadi/testing';
import { Button } from '@nadi/ui';

test('button shows loading state', () => {
  const [loading, setLoading] = signal(false);
  const { container } = render(() => <Button loading={loading()}>Save</Button>);

  setLoading(true);
  expect(container.querySelector('[data-loading="true"]')).toBeTruthy();
});
```

## 📖 API Documentation

Full API documentation coming soon at [nadi-ui.dev](https://nadi-ui.dev)

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT © Nadi Team

## 🔗 Links

- [Documentation](https://nadi-ui.dev) (coming soon)
- [GitHub](https://github.com/nadi/nadi)
- [Examples](../../examples)
- [Playground](./playground)

---

**Built with ❤️ for the Nadi ecosystem**
