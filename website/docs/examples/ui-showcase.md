# UI Component Showcase

Interactive examples demonstrating all components from `@nadi/ui`. Copy-paste ready code for your projects.

## Form Components

### Login Form

A complete login form with validation:

```tsx
import { signal } from '@nadi/core';
import { createForm } from '@nadi/forms';
import { Input, Button, Card, Stack } from '@nadi/ui';
import '@nadi/ui/styles.css';

function LoginForm() {
  const form = createForm({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: ['required', 'email'],
      password: ['required', 'min:8'],
    },
    onSubmit: async (values) => {
      console.log('Login:', values);
    },
  });

  return (
    <Card variant="elevated" padding="lg" style={{ maxWidth: '400px' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Stack spacing="lg">
          <h2>Sign In</h2>

          <Input
            field={form.fields.email}
            type="email"
            label="Email"
            placeholder="you@example.com"
            required
          />

          <Input
            field={form.fields.password}
            type="password"
            label="Password"
            placeholder="Min 8 characters"
            required
          />

          <Button
            type="submit"
            variant="primary"
            loading={form.isSubmitting()}
            disabled={!form.isValid()}
            fullWidth
          >
            Sign In
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
```

### Registration Form

Multi-field registration with country selection:

```tsx
import { createForm } from '@nadi/forms';
import { Input, Select, Checkbox, Button, Card, Grid, Stack } from '@nadi/ui';

function RegistrationForm() {
  const form = createForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      country: '',
      newsletter: false,
    },
    validationRules: {
      firstName: ['required', 'min:2'],
      lastName: ['required', 'min:2'],
      email: ['required', 'email'],
      password: ['required', 'min:8'],
    },
    onSubmit: async (values) => {
      console.log('Register:', values);
    },
  });

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
  ];

  return (
    <Card variant="elevated" padding="lg" style={{ maxWidth: '600px' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Stack spacing="lg">
          <h2>Create Account</h2>

          <Grid cols={2} gap="md">
            <Input field={form.fields.firstName} label="First Name" required />
            <Input field={form.fields.lastName} label="Last Name" required />
          </Grid>

          <Input field={form.fields.email} type="email" label="Email" required />
          <Input field={form.fields.password} type="password" label="Password" required />

          <Select field={form.fields.country} label="Country" options={countries} />

          <Checkbox field={form.fields.newsletter} label="Subscribe to newsletter" />

          <Button type="submit" variant="primary" fullWidth>
            Create Account
          </Button>
        </Stack>
      </form>
    </Card>
  );
}
```

### Search Form

Search with filters and rating:

```tsx
import { signal } from '@nadi/core';
import { Input, Select, Rating, Button, Card, Stack, Flex } from '@nadi/ui';

function SearchForm() {
  const [query, setQuery] = signal('');
  const [category, setCategory] = signal('all');
  const [minRating, setMinRating] = signal(0);

  const handleSearch = () => {
    console.log({ query: query(), category: category(), minRating: minRating() });
  };

  return (
    <Card padding="lg" style={{ maxWidth: '600px' }}>
      <Stack spacing="md">
        <h3>Search Products</h3>

        <Input
          value={query()}
          onInput={(e) => setQuery(e.target.value)}
          label="Search"
          placeholder="What are you looking for?"
        />

        <Select
          value={category()}
          onChange={setCategory}
          label="Category"
          options={[
            { value: 'all', label: 'All Categories' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'books', label: 'Books' },
            { value: 'clothing', label: 'Clothing' },
          ]}
        />

        <div>
          <label>Minimum Rating</label>
          <Rating value={minRating()} onChange={setMinRating} max={5} />
        </div>

        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Stack>
    </Card>
  );
}
```

## Dashboard Examples

### User Profile Card

User card with avatar and status badge:

