# Components

Components are the building blocks of Nadi applications. They're **reactive functions** that automatically update when their dependencies change.

## What are Components?

A component in Nadi is a function that returns JSX. It can use signals, computed values, and effects to create reactive, interactive UI.

```typescript
function Counter() {
  const [count, setCount] = signal(0)

  return (
    <div>
      <p>Count: {count()}</p>
      <button onclick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  )
}
```

## Creating Components

### Function Components

The standard way to create components:

```typescript
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>
}

// Usage
<Greeting name="John" />
```

### Arrow Function Components

You can also use arrow functions:

```typescript
const Greeting = ({ name }: { name: string }) => {
  return <h1>Hello, {name}!</h1>
}
```

### Component with State

Components can have local state using signals:

```typescript
function Counter() {
  const [count, setCount] = signal(0)

  const increment = () => setCount(count() + 1)
  const decrement = () => setCount(count() - 1)

  return (
    <div>
      <button onclick={decrement}>-</button>
      <span>{count()}</span>
      <button onclick={increment}>+</button>
    </div>
  )
}
```

## Props

### Basic Props

Props are passed as the first argument:

```typescript
interface UserCardProps {
  name: string
  email: string
  age: number
}

function UserCard({ name, email, age }: UserCardProps) {
  return (
    <div class="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <p>Age: {age}</p>
    </div>
  )
}

// Usage
<UserCard name="John" email="john@example.com" age={25} />
```

### Reactive Props

Props can be signals for reactive data:

