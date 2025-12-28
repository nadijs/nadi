# Real-Time Chat Example

Build a real-time chat application using Laravel Echo and WebSockets.

## Complete Chat Application

Full-featured chat with rooms, typing indicators, and online presence.

```typescript
import { signal, computed, effect } from '@nadi/core'
import { createEcho } from '@nadi/echo'

type Message = {
  id: string
  userId: string
  username: string
  text: string
  timestamp: number
}

type User = {
  id: string
  username: string
  avatar?: string
}

function ChatApp() {
  const currentUser = signal<User>({ id: '1', username: 'You' })
  const currentRoom = signal('general')
  const messages = signal<Message[]>([])
  const onlineUsers = signal<User[]>([])
  const typingUsers = signal<string[]>([])
  const inputText = signal('')
  const isTyping = signal(false)

  // Initialize Echo
  const echo = createEcho({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
  })

  // Join room
  effect(() => {
    const room = currentRoom()
    const channel = echo.join(`chat.${room}`)
      .here((users: User[]) => {
        onlineUsers.set(users)
      })
      .joining((user: User) => {
        onlineUsers.set([...onlineUsers(), user])
      })
      .leaving((user: User) => {
        onlineUsers.set(onlineUsers().filter(u => u.id !== user.id))
      })
      .listen('MessageSent', (data: Message) => {
        messages.set([...messages(), data])
      })
      .listenForWhisper('typing', (user: { id: string; username: string }) => {
        if (!typingUsers().includes(user.username)) {
          typingUsers.set([...typingUsers(), user.username])

          // Remove after 3 seconds
          setTimeout(() => {
            typingUsers.set(typingUsers().filter(u => u !== user.username))
          }, 3000)
        }
      })

    return () => {
      echo.leave(`chat.${room}`)
    }
  })

  // Send typing indicator
  effect(() => {
    if (isTyping()) {
      const channel = echo.join(`chat.${currentRoom()}`)
      channel.whisper('typing', {
        id: currentUser().id,
        username: currentUser().username
      })
    }
  })

  // Handle input changes
  const handleInput = (e: Event) => {
    const text = (e.target as HTMLInputElement).value
    inputText.set(text)

    // Set typing indicator
    if (text && !isTyping()) {
      isTyping.set(true)
      setTimeout(() => isTyping.set(false), 1000)
    }
  }

  // Send message
  const sendMessage = async () => {
    const text = inputText().trim()
    if (!text) return

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser().id,
      username: currentUser().username,
      text,
      timestamp: Date.now()
    }

    // Send to server
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        room: currentRoom(),
        message
      })
    })

    inputText.set('')
    isTyping.set(false)
  }

  const typingText = computed(() => {
    const users = typingUsers()
    if (users.length === 0) return ''
    if (users.length === 1) return `${users[0]} is typing...`
    if (users.length === 2) return `${users[0]} and ${users[1]} are typing...`
    return `${users.length} people are typing...`
  })

  return (
    <div class="chat-app">
      {/* Sidebar */}
      <aside class="sidebar">
        <div class="room-list">
          <h3>Rooms</h3>
          <button
            class={currentRoom() === 'general' ? 'active' : ''}
            onclick={() => currentRoom.set('general')}
          >
            # general
          </button>
          <button
            class={currentRoom() === 'random' ? 'active' : ''}
            onclick={() => currentRoom.set('random')}
          >
            # random
          </button>
          <button
            class={currentRoom() === 'tech' ? 'active' : ''}
            onclick={() => currentRoom.set('tech')}
          >
            # tech
          </button>
        </div>

        <div class="online-users">
          <h3>Online ({onlineUsers().length})</h3>
          <ul>
            {onlineUsers().map(user => (
              <li key={user.id}>
                <div class="avatar">{user.username[0]}</div>
                <span>{user.username}</span>
                <span class="status online"></span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Chat */}
      <main class="chat-main">
        <header class="chat-header">
          <h2># {currentRoom()}</h2>
        </header>

        <div class="messages-container">
          {messages().map(message => (
            <MessageItem key={message.id} message={message} />
          ))}

          {typingText() && (
            <div class="typing-indicator">
              <span>{typingText()}</span>
            </div>
          )}
        </div>

        <footer class="chat-footer">
          <input
            type="text"
            value={inputText()}
            oninput={handleInput}
            onkeypress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Message #${currentRoom()}`}
          />
          <button onclick={sendMessage}>Send</button>
        </footer>
      </main>
    </div>
  )
}

function MessageItem({ message }: { message: Message }) {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString()

  return (
    <div class="message">
      <div class="avatar">{message.username[0]}</div>
      <div class="content">
        <div class="header">
          <span class="username">{message.username}</span>
          <span class="timestamp">{formattedTime}</span>
        </div>
        <div class="text">{message.text}</div>
      </div>
    </div>
  )
}
```

## Private Messaging

One-on-one direct messages.

```typescript
function DirectMessage({ recipientId }: { recipientId: string }) {
  const messages = signal<Message[]>([])
  const inputText = signal('')

  const channelName = computed(() => {
    const ids = [currentUser().id, recipientId].sort()
    return `private.${ids[0]}.${ids[1]}`
  })

  effect(() => {
    const channel = echo.private(channelName())
      .listen('MessageSent', (message: Message) => {
        messages.set([...messages(), message])
      })

    return () => {
      echo.leave(channelName())
    }
  })

  const sendMessage = async () => {
    const text = inputText().trim()
    if (!text) return

    await fetch('/api/direct-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientId,
        text
      })
    })

    inputText.set('')
  }

  return (
    <div class="direct-message">
      <div class="messages">
        {messages().map(msg => (
          <MessageItem key={msg.id} message={msg} />
        ))}
      </div>

      <div class="input">
        <input
          value={inputText()}
          oninput={(e) => inputText.set((e.target as HTMLInputElement).value)}
          onkeypress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onclick={sendMessage}>Send</button>
      </div>
    </div>
  )
}
```

## Message Reactions

Add emoji reactions to messages.

```typescript
type Reaction = {
  emoji: string
  userIds: string[]
}

