# UI Components Guide

Learn how to use `@nadi/ui` - a professional component library designed specifically for Nadi.

## Why @nadi/ui?

`@nadi/ui` provides production-ready components that follow Nadi's design principles:

- ✨ **Signal-Native**: All props accept signals or static values
- 🎨 **CSS-First**: Zero runtime styling overhead
- ♿ **Accessible**: ARIA attributes and keyboard navigation built-in
- 📝 **Forms Integration**: Seamless integration with `@nadi/forms`
- 🎭 **Animation Ready**: Built-in spring physics and gestures
- 🌳 **Tree-Shakeable**: Import only what you need

## Installation

```bash
npm install @nadi/ui
```

## Basic Usage

### Import Components

```tsx
import { Button, Input, Card } from '@nadi/ui';
import '@nadi/ui/styles.css'; // Import once in your root file
```

### Simple Example

```tsx
import { signal } from '@nadi/core';
import { Button, Input } from '@nadi/ui';

function App() {
  const [name, setName] = signal('');

  return (
    <div>
      <Input
        value={name()}
        onInput={(e) => setName(e.target.value)}
        label="Your Name"
        placeholder="Enter your name"
      />
      <Button variant="primary" onClick={() => alert(`Hello ${name()}!`)}>
        Greet Me
      </Button>
    </div>
  );
}
```

## Signal-Native Props

One of the most powerful features of `@nadi/ui` is that **all props accept signals**. This means you can pass signals directly without dereferencing:

```tsx
const disabled = signal(false);
const loading = signal(false);
const variant = signal<'primary' | 'secondary'>('primary');

// All of these work!
<Button disabled={false} />              // Static value
<Button disabled={disabled()} />         // Dereferenced signal
<Button disabled={disabled} />           // Signal (reactive!) ✨

<Button
  loading={loading}                      // Reactive loading state
  variant={variant}                      // Reactive variant
  disabled={disabled}                    // Reactive disabled state
>
  Submit
</Button>
```

This eliminates the need for `useEffect` or manual subscriptions!

## Component Categories

### Layout Components

Perfect for page structure and responsive design:

```tsx
import { Grid, Stack, Container, Flex } from '@nadi/ui';

function Layout() {
  return (
    <Container size="lg" centered>
      <Grid cols={3} colsSm={1} colsMd={2} gap="md">
        <Card>Column 1</Card>
        <Card>Column 2</Card>
        <Card>Column 3</Card>
      </Grid>

      <Stack direction="vertical" spacing="lg">
        <div>Stack Item 1</div>
        <div>Stack Item 2</div>
      </Stack>

      <Flex justify="space-between" align="center">
        <span>Left</span>
        <span>Right</span>
      </Flex>
    </Container>
  );
}
```

### Form Components

Inputs that work seamlessly with `@nadi/forms`:

```tsx
import { signal } from '@nadi/core';
import { Input, Textarea, Select, Checkbox, Radio, Rating } from '@nadi/ui';

function FormExample() {
  const [email, setEmail] = signal('');
  const [bio, setBio] = signal('');
  const [country, setCountry] = signal('');
  const [agreed, setAgreed] = signal(false);

  return (
    <form>
      <Input
        type="email"
        value={email()}
        onInput={(e) => setEmail(e.target.value)}
        label="Email"
        required
      />

      <Textarea
        value={bio()}
        onInput={(e) => setBio(e.target.value)}
        label="Bio"
        rows={4}
        autoResize
        maxLength={500}
        showCount
      />

      <Select
        value={country()}
        onChange={setCountry}
        label="Country"
        options={[
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
        ]}
      />

      <Checkbox checked={agreed()} onChange={setAgreed} label="I agree to terms" required />
    </form>
  );
}
```

### Button Components

Versatile buttons with multiple variants:

```tsx
import { Button, IconButton } from '@nadi/ui';
import { TrashIcon, EditIcon } from './icons';

function Buttons() {
  return (
    <div>
      {/* Button variants */}
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>

      {/* Button sizes */}
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>

      {/* Loading state */}
      <Button loading={true}>Loading...</Button>

      {/* Icon buttons */}
      <IconButton variant="primary" aria-label="Edit">
        <EditIcon />
      </IconButton>
      <IconButton variant="danger" aria-label="Delete">
        <TrashIcon />
      </IconButton>
    </div>
  );
}
```

### Feedback Components

Show notifications and status updates:

