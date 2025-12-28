# @nadi/ui API Reference

Complete API reference for `@nadi/ui` - professional UI component library for Nadi.

## Installation

```bash
npm install @nadi/ui
```

## Bundle Size

- **Core + Theme**: 5KB gzipped
- **Individual Components**: 1-3KB each
- **Animation System**: 2.5KB
- **Full Library**: 28KB (uncompressed, use tree-shaking!)
- **CSS Styles**: 10KB (403 lines)

::: tip Tree-Shaking
Import only what you need for optimal bundle sizes:

```tsx
import { Button, Input } from '@nadi/ui';
import '@nadi/ui/styles.css';
```

:::

## Quick Start

```tsx
import { signal } from '@nadi/core';
import { Button, Input, Card, Grid } from '@nadi/ui';
import '@nadi/ui/styles.css';

function App() {
  const [name, setName] = signal('');

  return (
    <Grid cols={2} gap="md">
      <Card padding="lg">
        <Input value={name()} onInput={(e) => setName(e.target.value)} label="Your Name" />
        <Button variant="primary" onClick={() => alert(`Hello ${name()}!`)}>
          Submit
        </Button>
      </Card>
    </Grid>
  );
}
```

## Core Features

- ✨ **Signal-Native**: All props accept `Accessor<T>` or static values
- 🎨 **CSS-First**: Zero runtime JS for styling
- ♿ **Accessible**: ARIA attributes, keyboard navigation built-in
- 📝 **Forms Integration**: Auto-binding with `@nadi/forms`
- 🎭 **Animation Ready**: Spring physics, gestures, scroll effects
- 🌳 **Tree-Shakeable**: 26+ separate entry points

---

## Layout Components

### Grid

Responsive CSS Grid layout with breakpoint support.

```tsx
import { Grid } from '@nadi/ui';

<Grid cols={3} colsSm={1} colsMd={2} colsLg={3} colsXl={4} gap="md">
  <div>Item 1</div>
  <div>Item 2</div>
</Grid>;
```

**Props:**

| Prop     | Type     | Default | Description          |
| -------- | -------- | ------- | -------------------- |
| `cols`   | `number` | `1`     | Default column count |
| `colsSm` | `number` | -       | Columns at 640px+    |
| `colsMd` | `number` | -       | Columns at 768px+    |
| `colsLg` | `number` | -       | Columns at 1024px+   |
| `colsXl` | `number` | -       | Columns at 1280px+   |
| `gap`    | `string` | `'md'`  | Gap between items    |

### Stack

Vertical/horizontal spacing container.

```tsx
import { Stack } from '@nadi/ui';

<Stack direction="vertical" spacing="md" align="start" justify="center">
  <div>Item 1</div>
  <div>Item 2</div>
</Stack>;
```

### Container

Max-width responsive container.

```tsx
import { Container } from '@nadi/ui';

<Container size="lg" centered padding="md">
  <h1>Centered Content</h1>
</Container>;
```

### Flex

Flexible flexbox layout.

```tsx
import { Flex } from '@nadi/ui';

<Flex direction="row" wrap="wrap" align="center" justify="space-between" gap="md">
  <div>Flexible Item</div>
</Flex>;
```

---

## Form Components

### Input

Text input with validation and `@nadi/forms` integration.

```tsx
import { Input } from '@nadi/ui';
import { createForm } from '@nadi/forms';

// With @nadi/forms (recommended)
const form = createForm({
  initialValues: { email: '' },
});

<Input field={form.fields.email} label="Email" type="email" required />;

// Without forms
const [value, setValue] = signal('');
<Input
  value={value()}
  onInput={(e) => setValue(e.target.value)}
  label="Username"
  error={value().length < 3 ? 'Too short' : null}
/>;
```

**Props:**