```typescript
function Display({ count }: { count: () => number }) {
  return <div>Count: {count()}</div>
}

function Parent() {
  const [count, setCount] = signal(0)

  return (
    <div>
      <Display count={count} />
      <button onclick={() => setCount(count() + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### Optional Props

Use TypeScript's optional properties:

```typescript
interface ButtonProps {
  label: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

function Button({ label, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button
      class={`btn btn-${variant}`}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
```

### Children Props

Components can receive children:

```typescript
interface CardProps {
  title: string
  children: JSX.Element
}

function Card({ title, children }: CardProps) {
  return (
    <div class="card">
      <h3>{title}</h3>
      <div class="card-body">
        {children}
      </div>
    </div>
  )
}

// Usage
<Card title="My Card">
  <p>This is the card content</p>
  <button>Click me</button>
</Card>
```

## Component Composition

### Nested Components

Components can render other components:

```typescript
function Avatar({ src, name }: { src: string; name: string }) {
  return (
    <div class="avatar">
      <img src={src} alt={name} />
    </div>
  )
}

function UserProfile({ user }: { user: User }) {
  return (
    <div class="profile">
      <Avatar src={user.avatar} name={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
    </div>
  )
}
```

### Layout Components

Create reusable layouts:

```typescript
function Layout({ children }: { children: JSX.Element }) {
  return (
    <div class="app">
      <header>
        <h1>My App</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2024</p>
      </footer>
    </div>
  )
}

// Usage
<Layout>
  <HomePage />
</Layout>
```

### List Components

Render lists of components:

```typescript
interface TodoListProps {
  todos: Array<{ id: number; text: string; done: boolean }>
}

function TodoList({ todos }: TodoListProps) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.done} />
          <span>{todo.text}</span>
        </li>
      ))}
    </ul>
  )
}
```

## Conditional Rendering

### Using Ternary Operator

```typescript
function Greeting({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  )
}
```

### Using Logical AND

```typescript
function Profile({ user }: { user: User | null }) {
  return (
    <div>
      {user && (
        <div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      )}
    </div>
  )
}
```

### Using Functions

```typescript
function Dashboard({ role }: { role: 'admin' | 'user' | 'guest' }) {
  const renderContent = () => {
    switch (role) {
      case 'admin':
        return <AdminPanel />
      case 'user':
        return <UserDashboard />
      case 'guest':
        return <GuestView />
    }
  }

  return (
    <div>
      <header>Dashboard</header>
      {renderContent()}
    </div>
  )
}
```

### With Signals

```typescript
function ToggleContent() {
  const [show, setShow] = signal(false)

  return (
    <div>
      <button onclick={() => setShow(!show())}>
        Toggle
      </button>
      {show() && (
        <div class="content">
          <p>This content is toggleable!</p>
        </div>
      )}
    </div>
  )
}
```

## Event Handling

### Click Events

```typescript
function Button() {
  const handleClick = () => {
    console.log('Button clicked!')
  }

  return <button onclick={handleClick}>Click me</button>
}
```

### With Event Object

```typescript
function Form() {
  const handleSubmit = (event: Event) => {
    event.preventDefault()
    console.log('Form submitted')
  }

  return (
    <form onsubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Input Events

```typescript
function Search() {
  const [query, setQuery] = signal('')

  return (
    <input
      type="text"
      value={query()}
      oninput={(e) => setQuery((e.target as HTMLInputElement).value)}
      placeholder="Search..."
    />
  )
}
```

### Multiple Event Handlers

```typescript
function Button() {
  return (
    <button
      onclick={() => console.log('Clicked')}
      onmouseenter={() => console.log('Mouse entered')}
      onmouseleave={() => console.log('Mouse left')}
    >
      Hover or click me
    </button>
  )
}
```

## Lifecycle

### Component Initialization

Code at the top level runs once when the component is created:

```typescript
function Component() {
  console.log('Component created')

  const [count, setCount] = signal(0)

  // This runs once
  fetchInitialData()

  return <div>Count: {count()}</div>
}
```

### Cleanup with Effects

Use effects with cleanup for lifecycle management:

```typescript
function Timer() {
  const [seconds, setSeconds] = signal(0)

  effect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds() + 1)
    }, 1000)

    // Cleanup when component unmounts
    return () => clearInterval(interval)
  })

  return <div>Seconds: {seconds()}</div>
}
```

### onMount Helper

Create a custom onMount helper:

```typescript
function onMount(fn: () => void | (() => void)) {
  effect(() => {
    const cleanup = fn()
    return cleanup
  })
}

function Component() {
  onMount(() => {
    console.log('Component mounted')

    return () => {
      console.log('Component unmounted')
    }
  })

  return <div>Hello</div>
}
```

## Component Patterns

### Container/Presenter Pattern

```typescript
// Presenter - pure UI
function TodoItemView({
  todo,
  onToggle,
  onDelete
}: {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
}) {
  return (
    <li>
      <input type="checkbox" checked={todo.done} onchange={onToggle} />
      <span>{todo.text}</span>
      <button onclick={onDelete}>Delete</button>
    </li>
  )
}

// Container - logic
function TodoItem({ id }: { id: number }) {
  const [todo, setTodo] = signal<Todo | null>(null)

  const handleToggle = () => {
    if (!todo()) return
    setTodo({ ...todo()!, done: !todo()!.done })
  }

  const handleDelete = () => {
    deleteTodo(id)
  }

  effect(() => {
    fetchTodo(id).then(setTodo)
  })

  return todo() ? (
    <TodoItemView
      todo={todo()!}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  ) : (
    <div>Loading...</div>
  )
}
```

### Render Props Pattern

```typescript
function DataFetcher({
  url,
  children
}: {
  url: string
  children: (data: any, loading: boolean) => JSX.Element
}) {
  const [data, setData] = signal(null)
  const [loading, setLoading] = signal(true)

  effect(() => {
    setLoading(true)
    fetch(url)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
  })

  return children(data(), loading())
}

// Usage
<DataFetcher url="/api/users">
  {(data, loading) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
</DataFetcher>
```

### Higher-Order Components

```typescript
function withLoading<T extends object>(
  Component: (props: T) => JSX.Element
) {
  return (props: T & { loading: boolean }) => {
    if (props.loading) {
      return <Spinner />
    }
    return <Component {...props} />
  }
}

const UserListWithLoading = withLoading(UserList)

// Usage
<UserListWithLoading users={users} loading={isLoading()} />
```

## Styling Components

### Inline Styles

```typescript
function Box() {
  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px'
    }}>
      Content
    </div>
  )
}
```

### Dynamic Styles

```typescript
function Alert({ type }: { type: 'success' | 'error' | 'warning' }) {
  const getColor = () => {
    switch (type) {
      case 'success': return '#4caf50'
      case 'error': return '#f44336'
      case 'warning': return '#ff9800'
    }
  }

  return (
    <div style={{
      backgroundColor: getColor(),
      padding: '10px',
      color: 'white'
    }}>
      Alert message
    </div>
  )
}
```

### CSS Classes

```typescript
function Button({ variant }: { variant: 'primary' | 'secondary' }) {
  const [isHovered, setIsHovered] = signal(false)

  return (
    <button
      class={`btn btn-${variant} ${isHovered() ? 'hovered' : ''}`}
      onmouseenter={() => setIsHovered(true)}
      onmouseleave={() => setIsHovered(false)}
    >
      Click me
    </button>
  )
}
```

## TypeScript Tips

### Strongly Typed Props

```typescript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      onclick={onClick}
      class={`btn-${variant}`}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
```

### Generic Components

```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => JSX.Element
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item, index)}</li>
      ))}
    </ul>
  )
}

// Usage
<List
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
/>
```

## Performance Optimization

### Avoid Inline Functions

```typescript
// ❌ Bad - creates new function on every render
function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map(todo => (
        <li onclick={() => handleClick(todo.id)}>
          {todo.text}
        </li>
      ))}
    </ul>
  )
}

// ✅ Good - reuses function
function TodoList({ todos }: { todos: Todo[] }) {
  const handleClick = (id: number) => {
    console.log('Clicked:', id)
  }

  return (
    <ul>
      {todos.map(todo => (
        <li onclick={() => handleClick(todo.id)}>
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

### Memoize Expensive Computations

```typescript
function ProductList({ products }: { products: Product[] }) {
  const [sortBy, setSortBy] = signal<'name' | 'price'>('name')

  // ✅ Use computed for expensive operations
  const sortedProducts = computed(() => {
    return [...products].sort((a, b) => {
      if (sortBy() === 'name') {
        return a.name.localeCompare(b.name)
      }
      return a.price - b.price
    })
  })

  return (
    <div>
      <select onchange={(e) => setSortBy((e.target as HTMLSelectElement).value as 'name' | 'price')}>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
      <ul>
        {sortedProducts().map(p => (
          <li key={p.id}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Using Pre-built Components from @nadi/ui

Instead of building every component from scratch, you can use the professional components from `@nadi/ui`:

### Installation

```bash
npm install @nadi/ui
```

### Basic Usage

```typescript
import { Button, Input, Card, Grid } from '@nadi/ui';
import '@nadi/ui/styles.css';

function MyForm() {
  const [name, setName] = signal('');

  return (
    <Card padding="lg">
      <Grid cols={1} gap="md">
        <Input
          value={name()}
          onInput={(e) => setName(e.target.value)}
          label="Your Name"
          placeholder="Enter name"
        />
        <Button
          variant="primary"
          onClick={() => alert(`Hello ${name()}!`)}
        >
          Submit
        </Button>
      </Grid>
    </Card>
  );
}
```

### Benefits

- ✨ **Signal-Native**: All props accept signals or static values
- 🎨 **CSS-First**: No runtime styling overhead
- ♿ **Accessible**: Built-in ARIA attributes and keyboard navigation
- 📝 **Forms Integration**: Auto-binding with `@nadi/forms`
- 🎭 **Animated**: Spring physics and gestures built-in

### Available Components

**Layout**: Grid, Stack, Container, Flex, Card, Divider
**Forms**: Input, Textarea, Select, Checkbox, Radio, Rating
**Buttons**: Button, IconButton
**Feedback**: Toast
**Data Display**: Badge, Avatar, Timeline, Skeleton
**Navigation**: Breadcrumb, Pagination, Steps
**Overlays**: Popover

Learn more in the [UI Components Guide](/guide/ui-components) or [API Reference](/api/ui).

## Next Steps

- Learn about [UI Components](/guide/ui-components) for pre-built components
- Learn about [JSX](/guide/jsx) syntax and features
- Understand [Context](/guide/context) for prop drilling
- Explore [Routing](/guide/routing) for navigation
- Read the [Component API Reference](/api/core#components)
