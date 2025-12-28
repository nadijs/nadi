# JSX

JSX is a syntax extension that allows you to write HTML-like code in JavaScript. Nadi uses JSX to describe UI components in a declarative way.

## What is JSX?

JSX stands for JavaScript XML. It's a syntax that looks like HTML but is actually JavaScript:

```jsx
// This JSX...
const element = <h1>Hello, world!</h1>;

// ...compiles to...
const element = h('h1', null, 'Hello, world!');
```

## Basic Syntax

### Elements

```jsx
// Self-closing tags
<input type="text" />
<img src="photo.jpg" alt="Photo" />
<br />

// With children
<div>
  <h1>Title</h1>
  <p>Paragraph</p>
</div>

// With text content
<button>Click me</button>
<span>Hello</span>
```

### Attributes

```jsx
// String attributes
<input type="text" placeholder="Enter name" />

// Number attributes
<input type="number" min={0} max={100} />

// Boolean attributes
<button disabled={true}>Disabled</button>
<input checked={false} />

// Event handlers
<button onclick={handleClick}>Click</button>
```

### JavaScript Expressions

Use curly braces `{}` to embed JavaScript:

```jsx
const name = 'John'
const age = 25

<div>
  <h1>Hello, {name}!</h1>
  <p>You are {age} years old</p>
  <p>Next year you'll be {age + 1}</p>
</div>
```

## Elements and Attributes

### HTML Attributes

Most HTML attributes work as expected:

```jsx
<div
  id="container"
  class="wrapper"
  style={{ color: 'red' }}
  title="Tooltip text"
>
  Content
</div>

<input
  type="email"
  name="email"
  placeholder="Enter email"
  required
/>

<a href="/about" target="_blank" rel="noopener">
  About
</a>
```

### Class Names

Use `class` (not `className` like React):

```jsx
// Static class
<div class="container">Content</div>

// Dynamic class
const [isActive, setActive] = signal(false)
<div class={isActive() ? 'active' : 'inactive'}>Content</div>

// Multiple classes
<div class={`base-class ${isActive() ? 'active' : ''}`}>
  Content
</div>

// Conditional classes
<button class={[
  'btn',
  isPrimary() && 'btn-primary',
  isLarge() && 'btn-large'
].filter(Boolean).join(' ')}>
  Click me
</button>
```

### Inline Styles

Styles are objects with camelCase properties:

```jsx
// Static styles
<div style={{
  backgroundColor: '#f0f0f0',
  padding: '20px',
  borderRadius: '8px'
}}>
  Content
</div>

// Dynamic styles
const [color, setColor] = signal('red')

<div style={{
  color: color(),
  fontSize: '16px'
}}>
  Colored text
</div>

// Computed styles
const boxStyle = computed(() => ({
  width: `${width()}px`,
  height: `${height()}px`,
  backgroundColor: isActive() ? 'blue' : 'gray'
}))

<div style={boxStyle()}>Box</div>
```

### Data Attributes

```jsx
<div data-id="123" data-type="user" data-active={isActive()}>
  Content
</div>
```

### ARIA Attributes

```jsx
<button
  aria-label="Close dialog"
  aria-pressed={isPressed()}
  aria-disabled={isDisabled()}
>
  ×
</button>

<div
  role="alert"
  aria-live="polite"
>
  {message()}
</div>
```

## Event Handling

### Basic Events

```jsx
function Button() {
  const handleClick = () => {
    console.log('Clicked!');
  };

  return <button onclick={handleClick}>Click me</button>;
}
```

### Event Object

```jsx
function Input() {
  const handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    console.log('Input value:', value)
  }

  return <input oninput={handleInput} />
}
```

### Inline Event Handlers

```jsx
function Counter() {
  const [count, setCount] = signal(0);

  return (
    <div>
      <button onclick={() => setCount(count() - 1)}>-</button>
      <span>{count()}</span>
      <button onclick={() => setCount(count() + 1)}>+</button>
    </div>
  );
}
```

### Common Events

```jsx
<input
  oninput={handleInput}
  onchange={handleChange}
  onfocus={handleFocus}
  onblur={handleBlur}
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp}
/>

<button
  onclick={handleClick}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
/>

<form
  onsubmit={handleSubmit}
  onreset={handleReset}
/>
```