type MessageWithReactions = Message & {
  reactions: Reaction[]
}

function MessageWithReactions({ message }: { message: MessageWithReactions }) {
  const addReaction = async (emoji: string) => {
    await fetch(`/api/messages/${message.id}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji })
    })
  }

  const removeReaction = async (emoji: string) => {
    await fetch(`/api/messages/${message.id}/reactions/${emoji}`, {
      method: 'DELETE'
    })
  }

  return (
    <div class="message">
      <div class="content">
        <div class="text">{message.text}</div>

        <div class="reactions">
          {message.reactions.map(reaction => (
            <button
              key={reaction.emoji}
              class={reaction.userIds.includes(currentUser().id) ? 'active' : ''}
              onclick={() => {
                if (reaction.userIds.includes(currentUser().id)) {
                  removeReaction(reaction.emoji)
                } else {
                  addReaction(reaction.emoji)
                }
              }}
            >
              {reaction.emoji} {reaction.userIds.length}
            </button>
          ))}

          <button class="add-reaction" onclick={() => {
            const emoji = prompt('Enter emoji:')
            if (emoji) addReaction(emoji)
          }}>
            +
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Laravel Backend

```php
// app/Events/MessageSent.php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MessageSent implements ShouldBroadcast
{
    public $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function broadcastOn()
    {
        return new PresenceChannel('chat.' . $this->message['room']);
    }
}

// app/Http/Controllers/MessageController.php
namespace App\Http\Controllers;

use App\Events\MessageSent;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room' => 'required|string',
            'message' => 'required|array'
        ]);

        // Save to database
        $message = Message::create([
            'room' => $validated['room'],
            'user_id' => auth()->id(),
            'text' => $validated['message']['text']
        ]);

        // Broadcast event
        broadcast(new MessageSent([
            'id' => $message->id,
            'userId' => auth()->id(),
            'username' => auth()->user()->name,
            'text' => $message->text,
            'timestamp' => $message->created_at->timestamp * 1000
        ]));

        return response()->json($message);
    }
}

// routes/channels.php
Broadcast::channel('chat.{room}', function ($user, $room) {
    return [
        'id' => $user->id,
        'username' => $user->name,
        'avatar' => $user->avatar
    ];
});
```

## Styling

```css
.chat-app {
  display: flex;
  height: 100vh;
  background: #1a1a1a;
  color: #fff;
}

.sidebar {
  width: 250px;
  background: #2a2a2a;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.room-list h3,
.online-users h3 {
  margin: 0 0 1rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: #888;
}

.room-list button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
  text-align: left;
  border: none;
  background: transparent;
  color: #aaa;
  cursor: pointer;
  border-radius: 4px;
}

.room-list button:hover {
  background: #333;
  color: #fff;
}

.room-list button.active {
  background: #007bff;
  color: #fff;
}

.online-users ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.online-users li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: auto;
}

.status.online {
  background: #28a745;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid #333;
}

.chat-header h2 {
  margin: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.message .content {
  flex: 1;
}

.message .header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.message .username {
  font-weight: bold;
}

.message .timestamp {
  font-size: 0.75rem;
  color: #888;
}

.message .text {
  line-height: 1.5;
}

.reactions {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.reactions button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #444;
  background: #2a2a2a;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.875rem;
}

.reactions button:hover {
  background: #333;
}

.reactions button.active {
  border-color: #007bff;
  background: rgba(0, 123, 255, 0.2);
}

.typing-indicator {
  padding: 0.5rem;
  color: #888;
  font-style: italic;
}

.chat-footer {
  padding: 1rem;
  border-top: 1px solid #333;
  display: flex;
  gap: 0.5rem;
}

.chat-footer input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #444;
  background: #2a2a2a;
  color: #fff;
  border-radius: 4px;
}

.chat-footer button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
```

## Testing

```typescript
import { render, waitFor } from '@nadi/testing'

describe('ChatApp', () => {
  test('sends message', async () => {
    const { getByPlaceholderText, getByRole, findByText } = render(() => <ChatApp />)

    const input = getByPlaceholderText(/Message/)
    const sendBtn = getByRole('button', { name: 'Send' })

    fireEvent.input(input, { target: { value: 'Hello World' } })
    fireEvent.click(sendBtn)

    expect(await findByText('Hello World')).toBeInTheDocument()
  })

  test('shows typing indicator', async () => {
    const { getByPlaceholderText, findByText } = render(() => <ChatApp />)

    const input = getByPlaceholderText(/Message/)

    fireEvent.input(input, { target: { value: 'Test' } })

    expect(await findByText(/is typing/)).toBeInTheDocument()
  })
})
```

## Key Concepts

- **Laravel Echo**: Real-time event broadcasting
- **Presence Channels**: Track online users
- **Private Channels**: One-on-one messaging
- **Whispers**: Client-side events for typing indicators
- **Broadcasting**: Server-side event dispatch

## Next Steps

- Learn about [Laravel Echo](/guide/echo)
- Explore [WebSockets](/guide/websockets)
- Build [Notifications](/examples/notifications)
- Read [Real-Time Best Practices](/guide/echo#best-practices)