| Prop          | Type                                 | Description        |
| ------------- | ------------------------------------ | ------------------ |
| `value`       | `string \| Accessor<string>`         | Input value        |
| `onInput`     | `(event) => void`                    | Input handler      |
| `field`       | `Field<string>`                      | @nadi/forms field  |
| `label`       | `string`                             | Label text         |
| `type`        | `string`                             | Input type         |
| `placeholder` | `string`                             | Placeholder        |
| `required`    | `boolean`                            | Required indicator |
| `disabled`    | `boolean \| Accessor<boolean>`       | Disabled state     |
| `error`       | `string \| Accessor<string \| null>` | Error message      |

### Textarea

Multi-line text input with auto-resize.

```tsx
import { Textarea } from '@nadi/ui';

<Textarea
  value={text()}
  onInput={(e) => setText(e.target.value)}
  label="Description"
  rows={4}
  autoResize
  maxLength={500}
  showCount
/>;
```

### Checkbox

Checkbox input component.

```tsx
import { Checkbox } from '@nadi/ui';

<Checkbox checked={agreed()} onChange={setAgreed} label="I agree to terms" required />;
```

### RadioGroup

Radio button group.

```tsx
import { RadioGroup } from '@nadi/ui';

<RadioGroup
  name="choices"
  value={selected()}
  onChange={setSelected}
  direction="vertical"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
/>;
```

### Select

Native select dropdown.

```tsx
import { Select } from '@nadi/ui';

<Select
  value={country()}
  onChange={setCountry}
  label="Country"
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
/>;
```

---

## Button Components

### Button

Versatile button with variants and loading state.

```tsx
import { Button } from '@nadi/ui';

<Button
  variant="primary"
  size="md"
  loading={isLoading()}
  disabled={isDisabled()}
  onClick={handleClick}
  fullWidth
>
  Click Me
</Button>;
```

**Variants:** `primary`, `secondary`, `outline`, `ghost`, `danger`, `link`
**Sizes:** `xs`, `sm`, `md`, `lg`, `xl`

### IconButton

Circular button for icons.

```tsx
import { IconButton } from '@nadi/ui';

<IconButton variant="primary" size="md" aria-label="Delete">
  <TrashIcon />
</IconButton>;
```

---

## Feedback Components

### Toast

Global toast notification system.

```tsx
import { showToast, ToastContainer } from '@nadi/ui';

// In root component
<ToastContainer position="top-right" />;

// Anywhere in app
showToast({
  message: 'Success!',
  variant: 'success',
  duration: 3000,
});
```

**Functions:**

- `showToast(options)` - Show toast, returns ID
- `dismissToast(id)` - Dismiss specific toast
- `clearToasts()` - Clear all toasts

---

## Data Display Components

### Card

Container with elevation and hover effects.

```tsx
import { Card } from '@nadi/ui';

<Card variant="elevated" padding="lg" hoverable>
  <h3>Card Title</h3>
  <p>Card content...</p>
</Card>;
```

### Badge

Status and notification badges.

```tsx
import { Badge } from '@nadi/ui';

<Badge variant="success">New</Badge>
<Badge dot /> {/* Status dot */}
```

### Avatar

User avatar with image/initials.

```tsx
import { Avatar } from '@nadi/ui';

<Avatar src="/user.jpg" name="John Doe" size="lg" badge={<Badge dot variant="success" />} />;
```

### Timeline

Event timeline display.

```tsx
import { Timeline } from '@nadi/ui';

<Timeline
  items={[
    { title: 'Created', description: 'Order placed', time: '2h ago' },
    { title: 'Shipped', description: 'In transit', time: '1h ago' },
  ]}
/>;
```

### Skeleton

Loading placeholder.

```tsx
import { Skeleton } from '@nadi/ui';

<Skeleton variant="text" width="200px" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" height={200} animation="wave" />
```

---

## Navigation Components

### Breadcrumb

Navigation breadcrumb trail.

```tsx
import { Breadcrumb } from '@nadi/ui';

<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Item' },
  ]}
/>;
```

### Pagination

Page navigation component.

```tsx
import { Pagination } from '@nadi/ui';

<Pagination total={100} current={page()} onChange={setPage} pageSize={10} showFirstLast />;
```