```tsx
import { Badge, Avatar, Card, Stack, Button, Divider } from '@nadi/ui';

function UserProfileCard() {
  return (
    <Card variant="elevated" padding="lg" style={{ maxWidth: '350px' }}>
      <Stack spacing="md" align="center">
        <Avatar
          src="/avatar.jpg"
          name="Sarah Johnson"
          size="xl"
          badge={<Badge dot variant="success" />}
        />

        <div style={{ textAlign: 'center' }}>
          <h3>Sarah Johnson</h3>
          <p style={{ color: '#666' }}>Product Designer</p>
        </div>

        <Badge variant="primary">Premium Member</Badge>

        <Divider />

        <div
          style={{ display: 'flex', gap: '20px', justifyContent: 'space-around', width: '100%' }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>127</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Posts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>2.5K</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Followers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>512</div>
            <div style={{ fontSize: '14px', color: '#666' }}>Following</div>
          </div>
        </div>

        <Divider />

        <Button variant="primary" fullWidth>
          Follow
        </Button>
      </Stack>
    </Card>
  );
}
```

### Stats Dashboard

Grid of stat cards:

```tsx
import { Card, Grid, Badge } from '@nadi/ui';

function StatsDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '$45,231', change: '+12.5%', trend: 'up' },
    { label: 'New Users', value: '2,345', change: '+8.3%', trend: 'up' },
    { label: 'Orders', value: '1,234', change: '-2.1%', trend: 'down' },
    { label: 'Conversion', value: '3.2%', change: '+0.5%', trend: 'up' },
  ];

  return (
    <Grid cols={4} colsSm={1} colsMd={2} gap="md">
      {stats.map((stat) => (
        <Card key={stat.label} padding="lg">
          <div style={{ marginBottom: '8px', color: '#666', fontSize: '14px' }}>{stat.label}</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            {stat.value}
          </div>
          <Badge variant={stat.trend === 'up' ? 'success' : 'danger'}>{stat.change}</Badge>
        </Card>
      ))}
    </Grid>
  );
}
```

### Activity Timeline

Recent activity feed:

```tsx
import { Timeline, Card, Avatar } from '@nadi/ui';

function ActivityTimeline() {
  const activities = [
    {
      title: 'New user registered',
      description: 'john.doe@example.com joined the platform',
      time: '2 minutes ago',
      icon: <Avatar name="JD" size="sm" />,
    },
    {
      title: 'Order completed',
      description: 'Order #12345 was delivered successfully',
      time: '1 hour ago',
      icon: <Avatar name="✓" size="sm" />,
    },
    {
      title: 'Payment received',
      description: '$299.00 from Premium subscription',
      time: '3 hours ago',
      icon: <Avatar name="$" size="sm" />,
    },
  ];

  return (
    <Card padding="lg">
      <h3 style={{ marginBottom: '20px' }}>Recent Activity</h3>
      <Timeline items={activities} />
    </Card>
  );
}
```

## Layout Examples

### Multi-Column Layout

Responsive grid layout:

```tsx
import { Grid, Card, Container } from '@nadi/ui';

function MultiColumnLayout() {
  return (
    <Container size="xl" padding="lg">
      <Grid cols={3} colsSm={1} colsMd={2} gap="lg">
        <Card padding="lg">
          <h3>Column 1</h3>
          <p>Content for the first column</p>
        </Card>

        <Card padding="lg">
          <h3>Column 2</h3>
          <p>Content for the second column</p>
        </Card>

        <Card padding="lg">
          <h3>Column 3</h3>
          <p>Content for the third column</p>
        </Card>
      </Grid>
    </Container>
  );
}
```

### Sidebar Layout

Main content with sidebar:

```tsx
import { Grid, Card, Stack } from '@nadi/ui';

function SidebarLayout() {
  return (
    <Grid cols={4} gap="lg" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Card padding="lg" style={{ gridColumn: 'span 1' }}>
        <Stack spacing="md">
          <h3>Navigation</h3>
          <a href="/dashboard">Dashboard</a>
          <a href="/profile">Profile</a>
          <a href="/settings">Settings</a>
        </Stack>
      </Card>

      {/* Main Content */}
      <Card padding="lg" style={{ gridColumn: 'span 3' }}>
        <h2>Main Content</h2>
        <p>Your main content goes here...</p>
      </Card>
    </Grid>
  );
}
```