```tsx
import { showToast, ToastContainer } from '@nadi/ui';

// Add ToastContainer to your root component
function App() {
  return (
    <>
      <YourApp />
      <ToastContainer position="top-right" />
    </>
  );
}

// Show toasts anywhere
function handleSubmit() {
  showToast({
    message: 'Form submitted successfully!',
    variant: 'success',
    duration: 3000,
  });
}

function handleError() {
  showToast({
    message: 'An error occurred',
    variant: 'error',
    duration: 5000,
  });
}
```

### Data Display

Present information beautifully:

```tsx
import { Card, Badge, Avatar, Timeline, Skeleton } from '@nadi/ui';

function DataDisplay() {
  return (
    <div>
      {/* Card */}
      <Card variant="elevated" padding="lg" hoverable>
        <h3>User Profile</h3>
        <p>User information here...</p>
      </Card>
      {/* Badge */}
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge dot /> {/* Status indicator */}
      {/* Avatar */}
      <Avatar src="/user.jpg" name="Jane Doe" size="lg" badge={<Badge dot variant="success" />} />
      {/* Timeline */}
      <Timeline
        items={[
          { title: 'Order Placed', description: 'Your order was received', time: '2h ago' },
          { title: 'Processing', description: 'Order is being processed', time: '1h ago' },
          { title: 'Shipped', description: 'Package in transit', time: '30m ago' },
        ]}
      />
      {/* Loading skeleton */}
      <Skeleton variant="text" width="200px" />
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="rectangular" height={200} />
    </div>
  );
}
```

### Navigation

Help users navigate your app:

```tsx
import { Breadcrumb, Pagination, Steps } from '@nadi/ui';

function Navigation() {
  const [page, setPage] = signal(1);
  const [step, setStep] = signal(0);

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Laptop' },
        ]}
      />

      {/* Pagination */}
      <Pagination total={100} current={page()} onChange={setPage} pageSize={10} showFirstLast />

      {/* Steps */}
      <Steps
        current={step()}
        items={[
          { title: 'Account', description: 'Create your account' },
          { title: 'Profile', description: 'Complete your profile' },
          { title: 'Verification', description: 'Verify your email' },
        ]}
      />
    </div>
  );
}
```

## Integration with @nadi/forms

The real power of `@nadi/ui` shines when combined with `@nadi/forms`. Components automatically bind to form fields:

```tsx
import { createForm } from '@nadi/forms';
import { Input, Textarea, Select, Checkbox, Button } from '@nadi/ui';

function SignupForm() {
  const form = createForm({
    initialValues: {
      email: '',
      password: '',
      bio: '',
      country: '',
      agreed: false,
    },
    validate: {
      email: (value) => (!value.includes('@') ? 'Invalid email' : null),
      password: (value) => (value.length < 8 ? 'Too short' : null),
      agreed: (value) => (!value ? 'You must agree' : null),
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* Just pass the field - automatic binding! */}
      <Input field={form.fields.email} label="Email" type="email" />
      <Input field={form.fields.password} label="Password" type="password" />
      <Textarea field={form.fields.bio} label="Bio" rows={4} />
      <Select
        field={form.fields.country}
        label="Country"
        options={[
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
        ]}
      />
      <Checkbox field={form.fields.agreed} label="I agree to terms" />

      <Button
        type="submit"
        variant="primary"
        disabled={!form.isValid()}
        loading={form.isSubmitting()}
      >
        Sign Up
      </Button>
    </form>
  );
}
```

The `field` prop automatically handles:

- Value binding
- Change handlers
- Validation errors
- Touched/dirty state
- Accessibility attributes

## Animation Examples

`@nadi/ui` includes a powerful animation system:

```tsx
import { signal } from '@nadi/core';
import { useSpring, springPresets } from '@nadi/ui/animations';
import { Button } from '@nadi/ui';

function AnimatedButton() {
  const x = signal(0);
  const springX = useSpring(x, springPresets.wobbly);

  return (
    <>
      <Button onClick={() => x.set(x() + 100)}>Move Right</Button>

      <div style={{ transform: `translateX(${springX()}px)` }}>I animate smoothly!</div>
    </>
  );
}
```

### Gesture Handling

```tsx
import { useGesture } from '@nadi/ui/animations';
import { Card } from '@nadi/ui';

function DraggableCard() {
  const position = signal({ x: 0, y: 0 });

  const gesture = useGesture({
    onDrag: ({ x, y }) => position.set({ x, y }),
  });

  return (
    <Card
      {...gesture.bind()}
      style={{
        transform: `translate(${position().x}px, ${position().y}px)`,
        cursor: 'grab',
      }}
    >
      Drag me!
    </Card>
  );
}
```