### Steps

Step progress indicator.

```tsx
import { Steps } from '@nadi/ui';

<Steps
  current={1}
  items={[
    { title: 'Account', description: 'Create account' },
    { title: 'Profile', description: 'Fill profile' },
    { title: 'Done', description: 'Complete' },
  ]}
/>;
```

---

## Overlay Components

### Popover

Contextual popover overlay.

```tsx
import { Popover } from '@nadi/ui';

<Popover
  trigger={<Button>Show</Button>}
  content={<div>Content here</div>}
  placement="top"
  triggerMode="click"
/>;
```

---

## Utility Components

### Divider

Horizontal/vertical separator.

```tsx
import { Divider } from '@nadi/ui';

<Divider orientation="horizontal" variant="solid" />
<Divider label="OR" />
```

### Rating

Star rating component.

```tsx
import { Rating } from '@nadi/ui';

<Rating value={rating()} onChange={setRating} max={5} allowHalf />;
```

---

## Animation System

### useSpring

Physics-based spring animation.

```tsx
import { useSpring, springPresets } from '@nadi/ui/animations';

const x = signal(0);
const springX = useSpring(x, springPresets.wobbly);

x.set(100); // Animates automatically!

<div style={{ transform: `translateX(${springX()}px)` }}>Animated</div>;
```

**Presets:** `gentle`, `wobbly`, `stiff`, `slow`, `molasses`

### useGesture

Gesture handling for drag/swipe.

```tsx
import { useGesture } from '@nadi/ui/animations';

const gesture = useGesture({
  onDrag: ({ x, y }) => setPosition({ x, y }),
});

<div {...gesture.bind()}>Draggable</div>;
```

### Scroll Animations

```tsx
import { useFadeIn, useParallax, useStagger } from '@nadi/ui/animations';

const fadeRef = useFadeIn({ threshold: 0.3 });
<div ref={fadeRef}>Fades in</div>;

const parallaxRef = useParallax({ speed: 0.5 });
<div ref={parallaxRef}>Parallax</div>;
```

---

## Theme System

### ThemeProvider

Global theme management.

```tsx
import { ThemeProvider } from '@nadi/ui';

<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>;
```

### useTheme

Access and control theme.

```tsx
import { useTheme } from '@nadi/ui';

const { theme, toggleTheme } = useTheme();

<Button onClick={toggleTheme}>{theme()} mode</Button>;
```

### CSS Variables

```css
:root {
  --nadi-color-primary-600: #3b82f6;
  --nadi-color-success: #10b981;
  --nadi-radius-base: 0.375rem;
  --nadi-font-sans: system-ui;
}
```

---

## TypeScript Support

All components are fully typed.

```tsx
import type { ButtonProps, InputProps } from '@nadi/ui';

function MyButton(props: ButtonProps) {
  return <Button {...props} variant="primary" />;
}
```

---

## Best Practices

### Tree-Shaking

```tsx
// ✅ Good
import { Button, Input } from '@nadi/ui';

// ❌ Avoid
import * as UI from '@nadi/ui';
```

### Signal Props

```tsx
const disabled = signal(false);

// All work!
<Button disabled={false} />
<Button disabled={disabled()} />
<Button disabled={disabled} /> // Reactive!
```

### Form Integration

```tsx
const form = createForm({ initialValues: { email: '' } });

// ✅ Automatic
<Input field={form.fields.email} />;
```

---

## Migration from Material-UI

```tsx
// Material-UI
import { Button, TextField } from '@mui/material';
<TextField value={text} onChange={e => setText(e.target.value)} />
<Button variant="contained">Submit</Button>

// Nadi UI
import { Input, Button } from '@nadi/ui';
<Input value={text()} onInput={e => setText(e.target.value)} />
<Button variant="primary">Submit</Button>
```

---

## See Also

- [UI Components Guide](/guide/ui-components)
- [Bundle Size Guide](/guide/bundle-size)
- [Forms Guide](/guide/forms)
- [Animations](/guide/animations)