## Animation Examples

### Draggable Card

Card with drag gesture:

```tsx
import { signal } from '@nadi/core';
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
      padding="lg"
      style={{
        transform: `translate(${position().x}px, ${position().y}px)`,
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      <h3>Drag Me!</h3>
      <p>Click and drag this card around</p>
    </Card>
  );
}
```

### Animated Counter

Counter with spring animation:

```tsx
import { signal } from '@nadi/core';
import { useSpring, springPresets } from '@nadi/ui/animations';
import { Button, Card, Flex } from '@nadi/ui';

function AnimatedCounter() {
  const count = signal(0);
  const springCount = useSpring(count, springPresets.wobbly);

  return (
    <Card padding="lg" style={{ maxWidth: '300px' }}>
      <Flex direction="column" align="center" gap="lg">
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: '#5d64c4',
          }}
        >
          {Math.round(springCount())}
        </div>

        <Flex gap="md">
          <Button onClick={() => count.set(count() - 1)}>-</Button>
          <Button variant="primary" onClick={() => count.set(count() + 1)}>
            +
          </Button>
          <Button onClick={() => count.set(0)}>Reset</Button>
        </Flex>
      </Flex>
    </Card>
  );
}
```

### Fade In on Scroll

Elements that fade in when scrolled into view:

```tsx
import { useFadeIn } from '@nadi/ui/animations';
import { Card, Stack } from '@nadi/ui';

function ScrollFadeIn() {
  const ref1 = useFadeIn({ threshold: 0.3 });
  const ref2 = useFadeIn({ threshold: 0.3, delay: 100 });
  const ref3 = useFadeIn({ threshold: 0.3, delay: 200 });

  return (
    <Stack spacing="lg">
      <Card ref={ref1} padding="lg">
        <h3>Card 1</h3>
        <p>This card fades in first</p>
      </Card>

      <Card ref={ref2} padding="lg">
        <h3>Card 2</h3>
        <p>This card fades in second</p>
      </Card>

      <Card ref={ref3} padding="lg">
        <h3>Card 3</h3>
        <p>This card fades in third</p>
      </Card>
    </Stack>
  );
}
```

## Complete App Examples

### Todo App

Full todo list with add/delete:

```tsx
import { signal } from '@nadi/core';
import { Input, Button, Card, Stack, Flex, Checkbox } from '@nadi/ui';
import { showToast, ToastContainer } from '@nadi/ui';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function TodoApp() {
  const [todos, setTodos] = signal<Todo[]>([]);
  const [input, setInput] = signal('');

  const addTodo = () => {
    if (!input().trim()) return;

    setTodos([
      ...todos(),
      {
        id: Date.now(),
        text: input(),
        done: false,
      },
    ]);

    setInput('');
    showToast({ message: 'Todo added!', variant: 'success' });
  };

  const toggleTodo = (id: number) => {
    setTodos(todos().map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos().filter((t) => t.id !== id));
    showToast({ message: 'Todo deleted', variant: 'info' });
  };

  return (
    <>
      <Card padding="lg" style={{ maxWidth: '500px' }}>
        <Stack spacing="lg">
          <h2>My Todos</h2>

          <Flex gap="md">
            <Input
              value={input()}
              onInput={(e) => setInput(e.target.value)}
              placeholder="Add a todo..."
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <Button variant="primary" onClick={addTodo}>
              Add
            </Button>
          </Flex>

          <Stack spacing="sm">
            {todos().map((todo) => (
              <Card key={todo.id} padding="md" variant="outlined">
                <Flex justify="space-between" align="center">
                  <Flex align="center" gap="md">
                    <Checkbox checked={todo.done} onChange={() => toggleTodo(todo.id)} />
                    <span
                      style={{
                        textDecoration: todo.done ? 'line-through' : 'none',
                        color: todo.done ? '#999' : 'inherit',
                      }}
                    >
                      {todo.text}
                    </span>
                  </Flex>
                  <Button variant="danger" size="sm" onClick={() => deleteTodo(todo.id)}>
                    Delete
                  </Button>
                </Flex>
              </Card>
            ))}

            {todos().length === 0 && (
              <p style={{ textAlign: 'center', color: '#999' }}>No todos yet. Add one above!</p>
            )}
          </Stack>
        </Stack>
      </Card>

      <ToastContainer position="bottom-right" />
    </>
  );
}
```