### Preventing Default

```jsx
function Form() {
  const handleSubmit = (event: Event) => {
    event.preventDefault()
    console.log('Form submitted')
  }

  return (
    <form onsubmit={handleSubmit}>
      <input type="text" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Event Parameters

```jsx
function TodoList() {
  const [todos, setTodos] = signal<Todo[]>([])

  const removeTodo = (id: number) => {
    setTodos(todos().filter(t => t.id !== id))
  }

  return (
    <ul>
      {todos().map(todo => (
        <li key={todo.id}>
          {todo.text}
          <button onclick={() => removeTodo(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
```

## Children

### Text Children

```jsx
<h1>Hello, World!</h1>
<p>This is a paragraph</p>
<button>Click me</button>
```

### Element Children

```jsx
<div>
  <h1>Title</h1>
  <p>Paragraph</p>
  <button>Click</button>
</div>
```

### Mixed Children

```jsx
<div>
  <h1>Title</h1>
  Some text here
  <p>Paragraph</p>
  {count()}
  <button>Click</button>
</div>
```

### Dynamic Children

```jsx
const [items, setItems] = signal(['Apple', 'Banana', 'Orange'])

<ul>
  {items().map(item => (
    <li>{item}</li>
  ))}
</ul>
```

### Conditional Children

```jsx
<div>
  {isLoggedIn() && <UserProfile />}
  {!isLoggedIn() && <LoginForm />}
</div>
```

## Lists and Keys

### Rendering Lists

```jsx
const [todos, setTodos] = signal([
  { id: 1, text: 'Learn Nadi' },
  { id: 2, text: 'Build app' },
  { id: 3, text: 'Deploy' }
])

<ul>
  {todos().map(todo => (
    <li key={todo.id}>{todo.text}</li>
  ))}
</ul>
```

### Keys

Keys help Nadi identify which items changed:

```jsx
// ✅ Good - using unique ID
{
  todos().map((todo) => <li key={todo.id}>{todo.text}</li>);
}

// ⚠️ OK - using index (only if list never reorders)
{
  todos().map((todo, index) => <li key={index}>{todo.text}</li>);
}

// ❌ Bad - no key
{
  todos().map((todo) => <li>{todo.text}</li>);
}
```

### Complex List Items

```jsx
{
  users().map((user) => (
    <div key={user.id} class="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onclick={() => followUser(user.id)}>Follow</button>
    </div>
  ));
}
```

## Fragments

Use fragments to group elements without adding extra DOM nodes:

```jsx
// Using fragment
<>
  <h1>Title</h1>
  <p>Paragraph</p>
</>

// Without fragment (adds extra div)
<div>
  <h1>Title</h1>
  <p>Paragraph</p>
</div>
```

### Fragment with Key

```jsx
import { Fragment } from '@nadi/core';

{
  items().map((item) => (
    <Fragment key={item.id}>
      <dt>{item.term}</dt>
      <dd>{item.definition}</dd>
    </Fragment>
  ));
}
```

## Conditional Rendering

### Ternary Operator

```jsx
<div>{isLoggedIn() ? <UserProfile /> : <LoginForm />}</div>
```

### Logical AND

```jsx
<div>
  {hasError() && <ErrorMessage />}
  {isLoading() && <Spinner />}
  {data() && <DataDisplay data={data()} />}
</div>
```

### Logical OR

```jsx
<div>{username() || 'Guest'}</div>
```

### Multiple Conditions

```jsx
<div>
  {status() === 'loading' && <Spinner />}
  {status() === 'error' && <Error />}
  {status() === 'success' && <Data />}
</div>
```

### Switch-like Pattern

```jsx
const renderContent = () => {
  const s = status();
  if (s === 'loading') return <Spinner />;
  if (s === 'error') return <Error />;
  if (s === 'success') return <Data />;
  return <Empty />;
};

<div>{renderContent()}</div>;
```

## Component Composition

### Passing Components as Props

```jsx
interface CardProps {
  header: JSX.Element
  content: JSX.Element
  footer: JSX.Element
}

function Card({ header, content, footer }: CardProps) {
  return (
    <div class="card">
      <div class="card-header">{header}</div>
      <div class="card-content">{content}</div>
      <div class="card-footer">{footer}</div>
    </div>
  )
}

// Usage
<Card
  header={<h2>Title</h2>}
  content={<p>Content goes here</p>}
  footer={<button>Action</button>}
/>
```

### Render Props

```jsx
function MouseTracker({ render }: { render: (x: number, y: number) => JSX.Element }) {
  const [x, setX] = signal(0)
  const [y, setY] = signal(0)

  const handleMove = (e: MouseEvent) => {
    setX(e.clientX)
    setY(e.clientY)
  }

  return (
    <div onmousemove={handleMove}>
      {render(x(), y())}
    </div>
  )
}

// Usage
<MouseTracker
  render={(x, y) => (
    <p>Mouse position: {x}, {y}</p>
  )}
/>
```

## Refs

Access DOM elements directly:

```jsx
function Input() {
  let inputRef: HTMLInputElement | undefined

  const focusInput = () => {
    inputRef?.focus()
  }

  return (
    <div>
      <input ref={el => inputRef = el} />
      <button onclick={focusInput}>Focus</button>
    </div>
  )
}
```

### Ref with Signal

```jsx
function AutofocusInput() {
  const [inputEl, setInputEl] = (signal < HTMLInputElement) | (null > null);

  effect(() => {
    inputEl()?.focus();
  });

  return <input ref={(el) => setInputEl(el)} />;
}
```

## Portals

Render content outside the component tree:

```jsx
import { Portal } from '@nadi/core'

function Modal({ children }: { children: JSX.Element }) {
  const [isOpen, setIsOpen] = signal(false)

  return (
    <div>
      <button onclick={() => setIsOpen(true)}>Open Modal</button>

      {isOpen() && (
        <Portal mount={document.body}>
          <div class="modal-overlay" onclick={() => setIsOpen(false)}>
            <div class="modal" onclick={e => e.stopPropagation()}>
              {children}
              <button onclick={() => setIsOpen(false)}>Close</button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  )
}
```

## Special Attributes

### dangerouslySetInnerHTML

Set HTML from a string (use with caution):

```jsx
const htmlContent = '<p>This is <strong>bold</strong> text</p>'

<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
```

### innerHTML (Alternative)

```jsx
function RenderHTML({ html }: { html: string }) {
  let divRef: HTMLDivElement | undefined

  effect(() => {
    if (divRef) {
      divRef.innerHTML = html
    }
  })

  return <div ref={el => divRef = el} />
}
```

## TypeScript Integration

### Typed Components

```jsx
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps): JSX.Element {
  return (
    <button onclick={onClick} class={`btn-${variant}`}>
      {label}
    </button>
  )
}
```

### Generic Components

```jsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => JSX.Element
}

function List<T>({ items, renderItem }: ListProps<T>): JSX.Element {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

## Best Practices

### ✅ Do

- Use semantic HTML elements
- Add keys to list items
- Keep components focused
- Extract reusable components
- Use TypeScript for type safety

### ❌ Don't

- Mutate props
- Forget keys in lists
- Nest components too deeply
- Use inline styles excessively
- Create components in render

## Common Patterns

### Toggle Button

```jsx
function ToggleButton() {
  const [isOn, setIsOn] = signal(false);

  return (
    <button onclick={() => setIsOn(!isOn())} class={isOn() ? 'on' : 'off'}>
      {isOn() ? 'ON' : 'OFF'}
    </button>
  );
}
```

### Controlled Input

```jsx
function ControlledInput() {
  const [value, setValue] = signal('')

  return (
    <input
      type="text"
      value={value()}
      oninput={e => setValue((e.target as HTMLInputElement).value)}
    />
  )
}
```

### Form Handling

```jsx
function LoginForm() {
  const [email, setEmail] = signal('')
  const [password, setPassword] = signal('')

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    console.log('Login:', email(), password())
  }

  return (
    <form onsubmit={handleSubmit}>
      <input
        type="email"
        value={email()}
        oninput={e => setEmail((e.target as HTMLInputElement).value)}
      />
      <input
        type="password"
        value={password()}
        oninput={e => setPassword((e.target as HTMLInputElement).value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

## Next Steps

- Learn about [Components](/guide/components) in depth
- Understand [Context](/guide/context) for prop drilling
- Explore [Forms](/guide/forms) for form handling
- Read the [JSX API Reference](/api/core#jsx)
