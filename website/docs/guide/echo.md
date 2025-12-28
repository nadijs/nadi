# Real-Time with Laravel Echo

The Nadi Echo package provides seamless integration with Laravel Echo for real-time features like WebSockets, broadcasting, and live updates.

## Installation

```bash
npm install @nadi/echo laravel-echo pusher-js
```

## Quick Start

```typescript
import { createEcho, useChannel } from '@nadi/echo'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Configure Laravel Echo
window.Pusher = Pusher

const echo = createEcho({
  broadcaster: 'pusher',
  key: 'your-pusher-key',
  cluster: 'mt1',
  forceTLS: true
})

// Listen to events
function ChatRoom({ roomId }: { roomId: string }) {
  const [messages, setMessages] = signal<Message[]>([])

  const channel = useChannel(`chat.${roomId}`)

  channel.listen('MessageSent', (event: { message: Message }) => {
    setMessages([...messages(), event.message])
  })

  return (
    <div>
      {messages().map(msg => (
        <div key={msg.id}>{msg.text}</div>
      ))}
    </div>
  )
}
```

## Creating Echo Instance

### With Pusher

```typescript
import { createEcho } from '@nadi/echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = createEcho({
  broadcaster: 'pusher',
  key: process.env.PUSHER_APP_KEY,
  cluster: process.env.PUSHER_APP_CLUSTER,
  forceTLS: true,
});
```

### With Socket.io

```typescript
import { createEcho } from '@nadi/echo';
import io from 'socket.io-client';

window.io = io;

const echo = createEcho({
  broadcaster: 'socket.io',
  host: window.location.hostname + ':6001',
});
```

### With Authentication

```typescript
const echo = createEcho({
  broadcaster: 'pusher',
  key: process.env.PUSHER_APP_KEY,
  cluster: process.env.PUSHER_APP_CLUSTER,
  forceTLS: true,
  authEndpoint: '/broadcasting/auth',
  auth: {
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },
});
```

## Public Channels

### Listening to Events

```typescript
import { useChannel } from '@nadi/echo'

function NotificationBell() {
  const [notifications, setNotifications] = signal<Notification[]>([])

  const channel = useChannel('notifications')

  channel.listen('NotificationSent', (event) => {
    setNotifications([...notifications(), event.notification])
  })

  return (
    <div class="notification-bell">
      <span class="count">{notifications().length}</span>
      {notifications().map(n => (
        <div key={n.id}>{n.message}</div>
      ))}
    </div>
  )
}
```

### Multiple Events

```typescript
function LiveDashboard() {
  const [stats, setStats] = signal({ users: 0, orders: 0, revenue: 0 })

  const channel = useChannel('dashboard')

  channel
    .listen('UserRegistered', () => {
      setStats({ ...stats(), users: stats().users + 1 })
    })
    .listen('OrderPlaced', (event) => {
      setStats({
        ...stats(),
        orders: stats().orders + 1,
        revenue: stats().revenue + event.amount
      })
    })

  return (
    <div>
      <div>Users: {stats().users}</div>
      <div>Orders: {stats().orders}</div>
      <div>Revenue: ${stats().revenue}</div>
    </div>
  )
}
```

## Private Channels

### Authentication Required

```typescript
function UserFeed() {
  const [posts, setPosts] = signal<Post[]>([])

  const channel = useChannel('private-user-feed')

  channel.listen('PostCreated', (event) => {
    setPosts([event.post, ...posts()])
  })

  return (
    <div>
      {posts().map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

### Laravel Backend

```php
// routes/channels.php
Broadcast::channel('user-feed', function ($user) {
    return Auth::check();
});