### Contact Form with Toast

Contact form with success/error toasts:

```tsx
import { createForm } from '@nadi/forms';
import { Input, Textarea, Button, Card, Stack } from '@nadi/ui';
import { showToast, ToastContainer } from '@nadi/ui';

function ContactForm() {
  const form = createForm({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationRules: {
      name: ['required', 'min:2'],
      email: ['required', 'email'],
      message: ['required', 'min:10'],
    },
    onSubmit: async (values) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        showToast({
          message: 'Message sent successfully!',
          variant: 'success',
          duration: 3000,
        });

        form.reset();
      } catch (error) {
        showToast({
          message: 'Failed to send message',
          variant: 'error',
          duration: 5000,
        });
      }
    },
  });

  return (
    <>
      <Card variant="elevated" padding="lg" style={{ maxWidth: '600px' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Stack spacing="lg">
            <h2>Contact Us</h2>

            <Input field={form.fields.name} label="Name" required />
            <Input field={form.fields.email} type="email" label="Email" required />
            <Textarea
              field={form.fields.message}
              label="Message"
              rows={5}
              maxLength={500}
              showCount
              required
            />

            <Button
              type="submit"
              variant="primary"
              loading={form.isSubmitting()}
              disabled={!form.isValid()}
              fullWidth
            >
              Send Message
            </Button>
          </Stack>
        </form>
      </Card>

      <ToastContainer position="top-right" />
    </>
  );
}
```

### E-commerce Product Card

Product card with add to cart:

```tsx
import { signal } from '@nadi/core';
import { Button, Card, Badge, Rating, Stack, Flex } from '@nadi/ui';
import { showToast, ToastContainer } from '@nadi/ui';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  inStock: boolean;
}

function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = signal(1);

  const addToCart = () => {
    showToast({
      message: `Added ${quantity()} ${product.name} to cart`,
      variant: 'success',
    });
  };

  return (
    <>
      <Card hoverable padding="lg" style={{ maxWidth: '300px' }}>
        <Stack spacing="md">
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', borderRadius: '8px' }}
          />

          <div>
            <Flex justify="space-between" align="center">
              <h3>{product.name}</h3>
              <Badge variant={product.inStock ? 'success' : 'danger'}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </Flex>
            <Rating value={product.rating} max={5} readOnly />
          </div>

          <Flex justify="space-between" align="center">
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#5d64c4' }}>
              ${product.price}
            </div>

            <Flex gap="sm" align="center">
              <Button size="sm" onClick={() => setQuantity(Math.max(1, quantity() - 1))}>
                -
              </Button>
              <span style={{ minWidth: '30px', textAlign: 'center' }}>{quantity()}</span>
              <Button size="sm" onClick={() => setQuantity(quantity() + 1)}>
                +
              </Button>
            </Flex>
          </Flex>

          <Button variant="primary" fullWidth disabled={!product.inStock} onClick={addToCart}>
            Add to Cart
          </Button>
        </Stack>
      </Card>

      <ToastContainer position="bottom-right" />
    </>
  );
}
```

## Next Steps

- [UI Components Guide](/guide/ui-components) - Learn component usage patterns
- [Animations Guide](/guide/animations) - Master animation techniques
- [Theming Guide](/guide/theming) - Customize component styles
- [API Reference](/api/ui) - Complete API documentation