### Scroll Animations

```tsx
import { useFadeIn, useParallax } from '@nadi/ui/animations';
import { Card } from '@nadi/ui';

function ScrollEffects() {
  const fadeRef = useFadeIn({ threshold: 0.3 });
  const parallaxRef = useParallax({ speed: 0.5 });

  return (
    <>
      <Card ref={fadeRef}>Fades in when scrolled into view</Card>

      <div ref={parallaxRef}>Parallax scrolling effect</div>
    </>
  );
}
```

## Theming

### Using ThemeProvider

Wrap your app with `ThemeProvider` for automatic dark mode:

```tsx
import { ThemeProvider } from '@nadi/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Toggle Theme

```tsx
import { useTheme } from '@nadi/ui';
import { Button } from '@nadi/ui';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return <Button onClick={toggleTheme}>{theme()} mode</Button>;
}
```

### Custom CSS Variables

Override the default theme in your CSS:

```css
:root {
  /* Colors */
  --nadi-color-primary-600: #3b82f6;
  --nadi-color-success: #10b981;
  --nadi-color-danger: #ef4444;

  /* Spacing */
  --nadi-spacing-xs: 0.25rem;
  --nadi-spacing-sm: 0.5rem;
  --nadi-spacing-md: 1rem;

  /* Border radius */
  --nadi-radius-base: 0.375rem;
  --nadi-radius-lg: 0.5rem;

  /* Fonts */
  --nadi-font-sans: system-ui, -apple-system, sans-serif;
}

[data-theme='dark'] {
  --nadi-color-bg: #1a1a1a;
  --nadi-color-text: #ffffff;
}
```

## Custom Components

Build your own components using `@nadi/ui` as a foundation:

```tsx
import { Button, Card } from '@nadi/ui';
import type { ButtonProps } from '@nadi/ui';

// Extend existing components
function PrimaryButton(props: ButtonProps) {
  return <Button {...props} variant="primary" size="lg" />;
}

// Compose components
function UserCard({ user }: { user: User }) {
  return (
    <Card padding="lg" hoverable>
      <Avatar src={user.avatar} name={user.name} />
      <h3>{user.name}</h3>
      <Badge variant={user.isActive ? 'success' : 'default'}>
        {user.isActive ? 'Active' : 'Inactive'}
      </Badge>
    </Card>
  );
}
```

## Accessibility

All components follow accessibility best practices:

```tsx
// Automatic ARIA attributes
<Button disabled={true}>         {/* aria-disabled="true" */}
<Input label="Email" required /> {/* aria-required="true" */}
<IconButton aria-label="Delete"> {/* Accessible name for screen readers */}

// Keyboard navigation
<Pagination />  {/* Arrow keys work */}
<Select />      {/* Arrow keys + Enter */}
<RadioGroup />  {/* Arrow keys navigation */}
```

## Performance Tips

1. **Tree-shake unused components**:

```tsx
// ✅ Good - only imports what you need
import { Button, Input } from '@nadi/ui';

// ❌ Avoid - imports everything
import * as UI from '@nadi/ui';
```

2. **Use signal props for reactivity**:

```tsx
const disabled = signal(false);

// ✅ Reactive - updates automatically
<Button disabled={disabled} />

// ❌ Not reactive - won't update
<Button disabled={disabled()} />
```

3. **Lazy load heavy components**:

```tsx
const Timeline = lazy(() => import('@nadi/ui').then((m) => ({ default: m.Timeline })));
```

## Best Practices

1. **Import styles once** in your root file
2. **Use field prop** with @nadi/forms for automatic binding
3. **Pass signals directly** for reactive props
4. **Customize with CSS variables** instead of inline styles
5. **Use semantic HTML** - components render proper elements
6. **Test accessibility** with keyboard navigation

## Next Steps

- [API Reference](/api/ui) - Complete API documentation
- [Forms Integration](/guide/forms) - Deep dive into @nadi/forms
- [Animations](/guide/animations) - Advanced animation techniques
- [Theming](/guide/theming) - Custom theme creation
- [Examples](/examples/ui-showcase) - Live component examples

## Troubleshooting

### Styles not applied

Make sure you import the CSS:

```tsx
import '@nadi/ui/styles.css';
```

### TypeScript errors

Ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@nadi/core"
  }
}
```

### Components not reactive

Pass the signal directly, not dereferenced:

```tsx
// ✅ Reactive
<Button disabled={disabled} />

// ❌ Not reactive
<Button disabled={disabled()} />
```