// Event
class PostCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $post;

    public function __construct(Post $post)
    {
        $this->post = $post;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('user-feed');
    }
}
```

## Presence Channels

### Online Users

```typescript
function ChatRoom({ roomId }: { roomId: string }) {
  const [users, setUsers] = signal<User[]>([])
  const [messages, setMessages] = signal<Message[]>([])

  const channel = usePresenceChannel(`chat.${roomId}`)

  // Get initial users
  channel.here((initialUsers: User[]) => {
    setUsers(initialUsers)
  })

  // User joined
  channel.joining((user: User) => {
    setUsers([...users(), user])
  })

  // User left
  channel.leaving((user: User) => {
    setUsers(users().filter(u => u.id !== user.id))
  })

  // Listen to messages
  channel.listen('MessageSent', (event) => {
    setMessages([...messages(), event.message])
  })

  return (
    <div>
      <div class="online-users">
        <h3>Online ({users().length})</h3>
        {users().map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>

      <div class="messages">
        {messages().map(msg => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>
    </div>
  )
}
```

### Typing Indicators

```typescript
function ChatInput({ roomId }: { roomId: string }) {
  const [typing, setTyping] = signal<string[]>([])
  const [message, setMessage] = signal('')

  const channel = usePresenceChannel(`chat.${roomId}`)

  channel.listenForWhisper('typing', (user: { name: string }) => {
    if (!typing().includes(user.name)) {
      setTyping([...typing(), user.name])

      // Remove after 3 seconds
      setTimeout(() => {
        setTyping(typing().filter(n => n !== user.name))
      }, 3000)
    }
  })

  const handleTyping = () => {
    channel.whisper('typing', { name: 'Current User' })
  }

  return (
    <div>
      {typing().length > 0 && (
        <div class="typing-indicator">
          {typing().join(', ')} {typing().length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      <input
        value={message()}
        oninput={(e) => {
          setMessage((e.target as HTMLInputElement).value)
          handleTyping()
        }}
        placeholder="Type a message..."
      />
    </div>
  )
}
```

### Laravel Backend

```php
// routes/channels.php
Broadcast::channel('chat.{roomId}', function ($user, $roomId) {
    return ['id' => $user->id, 'name' => $user->name];
});
```

## Client Events (Whispers)

### Sending Whispers

```typescript
function CollaborativeEditor() {
  const [cursors, setCursors] = signal<Record<string, Cursor>>({})

  const channel = usePresenceChannel('editor')

  const updateCursor = (position: { x: number; y: number }) => {
    channel.whisper('cursor-moved', {
      userId: currentUser.id,
      position
    })
  }

  channel.listenForWhisper('cursor-moved', (data) => {
    setCursors({
      ...cursors(),
      [data.userId]: data.position
    })
  })

  return (
    <div onmousemove={(e) => updateCursor({ x: e.clientX, y: e.clientY })}>
      {Object.entries(cursors()).map(([userId, pos]) => (
        <div
          key={userId}
          class="cursor"
          style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        />
      ))}
    </div>
  )
}
```

## Notification Integration

### Browser Notifications

```typescript
function NotificationListener() {
  const [hasPermission, setHasPermission] = signal(false)

  onMount(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        setHasPermission(permission === 'granted')
      })
    }
  })

  const channel = useChannel(`notifications.${userId}`)

  channel.listen('ImportantNotification', (event) => {
    if (hasPermission()) {
      new Notification(event.title, {
        body: event.message,
        icon: '/icon.png'
      })
    }
  })

  return <div>Listening for notifications...</div>
}
```

### Toast Notifications

```typescript
function ToastNotifications() {
  const [toasts, setToasts] = signal<Toast[]>([])

  const channel = useChannel(`notifications.${userId}`)

  channel.listen('NotificationSent', (event) => {
    const toast = {
      id: Date.now(),
      message: event.message,
      type: event.type
    }

    setToasts([...toasts(), toast])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts(toasts().filter(t => t.id !== toast.id))
    }, 5000)
  })

  return (
    <div class="toast-container">
      {toasts().map(toast => (
        <div key={toast.id} class={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
```

## Real-Time Data Sync

### Live Updates

```typescript
function ProductList() {
  const [products, setProducts] = signal<Product[]>([])

  // Initial load
  effect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
  })

  const channel = useChannel('products')

  // New product added
  channel.listen('ProductCreated', (event) => {
    setProducts([...products(), event.product])
  })

  // Product updated
  channel.listen('ProductUpdated', (event) => {
    setProducts(
      products().map(p =>
        p.id === event.product.id ? event.product : p
      )
    )
  })

  // Product deleted
  channel.listen('ProductDeleted', (event) => {
    setProducts(
      products().filter(p => p.id !== event.productId)
    )
  })

  return (
    <div>
      {products().map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Optimistic Updates

```typescript
function TodoList() {
  const [todos, setTodos] = signal<Todo[]>([])

  const channel = useChannel('todos')

  const addTodo = async (text: string) => {
    const tempId = `temp-${Date.now()}`
    const tempTodo = { id: tempId, text, done: false }

    // Optimistic update
    setTodos([...todos(), tempTodo])

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ text })
      })
      const newTodo = await response.json()

      // Replace temp with real
      setTodos(
        todos().map(t => t.id === tempId ? newTodo : t)
      )
    } catch (error) {
      // Rollback on error
      setTodos(todos().filter(t => t.id !== tempId))
    }
  }

  // Listen for updates from other users
  channel.listen('TodoCreated', (event) => {
    if (!todos().find(t => t.id === event.todo.id)) {
      setTodos([...todos(), event.todo])
    }
  })

  return <div>{/* UI */}</div>
}
```

## Error Handling

### Connection Errors

```typescript
function App() {
  const [connected, setConnected] = signal(true)

  const echo = createEcho({
    broadcaster: 'pusher',
    key: 'your-key',
    cluster: 'mt1'
  })

  echo.connector.pusher.connection.bind('connected', () => {
    setConnected(true)
  })

  echo.connector.pusher.connection.bind('disconnected', () => {
    setConnected(false)
  })

  echo.connector.pusher.connection.bind('error', (err) => {
    console.error('Connection error:', err)
  })

  return (
    <div>
      {!connected() && (
        <div class="connection-banner">
          Reconnecting...
        </div>
      )}

      <MainContent />
    </div>
  )
}
```

### Reconnection Logic

```typescript
function useReconnect() {
  const [attempts, setAttempts] = signal(0);
  const maxAttempts = 5;

  const reconnect = () => {
    if (attempts() < maxAttempts) {
      setTimeout(
        () => {
          echo.connect();
          setAttempts(attempts() + 1);
        },
        Math.min(1000 * Math.pow(2, attempts()), 30000)
      );
    }
  };

  return { reconnect, attempts };
}
```

## Testing

### Mocking Echo

```typescript
import { createEcho } from '@nadi/echo'

const mockEcho = {
  channel: jest.fn(() => ({
    listen: jest.fn(),
    listenForWhisper: jest.fn()
  })),
  private: jest.fn(),
  join: jest.fn()
}

test('listens to channel events', () => {
  const { getByText } = render(
    <Component echo={mockEcho} />
  )

  const channel = mockEcho.channel('notifications')
  const listener = channel.listen.mock.calls[0][1]

  listener({ message: 'Test notification' })

  expect(getByText('Test notification')).toBeInTheDocument()
})
```

## Best Practices

✅ **Do:**

- Clean up channels on unmount
- Handle connection errors gracefully
- Use presence channels for online status
- Implement reconnection logic
- Throttle frequent updates

❌ **Don't:**

- Listen to the same event multiple times
- Forget to unsubscribe from channels
- Send sensitive data through public channels
- Ignore connection state
- Overuse real-time features

## Performance Tips

### Throttle Updates

```typescript
function throttle(fn: Function, delay: number) {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

const updatePosition = throttle((position) => {
  channel.whisper('cursor-moved', position);
}, 100);
```

### Batch Updates

```typescript
let updateQueue: Update[] = [];

channel.listen('DataUpdate', (event) => {
  updateQueue.push(event.update);
});

// Process in batches
setInterval(() => {
  if (updateQueue.length > 0) {
    setData(applyUpdates(data(), updateQueue));
    updateQueue = [];
  }
}, 100);
```

## Next Steps

- Learn about [Laravel Integration](/guide/laravel)
- Understand [Testing](/guide/testing) real-time features
- Explore [WebSockets](/guide/websockets) in depth
- Read the [Echo API Reference](/api/echo)
